import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// 桌面端快捷键定义 + Intent 类型
///
/// 在 DesktopHomeScreen 中通过 Shortcuts + Actions 装载。
class AppShortcuts {
  AppShortcuts._();

  /// 快捷键到 Intent 的映射表
  static final Map<ShortcutActivator, Intent> shortcuts = {
    // 操作
    const SingleActivator(LogicalKeyboardKey.keyN, control: true):
        const NewMemoIntent(),
    const SingleActivator(LogicalKeyboardKey.keyS, control: true):
        const SaveIntent(),
    const SingleActivator(LogicalKeyboardKey.keyR, control: true):
        const RecallIntent(),
    const SingleActivator(LogicalKeyboardKey.keyR,
            control: true, shift: true): const ResetIntent(),
    const SingleActivator(LogicalKeyboardKey.keyF, control: true):
        const ForgetIntent(),
    const SingleActivator(LogicalKeyboardKey.keyD, control: true):
        const DeleteIntent(),
    const SingleActivator(LogicalKeyboardKey.keyT, control: true):
        const ThemeIntent(),
    const SingleActivator(LogicalKeyboardKey.keyE, control: true):
        const AnimationIntent(),
  };
}

// ============== Intent 子类 ==============
class NewMemoIntent extends Intent {
  const NewMemoIntent();
}

class SaveIntent extends Intent {
  const SaveIntent();
}

class RecallIntent extends Intent {
  const RecallIntent();
}

class ForgetIntent extends Intent {
  const ForgetIntent();
}

class ResetIntent extends Intent {
  const ResetIntent();
}

class DeleteIntent extends Intent {
  const DeleteIntent();
}

class ThemeIntent extends Intent {
  const ThemeIntent();
}

class AnimationIntent extends Intent {
  const AnimationIntent();
}