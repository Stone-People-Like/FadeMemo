import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../../core/constants/app_constants.dart';
import '../../../core/theme/app_theme.dart';

/// 桌面端顶部工具栏
///
/// 紧凑布局：左侧 Title 字段，右侧控制按钮 + λ 滑块。
/// 区别于手机端：所有控件挤在一行内，不占垂直空间。
class DesktopToolbar extends StatelessWidget {
  final TextEditingController titleController;
  final FocusNode titleFocus;

  final double lambda;
  final ValueChanged<double> onLambdaChanged;

  final VoidCallback onRecall;
  final VoidCallback onForget;
  final VoidCallback onReset;

  final bool isDark;
  final ValueChanged<bool> onThemeToggle;
  final bool animationEnabled;
  final ValueChanged<bool> onAnimationToggle;

  const DesktopToolbar({
    super.key,
    required this.titleController,
    required this.titleFocus,
    required this.lambda,
    required this.onLambdaChanged,
    required this.onRecall,
    required this.onForget,
    required this.onReset,
    required this.isDark,
    required this.onThemeToggle,
    required this.animationEnabled,
    required this.onAnimationToggle,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final inkSoft = AppTheme.inkSoftBy(isDark);

    return Container(
      height: 56,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        border: Border(
          bottom: BorderSide(color: AppTheme.dividerBy(isDark), width: 0.6),
        ),
      ),
      child: Row(
        children: [
          // ============== 左侧标题 ==============
          Expanded(
            child: TextField(
              controller: titleController,
              focusNode: titleFocus,
              style: theme.textTheme.titleLarge?.copyWith(fontSize: 18),
              decoration: InputDecoration(
                hintText: '无题',
                hintStyle: TextStyle(
                  color: inkSoft.withValues(alpha: 0.5),
                  fontSize: 18,
                ),
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                filled: false,
                isCollapsed: true,
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ),
          // ============== 右侧控件 ==============
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              // λ 滑块（紧凑）
              _LambdaSlider(lambda: lambda, onChanged: onLambdaChanged),
              const SizedBox(width: 12),
              const VerticalDivider(width: 1),
              const SizedBox(width: 12),
              // 三动作
              _ToolbarAction(
                tooltip: '全员回忆 (Ctrl+R)',
                icon: Icons.auto_awesome_outlined,
                onPressed: onRecall,
                primary: true,
              ),
              _ToolbarAction(
                tooltip: '加速失忆 (Ctrl+F)',
                icon: Icons.hourglass_bottom_rounded,
                onPressed: onForget,
              ),
              _ToolbarAction(
                tooltip: '重置记忆 (Ctrl+Shift+R)',
                icon: Icons.restart_alt_rounded,
                onPressed: onReset,
              ),
              const SizedBox(width: 8),
              const VerticalDivider(width: 1),
              const SizedBox(width: 8),
              _ToolbarAction(
                tooltip: isDark ? '切换到浅色' : '切换到深色',
                icon: isDark
                    ? Icons.light_mode_outlined
                    : Icons.dark_mode_outlined,
                onPressed: () => onThemeToggle(!isDark),
              ),
              _ToolbarAction(
                tooltip: animationEnabled ? '关闭动效' : '开启动效',
                icon: animationEnabled
                    ? Icons.animation_rounded
                    : Icons.animation_outlined,
                onPressed: () => onAnimationToggle(!animationEnabled),
                active: animationEnabled,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _LambdaSlider extends StatelessWidget {
  final double lambda;
  final ValueChanged<double> onChanged;

  const _LambdaSlider({required this.lambda, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    // 对数刻度映射
    final minLog = math.log(AppConstants.minLambda);
    final maxLog = math.log(AppConstants.maxLambda);
    final vLog = math.log(lambda.clamp(AppConstants.minLambda, AppConstants.maxLambda));
    final sliderValue = ((vLog - minLog) / (maxLog - minLog)).clamp(0.0, 1.0);

    return SizedBox(
      width: 160,
      child: Row(
        children: [
          Text(
            'λ',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.primary,
              fontWeight: FontWeight.w500,
            ),
          ),
          Expanded(
            child: SliderTheme(
              data: SliderTheme.of(context).copyWith(
                trackHeight: 3,
                thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                overlayShape: const RoundSliderOverlayShape(overlayRadius: 14),
              ),
              child: Slider(
                value: sliderValue,
                onChanged: (v) {
                  final newLambda =
                      math.exp(minLog + (maxLog - minLog) * v);
                  onChanged(newLambda);
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ToolbarAction extends StatelessWidget {
  final String tooltip;
  final IconData icon;
  final VoidCallback onPressed;
  final bool primary;
  final bool active;

  const _ToolbarAction({
    required this.tooltip,
    required this.icon,
    required this.onPressed,
    this.primary = false,
    this.active = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    Color? bg;
    Color? fg;

    if (primary) {
      bg = theme.colorScheme.primary;
      fg = isDark ? const Color(0xFF14171C) : const Color(0xFFFBF8F3);
    } else if (active) {
      bg = theme.colorScheme.primary.withValues(alpha: 0.12);
      fg = theme.colorScheme.primary;
    } else {
      bg = Colors.transparent;
      fg = AppTheme.inkSoftBy(isDark);
    }

    return Tooltip(
      message: tooltip,
      child: Material(
        color: bg,
        borderRadius: BorderRadius.circular(6),
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(6),
          child: Container(
            width: 32,
            height: 32,
            alignment: Alignment.center,
            child: Icon(icon, size: 18, color: fg),
          ),
        ),
      ),
    );
  }
}