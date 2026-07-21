import 'package:flutter/material.dart';

import '../../../core/forgetting/forgetting_engine.dart';
import '../../../core/forgetting/memory_state.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/models/memo_model.dart';

/// 桌面端底部状态栏
///
/// 实时显示：
///   - 当前 Memo 名称 / ID
///   - 已过去时间
///   - 平均强度
///   - 字符总数 + 各状态分布（clear/blurry/garbled/disappeared）
///   - λ 当前值
class DesktopStatusBar extends StatelessWidget {
  final Memo memo;
  final double lambda;

  const DesktopStatusBar({super.key, required this.memo, required this.lambda});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final inkSoft = AppTheme.inkSoftBy(isDark);

    final stats = _computeStats(memo, lambda);

    return Container(
      height: 28,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        border: Border(
          top: BorderSide(color: AppTheme.dividerBy(isDark), width: 0.6),
        ),
      ),
      child: Row(
        children: [
          // 字符总数
          _StatusItem(
            icon: Icons.notes_rounded,
            label: '${stats.totalChars} chars',
          ),
          _Divider(),
          // 各状态分布（用色块标识）
          _StatusDistribution(stats: stats),
          _Divider(),
          // 平均强度
          _StatusItem(
            icon: Icons.water_drop_outlined,
            label: '强度 ${(stats.avgStrength * 100).toStringAsFixed(0)}%',
          ),
          _Divider(),
          // λ
          _StatusItem(
            icon: Icons.timer_outlined,
            label: 'λ=${lambda.toStringAsExponential(1)}',
          ),
          const Spacer(),
          // 右侧：信息
          Text(
            'FadeMemo · 0.0.1-alpha.2',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: inkSoft.withValues(alpha: 0.5),
              fontSize: 11,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }

  _StatusStats _computeStats(Memo memo, double lambda) {
    final now = DateTime.now();
    int total = memo.chars.length;
    int clear = 0, blurry = 0, garbled = 0, disappeared = 0;
    double sum = 0;

    for (final c in memo.chars) {
      final s = ForgettingEngine.computeStrength(
        importance: c.importance,
        lambda: lambda,
        createdAt: c.createTime,
        now: now,
      );
      sum += s;
      final state = ForgettingEngine.resolveState(s);
      switch (state) {
        case MemoryState.clear:
          clear++;
          break;
        case MemoryState.blurry:
          blurry++;
          break;
        case MemoryState.garbled:
          garbled++;
          break;
        case MemoryState.disappeared:
          disappeared++;
          break;
      }
    }

    return _StatusStats(
      totalChars: total,
      clear: clear,
      blurry: blurry,
      garbled: garbled,
      disappeared: disappeared,
      avgStrength: total > 0 ? sum / total : 0.0,
    );
  }
}

class _StatusStats {
  final int totalChars;
  final int clear;
  final int blurry;
  final int garbled;
  final int disappeared;
  final double avgStrength;

  _StatusStats({
    required this.totalChars,
    required this.clear,
    required this.blurry,
    required this.garbled,
    required this.disappeared,
    required this.avgStrength,
  });
}

class _StatusItem extends StatelessWidget {
  final IconData icon;
  final String label;
  const _StatusItem({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final inkSoft = AppTheme.inkSoftBy(isDark);
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 12, color: inkSoft),
        const SizedBox(width: 4),
        Text(
          label,
          style: theme.textTheme.bodyMedium?.copyWith(
            color: inkSoft,
            fontSize: 11,
            fontFeatures: const [FontFeature.tabularFigures()],
          ),
        ),
      ],
    );
  }
}

class _Divider extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      width: 1,
      height: 12,
      margin: const EdgeInsets.symmetric(horizontal: 12),
      color: AppTheme.dividerBy(isDark),
    );
  }
}

class _StatusDistribution extends StatelessWidget {
  final _StatusStats stats;
  const _StatusDistribution({required this.stats});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        _Dot(color: const Color(0xFF6366F1), count: stats.clear, label: '清晰'),
        _Dot(color: const Color(0xFFB4A66B), count: stats.blurry, label: '模糊'),
        _Dot(color: const Color(0xFFE85D75), count: stats.garbled, label: '错乱'),
        _Dot(color: const Color(0xFF666666), count: stats.disappeared, label: '消失'),
      ],
    );
  }
}

class _Dot extends StatelessWidget {
  final Color color;
  final int count;
  final String label;
  const _Dot({required this.color, required this.count, required this.label});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final inkSoft = AppTheme.inkSoftBy(isDark);
    return Padding(
      padding: const EdgeInsets.only(right: 10),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 4),
          Text(
            '$count',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: inkSoft,
              fontSize: 11,
              fontFeatures: const [FontFeature.tabularFigures()],
            ),
          ),
        ],
      ),
    );
  }
}