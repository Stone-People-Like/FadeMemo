import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/constants/app_constants.dart';
import '../../core/forgetting/forgetting_engine.dart';
import '../../core/utils/responsive.dart';
import '../../data/models/app_settings.dart';
import '../../data/models/memo_model.dart';
import '../../data/repositories/memo_repository.dart';
import '../canvas/widgets/fading_canvas.dart';
import '../canvas/widgets/memory_clock.dart';
import '../controls/widgets/control_panel.dart';
import '../editor/widgets/memo_editor.dart';
import '../library/widgets/memo_library.dart';

/// 主屏幕 — 三段式固定布局：
///   1. 顶部：MemoEditor（输入新内容）
///   2. 中部：FadingCanvas（核心遗忘展示区）
///   3. 底部：ControlPanel（控制面板）
///
/// 桌面端：左侧常驻 MemoLibrary 侧栏
/// 手机端：AppBar 入口打开抽屉式 MemoLibrary
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late MemoRepository _repo;
  Memo? _current;
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    _repo = context.read<MemoRepository>();
    // 监听 repo 变化（删除 / 外部更新）
    _repo.watch().listen((_) {
      if (mounted) setState(() {});
    });
    _ensureMemo();
  }

  Future<void> _ensureMemo() async {
    if (_initialized) return;
    _initialized = true;
    final list = _repo.getAll();
    if (list.isNotEmpty) {
      setState(() => _current = list.first);
    } else {
      final memo = await _repo.create('');
      setState(() => _current = memo);
    }
  }

  // ============== 动作回调 ==============
  Future<void> _onSubmit(String text) async {
    final current = _current;
    if (current == null) return;
    final updated = await _repo.updateText(current, text);
    if (!mounted) return;
    setState(() => _current = updated);
  }

  Future<void> _onCharTap(int index) async {
    final current = _current;
    if (current == null) return;
    final ch = current.chars[index];
    final newStrength = ForgettingEngine.applyRecall(ch.strength);
    final updated = await _repo.boostChar(current, index, newStrength);
    if (!mounted) return;
    setState(() => _current = updated);
  }

  Future<void> _onRecallAll() async {
    final current = _current;
    if (current == null) return;
    Memo updated = current;
    for (int i = 0; i < current.chars.length; i++) {
      final ch = current.chars[i];
      final newStrength = ForgettingEngine.applyRecall(ch.strength);
      updated = await _repo.boostChar(updated, i, newStrength);
    }
    if (!mounted) return;
    setState(() => _current = updated);
  }

  Future<void> _onAccelerate() async {
    final current = _current;
    if (current == null) return;
    final updated = await _repo.accelerate(current);
    if (!mounted) return;
    setState(() => _current = updated);
  }

  Future<void> _onReset() async {
    final current = _current;
    if (current == null) return;
    final updated = await _repo.resetMemory(current);
    if (!mounted) return;
    setState(() => _current = updated);
  }

  void _onLambdaChanged(double newLambda) {
    final s = context.read<AppSettingsModel>().settings;
    context.read<AppSettingsModel>().update(s.copyWith(lambda: newLambda));
    setState(() {});
  }

  void _onAnimationToggle(bool enabled) {
    final s = context.read<AppSettingsModel>().settings;
    context
        .read<AppSettingsModel>()
        .update(s.copyWith(animationEnabled: enabled));
  }

  void _onThemeToggle(bool dark) {
    final s = context.read<AppSettingsModel>().settings;
    context.read<AppSettingsModel>().update(
          s.copyWith(themeMode: dark ? ThemeMode.dark : ThemeMode.light),
        );
  }

  Future<void> _createNewMemo() async {
    final m = await _repo.create('');
    if (!mounted) return;
    setState(() => _current = m);
  }

  void _selectMemo(Memo m) {
    setState(() => _current = m);
    if (MediaQuery.of(context).size.width < AppConstants.tabletBreakpoint) {
      Navigator.of(context).maybePop();
    }
  }

  Future<void> _deleteMemo(Memo m) async {
    await _repo.delete(m.id);
    if (!mounted) return;
    if (_current?.id == m.id) {
      final remaining = _repo.getAll();
      if (remaining.isNotEmpty) {
        _current = remaining.first;
      } else {
        await _createNewMemo();
      }
    }
    setState(() {});
  }

  // ============== UI ==============
  @override
  Widget build(BuildContext context) {
    final settings = context.watch<AppSettingsModel>().settings;
    final lambda = settings.lambda;
    final fontSize = Responsive.fontSize(context, base: settings.fontSize);

    final current = _current;
    if (current == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final isWide = MediaQuery.of(context).size.width >= AppConstants.tabletBreakpoint;
    final memos = _repo.getAll();

    return Scaffold(
      appBar: AppBar(
        title: const Text('FADEMEMO'),
        leading: isWide
            ? null
            : IconButton(
                tooltip: '记忆库',
                onPressed: () => Scaffold.of(context).openDrawer(),
                icon: const Icon(Icons.menu_rounded),
              ),
        actions: [
          IconButton(
            tooltip: '新建记忆',
            onPressed: _createNewMemo,
            icon: const Icon(Icons.add_rounded),
          ),
        ],
      ),
      drawer: isWide
          ? null
          : Drawer(
              width: 280,
              child: MemoLibrary(
                memos: memos,
                currentId: current.id,
                onSelect: _selectMemo,
                onCreate: () {
                  _createNewMemo();
                  Navigator.of(context).maybePop();
                },
                onDelete: _deleteMemo,
              ),
            ),
      body: SafeArea(
        child: isWide
            ? Row(
                children: [
                  SizedBox(
                    width: 280,
                    child: MemoLibrary(
                      memos: memos,
                      currentId: current.id,
                      onSelect: _selectMemo,
                      onCreate: _createNewMemo,
                      onDelete: _deleteMemo,
                    ),
                  ),
                  Expanded(
                    child: Center(
                      child: ConstrainedBox(
                        constraints: BoxConstraints(
                          maxWidth: Responsive.maxContentWidth(context),
                        ),
                        child: _buildBody(
                            context, current, lambda, fontSize, settings),
                      ),
                    ),
                  ),
                ],
              )
            : Center(
                child: ConstrainedBox(
                  constraints: BoxConstraints(
                    maxWidth: Responsive.maxContentWidth(context),
                  ),
                  child: _buildBody(
                      context, current, lambda, fontSize, settings),
                ),
              ),
      ),
    );
  }

  Widget _buildBody(
    BuildContext context,
    Memo current,
    double lambda,
    double fontSize,
    AppSettings settings,
  ) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final padding = Responsive.horizontalPadding(context);

    final editor = MemoEditor(
      key: ValueKey('editor-${current.id}'),
      initialText: current.rawContent,
      onSubmit: _onSubmit,
    );

    final canvas = FadingCanvas(
      key: ValueKey('canvas-${current.id}'),
      memo: current,
      lambda: lambda,
      fontSize: fontSize,
      animationEnabled: settings.animationEnabled,
      onCharTap: _onCharTap,
    );

    final controls = ControlPanel(
      key: ValueKey('controls-${current.id}'),
      lambda: lambda,
      onLambdaChanged: _onLambdaChanged,
      onRecallAll: _onRecallAll,
      onAccelerate: _onAccelerate,
      onReset: _onReset,
      isDark: isDark,
      onThemeToggle: _onThemeToggle,
      animationEnabled: settings.animationEnabled,
      onAnimationToggle: _onAnimationToggle,
    );

    return Padding(
      padding: EdgeInsets.symmetric(horizontal: padding, vertical: 12),
      child: Column(
        children: [
          editor,
          const SizedBox(height: 10),
          MemoryClock(memo: current, lambda: lambda),
          const SizedBox(height: 4),
          Expanded(
            child: SingleChildScrollView(child: canvas),
          ),
          const SizedBox(height: 14),
          controls,
        ],
      ),
    );
  }
}