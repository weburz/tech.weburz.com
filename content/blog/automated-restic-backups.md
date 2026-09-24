---
title: How We Automated Secure, Deduplicated Backups with Restic
description:
  Discover how our engineering team automated zero-trust backups using Restic,
  systemd, and Azure Blob Storage client-side encryption, deduplication, and
  fast restores.
date: 2026-09-11T12:32:53
author: somraj-saha
category: Infrastructure
cover: /blog/golden-images-with-packer.webp
---

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

3. Complications with the 3-2-1 Backup Strategy: Adhering to the "gold-standard
   3-2-1 backup rule" (3 copies of data, across 2 different media types, with 1
   copy offsite) becomes an operational headache with fragmented tools. Trying
   to sync custom snapshots or raw archives across multiple disparate cloud
   providers and local storage targets usually results in brittle, custom-coded
   sync logic that is prone to silent failures.

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

Based on those requirements, we needed a tool which dould deliver on all fronts
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
   down by 60% to 80%.

3. **Backend Flexibility**: Deployment is remarkably straightforward thanks to a
   single, self-contained static binary. Whether we are pushing backups to a
   S3-compatible Vultr Object Storage or perhaps an Azure Blob Storage container
   (which is our preferred choice), the configuration and workflow remains
   identical.

Restic transformed our backups in to an efficient, and cloud-agnostic pipeline.
But a great tool needs reliable execution as well, hence in the next section
we'll look in to how we replaced traditional `cron` jobs with `systemd` timers
for better logging and error control.

## Automation Architecture: Systemd Timers over Cron

Having a great tool like Restic is only half the battle; ensuring it runs
reliably, securely, and predictably is where the real engineering happens. Here
is how we automated our backup pipeline:

- **Why Systemd Timers over Cron**: We replaced `cron` jobs with `systemd`
  timers since it gives us first-class logging via `journalctl`, built-in
  dependency management (guaranteeing that network services are fully active
  before backup execution), and much cleaner failure handling and alerting.

- **Secure In-Flight DB Dumps via Hooks**: To avoid writing unencrypted database
  dumps to the local disk (where they could linger if a job fails), our pre- and
  post-backup hooks stream live dumps (using `pg_dump` for our PostgreSQL
  database) directly into Restic using named pipes. This ensures data is
  encrypted in memory and sent straight to object storage without exposing
  plaintext files locally.

- **Automated Snapshot Retention Policies:** To prevent our repositories from
  bloating infinitely over time, we enforce a clean, grandfather-father-son
  retention policy paired with automatic cleanup:

  ```console
  resitc forget --keep-daily 7 --keep-weekly 4 --keep-monthly 12 --prune
  ```

By combining `systemd`'s robust orchestration with secure in-memory streaming
and automated cleanup, our backup pipeline runs entirely hands-off while
maintaining strict security standards.

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
backups remain both tamper-proof and verified.

However, locking down the repository is only half the battle, we also need to
know immediately if a backup fails and verify that we can actually recover from
it. In the next section, we'll cover observability, alerting, and recovery
testing to close the loop on our backup strategy.

## Observability, Alerting & Recovery Testing

A backup pipeline is only as good as the visibility in to it is and the ability
to actually use it when disaster strikes. To ensure nothing slips through the
cracks, we close the loop with active monitoring and routine drills:

1. **Monitoring Backup Failures**: We push execution metrics, such as exit code,
   backup size and duration to a Prometheus Push gateaway. Additionally, our
   wrapper scripts instantly trigger Slack and PagerDuty webhooks if a backup
   job fails or misses it window, ensuring our engineering team is alerted
   immediately.

2. **The "Untested Backup" Rule**: An unverified backup is merely an assumption.
   To eliminate nasty surprises during an actual outage, we enforce automated
   restore drills. Periodically, a script spins up an isolated sandbox
   environment, pulls down a fresh snapshot, and verifies data integrity while
   measuring our real-world Recovery Time Objectives (RTO).
