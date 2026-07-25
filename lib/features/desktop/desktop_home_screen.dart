import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../core/constants/app_constants.dart';
import '../../core/forgetting/forgetting_engine.dart';
import '../../core/forgetting/memory_state.dart';
import '../../data/models/app_settings.dart';
import '../../data/models/memo.dart';
import '../../data/repositories/memo_repository.dart';
import '../mobile/canvas/fading_canvas.dart';
import 'shortcuts/app_shortcuts.dart';

const _gold = Color(0xFFE0A454);
const _night = Color(0xFF030C14);
const _nightCard = Color(0xFF0B1721);
const _nightLine = Color(0xFF26343E);
const _nightText = Color(0xFFEDE2D0);
const _nightMuted = Color(0xFF8C949A);

class DesktopHomeScreen extends StatefulWidget {
  const DesktopHomeScreen({super.key});

  @override
  State<DesktopHomeScreen> createState() => _DesktopHomeScreenState();
}

class _DesktopHomeScreenState extends State<DesktopHomeScreen> {
  late final MemoRepository _repo;
  StreamSubscription<dynamic>? _repoSubscription;
  Memo? _current;
  Timer? _saveDebounce;
  Timer? _clock;
  bool _initialized = false;

  final _titleController = TextEditingController();
  final _contentController = TextEditingController();
  final _contentFocus = FocusNode();
  String _lastSavedTitle = '';
  String _lastSavedContent = '';

  static const _prompts = <({IconData icon, String text})>[
    (icon: Icons.star_border_rounded, text: '今天最不想忘记的事'),
    (icon: Icons.notes_rounded, text: '一句没有说出口的话'),
    (icon: Icons.person_outline_rounded, text: '一个逐渐模糊的人'),
    (icon: Icons.history_rounded, text: '最近反复想起的瞬间'),
  ];

  @override
  void initState() {
    super.initState();
    _repo = context.read<MemoRepository>();
    _repoSubscription = _repo.watch().listen((_) {
      if (mounted) setState(() {});
    });
    _clock = Timer.periodic(const Duration(seconds: 10), (_) {
      if (mounted) setState(() {});
    });
    _initialize();
  }

  Future<void> _initialize() async {
    if (_initialized) return;
    _initialized = true;
    final memos = _repo.getAll();
    if (memos.isEmpty) {
      final memo = await _repo.create(
        '那天下午的风很轻。\n我好像记得你站在门口，\n又好像只是我后来想象出来的。\n有些声音已经听不清了，\n只剩下一点模糊的光。',
        title: '今天傍晚的雨',
      );
      _selectMemo(memo);
    } else {
      _selectMemo(memos.first);
    }
  }

  void _selectMemo(Memo memo) {
    _saveDebounce?.cancel();
    setState(() => _current = memo);
    _titleController.text = memo.title;
    _contentController.text = memo.rawContent;
    _lastSavedTitle = memo.title;
    _lastSavedContent = memo.rawContent;
  }

  Future<void> _saveNow() async {
    final memo = _current;
    if (memo == null) return;
    final title = _titleController.text.trim();
    final content = _contentController.text;
    if (title == _lastSavedTitle && content == _lastSavedContent) return;
    final updated = await _repo.updateText(
      memo,
      content,
      title: title.isEmpty ? _deriveTitle(content) : title,
    );
    _lastSavedTitle = updated.title;
    _lastSavedContent = updated.rawContent;
    if (mounted && _current?.id == updated.id) {
      setState(() => _current = updated);
    }
  }

  void _scheduleSave(String _) {
    _saveDebounce?.cancel();
    _saveDebounce = Timer(const Duration(milliseconds: 700), _saveNow);
  }

