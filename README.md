<div align="center">

<img src="./assets/logo.svg" width="120" height="120" alt="FadeMemo Logo"/>

# FadeMemo

### 记忆遗忘模拟器 · Memory Forgetting Simulator

<sub>基于艾宾浩斯曲线 · 让文字随时间逐渐模糊、错乱、最终消失</sub>

[English](./README_EN.md) · 简体中文 · [更新日志](./CHANGELOG.md) · [报告 Bug](../../issues) · [提交功能](../../issues)

<br>

[![Version](https://img.shields.io/badge/Version-1.0.0-6366F1?style=for-the-badge)](./CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)
[![Flutter](https://img.shields.io/badge/Flutter-3.2+-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev)
[![Platforms](https://img.shields.io/badge/Platforms-5-blue?style=for-the-badge)](#-平台支持)
[![Hive](https://img.shields.io/badge/Hive-2.2-FFC107?style=for-the-badge)](https://pub.dev/packages/hive)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge)](../../pulls)
[![Stars](https://img.shields.io/github/stars/Stone-People-Like/FadeMemo?style=for-the-badge&logo=github)](../../stargazers)

</div>

<br>

## 概念

FadeMemo 是一款**反传统**的笔记 App：不主打「永久存储」，而是模拟人类记忆的自然遗忘规律。

> 你写下的每一个字，都会被时间一点点侵蚀。
> 它会先变得模糊，再开始错乱，最终彻底消失。
> 但只要你**点击 / hover** 它一下，又可以短暂地擦亮。

这是一款**氛围型**的工具，献给愿意和记忆和解的人。

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
      <td><b>跨 5 平台</b></td>
      <td>Flutter 一套代码，运行于 Web、Android、iOS、macOS、Linux</td>
    </tr>
    <tr>
      <td align="center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
      </td>
      <td><b>单字符颗粒度</b></td>
      <td>不再以段落为单位，每个字符独立携带强度 / 重要性 / 时间戳</td>
    </tr>
    <tr>
      <td align="center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </td>
      <td><b>艾宾浩斯曲线</b></td>
      <td>指数衰减公式 <code>strength = importance × exp(-λ·t<sup>β</sup>)</code>，β 与重要性负相关</td>
    </tr>
    <tr>
      <td align="center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </td>
      <td><b>四态视觉退化</b></td>
      <td>清晰 / 模糊（高斯+抖动）/ 错乱（字符替换+RGB偏移）/ 消失（透明占位）</td>
    </tr>
    <tr>
      <td align="center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </td>
      <td><b>触摸 / Hover 擦亮</b></td>
      <td>手机点击单字擦亮，桌面鼠标 hover 连续擦亮（60ms 节流）</td>
    </tr>
    <tr>
      <td align="center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
      </td>
      <td><b>三动作控制</b></td>
      <td>回忆擦亮 / 加速失忆（强度 ×0.5）/ 重置记忆</td>
    </tr>
    <tr>
      <td align="center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
      </td>
      <td><b>速度可调</b></td>
      <td>全局 λ 滑块对数刻度，从「保持数天」到「数秒即逝」自由切换</td>
    </tr>
    <tr>
      <td align="center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </td>
      <td><b>浅 / 深主题</b></td>
      <td>奶白 + 墨青双主题，Noto Serif SC 衬线字体，低饱和文艺调</td>
    </tr>
  </tbody>
</table>

---

## 技术栈

<div align="center">

| | 类别 | 技术 |
| :---: | :--- | :--- |
| <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> | **框架** | ![Flutter](https://img.shields.io/badge/Flutter-3.44.7-02569B?style=flat-square&logo=flutter&logoColor=white) |
| <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/></svg> | **本地存储** | ![Hive](https://img.shields.io/badge/Hive-2.2-FFC107?style=flat-square) |
| <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> | **配置存储** | ![SharedPreferences](https://img.shields.io/badge/SharedPreferences-2.3-4A86E5?style=flat-square) |
| <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> | **状态管理** | ![Provider](https://img.shields.io/badge/Provider-6.1-FF6F00?style=flat-square) |
| <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg> | **字体** | ![Noto Serif SC](https://img.shields.io/badge/Noto_Serif_SC-6.3-000000?style=flat-square) |

</div>

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

- [概念](#概念)
- [核心特性](#核心特性)
- [技术栈](#技术栈)
- [平台支持](#平台支持)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [算法说明](#算法说明)
- [版本历史](./CHANGELOG.md)
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

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/Stone-People-Like/FadeMemo.git

# 进入项目
cd FadeMemo

# 安装依赖
flutter pub get

# 启动应用
flutter run
```

> 💡 运行 `flutter doctor` 检查环境是否完整。

### 打包发布

```bash
flutter build web              # → build/web/
flutter build apk              # → Android APK
flutter build appbundle        # → Android AAB（Google Play）
flutter build ios              # → iOS（需 macOS）
flutter build macos            # → macOS DMG（需 Xcode）
flutter build linux            # → Linux
```

---

## 项目结构

```
FadeMemo/
├── lib/
│   ├── main.dart                       # 入口：Hive 初始化 + Provider 装配
│   ├── app/                            # MaterialApp / 路由
│   ├── core/
│   │   ├── constants/                  # 算法阈值 / 默认值 / 断点
│   │   ├── forgetting/                 # 遗忘引擎 + 状态枚举
│   │   ├── theme/                      # 双主题（奶白 / 墨青）
│   │   └── utils/                      # 响应式 + 错乱字库
│   ├── data/
│   │   ├── models/                     # CharState / Memo / AppSettings
│   │   └── repositories/               # Hive 仓库
│   └── features/
│       ├── home/                       # 主屏（三段式布局）
│       ├── editor/                     # 顶部输入（自动保存）
│       ├── canvas/                     # 中部展示（核心特效）
│       ├── controls/                   # 底部控制面板
│       └── library/                    # 记忆库侧栏
├── assets/                             # logo.svg
├── test/                               # 10 个单元测试
└── platform configs                    # web/android/ios/macos/linux
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

## 版本历史

完整更新日志见 [CHANGELOG.md](./CHANGELOG.md)。

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

<div align="center">

<b>Made with Flutter · 献给愿意和记忆和解的人</b>

</div>