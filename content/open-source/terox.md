---
title: Terox
description: A cross-platform CLI to scaffold projects from templates — local or straight from GitHub. Single Go binary.
icon: i-simple-icons-go
tags:
  - Go
  - CLI
  - Templates
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/Weburz/terox
    target: _blank
  - label: Docs
    icon: i-lucide-book-open
    to: https://terox.weburz.com
    target: _blank
---

Terox is a small, cross-platform CLI for scaffolding new projects from
templates. Point it at a GitHub repository or a local directory, answer a few
prompts, and it renders a ready-to-edit project into the output folder of your
choice. Single Go binary — no language runtime to install on the target
machine.

## Why it exists

Every new client project at Weburz starts the same way: the same lint config,
the same CI workflow, the same directory layout. Copy-pasting a "starter repo"
and find-and-replacing the project name gets old fast, and the JavaScript
scaffolders all assume a Node toolchain is already on the machine.

1. **One binary, any machine.** No runtime, no install graph — drop it on a
   fresh laptop or a CI runner and it works.
2. **Templates are just directories.** A `terox.json` manifest declares the
   variables; filenames and file contents are rendered with standard Go
   template tokens like `{{.project_name}}`.
3. **GitHub-native.** Scaffold straight from a public repo ref — no cloning
   first.

## Install

**macOS / Linux (Homebrew):**

```sh
brew install weburz/tap/terox
```

**Windows (Scoop):**

```powershell
scoop bucket add weburz https://github.com/weburz/scoop-bucket
scoop install weburz/terox
```

Binaries are also on the
[releases page](https://github.com/Weburz/terox/releases/latest), or build
from source with `go install github.com/weburz/terox@latest` (Go 1.23+).

## Usage

Scaffold from a local template:

```sh
terox scaffold ./templates/demo --output ./my-project
```

Or straight from GitHub — Weburz publishes its official templates as a
monorepo at
[`weburz/terox-templates`](https://github.com/Weburz/terox-templates), where
each top-level directory is a template:

```sh
terox list weburz/terox-templates
terox scaffold weburz/terox-templates/npm-package --output ./my-package
```

Terox prompts for the variables declared in the template's `terox.json` and
writes the rendered result. For CI or scripted use, skip the prompts:

```sh
terox scaffold ./templates/demo \
  --output ./my-project \
  --set project_name=portfolio \
  --set license=MIT \
  --non-interactive
```

Full template-authoring and command reference lives at
[terox.weburz.com](https://terox.weburz.com).

## Source

[github.com/Weburz/terox](https://github.com/Weburz/terox) — MIT licensed.
