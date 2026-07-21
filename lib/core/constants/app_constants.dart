/// 全局常量定义
/// 包括遗忘算法的阈值、默认值、布局断点等
class AppConstants {
  AppConstants._();

  // ================== 应用信息 ==================
  static const String appName = 'FadeMemo';
  static const String appSubtitle = '记忆遗忘模拟器';

  // ================== 遗忘算法阈值 ==================
  /// 强度 ≥ 此值：清晰态
  static const double clearThreshold = 0.7;

  /// 强度 ≥ 此值：模糊态（< clearThreshold）
  static const double blurThreshold = 0.4;

  /// 强度 ≥ 此值：错乱态（< blurThreshold）
  static const double garbleThreshold = 0.1;

  /// 强度 < 此值：消失态

  // ================== 遗忘参数默认值 ==================
  /// 默认重要性（每条笔记的所有字符共用，可在编辑时调整）
  static const double defaultImportance = 0.85;

  /// 默认全局遗忘系数 λ
  /// 单位: 秒^-1（数值越小保留越久）
  static const double defaultLambda = 0.00008;

  /// λ 滑块的最小值
  static const double minLambda = 0.00001;

  /// λ 滑块的最大值
  static const double maxLambda = 0.001;

  /// 回忆提升的强度增量（点击/hover 单个字符时）
  static const double recallBoost = 0.15;

  /// 「加速失忆」按钮：所有字符强度乘以的系数
  static const double accelerateFactor = 0.5;

  // ================== 布局断点 ==================
  /// 手机宽度断点（小于此值视为手机）
  static const double mobileBreakpoint = 600;

  /// 平板宽度断点
  static const double tabletBreakpoint = 900;

  /// 桌面宽度断点
  static const double desktopBreakpoint = 1200;

  // ================== Hive Box 名称 ==================
  static const String memosBox = 'memos';
  static const String settingsBox = 'settings';

  // ================== 动画参数 ==================
  /// 字符呼吸动画周期（毫秒）
  static const int breathingDurationMs = 2400;

  /// 字符状态切换过渡时长（毫秒）
  static const int stateTransitionMs = 600;

  /// 模糊态抖动频率
  static const double blurJitterFreq = 4.0;

  /// 错乱态 RGB 偏移像素
  static const double garbleRgbOffset = 2.5;

  /// 自动刷新时间线（毫秒）
  static const int timelineTickMs = 100;
}

/// 响应式断点工具
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