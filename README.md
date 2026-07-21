# FadeMemo

一个使用 Flutter 构建的跨平台备忘录应用。

## 功能特性

- 支持 Web、iOS、Android、Windows、macOS 和 Linux
- 使用 Hive 进行本地存储
- 美观且响应式的用户界面
- 支持浅色和深色主题
- 备忘录搜索与筛选
- 分类管理
- 支持 Markdown 语法

## 技术栈

- **框架**: Flutter
- **状态管理**: Flutter Bloc
- **数据库**: Hive
- **UI**: Material Design

## 快速开始

### 环境要求

- Flutter SDK (>= 3.2.0)
- Dart SDK (>= 3.2.0)

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/Stone-People-Like/FadeMemo.git

# 进入项目目录
cd FadeMemo

# 安装依赖
flutter pub get

# 生成 Hive 适配器
flutter pub run build_runner build

# 运行应用
flutter run
```

### 针对不同平台构建

```bash
# Web
flutter build web

# Android
flutter build apk

# iOS
flutter build ios

# Windows
flutter build windows

# macOS
flutter build macos

# Linux
flutter build linux
```

## 项目结构

```
FadeMemo/
├── lib/
│   ├── main.dart
│   ├── app/
│   │   ├── app.dart
│   │   └── routes.dart
│   ├── core/
│   │   ├── constants/
│   │   ├── errors/
│   │   ├── utils/
│   │   └── theme/
│   ├── features/
│   │   ├── memos/
│   │   ├── categories/
│   │   └── settings/
│   ├── data/
│   │   ├── models/
│   │   └── repositories/
│   └── widgets/
├── assets/
│   ├── icons/
│   ├── images/
│   └── fonts/
└── test/
```

## 开源协议

MIT License