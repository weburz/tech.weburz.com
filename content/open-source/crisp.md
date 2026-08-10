---
title: Crisp
description:
  A no-nonsense Conventional Commits linter for Git, written in Go. Single
  binary, no Node required.
icon: i-simple-icons-go
tags:
  - Go
  - Git
  - CLI
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/Weburz/crisp
    target: _blank
---

Crisp is a [Conventional Commits](https://www.conventionalcommits.org) linter
for `git commit` messages. It's a single Go binary — no Node toolchain, no
dependency churn, no version-pin drama.

We built it because the JavaScript-ecosystem alternatives broke too often and
were heavyweight for what is a very small, very static problem: does this commit
message follow our convention or not.

## Why it exists

1. **No Node dependency tree.** A commit-message linter is a 200ms one-shot
   tool. It shouldn't need to resolve a 300-package install graph to run.
2. **Opinionated and uniform.** One style across every Weburz repo, enforced the
   same way on every machine.
3. **Easy to drop in.** A `pre-commit` hook entry and you're done.

## Install

The recommended path is via [`pre-commit`](https://pre-commit.com):

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/Weburz/crisp
    rev: v1.0.0
    hooks:
      - id: crisp
        stages: [commit-msg]
        name: lint commit messages
```

Then in your repo:

```sh
pre-commit install --install-hooks
```

That's it. Every `git commit` now runs Crisp against the message.

You can also grab the binary directly from the
[releases page](https://github.com/Weburz/crisp/releases) and run it standalone.

## What it checks

Standard Conventional Commits format:

```
<type>(<optional scope>): <description>

<optional body>

<optional footer>
```

Allowed types are the conventional set (`feat`, `fix`, `chore`, `docs`,
`refactor`, `test`, `style`, `perf`, `build`, `ci`, `revert`).

Bad message → non-zero exit → commit blocked. Good message → silent pass.

## Source

[github.com/Weburz/crisp](https://github.com/Weburz/crisp) — MIT licensed.
