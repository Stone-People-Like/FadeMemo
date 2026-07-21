import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../../../data/models/char_state.dart';
import '../../../data/models/memo.dart';
import 'char_cell.dart';

/// 核心遗忘展示区
///
/// 把 Memo.chars 渲染成多行文本（按 `\n` 断行）。
/// 点击字符触发「回忆擦亮」。
class FadingCanvas extends StatelessWidget {
  final Memo memo;
  final double lambda;
  final double fontSize;
  final bool animationEnabled;
  final void Function(int charIndex)? onCharTap;

  const FadingCanvas({
    super.key,
    required this.memo,
    required this.lambda,
    required this.fontSize,
    this.animationEnabled = true,
    this.onCharTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final ink = AppTheme.inkBy(isDark);
    final inkSoft = AppTheme.inkSoftBy(isDark);

    final lines = _splitToLines(memo.chars);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppTheme.dividerBy(isDark),
          width: 0.6,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (final line in lines) ...[
            _CharLine(
              line: line,
              chars: memo.chars,
              lambda: lambda,
              fontSize: fontSize,
              ink: ink,
              inkSoft: inkSoft,
              animationEnabled: animationEnabled,
              onCharTap: onCharTap,
            ),
            const SizedBox(height: 6),
          ],
          if (_isEmpty(memo.chars))
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 32),
              child: Center(
                child: Text(
                  '落笔，留下第一段记忆',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: inkSoft.withValues(alpha: 0.7),
                    letterSpacing: 2,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  bool _isEmpty(List<CharState> chars) {
    return chars.isEmpty || chars.every((c) => c.char.trim().isEmpty);
  }

  /// 把 chars 拆成行（按 \n 切分）；空行保留为空列表以便占位
  List<List<int>> _splitToLines(List<CharState> chars) {
    final lines = <List<int>>[];
    final current = <int>[];
    for (int i = 0; i < chars.length; i++) {
      final ch = chars[i].char;
      if (ch == '\n') {
        lines.add(List<int>.from(current));
        current.clear();
        lines.add(<int>[]); // 空行占位
      } else {
        current.add(i);
      }
    }
    if (current.isNotEmpty || lines.isEmpty) {
      lines.add(current);
    }
    return lines;
  }
}

class _CharLine extends StatelessWidget {
  final List<int> line;
  final List<CharState> chars;
  final double lambda;
  final double fontSize;
  final Color ink;
  final Color inkSoft;
  final bool animationEnabled;
  final void Function(int charIndex)? onCharTap;

  const _CharLine({
    required this.line,
    required this.chars,
    required this.lambda,
    required this.fontSize,
    required this.ink,
    required this.inkSoft,
    required this.animationEnabled,
    required this.onCharTap,
  });

  @override
  Widget build(BuildContext context) {
    if (line.isEmpty) {
      return SizedBox(height: fontSize * 1.6);
    }
    return Wrap(
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        for (final idx in line)
          GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: onCharTap == null ? null : () => onCharTap!(idx),
            child: CharCell(
              charState: chars[idx],
              lambda: lambda,
              fontSize: fontSize,
              ink: ink,
              inkSoft: inkSoft,
              animationEnabled: animationEnabled,
              onRecall: onCharTap == null ? null : () => onCharTap!(idx),
            ),
          ),
      ],
    );
  }
}