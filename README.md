<div align="center">

# 📔 FadeMemo

### 一款简洁优雅的跨平台备忘录应用

基于 Flutter 构建，让灵感与思考在所有设备间无缝流转。

[English](./README_EN.md) · 简体中文 · [报告 Bug](../../issues) · [提交功能](../../issues)

<br>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Flutter](https://img.shields.io/badge/Flutter-3.2+-02569B?logo=flutter&logoColor=white)](https://flutter.dev)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20iOS%20%7C%20Android%20%7C%20Windows%20%7C%20macOS%20%7C%20Linux-blue)](#-平台支持)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](../../pulls)
[![Stars](https://img.shields.io/github/stars/Stone-People-Like/FadeMemo?style=social)](../../stargazers)

</div>

---

## ✨ 项目预览

> 🚧 预览图占位 — 建议在 `assets/images/` 添加应用截图后，将下方链接替换为实际图片。

<div align="center">

`📱 [在此插入应用主界面截图]`

`🌗 [在此插入浅色 / 深色主题对比图]`

</div>

---

## 🎯 核心特性

| 特性 | 描述 |
| :--- | :--- |
| 🌐 **真正跨平台** | 一套代码，同时运行于 Web、iOS、Android、Windows、macOS、Linux |
| 💾 **本地优先** | 使用 Hive 进行本地存储，无需联网即可记录所有内容 |
| 🎨 **精美 UI** | Material Design 风格，响应式布局，视觉与体验俱佳 |
| 🌗 **双主题切换** | 内置浅色与深色主题，随心切换，呵护双眼 |
| 🔍 **强大检索** | 支持关键词搜索与多维度筛选，快速找到任何一条记录 |
| 🗂️ **分类管理** | 自定义分类体系，让每条备忘录都有归属 |
| ✍️ **Markdown 支持** | 原生 Markdown 语法，记录排版一气呵成 |

---

## 🛠️ 技术栈

<div align="center">

| 类别 | 技术 | 说明 |
| :--- | :--- | :--- |
| 🚀 **框架** | ![Flutter](https://img.shields.io/badge/Flutter-02569B?logo=flutter&logoColor=white) | UI 框架 |
| 🧠 **状态管理** | ![Bloc](https://img.shields.io/badge/Flutter_Bloc-8.1-13B9FD?logo=flutter&logoColor=white) | 可预测、易测试 |
| 💿 **数据库** | ![Hive](https://img.shields.io/badge/Hive-2.2-FFC107) | 轻量、极速的本地 NoSQL |
| 🎭 **UI 设计** | ![Material Design](https://img.shields.io/badge/Material_Design-3-757575?logo=material-design&logoColor=white) | 设计语言 |
| 📝 **文本处理** | ![Markdown](https://img.shields.io/badge/Markdown-Supported-000000?logo=markdown&logoColor=white) | 富文本排版 |
| 🔤 **字体** | ![Inter](https://img.shields.io/badge/Inter-Font-000000) | 现代无衬线字体 |

</div>

---

## 📑 目录

- [✨ 项目预览](#-项目预览)
- [🎯 核心特性](#-核心特性)
- [🛠️ 技术栈](#-技术栈)
- [🚀 快速开始](#-快速开始)
- [📦 平台构建](#-平台构建)
- [🗂️ 项目结构](#️-项目结构)
- [🤝 参与贡献](#-参与贡献)
- [📄 开源协议](#-开源协议)
- [💖 致谢](#-致谢)

---

## 🚀 快速开始

### 📋 环境要求

开始之前，请确保你的开发环境中已安装：

| 工具 | 版本要求 |
| :--- | :--- |
| 🟦 **Flutter SDK** | `>= 3.2.0` |
| 🎯 **Dart SDK** | `>= 3.2.0` |
| 💻 **IDE** | VS Code / Android Studio / IntelliJ（任选其一） |

> 💡 **小提示**：可以通过运行 `flutter doctor` 检查你的开发环境是否完整。

### ⚙️ 安装步骤

按照以下命令依次执行：

```bash
# 1️⃣ 克隆仓库
git clone https://github.com/Stone-People-Like/FadeMemo.git

# 2️⃣ 进入项目目录
cd FadeMemo

# 3️⃣ 安装依赖
flutter pub get

# 4️⃣ 生成 Hive 类型适配器
dart run build_runner build

# 5️⃣ 启动应用 🚀
flutter run
```

✅ 一切顺利的话，应用就会在默认设备上启动啦！

---

## 📦 平台构建

FadeMemo 支持在所有主流平台上构建。选择你的目标平台，运行对应命令：

### 🌐 Web

```bash
flutter build web
# 输出目录：build/web/
```

### 📱 Android

```bash
flutter build apk          # 构建 APK
flutter build appbundle    # 构建 AAB（用于上架 Google Play）
```

### 🍎 iOS

```bash
flutter build ios          # 仅构建
flutter build ipa          # 构建可分发的 IPA
```

### 🪟 Windows

```bash
flutter build windows
# 输出目录：build/windows/runner/Release/
```

### 🍏 macOS

```bash
flutter build macos
# 输出目录：build/macos/Build/Products/Release/
```

### 🐧 Linux

```bash
flutter build linux
# 输出目录：build/linux/x64/release/bundle/
```

---

## 🗂️ 项目结构

```
FadeMemo/
│
├── 📂 lib/
│   ├── 📄 main.dart                  # 应用入口
│   ├── 📂 app/
│   │   ├── 📄 app.dart               # 根 Widget
│   │   └── 📄 routes.dart            # 路由配置
│   ├── 📂 core/                      # 核心基础设施
│   │   ├── 📂 constants/             # 全局常量
│   │   ├── 📂 errors/                # 错误定义
│   │   ├── 📂 utils/                 # 工具方法
│   │   └── 📂 theme/                 # 主题配置
│   ├── 📂 features/                  # 功能模块
│   │   ├── 📂 memos/                 # 备忘录
│   │   ├── 📂 categories/            # 分类
│   │   └── 📂 settings/              # 设置
│   ├── 📂 data/                      # 数据层
│   │   ├── 📂 models/                # 数据模型
│   │   └── 📂 repositories/          # 仓库
│   └── 📂 widgets/                   # 通用组件
│
├── 📂 assets/                        # 静态资源
│   ├── 📂 icons/
│   ├── 📂 images/
│   └── 📂 fonts/
│
├── 📂 test/                          # 测试
├── 📄 pubspec.yaml                   # 依赖与配置
└── 📄 README.md                      # 你正在阅读的文件 📖
```

---

## 🤝 参与贡献

我们欢迎所有形式的贡献！🎉

无论是：

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复

### 提交流程

1. **Fork** 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'feat: 添加某个超棒的功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 发起 **Pull Request**

> 📌 推荐遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范来书写提交信息。

---

## 📄 开源协议

本项目基于 **MIT License** 开源 — 查看 [LICENSE](./LICENSE) 文件了解更多细节。

```
MIT License

Copyright (c) 2024 Stone-People-Like

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 💖 致谢

- 💙 [Flutter](https://flutter.dev) — 强大的跨平台 UI 框架
- 🟡 [Hive](https://pub.dev/packages/hive) — 极速本地数据库
- 🟢 [Flutter Bloc](https://pub.dev/packages/flutter_bloc) — 优雅的状态管理
- 🌍 所有 [贡献者](../../contributors) 和 ⭐ Star 支持者

---

<div align="center">

### ⭐ 如果这个项目对你有帮助，欢迎点亮 Star！

**用 ❤️ 打造 · Made with Flutter**

</div>