  Future<void> _showNewMemoryDialog() async {
    final title = TextEditingController();
    final content = TextEditingController();
    final result = await showDialog<({String title, String content})>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('写下新的记忆'),
        content: SizedBox(
          width: 520,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: title,
                autofocus: true,
                decoration: const InputDecoration(labelText: '标题（可选）'),
              ),
              const SizedBox(height: 14),
              TextField(
                controller: content,
                minLines: 5,
                maxLines: 8,
                decoration: const InputDecoration(
                  labelText: '记忆内容',
                  alignLabelWithHint: true,
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(
              context,
              (title: title.text.trim(), content: content.text),
            ),
            child: const Text('保存记忆'),
          ),
        ],
      ),
    );
    title.dispose();
    content.dispose();
    if (result == null) return;
    final memo = await _repo.create(
      result.content,
      title: result.title.isEmpty ? _deriveTitle(result.content) : result.title,
    );
    if (mounted) _selectMemo(memo);
  }

  String _deriveTitle(String content) {
    final compact = content.trim().replaceAll(RegExp(r'\s+'), ' ');
    if (compact.isEmpty) return '未命名的记忆';
    return compact.length > 12 ? '${compact.substring(0, 12)}…' : compact;
  }

  Future<void> _deleteMemo(Memo memo) async {
    if (_repo.getAll().length <= 1) {
      _showMessage('至少留下一段记忆');
      return;
    }
    await _repo.delete(memo.id);
    if (_current?.id == memo.id && mounted) {
      _selectMemo(_repo.getAll().first);
    }
  }

  Future<void> _recallAll() async {
    var memo = _current;
    if (memo == null) return;
    for (var index = 0; index < memo!.chars.length; index++) {
      memo = await _repo.boostChar(
        memo,
        index,
        ForgettingEngine.applyRecall(memo.chars[index].strength),
      );
    }
    if (mounted) setState(() => _current = memo);
    _showMessage('这段记忆清晰了一些');
  }

  Future<void> _recallChar(int index) async {
    final memo = _current;
    if (memo == null || index >= memo.chars.length) return;
    final updated = await _repo.boostChar(
      memo,
      index,
      ForgettingEngine.applyRecall(memo.chars[index].strength),
    );
    if (mounted) setState(() => _current = updated);
  }

  Future<void> _accelerate() async {
    final memo = _current;
    if (memo == null) return;
    final updated = await _repo.accelerate(memo);
    if (mounted) setState(() => _current = updated);
    _showMessage('时间向前走了一段');
  }

  Future<void> _reset() async {
    final memo = _current;
    if (memo == null) return;
    final updated = await _repo.resetMemory(memo);
    if (mounted) setState(() => _current = updated);
    _showMessage('记忆已恢复');
  }

  void _applyPrompt(String prompt) {
    final current = _contentController.text;
    _contentController.text =
        current.trim().isEmpty ? '$prompt：\n' : '$current\n$prompt：\n';
    _contentController.selection = TextSelection.collapsed(
      offset: _contentController.text.length,
    );
    _scheduleSave(_contentController.text);
    _contentFocus.requestFocus();
  }

  void _setLambda(double value) {
    final model = context.read<AppSettingsModel>();
    model.update(model.settings.copyWith(lambda: value));
  }

  void _toggleTheme() {
    final model = context.read<AppSettingsModel>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    model.update(
      model.settings.copyWith(
        themeMode: isDark ? ThemeMode.light : ThemeMode.dark,
      ),
    );
  }

  void _showMessage(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        SnackBar(
          content: Text(message),
          duration: const Duration(seconds: 2),
          behavior: SnackBarBehavior.floating,
        ),
      );
  }

  @override
  void dispose() {
    _saveDebounce?.cancel();
    _clock?.cancel();
    _repoSubscription?.cancel();
    _titleController.dispose();
    _contentController.dispose();
    _contentFocus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final memo = _current;
    final settings = context.watch<AppSettingsModel>().settings;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Shortcuts(
      shortcuts: AppShortcuts.shortcuts,
      child: Actions(
        actions: {
          NewMemoIntent: CallbackAction<NewMemoIntent>(
            onInvoke: (_) => _showNewMemoryDialog(),
          ),
          SaveIntent: CallbackAction<SaveIntent>(onInvoke: (_) => _saveNow()),
          RecallIntent: CallbackAction<RecallIntent>(
            onInvoke: (_) => _recallAll(),
          ),
          ForgetIntent: CallbackAction<ForgetIntent>(
            onInvoke: (_) => _accelerate(),
          ),
          ResetIntent: CallbackAction<ResetIntent>(onInvoke: (_) => _reset()),
          DeleteIntent: CallbackAction<DeleteIntent>(
            onInvoke: (_) => memo == null ? null : _deleteMemo(memo),
          ),
          ThemeIntent: CallbackAction<ThemeIntent>(
            onInvoke: (_) {
              _toggleTheme();
              return null;
            },
          ),
        },
        child: Focus(
          autofocus: true,
          child: Scaffold(
            backgroundColor: isDark ? _night : const Color(0xFFF2EEE6),
            body: memo == null
                ? const Center(child: CircularProgressIndicator())
                : LayoutBuilder(
                    builder: (context, constraints) {
                      final compact = constraints.maxWidth < 1180;
                      return Row(
                        children: [
                          SizedBox(
                            width: compact ? 260 : 320,
                            child: _Sidebar(
                              memos: _repo.getAll(),
                              current: memo,
                              isDark: isDark,
                              onCreate: _showNewMemoryDialog,
                              onSelect: _selectMemo,
                              onDelete: _deleteMemo,
                              onSettings: () => _showMessage(
                                '设置将在后续版本开放',
                              ),
                              onTheme: _toggleTheme,
                            ),
                          ),
                          Expanded(
                            child: _MainSurface(
                              memo: memo,
                              settings: settings,
                              isDark: isDark,
                              compact: compact,
                              titleController: _titleController,
                              contentController: _contentController,
                              contentFocus: _contentFocus,
                              prompts: _prompts,
                              onChanged: _scheduleSave,
                              onPrompt: _applyPrompt,
                              onRecall: _recallAll,
                              onAccelerate: _accelerate,
                              onReset: _reset,
                              onTheme: _toggleTheme,
                              onLambdaChanged: _setLambda,
                              onCharTap: _recallChar,
                            ),
                          ),
                        ],
                      );
                    },
                  ),
          ),
        ),
      ),
    );
  }
}

