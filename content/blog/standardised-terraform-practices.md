---
title: How We Standardized on Terraform for Cloud Infrastructure
description:
  Discover how we standardized our cloud infrastructure on Terraform. Learn how
  Infrastructure as Code (IaC) eliminated drift, accelerated deployments, and
  scaled our workflows.
date: 2026-11-19T15:10:25+05:30
author: somraj-saha
category: infrastructure
cover: /blog/standardised-terraform-practices.webp
---

In our initial days at **[Weburz](https://weburz.com)**, manual intervention to
provision cloud resources on [Microsoft Azure](https://microsoft.azure.com) was
slowing us down. It created bottlenecks and friction across our engineering
workflows. Relying on manual steps simply couldn't keep pace with our rapid
deployment needs as we design and implemented our infrastructure requirements.

To eliminate configuration drift and speed up our delivery cycles, we turned to
Infrastructure as Code principles using [Terraform](https://terraform.io) to
automate our pipelines. In this post, we dive into practical patterns for
writing clean HCL configurations, managing state efficiently, and provisioning
cloud architectures with absolute confidence as we share our experience and
learnings in this blog post.

## The "Before" State: The Pain Points of Not Having Terraform

Before adopting Infrastructure as Code (IaC) at Weburz, managing our cloud
infrastructure relied heavily on manual processes and web console adjustments.
While this hands-on approach worked during our earliest phases, scaling our
architecture quickly exposed significant vulnerabilities in our operational
workflow.

Perhaps the biggest issue we faced with manual intervention to manage our
infrastructure was ["configuration drift"](/blog/managing-infrastructure-drift).

Without a single source of truth, manual tweaks in the cloud console; whether
quickly adjusting a security group rule or resizing a virtual machine, created
invisible divergence across our environments. Over time, actual cloud
infrastructure drifted far from our documented configurations resulting in
troubleshooting issues becoming an exercise in guesswork.

We jokingly addressed these manual operations as "ClickOps" and almost always
held our breadth when upgrading or auditing our infrastructure. Our reliance on
navigating through UI menus to manually configure services introduced an
unnecessary risk of human error. We often overlooked crucial settings stating
"temporary workarounds" but making deployments non-repeatable, difficult to
audit, and highly susceptible to mistakes that could disrupt production
services.

Over time we also realised how critical infrastructure details were stored
primarily in the heads of a few specific team members rather than being
documented systematically. This created single points of failure; if the person
(who set up a particular database cluster or network route) was unavailable, the
team faced unnecessary hurdles in modifying or scaling those resources.

The third issue we identified was spinning up identical deployment environments.
Setting up staging, QA, and production environments was nearly impossible using
our archaic manual provisioning. Small discrepancies between environments
frequently led to the cloud infrastructure equivalent of the classic "it works
on my machine" problem. Our application builds sometimes passed smoothly in the
developer's local testing environment, only to fail upon hitting production due
to underlying environment mismatched configurations.

## Why Terraform? (The Evaluation & Decision)

We chose Terraform for the following core reasons:

1. It's capability to manage resources with cloud-agnostic flexibility.

2. Defining the expected end state in a declarative configuration code instead
   of imperative scripts.

3. The power of the ecosystem with a rich module registry, active community
   support and broad provider support.

4. Tracking resource mappings and dependencies through a state file which
   provides increased idempotency.

We use Terraform to provision and manage infrastructure across diverse
environments, including Microsoft Azure, [Vultr](https://www.vultr.com), etc
using a single, unified workflow. By standardising around the Hashicorp
Configuration Language (HCL) and a consistent execution lifecycle (`init`,
`plan`, `apply`, `destroy`), engineers apply the same authoring, code review,
and automation practices regardless of the underlying platform.

While cloud-agnostic execution doesn't make vendor-specific abstractions
identical, for example, Azure RBAC models remain structurally distinct from
other providers (such as Vultr), standardising the operational layer eliminates
context switching and simplifies hybrid or multi-provider architectures.

The other benefit of using Terraform is its reliance on HCL to provide a
declarative model instead of relying on imperative scripts. Using HCL, our
engineers define the desired end state to easily manage the infrastructure of a
required project.

Here's a sample code snippet showcasing what Terraform's HCL code looks like:

```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "random" {}

variable "pet_length" {
  description = "Number of words in the generated pet name"
  type        = number
  default     = 2
}

resource "random_pet" "server" {
  length    = var.pet_length
  separator = "-"
}

output "server_name" {
  description = "Generated name for the server"
  value       = random_pet.server.id
}
```

You can save the code snippets shared above in a `main.tf` file then run
`terraform plan -out="main.tfplan"` to build the plan. The plan can then safely
consumed by Terraform's `terraform apply "main.tfplan"` command to actually
provision the infrastructure.

During execution, Terraform compares the target configuration against existing
infrastructure to compute a deterministic execution plan, safely creating,
updating or destroying resources to converge on the expected state. This
approach deliver idempotent deployments, makes infrastructure drift detectable,
and allows our engineers to inspect exact resource diffs during PR reviews
before any live changes occur. You want to read
[Taking Terraform to Production: Automating IaC with CI/CD](/blog/taking-terraform-to-production)
to learn more about our automated workflows.

The [Terraform Registry](https://registry.terraform.io) provides our teams
access to a wide range of public and private (internal) module repositories as
well. The contents of these repositories encapsulate hardened and reusable
architectural patterns such as VPC topologies, cluster baselines, and IAM
guardrails behind standardised input interfaces. Backed by industry adoption,
this ecosystem also provides well-established CI/CD patterns, static analysis
tools and policy-as-code integrations. All these factors are a major deciding
factor for us to end up using Terraform as our preferred tool for managing our
cloud infrastructure.

Lastly, at the core of Terraform's execution engine is its state file (usually
named `terraform.tfstate`), which maintains a persistent mapping between
resource definitions in HCL and real-world provisioned objects. The state tracks
resource identifiers, metadata, and implicit or explicit dependency graphs so
Terraform can determine the exact order in which changes must be applied and
avoid querying every provider API exhaustively on each run.

On a side note it should be also noted, this state file serves as the
authoritative record of managed infrastructure and often contains sensitive
attributes. For our production requirements we store this state file in a
remote, encrypted backend, such as Microsoft's Azure Blob Storage but for local
testing environments, saving it locally is probably fine as well.

Here's how we store the state file in a remote (Azure) backend:

```hcl
terraform {
  required_version = ">= 1.5.0"

  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "sttfstateprod001" # Must be globally unique across Azure
    container_name       = "tfstate"
    key                  = "networking/prod.terraform.tfstate"

    # Recommended: authenticate via Microsoft Entra ID (e.g., OIDC in pipelines or Azure CLI locally)
    # Ensure the identity has the "Storage Blob Data Contributor" role on the storage account/container
    use_azuread_auth = true
  }
}
```

To further prevent concurrent modifications and state corruption, we also enable
state locking and use automated CI/CD workflows to manage the infrastructure.

## The Impact & Long-Term Benefits

Ever since we standardised our workflows and infrastructure management around
Terraform, we noticed measurable operational velocity, stronger governance and
higher developer autonomy. We no longer have to deal with reactive firefighting
and manual bottlenecks. Instead we're more focused towards deployment that scale
alongside our product delivery requirements.

Here are some ways how using Terraform and a standardised approach to manage our
infrastructure has helped us:

- The automated environment and resource provisioning compresses delivery cycles
  from days or hours of manual ticket queues and console configuration down to
  minutes of repeatable execution. We now spin up/down ephemeral test
  environments, staging stacks, and production resources on demand with
  consistent configurations, removing setup delays from feature development and
  release schedules.

- Embedding security and governance checks directly in to PRs and CI/CD
  pipelines shift compliance leftwards. We now catch misconfigurations before
  resources are ever provisioned rather than discovering them during periodic
  audits. Our engineers now enforce encryption at rest with least-privilege
  access patterns, network segmentation, and required tagging standards
  automatically in code, producing a continuous, auditable trail of policy
  adherence.

- We also maintain private (internal) and some public shared modules with
  automatic validation and clear guardrails which allow our product engineers to
  provision and manage routine infrastructure independently. They no longer have
  to file tickets for every minor adjustment. This allows our DevOps Engineers
  to stay focused on shared foundations, reliability, and complex architectural
  problems, while developers ship faster with confidence of their changes
  staying within safe organisational boundaries.

## Lessons Learned & Advice for Others

Looking back on our journey with Terraform, some of the most valuable takeaways
came not from syntax or tooling, but how we paced our adoption and protected our
operational foundations. If you're preparing to introduce Terraform to your team
or company, here are a few practical lessons which will help you stand out:

1. Don't cheap out or take shortcuts when securing the state file to avoid
   costly incidents down the line. We made a decision early on to treat our
   remote state backend with the same level of security and rigor as a
   production database.

   Even to this day, we store our Terraform state file remotely with strict
   role-based access control, encryption at rest, versioning, and automated
   state locking to ensure sensitive metadata stays protected. Establishing such
   discipline for day one saved us from the kind of state corruption headaches
   which might potentially stall an entire engineering team otherwise.

2. When starting out, it can be tempting to try importing and codifying your
   entire legacy footprint all at once. In our experience, this approach creates
   an unnecessary risk and slows down momentum. Instead we recommend starting
   out with a greenfield service or a low-risk, non-critical workload. This
   should give your team/company room to establish repository conventions, test
   module patterns and refine your CI/CD workflows before bringing
   mission-critical production infrastructure under Terraform management.

3. Like any meaningful shift in engineering workflows, adopting Terraform comes
   with a real learning curve (we say so from our own experiences). Whether it
   was resolving a stubborn state lock, refactoring early configurations which
   grew too monolithic, or learning when to reach for `moved` blocks instead of
   letting Terraform destroy and recreate a resource, each mistake sharpened our
   understanding of how the tool behaves under the hood.

   Treating these early friction points as part of the learning process is
   ultimately what turned Terraform from a new tool into a dependable foundation
   we trust in production.
