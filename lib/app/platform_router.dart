import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

import '../features/desktop/desktop_home_screen.dart';
import '../features/mobile/mobile_home_screen.dart';

/// 平台布局路由器 — 决定 App 启动时使用 mobile 还是 desktop 主屏。
///
/// 分流规则：
///   - Web / Android / iOS → [MobileHomeScreen]
///   - Windows / macOS / Linux → [DesktopHomeScreen]
///
/// 集中放在这里有两个好处：
///   1. [FadeMemoApp] 根 Widget 不再直接依赖 dart:io，逻辑可测；
///   2. 后续要加入 iPad 自适应 / Web 桌面版等只需要改本类。
class PlatformRouter {
  PlatformRouter._();

  /// 当前进程应使用的布局。
  static HomeLayout get layout {
    if (kIsWeb) return HomeLayout.mobile;
    if (Platform.isWindows || Platform.isMacOS || Platform.isLinux) {
      return HomeLayout.desktop;
    }
    return HomeLayout.mobile;
  }

  /// 根据 [layout] 选一个主屏 Widget。
  static Widget home() {
    switch (layout) {
      case HomeLayout.mobile:
        return const MobileHomeScreen();
      case HomeLayout.desktop:
        return const DesktopHomeScreen();
    }
  }
}

/// 平台布局选项
enum HomeLayout { mobile, desktop }