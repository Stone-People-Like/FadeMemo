# AI Agent 行为准则

> 本文件定义了所有 AI 编码助手在本仓库中必须遵守的行为规范。
> 适用于 Cursor / Copilot / Trae / Windsurf / Claude Code / Cline 等所有 AI 工具。
> 本文件为**唯一规则源**，其他 AI 配置文件（`.cursorrules`、`AGENTS.md` 等）均从此文件同步。

---

## 一、绝对禁止（红线）

以下行为**在任何情况下都不允许**，即使得到用户口头同意也不例外：

| 序号 | 禁止行为 | 原因 |
|------|---------|------|
| 1 | 向 `main` 或 `develop` 分支直接推送代码 | 破坏分支保护，绕过 Review 机制 |
| 2 | 对 `main`/`develop`/`release`/`hotfix` 执行 `git push --force` | 可能永久丢失他人提交 |
| 3 | 在代码、commit、PR、Issue 中写入密钥、Token、密码、API Key | 安全风险，凭证泄露 |
| 4 | 自动选择一方覆盖解决冲突（`--theirs`/`--ours`） | 可能覆盖他人代码导致数据丢失 |
| 5 | 生成无意义的 commit message（"update files"、"fix bug"、"changes"） | 污染 Git 历史，无法追溯变更意图 |
| 6 | 在未告知用户的情况下修改 `pubspec.yaml` 中的版本号 | 版本号变更影响发布流程 |
| 7 | 未经用户明确要求引入新的第三方依赖 | 可能引入安全漏洞或兼容性问题 |
| 8 | 未经用户同意删除任何分支 | 可能丢失未合并的工作 |
| 9 | 替用户做出架构决策、发布决策、权限变更 | 高风险操作必须由人类决策 |
| 10 | 在错误未解决的情况下继续执行后续步骤 | 错误会级联放大 |

---

## 二、不要擅自动（需确认）

以下操作**必须先报告并等待用户明确确认**后才能执行：

### 高风险 — 必须确认

- 推送代码到远程仓库
- 合并分支
- 删除分支（本地或远程）
- 修改版本号（`pubspec.yaml`、`CHANGELOG.md`）
- 修改 CI/CD 配置或构建设置
- 修改 GitHub 仓库设置（分支保护、权限等）

### 中风险 — 必须确认

- 创建 Pull Request
- 修改项目配置文件（`pubspec.yaml`、`build.yaml` 等）
- 重构核心模块（editor、canvas、forgetting engine 等）
- 修改数据模型（需同步提供 Hive 迁移方案）
- 批量修改超过 5 个文件

### 低风险 — 可跳过确认

- 读取文件内容
- 搜索代码
- 生成测试用例
- 代码格式化
- 查看分支状态、commit 历史、PR 列表

---

## 三、必须规范化的行为

### 3.1 分支命名

| 分支类型 | 格式 | 从哪个分支创建 |
|---------|------|--------------|
| 新功能 | `feature/<功能名>` | `develop` |
| Bug 修复 | `bugfix/<问题描述>` | `develop` |
| 代码重构 | `refactor/<模块名>` | `develop` |
| 热修复 | `hotfix/<问题描述>` | `main`（先合 main，再合 develop） |
| 版本发布 | `release/vX.Y.Z` | `develop` |

创建分支前必须先执行 `git pull` 同步源分支最新代码。

### 3.2 Commit 格式

```
<type>(<scope>): <描述> 【<邮箱后四位>】
```

- **type**: `feat` | `fix` | `refactor` | `docs` | `test` | `style` | `chore`
- **scope**: 可选模块名（`canvas`、`editor`、`core`、`docs`、`ui`、`storage`、`sync`）
- **描述**: 中文或英文，简洁明了
- 一次 Commit 只做一件事，禁止混入不相关的修改

### 3.3 PR 规范

- 标题使用 Conventional Commits 格式
- body 必须包含：变更说明、自测清单、关联任务（如有）
- 日常功能 PR 目标为 `develop`，热修复 PR 目标为 `main`
- 创建 PR 前必须确保本地分支已同步目标分支且无冲突
- `main` 需 1~2 人评审，`develop` 至少 1 人评审

### 3.4 冲突处理流程

1. 停止操作，不要尝试自动解决
2. 向用户报告冲突文件列表及原因
3. 逐个文件分析，向用户解释两个版本的差异
4. 提供解决建议，等待用户确认
5. 用户确认后再提交

### 3.5 代码生成要求

- 生成代码前先阅读相关模块的现有代码，理解架构风格和命名约定
- 生成的代码必须通过 `flutter analyze` 无 error
- 命名遵循 Dart 官方规范：文件 `snake_case.dart`、类 `PascalCase`、方法 `camelCase`、私有成员 `_prefix`

---

## 四、行为准则

- **操作可追溯**：每一步操作都有明确的理由和记录
- **语言一致**：回复使用与用户相同的语言（中文/英文）
- **问题报告三要素**：问题描述 + 影响范围 + 建议的解决方案
- **不猜测**：遇到不确定的情况，主动询问用户而非自行假设
- **分阶段执行**：超过 5 步的任务应分阶段执行，每阶段汇报进度
- **失败即停**：操作失败时立即停止后续操作，报告错误原因，提供回滚方案

---

## 五、优先级裁决

当多条规则同时适用时，按以下优先级裁决：

1. **安全与数据保护**（最高）— 涉及敏感信息、数据丢失风险
2. **分支保护** — `main`/`develop` 分支的完整性
3. **代码质量** — 编译通过、测试覆盖、无引入性 Bug
4. **流程规范** — Commit 格式、PR 规范、命名约定
5. **效率优化**（最低）— 性能优化、代码风格改进

当用户口头指令与本规范冲突时，AI 必须先指出冲突、说明风险，等待用户明确确认后才能继续。

---

## 六、多 Agent 协作

当多个 AI Agent 同时在本仓库工作时：

| Agent 类型 | 职责 | 操作范围 |
|-----------|------|---------|
| 主 Agent | 任务调度、整体协调 | 全仓库 |
| 子 Agent | 单一模块/文件的独立任务 | 仅被分配的模块 |
| 审查 Agent | 代码审查、安全检查 | 只读 + PR 评论 |

- 子 Agent 不得越权操作非分配区域
- 审查 Agent 不得直接修改代码
- 同级 Agent 之间的冲突以主 Agent 决策为准
- 禁止子 Agent 自行覆盖其他 Agent 的修改

---

## 七、关联文件

| 文件 | 说明 |
|------|------|
| `VERSIONING.md` | 语义化版本规范 |
| `CHANGELOG.md` | 版本发布历史 |
| `AGENTS.md` | 通用 AI 规范（供 Zed/Aider/CodeWhale 等） |
| `.cursorrules` | Cursor 专用规则 |
| `.github/copilot-instructions.md` | GitHub Copilot 专用规则 |
| `.windsurfrules` | Windsurf 专用规则 |
| `.clinerules` | Cline 专用规则 |
| `CLAUDE.md` | Claude Code 专用规则 |
| `.trae/skills/` | Trae 专用 Skills |

> 发现敏感信息时，建议：1) 用 `git filter-branch` 或 BFG Repo-Cleaner 清除历史 2) 立即轮换凭证 3) 通知所有协作者重新 clone
