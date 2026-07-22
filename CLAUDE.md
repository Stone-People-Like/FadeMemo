# FadeMemo AI Agent Instructions (Claude Code)

> 本文件为 Claude Code 专用项目指令，规则源来自 CONTRIBUTING.md。
> 修改规则时请同步更新 CONTRIBUTING.md 中的 HTML 注释块。

## 项目概述

FadeMemo (记·忘) — 基于 Flutter 的跨平台间隔重复笔记应用。
技术栈：Flutter + Dart / Hive / Vite + React + TypeScript。

---

## 强制规则

### 安全（最高优先级）

- 禁止在代码、commit、PR、Issue 中写入密钥、Token、密码、API Key
- 发现仓库中存在敏感信息，必须立即警告用户并建议清除历史记录

### 分支保护

- 禁止直接向 `main` 或 `develop` 推送代码，所有改动必须通过 PR
- 禁止对 `main`/`develop`/`release`/`hotfix` 执行 `git push --force`
- 任何 git 操作前先执行 `git branch --show-current` 确认当前分支
- 创建新分支前必须先 `git pull` 同步目标分支最新代码

### 分支命名

| 分支类型 | 格式 | 源分支 |
|---------|------|-------|
| 功能 | `feature/<功能名>` | `develop` |
| 修复 | `bugfix/<问题描述>` | `develop` |
| 重构 | `refactor/<模块名>` | `develop` |
| 热修复 | `hotfix/<问题描述>` | `main`（先合 main 再合 develop） |
| 发布 | `release/vX.Y.Z` | `develop` |

## Commit 规范

格式：`<type>(<scope>): <描述> 【<邮箱后四位>】`

- type: `feat` | `fix` | `refactor` | `docs` | `test` | `style` | `chore`
- scope: 可选模块名（canvas, editor, core, docs, ui, storage, sync）
- 禁止无意义 commit message："update files"、"fix bug"、"changes"
- 一次 Commit 只做一件事

## PR 规范

- 日常功能 → `develop`，热修复 → `main`
- 标题使用 Conventional Commits 格式
- body 必须包含：变更说明、自测清单、关联任务
- `main` 需 1~2 人评审，`develop` 至少 1 人

## 冲突处理

- 禁止自动选择一方覆盖
- 逐个文件分析冲突，向用户解释差异，等待确认

## 代码生成

- 先阅读现有代码，理解架构风格和命名约定
- 不得引入新依赖，除非用户明确要求
- 必须通过 `flutter analyze` 无 error
- 数据模型变更必须提供 Hive 迁移方案

## 确认机制

- **必须确认**：推送代码、合并分支、删除分支、修改版本号、创建 PR、修改配置、引入新依赖
- **可跳过**：读取文件、搜索代码、生成测试、格式化

## 人机协作

- 回复使用与用户相同的语言
- 报告问题需同时提供：描述、影响范围、建议方案
- 操作失败时立即停止并报告

## 版本号

- 遵循 `VERSIONING.md` 语义化版本规范
- 不得自行修改版本号，除非用户明确指示
- 修改版本号时必须同步更新 `CHANGELOG.md`

## Dart/Flutter 命名

- 文件：`snake_case.dart`
- 类：`PascalCase`
- 函数/方法：`camelCase`
- 私有成员：`_prefix`
- 枚举值：`camelCase`