class _Sidebar extends StatelessWidget {
  final List<Memo> memos;
  final Memo current;
  final bool isDark;
  final VoidCallback onCreate;
  final ValueChanged<Memo> onSelect;
  final ValueChanged<Memo> onDelete;
  final VoidCallback onSettings;
  final VoidCallback onTheme;

  const _Sidebar({
    required this.memos,
    required this.current,
    required this.isDark,
    required this.onCreate,
    required this.onSelect,
    required this.onDelete,
    required this.onSettings,
    required this.onTheme,
  });

  @override
  Widget build(BuildContext context) {
    final line = isDark ? _nightLine : const Color(0xFFD8CDBD);
    final muted = isDark ? _nightMuted : const Color(0xFF716B64);
    return DecoratedBox(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF050F18) : const Color(0xFFEAE4DA),
        border: Border(right: BorderSide(color: line)),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(24, 34, 20, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              '记 · 忘',
              style: TextStyle(
                color:
                    isDark ? const Color(0xFFF0DEB9) : const Color(0xFF4D3924),
                fontSize: 38,
                fontWeight: FontWeight.w400,
                fontFamily: 'KaiTi',
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              'FadeMemo',
              style: TextStyle(color: Color(0xFFC69562), fontSize: 18),
            ),
            const SizedBox(height: 30),
            SizedBox(
              height: 54,
              child: FilledButton.icon(
                key: const Key('new-memory-button'),
                onPressed: onCreate,
                icon: const Icon(Icons.add_rounded, size: 25),
                label: const Text('写下新的记忆'),
                style: FilledButton.styleFrom(
                  backgroundColor: _gold,
                  foregroundColor: const Color(0xFFFFF3DE),
                  shape: const StadiumBorder(),
                  textStyle: const TextStyle(fontSize: 16),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 34, 0, 14),
              child: Row(
                children: [
                  Text('记忆碎片', style: TextStyle(color: muted, fontSize: 13)),
                  const SizedBox(width: 10),
                  Expanded(child: Divider(color: line)),
                ],
              ),
            ),
            Expanded(
              child: ListView.separated(
                padding: EdgeInsets.zero,
                itemCount: memos.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final memo = memos[index];
                  return _MemoryTile(
                    memo: memo,
                    selected: memo.id == current.id,
                    isDark: isDark,
                    onTap: () => onSelect(memo),
                    onDelete: () => onDelete(memo),
                  );
                },
              ),
            ),
            const SizedBox(height: 16),
            _SideButton(
              icon: Icons.settings_outlined,
              label: '设置',
              isDark: isDark,
              onTap: onSettings,
            ),
            const SizedBox(height: 12),
            _SideButton(
              icon: isDark ? Icons.dark_mode_rounded : Icons.light_mode_rounded,
              label: isDark ? '夜色未央' : '晨光微明',
              isDark: isDark,
              onTap: onTheme,
              tall: true,
            ),
          ],
        ),
      ),
    );
  }
}

