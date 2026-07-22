---
name: "pr-workflow"
description: "Manages the full Pull Request lifecycle for FadeMemo: creation, review, merge, and conflict resolution. Invoke when user asks to create/review/merge a PR, resolve merge conflicts, or check PR status."
---

# PR Workflow

Manages Pull Request operations following the FadeMemo contribution guidelines.

## PR Creation

### Prerequisites

1. Branch is created from correct source (`develop` for features, `main` for hotfixes)
2. Local branch is synced with target branch: `git fetch origin <target> && git merge origin/<target>`
3. All changes are committed with proper Conventional Commits format
4. `flutter analyze` passes with no errors
5. `flutter test` passes

### Creation Command

```bash
gh pr create --base <target-branch> --title "<type>(<scope>): <description>" --body "<description>"
```

### PR Body Template

```markdown
## 变更说明

<Clear description of what changed and why>

## 自测清单

- [ ] 本地编译通过
- [ ] Commit 信息符合规范
- [ ] 已从目标分支拉取最新代码并解决冲突
- [ ] 相关功能自测通过

## 关联任务

<Optional: link to related Issue or task>
```

## PR Review

### Target Review Requirements

| Target Branch | Minimum Reviewers |
|---------------|-------------------|
| `main` | 1~2 reviewers |
| `develop` | At least 1 reviewer |

### Review Checklist

- [ ] Commit history is clean (no "wip", "fix typo" noise commits)
- [ ] Title follows Conventional Commits format
- [ ] Body includes change description and self-test checklist
- [ ] Code follows project naming conventions
- [ ] No hardcoded secrets or debug code
- [ ] No unnecessary dependency additions
- [ ] Data model changes include migration plan
- [ ] Branch targets correct destination

### How to Review (Web)

1. Open PR URL in browser
2. Click **"Files changed"** tab
3. Review each file diff
4. Click **"Submit review"** (green button, top-right)
5. Choose: **Approve** (approve merge) / **Request changes** / **Comment**
6. Add optional review comments
7. Click **Submit review**

### How to Review (CLI)

```bash
# View PR diff
gh pr diff <pr-number>

# Approve
gh pr review <pr-number> --approve --body "LGTM"

# Request changes
gh pr review <pr-number> --request-changes --body "Please fix..."

# Comment only
gh pr review <pr-number> --comment --body "Suggestion..."
```

## PR Merge

### Merge Methods

| Method | Command | When to Use |
|--------|---------|-------------|
| Merge commit | `gh pr merge <n> --merge` | Preserves full history |
| Squash | `gh pr merge <n> --squash` | Clean history (recommended for feature PRs) |
| Rebase | `gh pr merge <n> --rebase` | Linear history |

### Post-merge Cleanup

After merge, prompt user to:

```bash
# Delete remote branch
git push origin --delete <branch-name>

# Delete local branch
git checkout develop && git pull origin develop
git branch -d <branch-name>
```

## Conflict Resolution

### Detection

```bash
git fetch origin <target-branch>
git merge origin/<target-branch>
# If conflicts appear, git will list conflicted files
```

### Resolution Process (MANDATORY)

1. **STOP** — do not auto-resolve or pick one side
2. Report conflict files to user with list: `git diff --name-only --diff-filter=U`
3. For each conflicted file:
   - Read both versions (ours/theirs)
   - Explain the differences to user
   - Suggest resolution approach
   - Wait for user confirmation
4. After all conflicts resolved, ask user to verify
5. Only then commit the resolution

### Never Do

- `git checkout --theirs <file>` without explaining to user
- `git checkout --ours <file>` without explaining to user
- Auto-resolve by blindly accepting one side
- Skip user confirmation after resolution
