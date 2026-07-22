---
name: "branch-manager"
description: "Manages Git branch lifecycle for FadeMemo: create, switch, sync, clean up, and enforce protection rules. Invoke when user asks to create/switch/delete branches, check branch status, or before starting any new work."
---

# Branch Manager

Enforces the FadeMemo branch model defined in CONTRIBUTING.md. All branch operations must comply with the protection rules.

## Branch Model

```
main（线上稳定版）
  ↑
  │ merge
  │
develop（开发主干）
  ↑
  │ merge
  │
feature/* / bugfix/* / refactor/*（功能分支）
```

## Protection Rules (MANDATORY)

| Branch Pattern | Protected? | Direct Push | Force Push | Merge Target |
|----------------|-----------|-------------|-------------|--------------|
| `main` | YES (highest) | FORBIDDEN | FORBIDDEN | - |
| `develop` | YES (strong) | FORBIDDEN | FORBIDDEN | - |
| `release/*` | YES | FORBIDDEN | FORBIDDEN | `main` + `develop` |
| `hotfix/*` | YES | FORBIDDEN | FORBIDDEN | `main` first, then `develop` |
| `feature/*` | NO | ALLOWED | ALLOWED | `develop` |
| `bugfix/*` | NO | ALLOWED | ALLOWED | `develop` |
| `refactor/*` | NO | ALLOWED | ALLOWED | `develop` |

## Naming Convention

| Branch Type | Format | Source | Examples |
|-------------|--------|--------|----------|
| Feature | `feature/<name>` | `develop` | `feature/canvas-effect`, `feature/editor-auto-save` |
| Bugfix | `bugfix/<description>` | `develop` | `bugfix/crash-on-null-note` |
| Refactor | `refactor/<module>` | `develop` | `refactor/forgetting-engine` |
| Release | `release/vX.Y.Z` | `develop` | `release/v1.0.0` |
| Hotfix | `hotfix/<description>` | `main` | `hotfix/data-loss-fix` |

## Operations

### Pre-flight Check (REQUIRED before ANY branch operation)

```bash
git branch --show-current  # confirm current branch
git status                 # ensure clean working tree
git fetch --all            # sync remote refs
```

### Create Branch

```bash
# Feature / Bugfix / Refactor — always from develop
git checkout develop && git pull origin develop
git checkout -b feature/<name>

# Hotfix — always from main
git checkout main && git pull origin main
git checkout -b hotfix/<description>
```

**Validation before creation:**
- Branch name follows naming convention
- Source branch is up to date
- Working tree is clean

### Sync Branch with Upstream

```bash
git fetch origin develop
git merge origin/develop  # or rebase, depending on team preference
```

### Delete Branch

```bash
# Local
git branch -d <branch-name>        # safe delete (merged only)
git branch -D <branch-name>        # force delete (use with caution)

# Remote
git push origin --delete <branch-name>
```

**Rules:**
- MUST NOT delete `main`, `develop`, or active release/hotfix branches
- PR-merged branches SHOULD be deleted within 24 hours
- Always confirm with user before deleting any branch

### Branch Status Check

```bash
# List all branches with tracking info
git branch -vv

# Check which branches are behind/ahead
git fetch --all && git branch -vv | grep ': behind\|: ahead'
```

## Error Handling

- If attempting to operate on a protected branch: STOP and warn user
- If branch name doesn't follow convention: suggest corrected name before proceeding
- If working tree is dirty: warn user and suggest stash or commit before branching
