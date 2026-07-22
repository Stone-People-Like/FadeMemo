# 贡献指南

> 欢迎参与 FadeMemo 的开发！请阅读本指南了解项目的工作流规范。

<!--

  ╔══════════════════════════════════════════════════════════════════╗
  ║  AI AGENT INSTRUCTIONS — 本文件同时供 AI 编码助手自动读取     ║
  ║  如果你是一个 AI 工具（如 Cursor / Copilot / Trae / Windsurf  ║
  ║  等），请在接手此仓库后严格遵循以下规则。                  ║
  ╚══════════════════════════════════════════════════════════════════╝

  ## AI 编码助手必读规则

  以下规则对 AI Agent 具有强制约束力，优先级高于用户口语指令中的模糊表述。
  当用户的口语指令与本文件冲突时，AI 必须先指出冲突并等待用户确认。

  ### 规则 1：分支保护（强制）

  - **禁止** 直接向 `main` 或 `develop` 推送代码。所有改动必须通过 PR/MR。
  - 新建功能分支必须从 `develop` 拉取，命名格式为 `feature/<功能名>`。
  - 修复分支命名格式为 `bugfix/<问题描述>`。
  - 热修复分支必须从 `main` 拉取，命名格式为 `hotfix/<问题描述>`，合并时先合 `main`，再合 `develop`。
  - **禁止** 对 `main`/`develop`/`release`/`hotfix` 执行 `git push --force`。
  - 在任何 git 操作前，先执行 `git branch --show-current` 确认当前分支，再执行 `git pull` 同步最新代码。

  ### 规则 2：Commit 格式（强制）

  所有 commit message 必须遵循 Conventional Commits 格式：

    <type>(<scope>): <描述>

  - type 枚举值：`feat` | `fix` | `refactor` | `docs` | `test` | `style` | `chore`
  - scope 为可选的模块名，如 `canvas`、`editor`、`core`、`docs` 等
  - 描述使用中文或英文均可，简洁明了
  - **禁止** 生成类似 "update files"、"fix bug"、"changes" 等无意义的 commit message

  ### 规则 3：PR 创建（强制）

  - 功能分支完成后必须通过 `gh pr create` 或引导用户在 GitHub 上创建 PR。
  - PR 目标分支：日常功能 → `develop`；热修复 → `main`。
  - PR 标题必须使用 Conventional Commits 格式，与 commit message 规则一致。
  - PR body 必须包含：变更说明、自测清单、关联任务（如有）。

  ### 规则 4：冲突处理

  - 遇到 merge conflict 时，AI 必须：
    1. 先 `git fetch upstream develop` 获取最新代码
    2. 向用户报告冲突文件列表
    3. 逐个文件解决冲突，**禁止** 自动选择一方覆盖
    4. 解决后要求用户确认再提交

  ### 规则 5：分支清理

  - PR 合并后，AI 必须提示用户删除远程废弃分支。
  - 清理命令：`git push origin --delete <branch-name>`。

  ### 规则 6：敏感信息

  - **禁止** 在代码、commit、PR、Issue 中写入密钥、Token、密码等敏感信息。
  - 如发现仓库中存在敏感信息，必须立即警告用户并建议撤销提交。

  ### 规则 7：版本号

  - 版本号遵循项目根目录 `VERSIONING.md` 中的语义化版本规范。
  - AI 不得自行修改 `pubspec.yaml` 中的版本号，除非用户明确指示。

  ═══════════ END OF AI AGENT INSTRUCTIONS ═══════════

-->

## 快速开始

```bash
# 1. Fork 并克隆仓库
git clone git@github.com:<你的用户名>/FadeMemo.git
cd FadeMemo

# 2. 添加上游仓库
git remote add upstream git@github.com:Stone-People-Like/FadeMemo.git

# 3. 安装依赖
flutter pub get

# 4. 运行项目
flutter run
```

---

## 分支模型

```
main（线上稳定版）
  ↑
  │ 合并
  │
develop（开发主干）
  ↑
  │ 合并
  │
feature/* / bugfix/* / refactor/*（功能分支）
```

| 分支 | 用途 | 保护级别 |
|------|------|----------|
| `main` | 线上稳定版，仅从 `release` / `hotfix` 合并 | 最高保护 |
| `develop` | 开发主干，日常功能分支的目标 | 强保护 |
| `feature/<功能名>` | 新功能开发 | 开放权限 |
| `bugfix/<问题描述>` | Bug 修复 | 开放权限 |
| `refactor/<模块名>` | 代码重构 | 开放权限 |
| `release/vX.Y.Z` | 版本发布 | 受限权限 |
| `hotfix/<问题描述>` | 线上紧急修复 | 受限权限 |