class _MemoryTile extends StatefulWidget {
  final Memo memo;
  final bool selected;
  final bool isDark;
  final VoidCallback onTap;
  final VoidCallback onDelete;

  const _MemoryTile({
    required this.memo,
    required this.selected,
    required this.isDark,
    required this.onTap,
    required this.onDelete,
  });

  @override
  State<_MemoryTile> createState() => _MemoryTileState();
}

class _MemoryTileState extends State<_MemoryTile> {
  bool hovered = false;

  @override
  Widget build(BuildContext context) {
    final integrity =
        _memoryStats(widget.memo, AppConstants.defaultLambda).integrity;
    return MouseRegion(
      onEnter: (_) => setState(() => hovered = true),
      onExit: (_) => setState(() => hovered = false),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: widget.onTap,
          borderRadius: BorderRadius.circular(8),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            height: 88,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: widget.isDark ? _nightCard : const Color(0xFFF3EEE5),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: widget.selected
                    ? _gold.withValues(alpha: 0.65)
                    : (hovered
                        ? _gold.withValues(alpha: 0.3)
                        : widget.isDark
                            ? _nightLine
                            : const Color(0xFFD8CDBD)),
              ),
              boxShadow: widget.selected
                  ? [
                      BoxShadow(
                          color: _gold.withValues(alpha: 0.1), blurRadius: 12)
                    ]
                  : null,
            ),
            child: Row(
              children: [
                Container(
                  width: 58,
                  height: 58,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: _gold.withValues(alpha: 0.4)),
                    gradient: const RadialGradient(
                      center: Alignment(0.35, 0.2),
                      colors: [
                        Color(0xFFD5A260),
                        Color(0xFF183047),
                        Color(0xFF07111A)
                      ],
                      stops: [0, 0.23, 1],
                    ),
                  ),
                  child: const Icon(Icons.landscape_outlined,
                      color: Color(0x99E8C18D)),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        widget.memo.title.isEmpty
                            ? '未命名的记忆'
                            : widget.memo.title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: widget.isDark
                              ? _nightText
                              : const Color(0xFF403B35),
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _relativeDate(widget.memo.updatedAt),
                        style:
                            const TextStyle(color: _nightMuted, fontSize: 11),
                      ),
                    ],
                  ),
                ),
                if (hovered)
                  IconButton(
                    tooltip: '删除记忆',
                    onPressed: widget.onDelete,
                    icon: const Icon(Icons.close_rounded, size: 15),
                  )
                else
                  Text(
                    '${(integrity * 100).round()}%',
                    style:
                        const TextStyle(color: Color(0xFFD3A66C), fontSize: 12),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SideButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isDark;
  final VoidCallback onTap;
  final bool tall;

  const _SideButton({
    required this.icon,
    required this.label,
    required this.isDark,
    required this.onTap,
    this.tall = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: tall ? 64 : 46,
      child: OutlinedButton.icon(
        onPressed: onTap,
        icon: Icon(icon, color: _gold, size: tall ? 28 : 19),
        label: Expanded(child: Text(label)),
        style: OutlinedButton.styleFrom(
          alignment: Alignment.centerLeft,
          foregroundColor: isDark ? _nightText : const Color(0xFF514A42),
          side:
              BorderSide(color: isDark ? _nightLine : const Color(0xFFD8CDBD)),
          shape: const StadiumBorder(),
          padding: const EdgeInsets.symmetric(horizontal: 18),
        ),
      ),
    );
  }
}

