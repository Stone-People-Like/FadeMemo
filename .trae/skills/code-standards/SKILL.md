---
name: "code-standards"
description: "Enforces FadeMemo code standards: commit message format (Conventional Commits + email suffix), naming conventions, and pre-commit checks. Invoke before committing code, reviewing commit history, or when user asks about coding standards."
---

# Code Standards

Enforces the FadeMemo coding conventions defined in CONTRIBUTING.md and VERSIONING.md.

## Commit Message Format (MANDATORY)

```
<type>(<scope>): <description> 【<last 4 digits of email>】
```

### Type Values

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat(canvas): 新增错乱态 RGB 偏移动效 【1924】` |
| `fix` | Bug fix | `fix(editor): 修复自动保存防抖失效问题 【1924】` |
| `refactor` | Code refactor (no behavior change) | `refactor(core): 重构遗忘引擎计算逻辑 【1924】` |
| `docs` | Documentation | `docs(readme): 更新快速开始指南 【1924】` |
| `test` | Test-related | `test(forgetting): 补充边界值测试用例 【1924】` |
| `style` | Code formatting | `style(lint): 统一缩进为 2 空格 【1924】` |
| `chore` | Build/tooling/dependency | `chore(deps): 升级 Flutter 至 3.22 【1924】` |

### Rules

- Scope is optional but recommended. Use module names: `canvas`, `editor`, `core`, `docs`, `ui`, `storage`, `sync`
- Description can be in Chinese or English, keep it concise
- One logical change per commit — do NOT mix unrelated changes
- **FORBIDDEN** messages: "update files", "fix bug", "changes", "update", "wip"

### Validation Steps (before every commit)

1. Review staged files: `git diff --staged --stat`
2. Verify single logical change: are all staged files related?
3. Check message format against the template above
4. Ensure email suffix matches the committer's registered email

## Dart/Flutter Naming Conventions

Follow official Dart style guide with these project-specific additions:

| Category | Convention | Example |
|----------|-----------|---------|
| File name | `snake_case.dart` | `note_editor.dart`, `forgetting_engine.dart` |
| Class name | `PascalCase` | `NoteEditor`, `ForgettingEngine` |
| Function/Method | `camelCase` | `calculateDecayLevel()`, `saveNote()` |
| Constant | `lowerCamelCase` (Dart style) | `maxDecayLevel`, `defaultInterval` |
| Private member | `_prefix` | `_notes`, `_currentLevel` |
| Enum values | `camelCase` | `DecayLevel.fresh`, `NoteType.learning` |
| Package name | `snake_case` | `fade_memo` |

## Pre-commit Checklist

```bash
# 1. Format code
dart format lib/

# 2. Static analysis
flutter analyze

# 3. Run tests
flutter test

# 4. Check staged changes
git diff --staged
```

## Prohibited Patterns

- **NO hardcoded secrets**: API keys, tokens, passwords in source code
- **NO commented-out large code blocks**: remove dead code instead
- **NO print/debug statements in commits**: remove before committing
- **NO arbitrary dependency additions**: must be approved by user first
- **NO Hive model changes without migration plan**: always include migration strategy

## Dependency Management

- New dependencies MUST be approved by user before adding to `pubspec.yaml`
- Check for compatible versions on [pub.dev](https://pub.dev)
- After adding dependency, run `flutter pub get` and verify no version conflicts
