---
title:
  "Managing Infrastructure Drift: How Packer, Terraform, and Ansible Keep
  Enterprise Environments Compliant"
description:
  Stop infrastructure drift before it breaks your enterprise. Discover how
  combining Packer, Terraform, and Ansible creates a bulletproof, automated
  pipeline to maintain compliance, lock down security baselines, and enforce
  desired state across your cloud environments.
date: 2026-09-03 08:43:30.057729+00:00
author: somraj-saha
category: Infrastructure
cover: /blog/managing-infrastructure-drift.webp
---

Every enterprise engineering team knows the dread of **"Configuration Drift."**

It usually starts small: an Infrastructure Engineer temporarily toggles a
security group rule in the cloud console to troubleshoot an outage at 2:00 AM
through manual intervention. A Software Development Engineer (SDE) applies a
patch update directly to a production server via SSH. A database parameter is
altered "temporarily" and forgotten. Months later, the production runtime
environment diverge wildly from the requirements specified in the code
repository. This turns the server in to nothing more than black box since it is
undocumented and practically impossible to maintain when an audit hits or a
disaster strikes.

Combating drift requires more than a single tool. In modern enterprise
environments, maintaining compliance across the entire infrastructure deployment
lifecycle demands a coordinated pipeline. At [Weburz](https://weburz.com) we use
the following technologies:

1. Packer for building immutable images.
2. Terraform for infrastructure resources provisioning.
3. Ansible for runtime configuration of the infrastructure resources.

## The Anatomy of Infrastructure Drift

Our engineering team has identified three distinct layers of the architecture
where drift occurs and should be managed carefully:

1. **The Image Layer:** Base AMIs or VMs age out, missing critical security
   patches or OS updates. For example, servers running Debian Stable may or may
   not be updated for years to come which—surprisingly is quite a common
   practice in legacy environments. Left unamanaged, these aging images become
   prime targets for vulnerabilities because underlying package repositories and
   kernel versions fall too far behind modern security baselines.

2. **The Infrastructure Layer:** Cloud resources (such as VPCs, subnets, IAM
   policies, firewalls) are temporarily modified outside of version control
   during high-pressure troubleshooting and then never reverted back to their
   original state afterward. What starts as a "quick hotfix" in the cloud
   provider's web console leaves behind undocumented network rules and overly
   permissive security groups that break our audit readiness.

3. **The Configuration Layer:** Packages, application dependencies, and local
   file structures on running nodes mutate over time. As developers SSH into
   servers to test packages or modify configuration files directly, individual
   nodes slowly drift away from their intended blueprint, leading to the classic
   "it works on my staging server" syndrome.

Relying on a single tool to fix all three layers usually leads to brittle
scripts and automation failure. Instead, we use Packer, Terraform and Ansible to
divide and conquer tasks at which each respective tool is particularly good at.

The next section shows how we do it.

## Layer 1: Packer - Eliminating Drift at the Image Level

Trying to patch running servers individually is a losing battle. Enterprise
compliance mandates **immutable infrastructure** wherein, if a server needs a
core OS update or security hardening, we do not patch it live but replace it
completely. This approach eliminates the ambiguity of long-lived servers which
accumulate hidden technical debt over months or years of operation.

- How it works is; [Packer](https://packer.io) bakes our security baselines
  (such as hardended SSH and firewall configurations), compliance agents
  ([Tailscale](https://tailscale.com)), and core software stack
  ([Docker](https://www.docker.com), [Restic](https://restic.net), etc) into a
  version-controlled "golden image" (aka, a "snapshot" on
  [Vultr](https://www.vultr.com) and a "VM image" on
  [Microsoft Azure](https://azure.microsoft.com)). By pre-packaging these
  dependencies and security policies ahead of time, we drastically reduce
  boot-up configuration times and ensure complete consistency across every
  instance in our client environments.

- By tying Packer builds to a CI/CD trigger (like GitHub Actions), every
  security update or CVE patch automatically forces a fresh image build. Old,
  vulnerable templates are deprecated and cleaned up from our artifact
  registries, ensuring that all future deployments always start from a strictly
  verified known-good baseline.

## Layer 2: Terraform - Enforcing Desired State for Resources

With the golden image ready, we provision the networking, compute, and storage
surrounding it. This is where [Terraform](https://terraform.io) takes over using
a declarative model backed by a state file (which is securely stored in a blob
storage service such as
[Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs)).

- Since Terraform maintains a state mapping our code to reality, running
  `terraform plan` actively scans our cloud provider's API to highlight
  discrepancies in the infrastructure. If someone manually adds an unauthorized
  ingress port in the cloud console to debug a late-night issue, Terraform flags
  it immediately as drift and forces remediation back to the code definition.

- Most enterprise teams use automated scheduled pipelines to run
  `terraform plan` daily without applying changes. If drift is detected, an
  alert fires notifying the platform team of out-of-band modifications over an
  email (**which by the way is working out fine for us**),
  [Slack](https://slack.com) or [PagerDuty](https://www.pagerduty.com). This
  loop guarantees that our version-controlled repository remains the ultimate
  single source of truth for all cloud resource topology.

## Layer 3: Ansible - Continuous Runtime Compliance

Even with immutable images and locked-down infrastructure, runtime environments
can eventually experience drift any way since applications update
configurations, local system files change, and compliance daemons require
periodic enforcement. To deal with such a scenario, we rely on
[Ansible](https://docs.ansible.com/projects/ansible/latest/index.html).

- Ansible leverages **idempotency** since playbooks can run repeatedly against
  running infrastructure without altering the system unless an actual drift from
  the desired state is discovered. This mkes it an ideal safety net of enforcing
  runtime invariants without risking uintended service disruptions.

- While tools like [cloud-init](https://cloud-init.io) are often used during the
  initial boot sequences to bootstrap instances, we don't rely on `cloud-init`
  for ongoing compliance. `cloud-init` is fundamentally designed for day-zero
  set up and is notoriously difficult to trigger safely or idempotently on
  running systems after the instance has booted. Attempting to force
  `cloud-init` to manage day-two drift often leads to fragile scripts,
  unpredictable re-runs and silent failures.

- Instead, Ansible can be scheduled via Automation Controller (AWX/AAP) (for
  enterprise requirements) or GitHub Actions (which is what we rely on) to run
  regular compliance check-ups. If a configuration file permission changes or a
  required monitoring agent is stopped, Ansible remediates it back to the
  compliant state automatically.

## Bringing It Together: The Compliance Pipeline

To build a truly resilient enterprise architecture, these three tools shouldn't
operate in silos. They form a natural assembly line:

1. **Packer** builds the compliance-verified OS image.
2. **Terraform** provisions the cloud topology utilizing that specific image ID.
3. **Ansible** consumes the inventory generated by Terraform to apply final
   application-layer configurations and runtime baselines.

By treating our infrastructure pipeline as a strict, code-driven product, we
shifted from a reactive posture (finding out about drift during an audit or
outage) to a proactive one where compliance is continuously engineered by
default. To ensure our end-to-end IaC workflows adhere to rigorous security
standards, we also recommend reviewing the
[OWASP Infrastructure as Code Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Infrastructure_as_Code_Security_Cheat_Sheet.html)
for best practices on secrets management, template hardening and state file
protection.

While this write-up provides a brief outlook in to the Infrastructure-as-Code
(IaC) tools we use to manage our infrastructure at Weburz, it is not detailed
enough on its own. So, in a series of future articles, we will provide detailed
guidelines on how we use each of the aforementioned tools for our infrastructure
deployment workflow.
