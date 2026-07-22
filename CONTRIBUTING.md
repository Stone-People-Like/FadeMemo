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

### 3.1 分支操作规范

#### 分支保护规则

| 分支模式 | 受保护？ | 直推 | 强推 | 合并目标 |
|---------|---------|------|------|---------|
| `main` | 最高保护 | 禁止 | 禁止 | — |
| `develop` | 强保护 | 禁止 | 禁止 | — |
| `release/*` | 受限 | 禁止 | 禁止 | `main` + `develop` |
| `hotfix/*` | 受限 | 禁止 | 禁止 | 先 `main`，再 `develop` |
| `feature/*` | 开放 | 允许 | 允许 | `develop` |
| `bugfix/*` | 开放 | 允许 | 允许 | `develop` |
| `refactor/*` | 开放 | 允许 | 允许 | `develop` |

#### 分支命名

| 分支类型 | 格式 | 从哪个分支创建 | 示例 |
|---------|------|--------------|------|
| 新功能 | `feature/<功能名>` | `develop` | `feature/canvas-effect` |
| Bug 修复 | `bugfix/<问题描述>` | `develop` | `bugfix/crash-on-null` |
| 代码重构 | `refactor/<模块名>` | `develop` | `refactor/forgetting-engine` |
| 热修复 | `hotfix/<问题描述>` | `main` | `hotfix/data-loss-fix` |
| 版本发布 | `release/vX.Y.Z` | `develop` | `release/v1.0.0` |

#### 分支操作前必须执行的检查

```bash
git branch --show-current  # 确认当前分支
git status                 # 确保工作树干净
git fetch --all            # 同步远端引用
```

#### 创建分支

```bash
# 功能/修复/重构 — 从 develop 创建
git checkout develop && git pull origin develop
git checkout -b feature/<功能名>

# 热修复 — 从 main 创建
git checkout main && git pull origin main
git checkout -b hotfix/<问题描述>
```

创建前验证：分支名符合规范、源分支已最新、工作树干净。

#### 删除分支

```bash
# 本地（安全删除，仅限已合并的分支）
git branch -d <branch-name>

# 远程
git push origin --delete <branch-name>
```

规则：禁止删除 `main`/`develop`/活跃的 release/hotfix 分支；PR 合并后 24 小时内删除废弃分支；删除前必须与用户确认。

#### 同步分支

```bash
git fetch origin develop
git merge origin/develop
```

---

### 3.2 Commit 规范

#### 格式

```
<type>(<scope>): <描述> 【<邮箱后四位>】
```

#### Type 值

| Type | 用途 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(canvas): 新增错乱态 RGB 偏移动效 【1924】` |
| `fix` | Bug 修复 | `fix(editor): 修复自动保存防抖失效问题 【1924】` |
| `refactor` | 代码重构（不改变行为） | `refactor(core): 重构遗忘引擎计算逻辑 【1924】` |
| `docs` | 文档更新 | `docs(readme): 更新快速开始指南 【1924】` |
| `test` | 测试相关 | `test(forgetting): 补充边界值测试用例 【1924】` |
| `style` | 代码格式调整 | `style(lint): 统一缩进为 2 空格 【1924】` |
| `chore` | 构建/工具/依赖变动 | `chore(deps): 升级 Flutter 至 3.22 【1924】` |

#### 提交前验证步骤

1. 检查暂存文件：`git diff --staged --stat`
2. 确认所有暂存文件属于同一个逻辑变更
3. 检查 message 格式是否符合模板
4. 确认邮箱后四位与提交者注册邮箱一致

#### 提交前检查清单

```bash
dart format lib/          # 格式化代码
flutter analyze            # 静态分析
flutter test               # 运行测试
git diff --staged          # 检查暂存变更
```

#### 禁止模式

- 硬编码密钥/Token/密码到源代码
- 大段注释掉的代码块（删除死代码，不要注释）
- 提交中遗留 print/debug 语句
- 未经用户批准的依赖引入
- 未经迁移方案的 Hive 数据模型变更

---

### 3.3 PR 规范

#### 创建前检查（5 项）

1. 分支从正确的源分支创建（功能 → `develop`，热修复 → `main`）
2. 本地分支已同步目标分支：`git fetch origin <target> && git merge origin/<target>`
3. 所有变更已按 Conventional Commits 格式提交
4. `flutter analyze` 通过，无 error
5. `flutter test` 通过

#### 创建命令

```bash
gh pr create --base <target-branch> --title "<type>(<scope>): <描述>" --body "<描述>"
```

#### PR Body 模板

```markdown
## 变更说明

