<div align="center">

<img src="./assets/logo.svg" width="120" height="120" alt="FadeMemo Logo"/>

# FadeMemo

### 一款简洁优雅的跨平台备忘录应用

<sub>基于 Flutter 构建 · 让灵感与思考在所有设备间无缝流转</sub>

[English](./README_EN.md) · 简体中文 · [报告 Bug](../../issues) · [提交功能](../../issues)

<br>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)
[![Flutter](https://img.shields.io/badge/Flutter-3.2+-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev)
[![Platforms](https://img.shields.io/badge/Platforms-6-blue?style=for-the-badge)](#-平台构建)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge)](../../pulls)
[![Stars](https://img.shields.io/github/stars/Stone-People-Like/FadeMemo?style=for-the-badge&logo=github)](../../stargazers)

</div>

<br>

<div align="center">

<sub>预览图占位 — 建议在 <code>assets/images/</code> 添加应用截图后替换下方链接</sub>

<br>

<table>
  <tr>
    <td align="center"><b>主界面</b></td>
    <td align="center"><b>浅色 / 深色主题对比</b></td>
  </tr>
  <tr>
    <td><i>[ 插入应用主界面截图 ]</i></td>
    <td><i>[ 插入主题对比截图 ]</i></td>
  </tr>
</table>

</div>

---

## 核心特性

<table>
  <thead>
    <tr>
      <th width="40"></th>
      <th width="200">特性</th>
      <th>描述</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      </td>
      <td><b>真正跨平台</b></td>
      <td>一套代码，同时运行于 Web、iOS、Android、Windows、macOS、Linux</td>
    </tr>
    <tr>
      <td align="center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
      </td>
      <td><b>本地优先</b></td>
      <td>使用 Hive 进行本地存储，无需联网即可记录所有内容</td>
    </tr>
    <tr>
      <td align="center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z"/></svg>
      </td>
      <td><b>精美 UI</b></td>
      <td>Material Design 3 风格，响应式布局，视觉与体验俱佳</td>
    </tr>
    <tr>
      <td align="center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </td>
      <td><b>双主题切换</b></td>
      <td>内置浅色与深色主题，随心切换，呵护双眼</td>
    </tr>
    <tr>
      <td align="center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </td>
      <td><b>强大检索</b></td>
      <td>支持关键词搜索与多维度筛选，快速定位任何一条记录</td>
    </tr>
    <tr>
      <td align="center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
      </td>
      <td><b>分类管理</b></td>
      <td>自定义分类体系，让每条备忘录都有归属</td>
    </tr>
    <tr>
      <td align="center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="7 15 7 9 10 12 13 9 13 15"/><polyline points="17 9 17 15 15 13 19 11"/></svg>
      </td>
      <td><b>Markdown 支持</b></td>
      <td>原生 Markdown 语法，记录与排版一气呵成</td>
    </tr>
  </tbody>
</table>

---

## 技术栈

<div align="center">

| | 类别 | 技术 |
| :---: | :--- | :--- |
| <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> | **框架** | ![Flutter](https://img.shields.io/badge/Flutter-3.2+-02569B?style=flat-square&logo=flutter&logoColor=white) |
| <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> | **状态管理** | ![Bloc](https://img.shields.io/badge/Flutter_Bloc-8.1-13B9FD?style=flat-square&logo=flutter&logoColor=white) |
| <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/></svg> | **数据库** | ![Hive](https://img.shields.io/badge/Hive-2.2-FFC107?style=flat-square) |
| <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg> | **UI 设计** | ![Material](https://img.shields.io/badge/Material_Design-3-757575?style=flat-square&logo=material-design&logoColor=white) |
| <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg> | **字体** | ![Inter](https://img.shields.io/badge/Inter-Font-000000?style=flat-square) |

</div>

---

## 目录

- [核心特性](#核心特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [平台构建](#平台构建)
- [项目结构](#项目结构)
- [参与贡献](#参与贡献)
- [开源协议](#开源协议)
- [致谢](#致谢)

---

## 快速开始

### 环境要求

开始之前，请确保你的开发环境中已安装：

| 工具 | 版本要求 |
| :--- | :--- |
| **Flutter SDK** | `>= 3.2.0` |
| **Dart SDK** | `>= 3.2.0` |
| **IDE** | VS Code / Android Studio / IntelliJ（任选其一） |

> **小提示**：运行 `flutter doctor` 可以快速检查你的开发环境是否完整。

### 安装步骤

按照以下命令依次执行：

```bash
# 1. 克隆仓库
git clone https://github.com/Stone-People-Like/FadeMemo.git

# 2. 进入项目目录
cd FadeMemo

# 3. 安装依赖
flutter pub get

# 4. 生成 Hive 类型适配器
dart run build_runner build

# 5. 启动应用
flutter run
```

一切顺利的话，应用就会在默认设备上启动。

---

## 平台构建

FadeMemo 支持在所有主流平台上构建。选择你的目标平台，运行对应命令：

<table>
  <thead>
    <tr>
      <th width="120">平台</th>
      <th width="40"></th>
      <th>构建命令</th>
      <th>输出目录</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Web</b></td>
      <td align="center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      </td>
      <td><code>flutter build web</code></td>
      <td><code>build/web/</code></td>
    </tr>
    <tr>
      <td><b>Android</b></td>
      <td align="center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3DDC84" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
      </td>
      <td><code>flutter build apk</code></td>
      <td><code>build/app/outputs/flutter-apk/</code></td>
    </tr>
    <tr>
      <td><b>iOS</b></td>
      <td align="center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1.27a11 11 0 0 0-3.48 21.45c.55.1.75-.24.75-.53v-1.86c-3.07.66-3.72-1.48-3.72-1.48-.5-1.27-1.22-1.61-1.22-1.61-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.57 1.19 3.2.91.1-.71.38-1.19.7-1.47-2.45-.28-5.03-1.22-5.03-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.91 0 0 .92-.3 3.02 1.12a10.5 10.5 0 0 1 5.5 0c2.1-1.42 3.02-1.12 3.02-1.12.6 1.51.22 2.63.11 2.91.7.77 1.13 1.75 1.13 2.95 0 4.23-2.58 5.16-5.04 5.43.39.34.74 1 .74 2.02v3c0 .29.2.64.76.53A11 11 0 0 0 12 1.27"/></svg>
      </td>
      <td><code>flutter build ios</code></td>
      <td><code>build/ios/iphoneos/</code></td>
    </tr>
    <tr>
      <td><b>Windows</b></td>
      <td align="center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      </td>
      <td><code>flutter build windows</code></td>
      <td><code>build/windows/runner/Release/</code></td>
    </tr>
    <tr>
      <td><b>macOS</b></td>
      <td align="center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      </td>
      <td><code>flutter build macos</code></td>
      <td><code>build/macos/Build/Products/Release/</code></td>
    </tr>
    <tr>
      <td><b>Linux</b></td>
      <td align="center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
      </td>
      <td><code>flutter build linux</code></td>
      <td><code>build/linux/x64/release/bundle/</code></td>
    </tr>
  </tbody>
</table>

---

## 项目结构

```
FadeMemo/
├── lib/
│   ├── main.dart                  # 应用入口
│   ├── app/
│   │   ├── app.dart               # 根 Widget
│   │   └── routes.dart            # 路由配置
│   ├── core/                      # 核心基础设施
│   │   ├── constants/             # 全局常量
│   │   ├── errors/                # 错误定义
│   │   ├── utils/                 # 工具方法
│   │   └── theme/                 # 主题配置
│   ├── features/                  # 功能模块
│   │   ├── memos/                 # 备忘录
│   │   ├── categories/            # 分类
│   │   └── settings/              # 设置
│   ├── data/                      # 数据层
│   │   ├── models/                # 数据模型
│   │   └── repositories/          # 仓库
│   └── widgets/                   # 通用组件
├── assets/
│   ├── icons/
│   ├── images/
│   ├── fonts/
│   └── logo.svg                   # 项目 Logo
├── test/
├── pubspec.yaml
└── README.md
```

---

## 参与贡献

我们欢迎所有形式的贡献。

无论是：

- 报告 Bug
- 提出新功能建议
- 改进文档
- 提交代码修复

### 提交流程

1. **Fork** 本仓库
2. 创建你的特性分支：`git checkout -b feature/AmazingFeature`
3. 提交你的修改：`git commit -m 'feat: 添加某个超棒的功能'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 发起 **Pull Request**

> 推荐遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范来书写提交信息。

---

## 开源协议

本项目基于 **MIT License** 开源 — 查看 [LICENSE](./LICENSE) 文件了解更多细节。

```
MIT License

Copyright (c) 2024 Stone-People-Like

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 致谢

- [Flutter](https://flutter.dev) — 强大的跨平台 UI 框架
- [Hive](https://pub.dev/packages/hive) — 极速本地数据库
- [Flutter Bloc](https://pub.dev/packages/flutter_bloc) — 优雅的状态管理
- 所有 [贡献者](../../contributors) 和 Star 支持者

---

<div align="center">

<sub>如果这个项目对你有帮助，欢迎点亮 Star</sub>

<br>

<b>Made with Flutter</b>

</div>