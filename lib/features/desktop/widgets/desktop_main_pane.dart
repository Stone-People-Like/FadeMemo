import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/utils/responsive.dart';
import '../../../data/models/memo.dart';
import '../../mobile/canvas/fading_canvas.dart';

/// 桌面端中央主面板
///
/// 布局（自上而下）：
///   1. 大字号 Canvas（flex，绝大部分空间）
///   2. 编辑器（固定高度，多行文本）
class DesktopMainPane extends StatelessWidget {
  final Memo memo;
  final double lambda;
  final double fontSize;
  final bool animationEnabled;

  final TextEditingController contentController;
  final ValueChanged<String> onContentChange;
  final ValueChanged<String>? onContentSubmit;

  final void Function(int charIndex)? onCharTap;

  const DesktopMainPane({
    super.key,
    required this.memo,
    required this.lambda,
    required this.fontSize,
    required this.animationEnabled,
    required this.contentController,
    required this.onContentChange,
    this.onContentSubmit,
    required this.onCharTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    // 桌面端字号放大一档
    final desktopFontSize = fontSize + 6;

    return Container(
      color: theme.scaffoldBackgroundColor,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // ============== Canvas ==============
          Expanded(
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 880),
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(40, 28, 40, 16),
                  child: FadingCanvas(
                    memo: memo,
                    lambda: lambda,
                    fontSize: desktopFontSize,
                    animationEnabled: animationEnabled,
                    onCharTap: onCharTap,
                  ),
                ),
              ),
            ),
          ),

          // 分隔
          Divider(
            height: 1,
            thickness: 0.6,
            color: AppTheme.dividerBy(isDark),
          ),

          // ============== Editor ==============
          Container(
            color: theme.colorScheme.surface,
            padding: const EdgeInsets.fromLTRB(40, 14, 40, 18),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 880),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          'CONTENT',
                          style: theme.textTheme.labelSmall?.copyWith(
                            letterSpacing: 2.5,
                            color: AppTheme.inkSoftBy(isDark),
                            fontSize: 10,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '停止输入 1.5s 自动保存',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: AppTheme.inkSoftBy(isDark)
                                .withValues(alpha: 0.5),
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    _DesktopEditor(
                      controller: contentController,
                      onChange: onContentChange,
                      onSubmit: onContentSubmit,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// 桌面端编辑器
///
/// 与手机端 MemoEditor 区别：
///   - 单行高度更大
///   - 没有标题栏，纯内容编辑
///   - 有 monospace 风格的字数提示
class _DesktopEditor extends StatefulWidget {
  final TextEditingController controller;
  final ValueChanged<String> onChange;
  final ValueChanged<String>? onSubmit;
  const _DesktopEditor({
    required this.controller,
    required this.onChange,
    this.onSubmit,
  });

  @override
  State<_DesktopEditor> createState() => _DesktopEditorState();
}

class _DesktopEditorState extends State<_DesktopEditor> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return TextField(
      controller: widget.controller,
      maxLines: 3,
      minLines: 2,
      onChanged: widget.onChange,
      onSubmitted: widget.onSubmit != null
          ? (_) => widget.onSubmit!(widget.controller.text)
          : null,
      style: theme.textTheme.bodyLarge?.copyWith(
        fontSize: Responsive.fontSize(context, base: 15),
        height: 1.6,
      ),
      decoration: InputDecoration(
        hintText: '在此编辑内容…',
        hintStyle: TextStyle(
          color: AppTheme.inkSoftBy(isDark).withValues(alpha: 0.6),
        ),
        filled: true,
        fillColor: theme.scaffoldBackgroundColor,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: AppTheme.dividerBy(isDark)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: AppTheme.dividerBy(isDark)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide:
              BorderSide(color: theme.colorScheme.primary, width: 1.2),
        ),
      ),
    );
  }
}