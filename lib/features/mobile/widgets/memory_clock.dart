import 'package:flutter/material.dart';

import '../../../core/forgetting/forgetting_engine.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/models/memo.dart';

/// 「记忆时钟」— 显示当前 Memo 已存在的时间
///
/// 用来强化「遗忘正在发生」的氛围：
///   - 用旧版式字号
///   - 旁边显示平均强度
class MemoryClock extends StatelessWidget {
  final Memo memo;
  final double lambda;

  const MemoryClock({super.key, required this.memo, required this.lambda});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final inkSoft = AppTheme.inkSoftBy(isDark);

    final age = _ageOfOldestChar(memo);
    final avgStrength = _averageStrength(memo, lambda);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
      child: Row(
        children: [
          Icon(Icons.timer_outlined, size: 14, color: inkSoft.withValues(alpha: 0.7)),
          const SizedBox(width: 6),
          Text(
            age,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: inkSoft,
              fontFeatures: const [FontFeature.tabularFigures()],
              fontSize: 12,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(width: 14),
          Icon(Icons.water_drop_outlined, size: 12, color: inkSoft.withValues(alpha: 0.7)),
          const SizedBox(width: 4),
          Text(
            '强度 ${(avgStrength * 100).toStringAsFixed(0)}%',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: inkSoft,
              fontFeatures: const [FontFeature.tabularFigures()],
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  String _ageOfOldestChar(Memo memo) {
    if (memo.chars.isEmpty) return '00:00';
    final oldest = memo.chars
        .map((c) => c.createTime)
        .reduce((a, b) => a.isBefore(b) ? a : b);
    final delta = DateTime.now().difference(oldest);
    final h = delta.inHours.toString().padLeft(2, '0');
    final m = (delta.inMinutes % 60).toString().padLeft(2, '0');
    final s = (delta.inSeconds % 60).toString().padLeft(2, '0');
    if (delta.inDays > 0) {
      return '${delta.inDays}天 $h:$m:$s';
    }
    return '$h:$m:$s';
  }

  double _averageStrength(Memo memo, double lambda) {
    if (memo.chars.isEmpty) return 0;
    final now = DateTime.now();
    double sum = 0;
    for (final c in memo.chars) {
      sum += ForgettingEngine.computeStrength(
        importance: c.importance,
        lambda: lambda,
        createdAt: c.createTime,
        now: now,
      );
    }
    return sum / memo.chars.length;
  }
}