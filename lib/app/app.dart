import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../core/theme/app_theme.dart';
import '../data/models/app_settings.dart';
import '../features/desktop/desktop_home_screen.dart';
import '../features/home/home_screen.dart';

/// App 根 Widget
///
/// 根据平台自动选择布局：
///   - 桌面端（Windows / macOS / Linux）→ DesktopHomeScreen
///   - 移动端（Android / iOS / Web）→ HomeScreen
class FadeMemoApp extends StatelessWidget {
  const FadeMemoApp({super.key});

  bool get _isDesktop {
    if (kIsWeb) return false;
    return Platform.isWindows || Platform.isMacOS || Platform.isLinux;
  }

  @override
  Widget build(BuildContext context) {
    final settingsModel = context.watch<AppSettingsModel>();
    final mode = settingsModel.settings.themeMode;

    return MaterialApp(
      title: 'FadeMemo · 记忆遗忘模拟器',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: mode,
      home: _isDesktop ? const DesktopHomeScreen() : const HomeScreen(),
    );
  }
}