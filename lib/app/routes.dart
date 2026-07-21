import 'package:flutter/widgets.dart';

import '../features/home/home_screen.dart';

/// 路由表
/// 当前版本只有一个 Home 屏幕，预留路由命名空间方便后续扩展。
class Routes {
  Routes._();

  static const String home = '/';

  static Map<String, WidgetBuilder> get routes => {
        home: (_) => const HomeScreen(),
      };
}