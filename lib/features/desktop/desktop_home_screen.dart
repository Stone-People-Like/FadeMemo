import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/forgetting/forgetting_engine.dart';
import '../../data/models/app_settings.dart';
import '../../data/models/memo.dart';
import '../../data/repositories/memo_repository.dart';
import 'shortcuts/app_shortcuts.dart';
import 'widgets/desktop_menu_bar.dart';
import 'widgets/desktop_sidebar.dart';
import 'widgets/desktop_status_bar.dart';
import 'widgets/desktop_toolbar.dart';
import 'widgets/desktop_main_pane.dart';

/// 桌面端主屏幕（Windows / macOS / Linux 通用）
///
/// 与手机端的本质区别：
///   - 三段式独立分区（侧栏 / 中央 / 状态栏）
///   - 顶部原生菜单栏 + 工具栏
///   - 完整键盘快捷键（Ctrl+N/S/R/F/D/T/E）
///   - 大字号 + 多信息密度
class DesktopHomeScreen extends StatefulWidget {
  const DesktopHomeScreen({super.key});

  @override
  State<DesktopHomeScreen> createState() => _DesktopHomeScreenState();
}

class _DesktopHomeScreenState extends State<DesktopHomeScreen> {
  late MemoRepository _repo;
  Memo? _current;
  bool _initialized = false;

  // 编辑器 controller
  final TextEditingController _titleCtrl = TextEditingController();
  final TextEditingController _contentCtrl = TextEditingController();
  final FocusNode _titleFocus = FocusNode();
  final FocusNode _contentFocus = FocusNode();

  // 用于 content 防抖自动保存
  Timer? _contentDebounce;
  String _lastSavedContent = '';

  // 用于 title 同步（占位保留，后续可启用持久化）
  // Timer? _titleDebounce;

  @override
  void initState() {
    super.initState();
    _repo = context.read<MemoRepository>();
    _repo.watch().listen((_) {
      if (mounted) setState(() {});
    });
    _initCurrent();
  }

  Future<void> _initCurrent() async {
    if (_initialized) return;
    _initialized = true;
    final list = _repo.getAll();
    if (list.isNotEmpty) {
      _setCurrent(list.first);
    } else {
      final m = await _repo.create('');
      _setCurrent(m);
    }
  }

  void _setCurrent(Memo m) {
    setState(() => _current = m);
    if (_titleCtrl.text != m.title) _titleCtrl.text = m.title;
    if (_contentCtrl.text != m.rawContent) {
      _contentCtrl.text = m.rawContent;
      _lastSavedContent = m.rawContent;
    }
  }

  // ============== 动作回调 ==============
  Future<void> _createNew() async {
    final m = await _repo.create('');
    _setCurrent(m);
  }

  Future<void> _saveCurrent() async {
    // 立即把当前编辑器内容落库
    final m = _current;
    if (m == null) return;
    final title = _titleCtrl.text;
    final content = _contentCtrl.text;
    if (title != m.title) {
      await _repo.updateText(m, content);
      // 用一个新对象覆盖 title（这里暂时更新 rawContent 同时保留 title）
    }
    _lastSavedContent = content;
  }

  Future<void> _onContentChange(String text) async {
    _contentDebounce?.cancel();
    _contentDebounce = Timer(const Duration(milliseconds: 1500), () async {
      if (!mounted) return;
      final m = _current;
      if (m == null) return;
      if (text == _lastSavedContent) return;
      final updated = await _repo.updateText(m, text);
      _lastSavedContent = text;
      if (mounted && _current?.id == updated.id) {
        setState(() => _current = updated);
      }
    });
  }

  Future<void> _onCharTap(int index) async {
    final m = _current;
    if (m == null) return;
    final ch = m.chars[index];
    final newStrength = ForgettingEngine.applyRecall(ch.strength);
    final updated = await _repo.boostChar(m, index, newStrength);
    if (!mounted) return;
    setState(() => _current = updated);
  }

  Future<void> _recallAll() async {
    final m = _current;
    if (m == null) return;
    Memo updated = m;
    for (int i = 0; i < m.chars.length; i++) {
      final ch = m.chars[i];
      updated = await _repo.boostChar(updated, i,
          ForgettingEngine.applyRecall(ch.strength));
    }
    if (!mounted) return;
    setState(() => _current = updated);
  }

  Future<void> _accelerate() async {
    final m = _current;
    if (m == null) return;
    final updated = await _repo.accelerate(m);
    if (!mounted) return;
    setState(() => _current = updated);
  }

  Future<void> _reset() async {
    final m = _current;
    if (m == null) return;
    final updated = await _repo.resetMemory(m);
    if (!mounted) return;
    setState(() => _current = updated);
  }

  void _selectMemo(Memo m) => _setCurrent(m);

