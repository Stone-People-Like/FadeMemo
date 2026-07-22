---
name: "release-flow"
description: "Manages FadeMemo version releases: semantic versioning, git tags, changelog updates, and GitHub releases. Invoke when user asks to bump version, create a release, publish a new build, or manage changelog."
---

# Release Flow

Manages version releases following the FadeMemo VERSIONING.md specification.

## Version Format

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
```

| Component | When to Increment | Example |
|-----------|------------------|---------|
| MAJOR | Breaking changes, incompatible API | 1.0.0 → 2.0.0 |
| MINOR | New features, backward compatible | 1.0.0 → 1.1.0 |
| PATCH | Bug fixes, no new features | 1.0.0 → 1.0.1 |
| PRERELEASE | Alpha/Beta/RC builds | 1.0.0-alpha.1, 1.0.0-rc.2 |
| BUILD | Build metadata (auto) | 1.0.0+42 |

## Version Bump Workflow

### Step 1: Verify Branch State

```bash
git checkout develop && git pull origin develop
git status  # must be clean
```

### Step 2: Update Version Files

- `pubspec.yaml` — update `version` field
- `CHANGELOG.md` — add new version entry with changes

**RULE: AI MUST NOT modify version numbers unless user explicitly requests.**

### Step 3: Create Release Branch

```bash
git checkout -b release/vX.Y.Z
```

### Step 4: Testing Gate

- Full regression testing on release branch
- Only bug fixes allowed on release branch
- All bugs found must be fixed and committed to release branch

### Step 5: Merge to main and develop

```bash
# Merge to main (production)
git checkout main && git merge release/vX.Y.Z --no-ff

# Tag the release
git tag -a vX.Y.Z -m "Release vX.Y.Z"

# Merge back to develop (sync)
git checkout develop && git merge release/vX.Y.Z --no-ff

# Delete release branch
git branch -d release/vX.Y.Z
git push origin --delete release/vX.Y.Z
```

## Git Tag Convention

| Tag Format | Purpose | Example |
|------------|---------|---------|
| `vX.Y.Z` | Production release | `v1.0.0` |
| `vX.Y.Z-alpha.N` | Alpha build | `v1.0.0-alpha.1` |
| `vX.Y.Z-beta.N` | Beta build | `v1.0.0-beta.3` |
| `vX.Y.Z-rc.N` | Release candidate | `v1.0.0-rc.1` |

Tag messages should include release summary.

## GitHub Release

```bash
# Create GitHub release with tag
gh release create vX.Y.Z \
  --title "vX.Y.Z" \
  --notes "<release notes from CHANGELOG>" \
  --target main
```

## Changelog Format (CHANGELOG.md)

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New feature descriptions

### Changed
- Changes to existing behavior

### Fixed
- Bug fixes

### Removed
- Removed features/deprecations
```

## Hotfix Release

When a critical bug is found in production:

1. Create hotfix from `main`: `git checkout -b hotfix/<description>`
2. Fix and test
3. Merge to `main` first (emergency release)
4. Then merge to `develop` (sync fix)
5. Bump PATCH version, tag, create GitHub release
6. Clean up hotfix branch
