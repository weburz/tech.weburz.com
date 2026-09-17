---
title: "Golden Images at Scale: Building Secure, Multi-Cloud VMs with Packer"
description:
  Learn how to build secure, immutable Debian 13 golden images for Microsoft
  Azure and Vultr simultaneously using HashiCorp Packer, Infrastructure-as-Code,
  and CI/CD automation.
date: "2026-09-11T12:32:53+05:30"
author: somraj-saha
category: Infrastructure
cover: /blog/golden-images-with-packer.webp
---

## The Multi-Cloud Image Dilemma

When organizations start scaling across multiple cloud providers, they
inevitably run in to a hidden bottleneck that management rarely anticipates:
"**the image pipeline**".

At [Weburz](https://weburz.com), we operate across
[Microsoft Azure](https://azure.microsoft.com) and
[Vultr](https://www.vultr.com) for maximum redundancy and flexibility, in
theory. On the flip side, in practice, it often means our engineering teams are
trapped maintaining entirely separate, siloed processes for every single target
environment. For the longest time, our own deployment velocity was crippled by
this exact fragmentation. We weren't slowed down by our own code nor were we
slowed down by our CI/CD pipelines. Instead what was slowing us down the most,
was the sheer weight of manual image configurations.

Early on, building a "golden image" meant logging into a base OS instance,
manually installing security patches, tweaking local firewall settings,
installing monitoring agents and running a final capture command. This capture
command, it's logic, definition and use cases differ by the vendor's ecosystem,
for e.g., Vultr has
[Snapshots](https://docs.vultr.com/products/storage/snapshots) and Azure has
[Compute Gallery](https://learn.microsoft.com/en-us/azure/virtual-machines/azure-compute-gallery).
Each providing a unique feature set and an approach for creating/managing th
golden images.

Whenever it was time to update a vulnerability or perform a security audit, our
team had to scramble, replicating the same manual hardening steps across
distinct environments but the process is erroneous. Over time these minor
inconsistencies compounded into a much larger threat:
[infrastructure drift](/blog/managing-infrastructure-drift).

In a multi-cloud image context drift meant, our staging images in Vultr didn't
quite match the security hardening profile of our production images on Azure.
Every deployment turned into an anxious exercise of wondering if a specific
package version discrepancy or missing configuration tweak would break the build
in region X, even though it passed in region Y.

Instead of shipping features, our engineers spent precious development hours
troubleshooting environment-specific quirks, patching drift manually or
verifying compliance across fragmented artifact registries. Even though our
application delivery was automated, our infrastructure foundation was still
stuck in The Stone Age.

To break free from this drag-on, we realised we had to stop treating multi-cloud
image creation as an ad-hoc chore and start treating it as a first-class node.
This realisation led us to start using
[HashiCorp Packer](https://developer.hashicorp.com/packer) which allows us to
define our image inputs once, eliminate drift at the source and finally match
our cloud ambitions with true deployment velocity.

The rest of the article provides a brief overview of how we ended up using
Packer to build/manage our golden images for the cloud.

## Standardisation by Design

Once we recognized our manual configurations and drift were throttling our
deployment speed, the path forward became clear: we've to remove humans from the
direct build loop. The antidote to ad-hoc image creation is "**Standardisation
by Design**", achieved by treating virtual machine images with the exact same
rigor, version control, and automated pipelines. These practices are already
practiced by software engineering teams for their application code and the same
knowledge is applied for building our "golden images" as well.

Elsewhere, application developers often enjoyed the luxury of repeatable builds.
Their code was checked into Git (or some other version-control system), tested
automatically via CI/CD, and pushed through pipelines with zero manual
intervention. Meanwhile, our infrastructure teams were still treating server
images like special, hand-crafted artifacts.

The shift from manual configuration to Infrastructure-as-Code (IaC) changed that
dynamic entirely for us. Instead of clicking through cloud consoles or running
unversioned shell scripts on live instances, your golden image definition became
declarative code in the form of
[HashiCorp Configuration Language (HCL)](https://github.com/hashicorp/hcl).
Every package installation, security patch, system user, and configuration file
is explicitly written out, reviewed in pull requests, and stored in a
version-controlled repository.

For reference, here's a sample of the Packer we use internally;

```hcl
packer {
  required_version = "~> 1.16.0"

  required_plugins {
    azure = {
      version = ">= 1.4.0"
      source  = "github.com/hashicorp/azure"
    }
    vultr = {
      version = ">= 2.3.2"
      source  = "github.com/vultr/vultr"
    }
  }
}

variable "image_version" {
  type    = string
  default = "1.0.0"
}

# 1. Azure Builder Target (Debian 13 / Trixie)
source "azure-arm" "debian_azure" {
  subscription_id                   = "your-azure-subscription-id"
  managed_image_resource_group_name = "my-golden-images-rg"
  managed_image_name                = "golden-debian-13-${var.image_version}"

  os_type         = "Linux"
  image_publisher = "Debian"
  image_offer     = "debian-13"
  image_sku       = "13-gen2"

  location        = "East US"
  vm_size         = "Standard_B2s"
  communicator    = "ssh"
  ssh_username    = "adminuser"
}

# 2. Vultr Builder Target (Debian 13)
source "vultr" "debian_vultr" {
  api_key       = "your-vultr-api-key"
  region        = "ewr"        # New Jersey / East Coast
  plan_id       = "vc2-1c-2gb" # Instance size
  os_id         = 2625         # Debian 13 x64 (trixie)
  snapshot_name = "golden-debian-13-${var.image_version}"
  ssh_username  = "root"
}

# Unified Build and Provisioning Pipeline
build {
  sources = [
    "source.azure-arm.debian_azure",
    "source.vultr.debian_vultr"
  ]

  # Common Security Hardening Provisioner
  provisioner "shell" {
    inline = [
      "echo 'Updating Debian 13 system packages...'",
      "sudo apt-get update && sudo apt-get upgrade -y",

      "echo 'Applying basic security hardening...'",
      "sudo sed -i 's/^PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config",
      "sudo systemctl restart ssh",

      "echo 'Installing compliance and monitoring agents...'",
      "sudo apt-get install -y auditd ufw",
      "sudo ufw enable"
    ]
  }
}
```

When VM images are defined as code, the concept of "patching a running server"
begins to disappear in favor of immutable infrastructure.

If a package needs an update, we no longer need to SSH into production to fix
it. Instead, we update our Packer template, trigger a pipeline build, and roll
out a brand-new, pristine image version (while optionally replacing/pruning the
older versions).

The operational benefits we observed from this were tremendous! Just like
application binaries, our golden images now carry semantic versions and commit
hashes. If a newly deployed image introduces an unexpected behavior, rolling
back is as simple as reverting to the previous image tag in our deployment
manifest.

This code-first mentality is where a tool like Packer shines. By abstracting
away the platform-specific APIs of Azure, and Vultr into a single configuration
block, Packer allowed us to codify our organization's compliance baselines and
security hardening rules once.

When a security compliance rule changes, we update a set of HCL files (and some
scripts). A single `packer build` command then cascades those updates across
every cloud environment simultaneously. By standardizing our image pipeline, we
turned infrastructure from an unpredictable operational hurdle into a
predictable, automated extension of our software delivery lifecycle.

## Baking in Security Early:

Historically, security was treated as a gate at the end of the deployment
lifecycle. It was treated as a final audit or manual review conducted just
before an application went live. In a fast-paced multi-cloud environment, this
late-stage approach fails. If security vulnerabilities or compliance gaps are
only discovered after an image is deployed to production, remediation becomes a
painful, high-friction scramble.

To achieve true velocity without compromising safety, we embraced a "shift-left"
security model, baking hardening, scanning, and compliance checks directly into
the image build pipeline from day one.

Relying on manual application of Centre for Internet Security (CIS) benchmarks
or internal hardening guides is a recipe for inconsistency. Human error almost
guarantees that a critical setting, such as disabling root logins, tightening
SSH configurations, or configuring audit logging, will be missed on at least one
cloud target.

Our approach to deal with such shortcomings is by embedding hardening
provisioning steps (using tools like Ansible, or custom shell scripts) directly
into our Packer workflow to make our security compliance deterministic. Thereby,
every time an image builds, it undergoes the exact same automated hardening
sequence. If a compliance check fails during the build script, the pipeline
halts immediately, preventing insecure artifacts from ever reaching an image
registry.

For teams or companies whose IT security compliance enforces further strict
measures, building a hardened base image is only half the battle. Since software
packages age quickly, and zero-day vulnerabilities emerge daily rather than
waiting for a runtime scanner to flag a vulnerable production server, security
teams can integrate vulnerability scanning tools directly into the CI/CD
pipeline. All this is only possible thanks to how Packer integrates with the
entire cloud vendor's ecosystem.

Using tools that inspect container images, AMIs, or VM disks before they are
published, you can automatically screen packages for known Common
Vulnerabilities and Exposures (CVEs). If a package exceeds an acceptable risk
threshold (e.g., a critical or high-severity CVE), the pipeline can
automatically fail the build, notifying developers and platform engineers to
update their base packages before promotion.

**DISCLAIMER**: Although we've setup such strict compliance enforcements for our
requirements (yet) we're mentioning the practice for our readers' reference.
Some time in the near future we _may_ implement such strict compliance
enforcements in our pipelines. When or if we do so, we will document the process
and requirements of it as well.

So, the keynote from this section is; when security is baked into the automated
build pipeline, compliance shifts from an anxious, manual audit preparation
chore into a continuous, repeatable process. This allows every image to be
traceable back to a version-controlled IaC configuration and passes automated
security gates prior to publication, proving compliance becomes effortless.

## Scaling the Pipeline:

With our standardized image definitions and embedded security guardrails, the
final operational hurdle is scale. If our engineering teams has to trigger
builds for Azure, and Vultr sequentially, or worse, maintain separate scripts
for each provider, our delivery pipeline remains bottlenecked by sheer
logistics. On the contrary, true multi-cloud scalability requires orchestrating
builds across disparate cloud ecosystems simultaneously, all driven by a single
source of truth.

The core philosophy of HashiCorp Packer is "_Write Once, Build Everywhere_". So,
instead of writing separate provisioning logic for each cloud provider, you
define your base operating system, packages, security hardening scripts, and
configurations in a single template file.

Packer's multi-builder architecture allows you to declare multiple targets, such
as an `azure-arm` builder, a `vultr` builder all within the same set of
configurations. Thereafter, whenever we execute a single `packer build` command,
Packer simultaneously provisions, hardens, and captures images across all three
clouds in parallel.

By unifying your image pipeline under a single, centralized configuration:

- Our provisioning logic is written once and shared universally across all
  target environments thereby adhering to the Don't Repeat Yourself (DRY)
  principles.

- We eliminate the risk of forgetting to update one cloud provider's script
  while updating another.

- Updates to software versions or security patches are managed in one place,
  instantly propagating to every cloud platform during the next scheduled
  pipeline run.

By hooking our Packer multi-builder configuration into our CI/CD platform
(usually GitHub Actions), image creation became a complete automated event
triggered by code commits, dependency updates, or scheduled cron jobs.

When a security patch is released, our CI/CD system automatically kicks off a
parallel build across Azure, and Vultr, runs compliance validations, and
publishes the resulting golden images to their respective cloud registries
before the engineering team even starts their workday. By orchestrating our
multi-cloud pipeline this way, we transformed image management from a heavy
operational burden into a seamless, high-speed automated engine.

## Lessons Learned and What's Next:

Transitioning from ad-hoc, manual image building to an automated, multi-cloud
pipeline powered by HashiCorp Packer was a cultural shift as much as a technical
one. Looking back on our journey from the initial multi-cloud dilemma to a fully
standardized image factory, a few hard-won lessons stand out-along with some
massive performance wins.

Some of the pitfalls we successfully avoided are:

1. The "_Just SSH and Fix It_" Trap during our initial journey where it was
   tempting to log into running instances to troubleshoot or patch
   configurations directly. We quickly learned that treating instances like
   cattle meant breaking this habit entirely. If something was wrong, the fix
   had to happen in the code, forcing us to maintain discipline across our IaC
   repositories.

2. In the beginning, our provisioning scripts tried to do too much, resulting in
   bloated, fragile builds. We learned to keep our base images lean, leveraging
   Packer primarily for foundational hardening and security agents, while
   leaving application-specific layers to runtime deployment tools (such as
   [Docker](https://www.docker.com)).

3. As we added more hardening steps, our build times crept up. We had to learn
   how to optimize our pipeline caching and leverage parallel multi-builder
   execution so that security checks didn't bottleneck developer velocity.

4. Because our automated pipeline churned out fresh, secure images on a regular
   schedule, we quickly accumulated hundreds of older VM Images and snapshots
   across our cloud accounts. Left unchecked, this invisible buildup of obsolete
   artifacts began inflating our monthly cloud storage bills, forcing us to
   quickly implement automated retention and cleanup policies.

Regardless of the pitfalls, we did notice some performance wins in our
application deployment pipelines as well thanks to the Packer integrations, such
as:

1.  What used to take hours of manual coordination across multiple cloud
    consoles now happens in a matter of minutes, entirely hands-off via our
    CI/CD triggers.

2.  By stamping out manual configurations and centralizing our templates, we
    eliminated the environment-specific anomalies that used to plague our
    staging-to-production promotions due to
    [infrastructure drift](/blog/managing-infrastructure-drift).

3.  Compliance reviews that once triggered weeks of anxious preparation are now
    streamlined. We can point directly to version-controlled Packer manifests
    and automated scan logs to prove our security posture.

Having conquered the multi-cloud image dilemma, our sights are now set on the
next frontier. We are currently exploring automated image lifecycle
policies-automatically deprecating and aging out older VM Images and snapshots
to ensure teams are always pulling the absolute freshest, most secure baselines.
We are also looking into tighter integration with service meshes and ephemeral
testing frameworks to validate image integrity instantly upon build completion.

By treating our VM images as code, we didn't just speed up our deployments; we
built a resilient foundation for the future of our engineering organization. We
also hope by sharing the knowledge we gathered from our venture might help you,
your team or your company out as well.
