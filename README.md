# FadeMemo

### 记忆遗忘模拟器 · Memory Forgetting Simulator

基于艾宾浩斯曲线，让文字随时间逐渐模糊、错乱、最终消失。

[English](./README_EN.md) · 简体中文 · [更新日志](./CHANGELOG.md) · [报告 Bug](../../issues) · [提交功能](../../issues)

| 项目 | 信息 |
| :--- | :--- |
| 当前版本 | `0.0.1-alpha.2` |
| 开源协议 | MIT |
| 框架 | Flutter `>= 3.2.0` |
| 本地存储 | Hive 2.2 |
| 支持平台 | Web / Android / iOS / macOS / Linux |
| 贡献方式 | PRs Welcome |

## 项目简介

FadeMemo 是一款**反传统**的笔记 App：不主打「永久存储」，而是模拟人类记忆的自然遗忘规律。

它基于艾宾浩斯遗忘曲线模拟文字记忆强度，让笔记内容随时间逐渐模糊、错乱并消失，帮助用户用更沉浸的方式记录、回望和处理记忆。

> 你写下的每一个字，都会被时间一点点侵蚀。
> 它会先变得模糊，再开始错乱，最终彻底消失。
> 但只要你**点击 / hover** 它一下，又可以短暂地擦亮。

这是一款**氛围型**的工具，献给愿意和记忆和解的人。

---

## 功能特性

| 特性 | 描述 |
| :--- | :--- |
| **跨 5 平台** | Flutter 一套代码，运行于 Web、Android、iOS、macOS、Linux |
| **单字符颗粒度** | 不再以段落为单位，每个字符独立携带强度 / 重要性 / 时间戳 |
| **艾宾浩斯曲线** | 指数衰减公式 `strength = importance × exp(-λ·t^β)`，β 与重要性负相关 |
| **四态视觉退化** | 清晰 / 模糊（高斯+抖动）/ 错乱（字符替换+RGB 偏移）/ 消失（透明占位） |
| **触摸 / Hover 擦亮** | 手机点击单字擦亮，桌面鼠标 hover 连续擦亮（60ms 节流） |
| **三动作控制** | 回忆擦亮 / 加速失忆（强度 ×0.5）/ 重置记忆 |
| **速度可调** | 全局 λ 滑块对数刻度，从「保持数天」到「数秒即逝」自由切换 |
| **浅 / 深主题** | 奶白 + 墨青双主题，Noto Serif SC 衬线字体，低饱和文艺调 |

---

## 技术栈

| 类别 | 技术 |
| :--- | :--- |
| **框架** | Flutter 3.44.7 |
| **语言** | Dart 3.12.2 |
| **本地存储** | Hive 2.2 |
| **配置存储** | SharedPreferences 2.3 |
| **状态管理** | Provider 6.1 |
| **字体** | Noto Serif SC |

---

## 平台支持

| 平台 | 状态 | 备注 |
| :--- | :---: | :--- |
| **Web** | ✅ 可打包 | Chrome / Safari / Edge / Firefox |
| **Android** | ✅ 已配置 | 需 Android SDK 构建 APK / AAB |
| **iOS** | ✅ 已配置 | 需 macOS + Xcode 构建 IPA |
| **macOS** | ✅ 已配置 | 需 Xcode 构建 DMG |
| **Linux** | ✅ 已配置 | snap / deb / AppImage |

> 所有平台共用一套 Flutter 代码，UI 与交互完全一致。

---

## 目录

- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [平台支持](#平台支持)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [使用说明](#使用说明)
- [编译 / 打包 / 部署](#编译--打包--部署)
- [项目结构](#项目结构)
- [算法说明](#算法说明)
- [测试](#测试)
- [版本说明](#版本说明)
- [常见问题 FAQ](#常见问题-faq)
- [参与贡献](#参与贡献)
- [开源协议](#开源协议)

---

## 快速开始

### 环境要求

| 工具 | 版本要求 |
| :--- | :--- |
| **Flutter SDK** | `>= 3.2.0`（推荐 3.44+） |
| **Dart SDK** | `>= 3.2.0`（随 Flutter 安装） |
| **IDE** | VS Code / Android Studio / IntelliJ |
| **Android 构建** | Android Studio + Android SDK |
| **iOS / macOS 构建** | macOS + Xcode |

### 拉取代码

```bash
git clone https://github.com/Stone-People-Like/FadeMemo.git
cd FadeMemo
```

### 安装依赖

```bash
flutter pub get
```

项目当前没有必填的外部配置文件或初始化脚本。完成依赖安装后，即可直接本地运行。

### 本地运行

```bash
flutter run
```

> 💡 运行 `flutter doctor` 检查环境是否完整。

### Web 调试

```bash
flutter run -d chrome
```

启动后 Flutter 会在终端输出本地访问地址，通常形如：

```text
http://localhost:xxxxx/
```

### 停止运行

在终端按下：

```bash
Ctrl + C
```

### 常用调试命令

```bash
flutter doctor
flutter analyze
flutter test
```

---

## 配置说明

项目主要配置文件如下：

- `pubspec.yaml`：Flutter 依赖、资源文件、版本号配置
- `analysis_options.yaml`：Dart / Flutter 静态检查规则
- `build.yaml`：构建相关配置
- `assets/`：应用静态资源目录

目前项目暂无必须配置的环境变量。

### 多环境说明

当前版本以本地应用为主，没有区分开发 / 测试 / 生产环境的后端配置。不同平台的构建差异主要由 Flutter 平台目录和对应 SDK 决定。

---

## 使用说明

FadeMemo 是一个本地运行的 Flutter 应用，目前没有后端接口。

基本使用流程：

1. 新建或选择一条记忆
2. 输入文字内容
3. 文字会随时间逐渐模糊、错乱并消失
4. 点击或 Hover 单个文字可以短暂擦亮
5. 通过控制面板调整遗忘速度、重置记忆或加速失忆

### 官网路由

`website/` 是产品官网，基于 Vite + React 构建，当前使用 HashRouter：

| 路由 | 页面 | 说明 |
| :--- | :--- | :--- |
| `/` | `HomePage` | 产品介绍首页 |
| `/download/:platform` | `DownloadPage` | 指定平台下载页 |

### 官网组件

官网主要组件位于 `website/src/components/`：

- `Navbar`：顶部导航
- `Hero`：首页首屏
- `Features`：功能展示
- `Platforms`：平台支持
- `Preview`：产品预览
- `DownloadPage`：下载页

### 后端接口

当前项目暂无后端服务，也没有需要调用的 HTTP API。

---

## 编译 / 打包 / 部署

### Flutter 应用

```bash
flutter build web              # → build/web/
flutter build apk              # → Android APK
flutter build appbundle        # → Android AAB（Google Play）
flutter build ios              # → iOS（需 macOS）
flutter build macos            # → macOS DMG（需 Xcode）
flutter build linux            # → Linux
```

### 产品官网

```bash
cd website
npm install
npm run dev       # 本地开发，默认由 Vite 输出访问地址
npm run build     # 生产构建，产物位于 website/dist/
npm run preview   # 本地预览生产构建
```

### 部署说明

- Flutter Web 产物位于 `build/web/`，可部署到任意静态网站服务。
- 官网产物位于 `website/dist/`，可部署到 Vercel、Netlify、GitHub Pages 或其他静态托管服务。
- Android / iOS / macOS / Linux / Windows 需要在对应平台 SDK 环境中构建。

---

## 项目结构

```text
FadeMemo/
├── lib/
│   ├── main.dart                       # 入口：Hive 初始化 + Provider 装配
│   ├── app/                            # MaterialApp / 平台路由
│   ├── core/
│   │   ├── constants/                  # 算法阈值 / 默认值 / 断点
│   │   ├── forgetting/                 # 遗忘引擎 + 状态枚举
│   │   ├── theme/                      # 双主题（奶白 / 墨青）
│   │   └── utils/                      # 响应式 + 错乱字库
│   ├── data/
│   │   ├── models/                     # CharState / Memo / AppSettings
│   │   └── repositories/               # Hive 仓库
│   └── features/
│       ├── mobile/                     # 移动端界面：编辑器 / 画布 / 控制面板 / 记忆库
│       └── desktop/                    # 桌面端界面：菜单栏 / 侧栏 / 工具栏 / 状态栏
├── assets/                             # logo.svg
├── test/                               # 10 个单元测试
│   ├── core/                           # 遗忘算法测试
│   └── data/                           # 数据模型测试
├── website/                            # 产品官网（Vite + React）
├── android/ ios/ web/                  # 移动端与 Web 平台配置
├── macos/ linux/ windows/              # 桌面端平台配置
├── pubspec.yaml                        # Flutter 依赖与资源配置
└── README.md                           # 项目说明文档
```

---

## 算法说明

### 遗忘公式（艾宾浩斯指数衰减）

```
strength(t) = importance × exp(-λ × t^β)
```

其中：

| 符号 | 含义 | 取值 |
| :--- | :--- | :--- |
| `t` | 字符创建后经过的秒数 | `>= 0` |
| `λ` | 全局遗忘系数（用户可调） | `1e-5 ~ 1e-3` |
| `β` | 衰减曲率（与 importance 反相关） | `0.5 ~ 2.0` |
| `importance` | 字符重要性 | `0 ~ 1` |

β 由 importance 派生：`β = 0.5 + (1 - importance) × 1.5`
- importance = 1.0 → β = 0.5（最稳）
- importance = 0.0 → β = 2.0（最快）

### 四态划分

| 状态 | strength | 视觉表现 |
| :--- | :---: | :--- |
| **clear 清晰** | `≥ 0.7` | 正常透明度 + 2.4s 呼吸 |
| **blurry 模糊** | `0.4 ~ 0.7` | 高斯模糊 + 4Hz 抖动 |
| **garbled 错乱** | `0.1 ~ 0.4` | 字符替换 + RGB 偏移 |
| **disappeared 消失** | `< 0.1` | 透明占位 |

---

## 测试

### Flutter 应用

运行单元测试：

```bash
flutter test
```

运行代码检查：

```bash
flutter analyze
```

测试文件位于：

```text
test/
├── core/
└── data/
```

### 产品官网

```bash
cd website
npm run lint
npm run check
```

### 测试规范

- 算法相关逻辑优先补充到 `test/core/`
- 数据模型相关逻辑优先补充到 `test/data/`
- 修改 UI 或平台适配时，建议至少运行 `flutter analyze`
- 修改官网时，建议运行 `npm run lint` 和 `npm run check`

---

## 版本说明

项目使用语义化版本号，例如：

```text
0.0.1-alpha.2
```

其中：

- `0.0.1`：版本号
- `alpha`：预览版本
- `alpha.2`：第二个 alpha 版本

完整更新日志见 [CHANGELOG.md](./CHANGELOG.md)。

---

## 常见问题 FAQ

### flutter 命令找不到怎么办？

请确认已经安装 Flutter，并且 Flutter SDK 的 `bin` 目录已经加入系统 PATH。

可以运行：

```bash
flutter doctor
```

检查环境是否正常。

### flutter pub get 失败怎么办？

请先检查网络环境和 Flutter SDK 版本，然后重新执行：

```bash
flutter pub get
```

### Android 无法构建怎么办？

请确认已经安装 Android Studio 和 Android SDK，并执行：

```bash
flutter doctor --android-licenses
```

### iOS / macOS 无法构建怎么办？

iOS 和 macOS 构建需要 macOS 系统和 Xcode。

---

## 参与贡献

我们欢迎所有形式的贡献：

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复

### 提交流程

1. **Fork** 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交修改：`git commit -m 'feat: 添加某个超棒的功能'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 发起 **Pull Request**

> 推荐遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范。

---

## 开源协议

本项目基于 **MIT License** 开源 — 查看 [LICENSE](./LICENSE) 文件了解更多。

---

## 致谢

- [Flutter](https://flutter.dev) — 强大的跨平台 UI 框架
- [Hive](https://pub.dev/packages/hive) — 极速本地数据库
- [Ebbinghaus](https://en.wikipedia.org/wiki/Forgetting_curve) — 遗忘曲线理论

---

**Made with Flutter · 献给愿意和记忆和解的人**