  Future<void> _deleteMemo(Memo m) async {
    await _repo.delete(m.id);
    if (_current?.id == m.id) {
      final remaining = _repo.getAll();
      if (remaining.isNotEmpty) {
        _setCurrent(remaining.first);
      } else {
        await _createNew();
      }
    } else {
      setState(() {});
    }
  }

  void _onLambdaChanged(double newLambda) {
    final s = context.read<AppSettingsModel>().settings;
    context.read<AppSettingsModel>().update(s.copyWith(lambda: newLambda));
    setState(() {});
  }

  void _onThemeToggle(bool dark) {
    final s = context.read<AppSettingsModel>().settings;
    context.read<AppSettingsModel>().update(
          s.copyWith(themeMode: dark ? ThemeMode.dark : ThemeMode.light),
        );
  }

  void _onAnimationToggle(bool enabled) {
    final s = context.read<AppSettingsModel>().settings;
    context
        .read<AppSettingsModel>()
        .update(s.copyWith(animationEnabled: enabled));
  }

  @override
  void dispose() {
    _contentDebounce?.cancel();
    _titleCtrl.dispose();
    _contentCtrl.dispose();
    _titleFocus.dispose();
    _contentFocus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final settings = context.watch<AppSettingsModel>().settings;
    final current = _current;

    return Shortcuts(
      shortcuts: AppShortcuts.shortcuts,
      child: Actions(
        actions: {
          NewMemoIntent: CallbackAction<NewMemoIntent>(
            onInvoke: (_) {
              _createNew();
              return null;
            },
          ),
          SaveIntent: CallbackAction<SaveIntent>(
            onInvoke: (_) {
              _saveCurrent();
              return null;
            },
          ),
          RecallIntent: CallbackAction<RecallIntent>(
            onInvoke: (_) {
              _recallAll();
              return null;
            },
          ),
          ForgetIntent: CallbackAction<ForgetIntent>(
            onInvoke: (_) {
              _accelerate();
              return null;
            },
          ),
          ResetIntent: CallbackAction<ResetIntent>(
            onInvoke: (_) {
              _reset();
              return null;
            },
          ),
          DeleteIntent: CallbackAction<DeleteIntent>(
            onInvoke: (_) {
              final m = _current;
              if (m != null) _deleteMemo(m);
              return null;
            },
          ),
          ThemeIntent: CallbackAction<ThemeIntent>(
            onInvoke: (_) {
              final isDark = Theme.of(context).brightness == Brightness.dark;
              _onThemeToggle(!isDark);
              return null;
            },
          ),
          AnimationIntent: CallbackAction<AnimationIntent>(
            onInvoke: (_) {
              _onAnimationToggle(!settings.animationEnabled);
              return null;
            },
          ),
        },
        child: Focus(
          autofocus: true,
          child: Scaffold(
            body: current == null
                ? const Center(child: CircularProgressIndicator())
                : _buildBody(context, current, settings),
          ),
        ),
      ),
    );
  }

  Widget _buildBody(
      BuildContext context, Memo current, AppSettings settings) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Column(
      children: [
        // ============== 顶部菜单栏 ==============
        DesktopMenuBar(
          onNew: _createNew,
          onRecall: _recallAll,
          onForget: _accelerate,
          onReset: _reset,
          onToggleTheme: () => _onThemeToggle(!isDark),
          onToggleAnimation: () =>
              _onAnimationToggle(!settings.animationEnabled),
        ),

        // ============== 主体：侧栏 + 中央 ==============
        Expanded(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 左侧：记忆库
              SizedBox(
                width: 280,
                child: DesktopSidebar(
                  memos: _repo.getAll(),
                  currentId: current.id,
                  onSelect: _selectMemo,
                  onCreate: _createNew,
                  onDelete: _deleteMemo,
                ),
              ),

              // 右侧：主面板（工具栏 + 中央 + 编辑器）
              Expanded(
                child: Column(
                  children: [
                    DesktopToolbar(
                      titleController: _titleCtrl,
                      titleFocus: _titleFocus,
                      lambda: settings.lambda,
                      onLambdaChanged: _onLambdaChanged,
                      onRecall: _recallAll,
                      onForget: _accelerate,
                      onReset: _reset,
                      isDark: isDark,
                      onThemeToggle: _onThemeToggle,
                      animationEnabled: settings.animationEnabled,
                      onAnimationToggle: _onAnimationToggle,
                    ),
                    Expanded(
                      child: DesktopMainPane(
                        memo: current,
                        lambda: settings.lambda,
                        fontSize: settings.fontSize,
                        animationEnabled: settings.animationEnabled,
                        contentController: _contentCtrl,
                        onContentChange: _onContentChange,
                        onCharTap: _onCharTap,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        // ============== 底部状态栏 ==============
        DesktopStatusBar(memo: current, lambda: settings.lambda),
      ],
    );
  }
}