class _MainSurface extends StatelessWidget {
  final Memo memo;
  final AppSettings settings;
  final bool isDark;
  final bool compact;
  final TextEditingController titleController;
  final TextEditingController contentController;
  final FocusNode contentFocus;
  final List<({IconData icon, String text})> prompts;
  final ValueChanged<String> onChanged;
  final ValueChanged<String> onPrompt;
  final VoidCallback onRecall;
  final VoidCallback onAccelerate;
  final VoidCallback onReset;
  final VoidCallback onTheme;
  final ValueChanged<double> onLambdaChanged;
  final ValueChanged<int> onCharTap;

  const _MainSurface({
    required this.memo,
    required this.settings,
    required this.isDark,
    required this.compact,
    required this.titleController,
    required this.contentController,
    required this.contentFocus,
    required this.prompts,
    required this.onChanged,
    required this.onPrompt,
    required this.onRecall,
    required this.onAccelerate,
    required this.onReset,
    required this.onTheme,
    required this.onLambdaChanged,
    required this.onCharTap,
  });

  @override
  Widget build(BuildContext context) {
    final line = isDark ? _nightLine : const Color(0xFFD6CBBC);
    return DecoratedBox(
      decoration: BoxDecoration(
        gradient: RadialGradient(
          center: const Alignment(0.35, 0),
          radius: 1.15,
          colors: isDark
              ? const [Color(0xFF0B1A25), _night]
              : const [Color(0xFFFAF6EE), Color(0xFFEDE6DC)],
        ),
      ),
      child: Padding(
        padding:
            EdgeInsets.fromLTRB(compact ? 28 : 48, 34, compact ? 28 : 44, 26),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              key: const Key('memory-title-field'),
              controller: titleController,
              onChanged: onChanged,
              style: TextStyle(
                color:
                    isDark ? const Color(0xFFF0DFBC) : const Color(0xFF49341E),
                fontSize: compact ? 29 : 36,
                fontFamily: 'KaiTi',
              ),
              decoration: const InputDecoration(
                hintText: '写下点什么，让它慢慢被遗忘。',
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                filled: false,
                contentPadding: EdgeInsets.zero,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              '有些记忆值得保存，有些适合慢慢消失。',
              style: TextStyle(color: _nightMuted, fontSize: 15),
            ),
            const SizedBox(height: 24),
            Wrap(
              spacing: 12,
              runSpacing: 10,
              children: [
                for (final prompt in prompts)
                  SizedBox(
                    width: compact ? 190 : 222,
                    height: 42,
                    child: OutlinedButton.icon(
                      onPressed: () => onPrompt(prompt.text),
                      icon: Icon(prompt.icon, size: 18),
                      label: Text(
                        prompt.text,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 12),
                      ),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: isDark
                            ? const Color(0xFFAAA7A2)
                            : const Color(0xFF625C55),
                        side: BorderSide(color: line),
                        shape: const StadiumBorder(),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 18),
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: isDark
                      ? const Color(0xCC09141D)
                      : const Color(0xCCFAF7F1),
                  border: Border.all(color: line),
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: [
                    BoxShadow(
                      color:
                          Colors.black.withValues(alpha: isDark ? 0.22 : 0.06),
                      blurRadius: 24,
                    ),
                  ],
                ),
                child: Stack(
                  children: [
                    Positioned.fill(
                      child: Padding(
                        padding: EdgeInsets.fromLTRB(
                            compact ? 32 : 56, 30, compact ? 32 : 56, 32),
                        child: SingleChildScrollView(
                          child: FadingCanvas(
                            memo: memo,
                            lambda: settings.lambda,
                            fontSize: compact ? 22 : 26,
                            animationEnabled: settings.animationEnabled,
                            onCharTap: onCharTap,
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      right: 16,
                      top: 14,
                      child: Tooltip(
                        message: '编辑记忆',
                        child: IconButton(
                          onPressed: () => _showEditor(context),
                          icon: const Icon(Icons.edit_outlined, size: 19),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            _BottomPanel(
              memo: memo,
              lambda: settings.lambda,
              isDark: isDark,
              compact: compact,
              onLambdaChanged: onLambdaChanged,
              onRecall: onRecall,
              onAccelerate: onAccelerate,
              onReset: onReset,
              onTheme: onTheme,
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _showEditor(BuildContext context) async {
    await showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('编辑记忆'),
        content: SizedBox(
          width: 620,
          child: TextField(
            key: const Key('memory-content-field'),
            controller: contentController,
            focusNode: contentFocus,
            autofocus: true,
            minLines: 10,
            maxLines: 16,
            onChanged: onChanged,
            decoration: const InputDecoration(hintText: '写下这段记忆…'),
          ),
        ),
        actions: [
          FilledButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('完成'),
          ),
        ],
      ),
    );
  }
}

class _BottomPanel extends StatelessWidget {
  final Memo memo;
  final double lambda;
  final bool isDark;
  final bool compact;
  final ValueChanged<double> onLambdaChanged;
  final VoidCallback onRecall;
  final VoidCallback onAccelerate;
  final VoidCallback onReset;
  final VoidCallback onTheme;

  const _BottomPanel({
    required this.memo,
    required this.lambda,
    required this.isDark,
    required this.compact,
    required this.onLambdaChanged,
    required this.onRecall,
    required this.onAccelerate,
    required this.onReset,
    required this.onTheme,
  });

  @override
  Widget build(BuildContext context) {
    final stats = _memoryStats(memo, lambda);
    return SizedBox(
      height: 112,
      child: Row(
        children: [
          Expanded(
            child: _PanelBox(
              isDark: isDark,
              child: Row(
                children: [
                  _Stat(
                      label: '记忆完整度',
                      value: '${(stats.integrity * 100).round()}%'),
                  const VerticalDivider(indent: 16, endIndent: 16),
                  _Stat(
                      label: '存活字符',
                      value: '${stats.alive} / ${stats.total}',
                      small: true),
                  const VerticalDivider(indent: 16, endIndent: 16),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 18),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('遗忘速度',
                              style:
                                  TextStyle(color: _nightMuted, fontSize: 12)),
                          Row(
                            children: [
                              const Icon(Icons.hourglass_empty_rounded,
                                  size: 18),
                              Expanded(
                                child: Slider(
                                  key: const Key('forgetting-speed-slider'),
                                  value: _lambdaToSlider(lambda),
                                  onChanged: (value) =>
                                      onLambdaChanged(_sliderToLambda(value)),
                                ),
                              ),
                              const Icon(Icons.fast_forward_rounded, size: 19),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 14),
          SizedBox(
            width: compact ? 380 : 440,
            child: _PanelBox(
              isDark: isDark,
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Row(
                  children: [
                    Expanded(
                        child: _Action(
                            icon: Icons.auto_awesome_outlined,
                            label: '回忆擦亮',
                            onTap: onRecall)),
                    const SizedBox(width: 8),
                    Expanded(
                        child: _Action(
                            icon: Icons.fast_forward_rounded,
                            label: '加速失忆',
                            onTap: onAccelerate)),
                    const SizedBox(width: 8),
                    Expanded(
                        child: _Action(
                            icon: Icons.refresh_rounded,
                            label: '恢复记忆',
                            onTap: onReset)),
                    const SizedBox(width: 8),
                    SizedBox(
                        width: 58,
                        child: _Action(
                            icon: isDark
                                ? Icons.dark_mode_rounded
                                : Icons.light_mode_rounded,
                            label: '',
                            onTap: onTheme)),
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

class _PanelBox extends StatelessWidget {
  final bool isDark;
  final Widget child;
  const _PanelBox({required this.isDark, required this.child});

  @override
  Widget build(BuildContext context) => Container(
        decoration: BoxDecoration(
          color: isDark ? _nightCard : const Color(0xFFF8F3EA),
          borderRadius: BorderRadius.circular(8),
          border:
              Border.all(color: isDark ? _nightLine : const Color(0xFFD8CDBD)),
        ),
        child: child,
      );
}

class _Stat extends StatelessWidget {
  final String label;
  final String value;
  final bool small;
  const _Stat({required this.label, required this.value, this.small = false});

  @override
  Widget build(BuildContext context) => SizedBox(
        width: small ? 132 : 150,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label,
                  style: const TextStyle(color: _nightMuted, fontSize: 12)),
              const SizedBox(height: 5),
              FittedBox(
                child: Text(
                  value,
                  style: TextStyle(
                      color: _gold,
                      fontSize: small ? 25 : 34,
                      fontFamily: 'Georgia'),
                ),
              ),
            ],
          ),
        ),
      );
}

class _Action extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  const _Action({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) => Tooltip(
        message: label.isEmpty ? '切换昼夜主题' : label,
        child: OutlinedButton(
          onPressed: onTap,
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(7)),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: _gold, size: 24),
              if (label.isNotEmpty) ...[
                const SizedBox(height: 7),
                Text(label, maxLines: 1, style: const TextStyle(fontSize: 11)),
              ],
            ],
          ),
        ),
      );
}

({double integrity, int alive, int total}) _memoryStats(
    Memo memo, double lambda) {
  if (memo.chars.isEmpty) return (integrity: 0, alive: 0, total: 0);
  final now = DateTime.now();
  var sum = 0.0;
  var alive = 0;
  for (final char in memo.chars) {
    final strength = ForgettingEngine.effectiveStrength(
      strength: char.strength,
      importance: char.importance,
      lambda: lambda,
      lastRecall: char.lastRecall,
      now: now,
    );
    sum += strength;
    if (ForgettingEngine.resolveState(strength) != MemoryState.disappeared) {
      alive++;
    }
  }
  return (
    integrity: sum / memo.chars.length,
    alive: alive,
    total: memo.chars.length
  );
}

double _lambdaToSlider(double lambda) {
  final min = math.log(AppConstants.minLambda);
  final max = math.log(AppConstants.maxLambda);
  return ((math.log(lambda.clamp(
                  AppConstants.minLambda, AppConstants.maxLambda)) -
              min) /
          (max - min))
      .clamp(0, 1);
}

double _sliderToLambda(double value) {
  final min = math.log(AppConstants.minLambda);
  final max = math.log(AppConstants.maxLambda);
  return math.exp(min + (max - min) * value);
}

String _relativeDate(DateTime date) {
  final difference = DateTime.now().difference(date);
  if (difference.inMinutes < 1) return '刚刚';
  if (difference.inHours < 1) return '${difference.inMinutes} 分钟前';
  if (difference.inDays < 1) return '今天 ${DateFormat('HH:mm').format(date)}';
  if (difference.inDays < 7) return '${difference.inDays} 天前';
  return DateFormat('M月d日').format(date);
}
