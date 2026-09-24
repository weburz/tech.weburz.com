---
title: How We Automated Secure, Deduplicated Backups with Restic
description:
  Discover how our engineering team automated zero-trust backups using Restic,
  systemd, and Azure Blob Storage client-side encryption, deduplication, and
  fast restores.
date: "2026-09-11T12:32:53+05:30"
author: somraj-saha
category: Infrastructure
cover: /blog/golden-images-with-packer.webp
---

1. The Challenge: Why Traditional Backup Strategies Failed The Limitations of
   Native Cloud Snapshots: Cloud provider volume snapshots (e.g., AWS EBS) are
   convenient, but they quickly become expensive at scale and don't natively
   offer cross-cloud or multi-region redundancy out of the box.

The Flaws of Basic tar + rsync Scripts: Custom backup scripts lack native
deduplication, require manually managing encryption keys, and consume excessive
bandwidth when uploading raw database dumps daily.

Ransomware & Zero-Trust Requirements: Backup repositories need client-side
encryption before touching object storage, along with append-only permissions so
compromised servers cannot wipe their own backups.

2. The Decision Matrix: Why We Chose Restic Client-Side Encryption by Default:
   Restic encrypts data on the host machine using AES-256 before transmitting a
   single byte to remote storage.

Content-Defined Chunking (CDC) & Deduplication: Splitting files into dynamic
chunks so duplicate data across runs-or across multiple server instances-is only
stored once, reducing storage costs by 60-80%.

Backend Flexibility: A single static binary that works seamlessly with AWS S3,
Backblaze B2, Google Cloud Storage, or self-hosted MinIO instances.

3. Automation Architecture: Systemd Timers over Cron Why Systemd Timers? Systemd
   timers offer superior logging via journalctl, built-in dependency management
   (e.g., ensuring network services are active before running), and clean
   failure handling compared to legacy cron jobs.

Pre-Backup and Post-Backup Hooks: Executing database dumps (e.g., pg_dump or
mysqldump) into named pipes directly to Restic to avoid writing unencrypted
dumps to local disk before upload.

Snapshot Retention Policies: Managing storage consumption with automated
retention rules:

Bash restic forget \
--keep-daily 7 \
--keep-weekly 4 \
--keep-monthly 12 \
--prune 4. Hardening Backup Security & Integrity Least-Privilege AWS IAM
Policies: Restricting the server's backup credentials to s3:PutObject and
s3:GetObject, while locking s3:DeleteObject behind a separate, isolated
maintenance worker (Append-Only Backups).

Automated Integrity Verification: Running scheduled restic check jobs to scan
the repository index and prevent silent data corruption (bit rot).

5. Observability, Alerting & Recovery Testing Monitoring Backup Failures:
   Pushing execution metrics (exit codes, backup size, duration) to Prometheus
   Pushgateway or triggering Slack/PagerDuty webhooks on failure.

The "Untested Backup" Rule: Automated restore drills-periodically pulling a
snapshot into a sandbox environment to verify data integrity and measure
real-world Recovery Time Objectives (RTO).
