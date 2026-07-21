import 'package:flutter/widgets.dart';

import '../constants/app_constants.dart';

/// 响应式断点工具 — 跟 Responsive 工具类绑定使用
enum DeviceFormFactor {
  mobile,
  tablet,
  desktop,
}

extension DeviceFormFactorX on DeviceFormFactor {
  bool get isMobile => this == DeviceFormFactor.mobile;
  bool get isTablet => this == DeviceFormFactor.tablet;
  bool get isDesktop => this == DeviceFormFactor.desktop;
}

/// 响应式工具 — 把屏幕宽度映射为设备形态 / 数值常量
class Responsive {
  Responsive._();

  /// 根据屏幕宽度返回设备形态
  static DeviceFormFactor formFactorOf(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width < AppConstants.mobileBreakpoint) return DeviceFormFactor.mobile;
    if (width < AppConstants.tabletBreakpoint) return DeviceFormFactor.tablet;
    return DeviceFormFactor.desktop;
  }

  /// 是否手机
  static bool isMobile(BuildContext context) =>
      formFactorOf(context) == DeviceFormFactor.mobile;

  /// 是否横屏（宽度 > 高度）
  static bool isLandscape(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return size.width > size.height;
  }

  /// 编辑器字号：手机略小、桌面略大
  static double fontSize(BuildContext context, {double base = 18.0}) {
    final factor = formFactorOf(context);
    switch (factor) {
      case DeviceFormFactor.mobile:
        return base;
      case DeviceFormFactor.tablet:
        return base + 2;
      case DeviceFormFactor.desktop:
        return base + 4;
    }
  }

  /// 区块水平内边距
  static double horizontalPadding(BuildContext context) {
    final factor = formFactorOf(context);
    switch (factor) {
      case DeviceFormFactor.mobile:
        return 16;
      case DeviceFormFactor.tablet:
        return 28;
      case DeviceFormFactor.desktop:
        return 48;
    }
  }

  /// 编辑器最大内容宽度（用于居中展示）
  static double maxContentWidth(BuildContext context) {
    final factor = formFactorOf(context);
    switch (factor) {
      case DeviceFormFactor.mobile:
        return double.infinity;
      case DeviceFormFactor.tablet:
        return 720;
      case DeviceFormFactor.desktop:
        return 880;
    }
  }
}