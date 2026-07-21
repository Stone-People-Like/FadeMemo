import 'dart:async';

import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';

/// 顶部输入编辑区
///
/// 输入完成后有两种保存方式：
///   1. 点击右上角 ✓ 立即保存
///   2. 停止输入 1.5 秒后自动保存（防抖）
class MemoEditor extends StatefulWidget {
  final String initialText;
  final ValueChanged<String> onSubmit;
  final VoidCallback? onCancel;

  const MemoEditor({
    super.key,
    required this.initialText,
    required this.onSubmit,
    this.onCancel,
  });

  @override
  State<MemoEditor> createState() => _MemoEditorState();
}

class _MemoEditorState extends State<MemoEditor> {
  late final TextEditingController _ctrl;
  final FocusNode _focus = FocusNode();
  bool _editing = false;

  Timer? _autoSaveTimer;
  String _lastSavedText = '';
  bool _dirty = false;

  /// 自动保存防抖时长
  static const Duration _autoSaveDelay = Duration(milliseconds: 1500);

  @override
  void initState() {
    super.initState();
    _ctrl = TextEditingController(text: widget.initialText);
    _lastSavedText = widget.initialText;
    _ctrl.addListener(_onTextChange);
  }

  void _onTextChange() {
    final text = _ctrl.text;
    final has = text.trim().isNotEmpty;
    final dirty = text != _lastSavedText;

    if (has != _editing || dirty != _dirty) {
      setState(() {
        _editing = has;
        _dirty = dirty;
      });
    }

    // 重置防抖
    _autoSaveTimer?.cancel();
    if (_dirty && has) {
      _autoSaveTimer = Timer(_autoSaveDelay, () {
        if (mounted && _dirty) {
          _submit(silent: true);
        }
      });
    }
  }

  @override
  void didUpdateWidget(covariant MemoEditor oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.initialText != _ctrl.text && !_focus.hasFocus) {
      _ctrl.text = widget.initialText;
      _lastSavedText = widget.initialText;
      _dirty = false;
    }
  }

  @override
  void dispose() {
    _autoSaveTimer?.cancel();
    _ctrl.removeListener(_onTextChange);
    _ctrl.dispose();
    _focus.dispose();
    super.dispose();
  }

  void _submit({bool silent = false}) {
    final text = _ctrl.text;
    if (text.trim().isEmpty) return;
    widget.onSubmit(text);
    _lastSavedText = text;
    _dirty = false;
    if (!silent) _focus.unfocus();
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final inkSoft = AppTheme.inkSoftBy(isDark);

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppTheme.dividerBy(isDark),
          width: 0.6,
        ),
      ),
      padding: const EdgeInsets.fromLTRB(20, 18, 12, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                _dirty && _editing ? '正在保存…' : '此刻',
                style: theme.textTheme.labelSmall?.copyWith(
                  letterSpacing: 3,
                  color: inkSoft,
                ),
              ),
              const Spacer(),
              if (_editing)
                IconButton(
                  tooltip: '保存',
                  onPressed: () => _submit(silent: false),
                  icon: Icon(
                    Icons.check_rounded,
                    color: theme.colorScheme.primary,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 4),
          TextField(
            controller: _ctrl,
            focusNode: _focus,
            maxLines: null,
            minLines: 2,
            textInputAction: TextInputAction.newline,
            style: theme.textTheme.bodyLarge,
            decoration: InputDecoration(
              hintText: '把这一刻记下来……',
              hintStyle: TextStyle(
                color: inkSoft.withValues(alpha: 0.6),
              ),
              border: InputBorder.none,
              enabledBorder: InputBorder.none,
              focusedBorder: InputBorder.none,
              filled: false,
              contentPadding: EdgeInsets.zero,
              isCollapsed: true,
            ),
          ),
        ],
      ),
    );
  }
}