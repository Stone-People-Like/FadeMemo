import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../../core/constants/app_constants.dart';
import '../../../core/theme/app_theme.dart';

/// 底部控制面板
///
/// 包含：
///   - 全局遗忘速度 λ 滑块
///   - 回忆擦亮 / 加速失忆 / 重置记忆 三个动作按钮
///   - 明暗模式切换
class ControlPanel extends StatelessWidget {
  final double lambda;
  final ValueChanged<double> onLambdaChanged;
  final VoidCallback onRecallAll;
  final VoidCallback onAccelerate;
  final VoidCallback onReset;
  final bool isDark;
  final ValueChanged<bool> onThemeToggle;

  /// 动画开关（只对中部的字符动效生效）
  final bool animationEnabled;
  final ValueChanged<bool> onAnimationToggle;

  const ControlPanel({
    super.key,
    required this.lambda,
    required this.onLambdaChanged,
    required this.onRecallAll,
    required this.onAccelerate,
    required this.onReset,
    required this.isDark,
    required this.onThemeToggle,
    required this.animationEnabled,
    required this.onAnimationToggle,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final inkSoft = AppTheme.inkSoft(isDark ? Brightness.dark : Brightness.light);

    // 把 lambda 映射到 0~1 用于滑块（对数刻度）
    final sliderValue = _lambdaToSlider(lambda);

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: AppTheme.divider(isDark ? Brightness.dark : Brightness.light),
          width: 0.6,
        ),
      ),
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ============== 速度滑块 ==============
          Row(
            children: [
              Text(
                '遗忘速度',
                style: theme.textTheme.labelSmall?.copyWith(
                  letterSpacing: 2,
                  color: inkSoft,
                ),
              ),
              const Spacer(),
              Text(
                _describeLambda(lambda),
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.primary,
                ),
              ),
            ],
          ),
          Slider(
            value: sliderValue,
            onChanged: (v) => onLambdaChanged(_sliderToLambda(v)),
          ),
          Row(
            children: [
              Text('慢', style: theme.textTheme.bodyMedium),
              const Spacer(),
              Text('快', style: theme.textTheme.bodyMedium),
            ],
          ),
          const SizedBox(height: 12),
          const Divider(height: 24),
          // ============== 动作按钮 ==============
          Row(
            children: [
              Expanded(
                child: _ActionButton(
                  icon: Icons.auto_awesome_outlined,
                  label: '回忆',
                  onPressed: onRecallAll,
                  primary: true,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _ActionButton(
                  icon: Icons.hourglass_bottom_rounded,
                  label: '加速失忆',
                  onPressed: onAccelerate,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _ActionButton(
                  icon: Icons.restart_alt_rounded,
                  label: '重置',
                  onPressed: onReset,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          // ============== 主题 / 动画开关 ==============
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              IconButton(
                tooltip: isDark ? '切换到浅色' : '切换到深色',
                onPressed: () => onThemeToggle(!isDark),
                icon: Icon(
                  isDark
                      ? Icons.light_mode_outlined
                      : Icons.dark_mode_outlined,
                  color: inkSoft,
                ),
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    animationEnabled
                        ? Icons.animation_outlined
                        : Icons.animation_rounded,
                    size: 18,
                    color: inkSoft,
                  ),
                  const SizedBox(width: 6),
                  Text('动效', style: theme.textTheme.bodyMedium),
                  const SizedBox(width: 4),
                  Switch.adaptive(
                    value: animationEnabled,
                    onChanged: onAnimationToggle,
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _describeLambda(double lambda) {
    // 把 lambda 数值映射成「保留 N 小时」之类的可读文案
    // strength(t) = importance * exp(-lambda * t^beta)
    // 粗略估算：strength = 0.5 时 t ≈ ?
    final t = _halfLifeSeconds(lambda);
    if (t < 60) return '约 ${t.toStringAsFixed(0)} 秒';
    if (t < 3600) return '约 ${(t / 60).toStringAsFixed(0)} 分钟';
    if (t < 86400) return '约 ${(t / 3600).toStringAsFixed(1)} 小时';
    return '约 ${(t / 86400).toStringAsFixed(1)} 天';
  }

  double _halfLifeSeconds(double lambda) {
    // 默认 β ≈ 1 时，strength = 0.5 → exp(-λt) = 0.5 → t = ln2 / λ
    const beta = 1.0;
    return math.pow(math.log(2) / lambda, 1 / beta).toDouble();
  }

  // 对数刻度映射 lambda ∈ [minLambda, maxLambda] → slider [0, 1]
  static double _lambdaToSlider(double lambda) {
    final minLog = math.log(AppConstants.minLambda);
    final maxLog = math.log(AppConstants.maxLambda);
    final vLog = math.log(lambda.clamp(AppConstants.minLambda, AppConstants.maxLambda));
    return ((vLog - minLog) / (maxLog - minLog)).clamp(0.0, 1.0);
  }

  static double _sliderToLambda(double v) {
    final minLog = math.log(AppConstants.minLambda);
    final maxLog = math.log(AppConstants.maxLambda);
    return math.exp(minLog + (maxLog - minLog) * v.clamp(0.0, 1.0));
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onPressed;
  final bool primary;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.onPressed,
    this.primary = false,
  });

  @override
  Widget build(BuildContext context) {
    if (primary) {
      return ElevatedButton.icon(
        onPressed: onPressed,
        icon: Icon(icon, size: 18),
        label: Text(label),
      );
    }
    return OutlinedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, size: 18),
      label: Text(label),
    );
  }
}