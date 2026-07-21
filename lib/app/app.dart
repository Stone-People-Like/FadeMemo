import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../core/theme/app_theme.dart';
import '../data/models/app_settings.dart';
import '../features/home/home_screen.dart';

/// App 根 Widget
///
/// 监听 AppSettingsModel 中的主题模式，实时切换 light / dark。
class FadeMemoApp extends StatelessWidget {
  const FadeMemoApp({super.key});

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
      home: const HomeScreen(),
    );
  }
}