<描述改了什么以及为什么改>

## 自测清单

- [ ] 本地编译通过
- [ ] Commit 信息符合规范
- [ ] 已从目标分支拉取最新代码并解决冲突
- [ ] 相关功能自测通过

## 关联任务

<可选：关联的 Issue 或任务>
```

#### 评审要求

| 目标分支 | 最低评审人数 |
|---------|------------|
| `main` | 1~2 人 |
| `develop` | 至少 1 人 |

#### Review 方式

**Web 端**：
1. 打开 PR 页面
2. 点击 "Files changed" 标签
3. 审查每个文件 diff
4. 点击右上角 "Submit review" 绿色按钮
5. 选择 Approve / Request changes / Comment
6. 点击 Submit review

**CLI 端**：
```bash
gh pr diff <pr-number>                            # 查看 diff
gh pr review <pr-number> --approve --body "LGTM"   # 批准
gh pr review <pr-number> --request-changes --body "Please fix..."  # 请求修改
```

#### 合并方式

| 方式 | 命令 | 适用场景 |
|------|------|---------|
| Merge commit | `gh pr merge <n> --merge` | 保留完整历史 |
| Squash（推荐） | `gh pr merge <n> --squash` | 干净历史，适合功能 PR |
| Rebase | `gh pr merge <n> --rebase` | 线性历史 |

#### 合并后清理

```bash
git push origin --delete <branch-name>                  # 删除远程分支
git checkout develop && git pull origin develop         # 切回 develop
git branch -d <branch-name>                              # 删除本地分支
```

#### 冲突处理流程（强制 5 步）

1. **停止** — 不要尝试自动解决
2. 向用户报告冲突文件列表：`git diff --name-only --diff-filter=U`
3. 逐个文件分析：读取两个版本，向用户解释差异，提供解决建议
4. 等待用户确认
5. 用户确认后再提交

---

### 3.4 代码生成规范

- 生成代码前，必须先阅读相关模块的现有代码，理解架构风格和命名约定
- 生成的代码必须通过 `flutter analyze` 无 error
- 数据模型变更必须提供 Hive 迁移方案
- 新依赖必须用户批准，需检查 [pub.dev](https://pub.dev) 版本兼容性

#### Dart/Flutter 命名约定

| 类别 | 规范 | 示例 |
|------|------|------|
| 文件名 | `snake_case.dart` | `note_editor.dart` |
| 类名 | `PascalCase` | `NoteEditor` |
| 函数/方法 | `camelCase` | `calculateDecayLevel()` |
| 常量 | `lowerCamelCase` | `maxDecayLevel` |
| 私有成员 | `_prefix` | `_notes` |
| 枚举值 | `camelCase` | `DecayLevel.fresh` |

---

### 3.5 发布流程规范

#### 版本格式

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
```

| 组件 | 何时递增 | 示例 |
|------|---------|------|
| MAJOR | 破坏性变更 | 1.0.0 → 2.0.0 |
| MINOR | 新功能（向后兼容） | 1.0.0 → 1.1.0 |
| PATCH | Bug 修复 | 1.0.0 → 1.0.1 |
| PRERELEASE | Alpha/Beta/RC | 1.0.0-alpha.1, 1.0.0-rc.2 |
| BUILD | 构建元数据（自动） | 1.0.0+42 |

#### 发布 5 步流程

