import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../core/theme/app_theme.dart';
import '../data/models/app_settings.dart';
import 'platform_router.dart';

/// App 根 Widget
///
/// 不再关心平台分流，统一通过 [PlatformRouter.home] 拿到主屏。
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
      home: PlatformRouter.home(),
    );
  }
}