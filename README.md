# FadeMemo

A cross-platform memo application built with Flutter.

## Features

- Web, iOS, Android, Windows, macOS, and Linux support
- Local storage using Hive
- Beautiful and responsive UI
- Light and dark themes
- Search and filter memos
- Category management
- Markdown support

## Tech Stack

- **Framework**: Flutter
- **State Management**: Flutter Bloc
- **Database**: Hive
- **UI**: Material Design

## Getting Started

### Prerequisites

- Flutter SDK (>= 3.2.0)
- Dart SDK (>= 3.2.0)

### Installation

```bash
# Clone the repository
git clone https://github.com/Stone-People-Like/FadeMemo.git

# Navigate to the project
cd FadeMemo

# Install dependencies
flutter pub get

# Generate Hive adapters
flutter pub run build_runner build

# Run the app
flutter run
```

### Build for Different Platforms

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

## Project Structure

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

## License

MIT License