```bash
# 1. 验证分支状态
git checkout develop && git pull origin develop
git status  # 必须干净

# 2. 更新版本文件（pubspec.yaml + CHANGELOG.md）
# 注意：AI 不得自行修改版本号，除非用户明确指示

# 3. 创建 release 分支
git checkout -b release/vX.Y.Z

# 4. 全员回归测试（仅允许修复 Bug）

# 5. 合并到 main 和 develop
git checkout main && git merge release/vX.Y.Z --no-ff
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git checkout develop && git merge release/vX.Y.Z --no-ff
git branch -d release/vX.Y.Z
git push origin --delete release/vX.Y.Z
```

#### Git Tag 约定

| Tag 格式 | 用途 | 示例 |
|---------|------|------|
| `vX.Y.Z` | 正式发布 | `v1.0.0` |
| `vX.Y.Z-alpha.N` | Alpha 构建 | `v1.0.0-alpha.1` |
| `vX.Y.Z-beta.N` | Beta 构建 | `v1.0.0-beta.3` |
| `vX.Y.Z-rc.N` | 候选发布 | `v1.0.0-rc.1` |

#### GitHub Release

```bash
gh release create vX.Y.Z \
  --title "vX.Y.Z" \
  --notes "<从 CHANGELOG 提取的发布说明>" \
  --target main
```

#### 热修复发布

1. 从 `main` 拉取：`git checkout -b hotfix/<描述>`
2. 修复、测试
3. 先合并到 `main`（紧急上线）
4. 再合并到 `develop`（同步修复）
5. PATCH 版本号递增、打 Tag、创建 GitHub Release
6. 清理 hotfix 分支

#### Changelog 格式

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- 新功能描述

### Changed
- 行为变更描述

### Fixed
- Bug 修复描述

### Removed
- 移除/废弃描述
```

---

### 3.6 项目导航

#### 项目概述

**FadeMemo (记·忘)** — 基于 Flutter 的跨平台间隔重复笔记应用，通过"笔记衰减"机制强制用户进行主动回忆。

#### 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| UI 框架 | Flutter + Dart | 跨平台应用 |
| 本地存储 | Hive | NoSQL 数据库 |
| 构建工具 | Flutter CLI | 构建与打包 |
| 官网 | Vite + React + TypeScript + Tailwind CSS | 产品落地页 |
| 版本控制 | Git + GitHub | 源代码管理 |
| CI/CD | GitHub Actions（规划中） | 自动化测试与构建 |

#### 仓库结构

```
FadeMemo/
├── lib/                          # Flutter 应用源代码
├── test/                         # 单元 & Widget 测试
├── web/                          # Flutter Web 资源
├── website/                      # 产品落地页（Vite + React）
│   └── src/components/           # React 组件
├── assets/                        # 静态资源
├── .github/                      # GitHub 配置
│   └── PULL_REQUEST_TEMPLATE.md  # PR 模板
├── .trae/documents/              # 产品文档（PRD + 技术架构）
├── CONTRIBUTING.md               # 本文件（AI 行为准则）
├── VERSIONING.md                  # 版本号规范
├── CHANGELOG.md                  # 发布历史
├── README.md                     # 项目概述
├── pubspec.yaml                  # Flutter 依赖与版本号
└── 记·忘_产品概念报告.md           # 产品概念报告
```

#### 核心概念

- **笔记衰减**：笔记随时间"损坏"，基于遗忘曲线计算
- **主动回忆**：用户修复衰减的笔记，强化记忆
- **衰减等级**：视觉损坏强度（越高越严重）
- **Hive 存储**：原始内容完整保存，损坏仅在展示时实时计算
- **笔记类型**：学习型笔记（启用衰减）vs 工具型笔记（始终完好）

#### 常用命令

```bash
flutter pub get        # 安装依赖
flutter run            # 运行（设备/模拟器）
flutter run -d chrome  # 运行 Web 版
flutter test           # 运行测试
flutter analyze         # 静态分析
```

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

> 发现敏感信息时，建议：1) 用 `git filter-branch` 或 BFG Repo-Cleaner 清除历史 2) 立即轮换凭证 3) 通知所有协作者重新 clone
