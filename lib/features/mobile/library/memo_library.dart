import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../core/theme/app_theme.dart';
import '../../../data/models/memo.dart';

/// 记忆库列表（侧边栏 / 抽屉）
///
/// 展示所有 Memo，支持：
///   - 切换当前 Memo
///   - 新建 Memo
///   - 长按 / 滑动手势删除（带确认）
class MemoLibrary extends StatelessWidget {
  final List<Memo> memos;
  final String currentId;
  final ValueChanged<Memo> onSelect;
  final VoidCallback onCreate;
  final ValueChanged<Memo> onDelete;

  const MemoLibrary({
    super.key,
    required this.memos,
    required this.currentId,
    required this.onSelect,
    required this.onCreate,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final inkSoft = AppTheme.inkSoftBy(isDark);

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        border: Border(
          right: BorderSide(color: AppTheme.dividerBy(isDark), width: 0.6),
        ),
      ),
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // ============== 顶部标题区 ==============
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 18, 16, 12),
              child: Row(
                children: [
                  Text(
                    '记忆库',
                    style: theme.textTheme.labelSmall?.copyWith(
                      letterSpacing: 3,
                      color: inkSoft,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    tooltip: '新建记忆',
                    onPressed: onCreate,
                    icon: const Icon(Icons.add_rounded),
                  ),
                ],
              ),
            ),
            const Divider(height: 1, thickness: 0.5),
            // ============== 列表 ==============
            Expanded(
              child: memos.isEmpty
                  ? _EmptyLibrary(inkSoft: inkSoft)
                  : ListView.separated(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      itemCount: memos.length,
                      separatorBuilder: (_, __) =>
                          const SizedBox(height: 2),
                      itemBuilder: (context, i) {
                        final m = memos[i];
                        final selected = m.id == currentId;
                        return _MemoTile(
                          memo: m,
                          selected: selected,
                          onTap: () => onSelect(m),
                          onDelete: () => _confirmDelete(context, m),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _confirmDelete(BuildContext context, Memo m) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('删除这条记忆？'),
        content: const Text('文字将永久消失，无法恢复。'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            style: TextButton.styleFrom(
              foregroundColor: Theme.of(ctx).colorScheme.error,
            ),
            child: const Text('删除'),
          ),
        ],
      ),
    );
    if (ok == true) onDelete(m);
  }
}

class _MemoTile extends StatelessWidget {
  final Memo memo;
  final bool selected;
  final VoidCallback onTap;
  final VoidCallback onDelete;

  const _MemoTile({
    required this.memo,
    required this.selected,
    required this.onTap,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final preview = memo.rawContent.trim().isEmpty
        ? '（空白记忆）'
        : memo.rawContent.trim().replaceAll(RegExp(r'\s+'), ' ');
    final truncated = preview.length > 28
        ? '${preview.substring(0, 28)}…'
        : preview;
    final timeStr = _formatRelative(memo.updatedAt);

    return Material(
      color: selected
          ? theme.colorScheme.primary.withValues(alpha: 0.08)
          : Colors.transparent,
      child: InkWell(
        onTap: onTap,
        onLongPress: onDelete,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          decoration: BoxDecoration(
            border: Border(
              left: BorderSide(
                color: selected ? theme.colorScheme.primary : Colors.transparent,
                width: 2,
              ),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                truncated,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.bodyLarge?.copyWith(
                  fontWeight: selected ? FontWeight.w500 : FontWeight.w400,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  Text(
                    timeStr,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: AppTheme.inkSoftBy(isDark).withValues(alpha: 0.8),
                      fontSize: 12,
                    ),
                  ),
                  const Spacer(),
                  if (selected)
                    Icon(
                      Icons.adjust_rounded,
                      size: 10,
                      color: theme.colorScheme.primary,
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatRelative(DateTime t) {
    final now = DateTime.now();
    final diff = now.difference(t);
    if (diff.inSeconds < 30) return '刚刚';
    if (diff.inMinutes < 1) return '${diff.inSeconds} 秒前';
    if (diff.inMinutes < 60) return '${diff.inMinutes} 分钟前';
    if (diff.inHours < 24) return '${diff.inHours} 小时前';
    if (diff.inDays < 7) return '${diff.inDays} 天前';
    return DateFormat('MM-dd HH:mm').format(t);
  }
}

class _EmptyLibrary extends StatelessWidget {
  final Color inkSoft;
  const _EmptyLibrary({required this.inkSoft});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Text(
          '还没有记忆\n轻触右上角 ＋ 开始',
          textAlign: TextAlign.center,
          style: TextStyle(
            color: inkSoft.withValues(alpha: 0.7),
            height: 1.8,
            letterSpacing: 1.5,
          ),
        ),
      ),
    );
  }
}