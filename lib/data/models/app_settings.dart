import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/constants/app_constants.dart';

/// 全局应用设置（SharedPreferences 持久化）
///
/// 不放进 Hive box 是因为这些都是极简键值对，配置存储更适合 SharedPreferences。
class AppSettings {
  /// 当前主题模式
  ThemeMode themeMode;

  /// 全局遗忘系数 λ
  double lambda;

  /// 是否启用动画
  bool animationEnabled;

  /// 编辑器字号（用于中间展示区）
  double fontSize;

  AppSettings({
    this.themeMode = ThemeMode.system,
    double? lambda,
    this.animationEnabled = true,
    this.fontSize = 18.0,
  }) : lambda = lambda ?? AppConstants.defaultLambda;

  AppSettings copyWith({
    ThemeMode? themeMode,
    double? lambda,
    bool? animationEnabled,
    double? fontSize,
  }) {
    return AppSettings(
      themeMode: themeMode ?? this.themeMode,
      lambda: lambda ?? this.lambda,
      animationEnabled: animationEnabled ?? this.animationEnabled,
      fontSize: fontSize ?? this.fontSize,
    );
  }
}

/// SharedPreferences 仓库
class SettingsRepository {
  static const _kThemeMode = 'themeMode';
  static const _kLambda = 'lambda';
  static const _kAnimation = 'animationEnabled';
  static const _kFontSize = 'fontSize';

  late final SharedPreferences _prefs;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  AppSettings load() {
    final themeIndex = _prefs.getInt(_kThemeMode) ?? ThemeMode.system.index;
    return AppSettings(
      themeMode: ThemeMode.values[themeIndex.clamp(0, ThemeMode.values.length - 1)],
      lambda: _prefs.getDouble(_kLambda) ?? AppConstants.defaultLambda,
      animationEnabled: _prefs.getBool(_kAnimation) ?? true,
      fontSize: _prefs.getDouble(_kFontSize) ?? 18.0,
    );
  }

  Future<void> save(AppSettings s) async {
    await _prefs.setInt(_kThemeMode, s.themeMode.index);
    await _prefs.setDouble(_kLambda, s.lambda);
    await _prefs.setBool(_kAnimation, s.animationEnabled);
    await _prefs.setDouble(_kFontSize, s.fontSize);
  }
}

/// 全局设置 ViewModel（ChangeNotifier）
///
/// 由 Provider 在根 Widget 上注入，UI 通过 context.watch / context.read 访问。
class AppSettingsModel extends ChangeNotifier {
  AppSettings _settings;
  final SettingsRepository _repo;

  AppSettingsModel(this._repo) : _settings = _repo.load();

  AppSettings get settings => _settings;

  Future<void> update(AppSettings s) async {
    _settings = s;
    await _repo.save(s);
    notifyListeners();
  }
}