---
title: How We Automated Secure, Deduplicated Backups with Restic
description:
  Discover how our engineering team automated zero-trust backups using Restic,
  systemd, and Azure Blob Storage client-side encryption, deduplication, and
  fast restores.
date: 2026-09-29T17:33:34+05:30
author: somraj-saha
category: Infrastructure
cover: /blog/automated-restic-backups.webp
---

At [Weburz](https://weburz.com), we rely on a suite of self-hosted services that
power our day-to-day operations — [application](https://penpot.app) for design
collaboration, [Umami](https://umami.is) for analytics, and
[Wiki.js](https://js.wiki) for internal knowledge management, among others. Each
of these tools stores data that is critical to how we work, which means losing
it is not a hypothetical scenario but an existential risk. That reality made
building a robust, automated backup pipeline one of our top infrastructure
priorities.

## Why Traditional Backup Strategies Failed

When evaluating backup strategies for our infrastructure, we initially fell in
to the same traps many growing engineering teams do. We relied on cloud-native
conveniences and homegrown Bash scripts, only to hit a wall as our data
footprint and security requirements expanded.

Here is why we ultimately moved away from our legacy setup and standardised on
Restic:

1. **The Cost and Lock-in of Native Cloud Snapshots**: Provider-managed volume
   snapshots like (e.g.,
   [Vultr Snapshots](https://docs.vultr.com/products/storage/snapshots) or
   [Azure managed disk snapshot](https://learn.microsoft.com/en-us/azure/virtual-machines/snapshot-copy-managed-disk))
   are undeniably convenient for quick point-in-time recovery. However, they
   scale poorly, costs escalate rapidly as data grows and they locked us in to a
   single ecosystem, making cross-cloud or multi-region redundancy complex and
   expensive to orchestrate natively.

2. **The Flaws of Basic `tar` + `rsync` Scripts**: Custom scripts seem simple at
   first, but they quickly become maintenance nightmares. They lack native
   deduplication, meaning we ended up uploading massive, redundant raw database
   dumps every single day, eating through bandwidth and storage. In the worst
   case scenario, they forced us to manually handle encryption key rotations and
   integrity verifications as well.

3. **Complications with the 3-2-1 Backup Strategy**: Adhering to the
   "gold-standard 3-2-1 backup rule" (3 copies of data, across 2 different media
   types, with 1 copy offsite) becomes an operational headache with fragmented
   tools. Trying to sync custom snapshots or raw archives across multiple
   disparate cloud providers and local storage targets usually results in
   brittle, custom-coded sync logic that is prone to silent failures.

4. **The Demands of Ransomware & Zero-Trust Requirements**: In a modern threat
   landscape, a backup is only as good as its isolation. If a production server
   is compromised, any script of IAM role with read-write access to the storage
   container can be used to wipe the backups right along with the application.
   We needed a solution which enforced client-side encryption **before** the
   data even touches the object storage, paired with an append-only repository
   permissions to prevent even a compromised root user from deleting historical
   snapshots.

By addressing all of these pain points natively, [Restic](https://restic.net)
gave us a predictable, secure and highly efficient backup pipeline.

## Why We Chose Restic Instead

We had mapped out our strict requirements and they were not a lot to ask for:

- Bulletproof security,
- Efficiency at scale,
- Adherence to modern redundancy standards

Based on those requirements, we needed a tool which would deliver on all fronts
without adding operational overhead. So, here's why Restic became our go-to
solution:

1. **Client-Side Encryption by Default**: Restic encrypts all data locally on
   the host machine using robust AES-256 encryption before a single byte is ever
   transmitted to a remote storage. Even if our object storage provider was
   compromised, our data remains completely unreadable.

2. **Content-Defined Chunking (CDC) & Deduplication**: Restic uses smart
   chunking algorithms to split files in to dynamic blocks. This means duplicate
   data across backup runs or even across multiple distinct server instances, is
   only stored once. In practice, this optimisation cut our remote storage costs
   down quite a lot.

3. **Backend Flexibility**: Deployment is remarkably straightforward thanks to a
   single, self-contained static binary. Whether we are pushing backups to a
   S3-compatible
   [Vultr Object Storage](https://www.vultr.com/products/object-storage) or
   perhaps an
   [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs)
   container (which is our preferred choice), the configuration and workflow
   remains identical.

Restic transformed our backups in to an efficient, and cloud-agnostic pipeline.
But a great tool needs reliable execution as well, hence in the next section
we'll look in to how we replaced traditional `cron` jobs with `systemd` timers
for better logging and error control.

## Automation Architecture: `systemd` Timers over `cron`

With Restic now standardised across our infrastructure, the next challenge was
ensuring every backup ran reliably and that we maintained redundant copies of
our data — one stored in a cloud storage service and another transferred to a
physical offsite server via SFTP. Automating this dual-target pipeline required
moving beyond basic `cron` jobs in favour of something with stronger
observability and control. Here is how we built it:

- We replaced `cron` jobs with `systemd` timers since it gives us first-class
  logging via `journalctl`, built-in dependency management (guaranteeing that
  network services are fully active before backup execution), and much cleaner
  failure handling and alerting.

- Rather than streaming dumps in real time, our pre- and post-backup hooks write
  temporary database dumps (using `pg_dump` for our PostgreSQL database) that
  are encrypted and uploaded to Restic, then cleaned up once the backup
  completes. Since we deploy standardised scripts for this objective, failed
  backup attempts are retried multiple times before escalating to a team
  notification (usually using [ntfy.sh](https://ntfy.sh)). Regardless of the
  backup's execution state, these scripts always clean up the temporary dumps
  afterwards in an idempotent manner, ensuring no plaintext data lingers on
  disk.

- To prevent our repositories from bloating infinitely over time, we enforce a
  clean, grandfather-father-son retention policy paired with automatic cleanup:

  ```console
  restic forget --keep-daily 7 --keep-weekly 4 --keep-monthly 12 --prune
  ```

  This retention policy is defined once in our standardised Restic configuration
  and applied uniformly across all repositories, so every backup target, whether
  cloud storage or the offsite SFTP server, all follows the same snapshot
  lifecycle. Combined with the automated cleanup in our standardised scripts,
  this ensures no repository grows unbounded regardless of where it lives.

By combining `systemd`'s robust orchestration with secure in-memory streaming
and automated cleanup, our backup pipeline runs entirely hands-off while
maintaining strict security standards.

## A Sample Implementation for Reference

For you reference, we are providing a simplified version of the standardised
backup script our `systemd` service invokes, along with the service and timer
unit files that schedule it. The full logic mirrors what we described above —
database dumping via `pg_dump`, Restic uploads with tags for filtering, offsite
SFTP syncing, retention policy enforcement, and retry-based failure
notification.

**Backup script** (`/usr/local/bin/create-backup.sh`):

```bash
#!/usr/bin/env bash
# ==============================================================================
# Script Name: create-backup.sh
# Description: Automates the backup of applications's PostgreSQL database and
#              assets Docker volume, then uploads them using Restic with retry
#              logic, dual-target sync (cloud + offsite SFTP), and failure
#              notifications.
# ==============================================================================

set -euo pipefail

# Configuration
export RESTIC_REPOSITORY="azure:container-name:/"
export RESTIC_PASSWORD_FILE="super-sensitive-password-which-should-be-secret"
export AZURE_ACCOUNT_KEY=""
export AZURE_ACCOUNT_NAME=""

OFFSITE_HOST="offsite.example.com"
OFFSITE_USER="backup"
OFFSITE_PATH="/backups/application"
NOTIFY_URL="https://ntfy.sh/application-backups"

MAX_RETRIES=3
RETRY_DELAY=30

BACKUP_DIR="/tmp/application-backup-temp"
DB_DUMP_FILE="$BACKUP_DIR/application-db.sql"
ASSETS_DIR="$BACKUP_DIR/assets"

notify_failure() {
  local attempt="$1"
  local message="$2"
  echo "Backup failed on attempt ${attempt}: ${message}"
  curl -s -d "application backup failed after ${attempt} attempt(s): ${message}" \
    "$NOTIFY_URL" &>/dev/null || true
}

cleanup() {
  rm --recursive --force "$BACKUP_DIR" 2>/dev/null || true
}
trap cleanup EXIT

mkdir --parents "$ASSETS_DIR"

dump_and_upload() {
  # Dump the PostgreSQL database to a temporary file
  docker compose --project-name application \
    exec --no-tty application-postgres pg_dump --username=application --dbname=application |
    tee "$DB_DUMP_FILE" >/dev/null

  if [ ! -s "$DB_DUMP_FILE" ]; then
    echo "Error: PostgreSQL dump failed or is empty."
    return 1
  fi

  # Extract Docker assets
  docker run --rm \
    --volume application_assets:/assets:ro \
    --volume "$ASSETS_DIR":/backup \
    alpine cp --archive /assets/. /backup/

  # Upload both components to Restic
  restic backup \
    --tag "application-automated" \
    "$DB_DUMP_FILE" \
    "$ASSETS_DIR"

  # Mirror the latest snapshot to the offsite SFTP target
  restic restore latest --target /tmp/application-restore-test --tag "application-automated"
  rsync -az /tmp/application-restore-test/ "${OFFSITE_USER}@${OFFSITE_HOST}:${OFFSITE_PATH}/"
  rm --recursive --force /tmp/application-restore-test
}

prune_old() {
  restic forget --tag "application-automated" --keep-daily 7 --keep-weekly 4 --prune
}

attempt=0
while [ "$attempt" -lt "$MAX_RETRIES" ]; do
  attempt=$((attempt + 1))
  echo "=== Backup attempt ${attempt} of ${MAX_RETRIES} ==="

  if dump_and_upload; then
    prune_old
    echo "application backup completed successfully on attempt ${attempt}!"
    exit 0
  fi

  if [ "$attempt" -lt "$MAX_RETRIES" ]; then
    echo "Retrying in ${RETRY_DELAY} seconds..."
    sleep "$RETRY_DELAY"
  fi
done

notify_failure "$MAX_RETRIES" "All backup attempts exhausted."
exit 1
```

**`systemd` service** (`/etc/systemd/system/application-backup.service`):

```systemd
[Unit]
Description=Application Automated Backup
Requires=network-online.target
After=network-online.target docker.service
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/application-backup.sh
StandardOutput=journal
StandardError=journal
Restart=no

[Install]
WantedBy=multi-user.target
```

**`systemd` timer** (`/etc/systemd/system/application-backup.timer`):

```systemd
[Unit]
Description=Run application backup daily at 02:00

[Timer]
OnCalendar=daily
Persistent=true
RandomizedDelaySec=15m

[Install]
WantedBy=timers.target
```

With these files in place, enabling and starting the timer
(`systemctl enable --now application-backup.timer`) schedules the backup to run
daily. The service captures full output in
`journalctl -xeu application-backup.service --no-pager | less +G`, making
troubleshooting straightforward without relying on `cron`'s limited mailing
capabilities.

## Hardening Backup Security & Integrity

Even with automated scheduling and smooth streaming, a robust production backup
strategy must account for worst-case scenarios like compromised infrastructure
and silent data corruption. Here is how we lock down our backups in Azure:

- **Least-Privilege Azure RBAC**: Instead of giving servers full control over
  our Azure Blob Storage, we restrict our backup service principal to write and
  read permissions
  (`Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read`,
  `write`, `add`, and `list`). We strip out delete permissions entirely so that
  a compromised application server cannot wipe its own backups. Pruning and
  snapshot expiration are handled exclusively by a separate, isolated
  maintenance worker.

- **Automated Integrity Verification**: A backup which cannot be restored is
  just expensive garbage. To prevent silent data corruption (bit rot) or
  incomplete uploads from going unnoticed, we run scheduled `restic check` jobs
  to periodically scan the repository index, verify chunk checksums and ensure
  our recovery chain remain pristine.

By combining Azure's append-only guardrails with routine consistency checks, our
backups remain both tamper-proof and verified. However, locking down the
repository is only half the battle, we also need to know immediately if a backup
fails and verify that we can actually recover from it.

To ensure our backups are healthy and recoverable, we run periodic manual
restoration exercises on a schedule (usually once or twice a year). This not
only provides us the confidence in our backup pipeline(s) but also provides
valuable experience to our engineering teams for disaster management and
recovery drills.

That said, we hope this article provided you with some knowledge and insight in
to our infrastructure's backup management workflow. Since we're continuoulsy
experimenting and evolving our backup pipelines, we will keep this piece of
article updated as often as we can.