---

## 开发流程

### 日常功能开发

```
1. 从最新 develop 拉取功能分支
   git checkout develop && git pull upstream develop
   git checkout -b feature/<功能名>

2. 本地开发、自测，频繁提交到远程个人分支
   git add . && git commit -m "feat(module): 描述"
   git push -u origin feature/<功能名>

3. 定时拉取 develop 最新代码，提前解决冲突
   git fetch upstream develop && git merge upstream/develop

4. 开发完成 → 提交 PR，目标分支选择 develop

5. 评审通过 + 检测通过 → 合并到 develop

6. 合并完成后删除本地 + 远程废弃分支
   git branch -d feature/<功能名>
   git push origin --delete feature/<功能名>
```

### Bug 修复

```
1. 从 develop 拉取 bugfix 分支
   git checkout develop && git pull upstream develop
   git checkout -b bugfix/<问题描述>

2. 修复、自测 → 提 PR 合入 develop

3. 合并后清理分支
```

### 线上紧急修复（热修复）

```
1. 从 main 拉取 hotfix 分支
   git checkout main && git pull upstream main
   git checkout -b hotfix/<问题描述>

2. 修复、测试

3. 提 PR 先合并到 main（上线）

4. 再合并到 develop（同步修复）

5. 清理 hotfix 分支
```

### 版本发布

```
1. 从 develop 拉出 release 分支
   git checkout develop && git pull upstream develop
   git checkout -b release/vX.Y.Z

2. 全员回归测试，仅在 release 分支修复 Bug

3. 测试通过 → 合并 release 到 main 和 develop

4. 删除 release 分支
```

---

## Commit 规范

### 格式

```
<类型>(<模块>): <描述内容> 【<邮箱号前四位>】
```

### 类型

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `refactor` | 代码重构（不改变行为） |
| `docs` | 文档更新 |
| `test` | 测试相关 |
| `style` | 代码格式调整 |
| `chore` | 构建/工具/依赖变动 |

### 示例

```
feat(canvas): 新增错乱态 RGB 偏移动效 【1924】
fix(editor): 修复自动保存防抖失效问题 【1924】
docs(readme): 更新快速开始指南 【1924】
refactor(core): 重构遗忘引擎计算逻辑 【1924】
test(forgetting): 补充边界值测试用例 【1924】
```

---

## PR 规范

### 提交要求

- 标题使用 Conventional Commits 格式
- 目标分支选择正确（功能 → `develop`，修复 → `develop`/`main`）
- 已从目标分支拉取最新代码并解决冲突
- 自测通过，不影响已有功能
- Commit 历史整洁，避免无意义的提交

### 评审要求

| 目标分支 | 最低评审人数 |
|----------|-------------|
| `main` | 1~2 人 |
| `develop` | 至少 1 人 |

### 自动化检测

仓库已配置分支保护规则，PR 合并需要满足：
- 至少 1 人评审通过
- CI 检测通过（如已配置）
- 所有对话（评论）已解决

---

## 任务与分支绑定

1. 一个需求 / Bug 对应**唯一一条分支**，不多人共用一条长期分支
2. 一人可拥有多个分支，但一个分支只归属**一名主要负责人**

---

## 冲突处理

1. 代码冲突由**当前分支开发者**优先解决
2. 跨人 / 跨模块冲突，双方沟通后再修改，禁止私自覆盖他人代码
3. 公共组件、工具类修改，必须通知所有相关人员并加强评审

---

## 日常同步

- **每天开发前**：拉取 `develop` 最新代码，保持本地同步
- 不允许本地堆积大量代码，长时间不同步主干

---

## 分支清理

- 功能 / Bug 合并完成后 **24 小时内** 删除远程废弃分支
- 每周固定一次分支盘点，清理长期未使用的僵尸分支

---

## 禁止事项

- 禁止向 `main` / `develop` 直接 push（必须走 PR）
- 禁止强制推送（force push）到受保护分支
- 禁止长期多个分支互相嵌套合并
- 禁止跨人私自覆盖代码
- 禁止在 Commit 中包含敏感信息（密钥、Token 等）

---

## 问题反馈

如有疑问，请通过 [GitHub Issues](https://github.com/Stone-People-Like/FadeMemo/issues) 提交。
