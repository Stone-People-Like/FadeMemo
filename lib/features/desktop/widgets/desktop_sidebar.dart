import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../core/theme/app_theme.dart';
import '../../../data/models/memo.dart';

/// 桌面端左侧记忆库
///
/// 与手机端抽屉相比：
///   - 常驻显示，无需打开
///   - 列表项更宽，可显示更多预览
///   - 顶部有搜索框（占位，未来加）
///   - 鼠标悬停有高亮反馈
class DesktopSidebar extends StatefulWidget {
  final List<Memo> memos;
  final String? currentId;
  final ValueChanged<Memo> onSelect;
  final VoidCallback onCreate;
  final ValueChanged<Memo> onDelete;

  const DesktopSidebar({
    super.key,
    required this.memos,
    required this.currentId,
    required this.onSelect,
    required this.onCreate,
    required this.onDelete,
  });

  @override
  State<DesktopSidebar> createState() => _DesktopSidebarState();
}

class _DesktopSidebarState extends State<DesktopSidebar> {
  String _filter = '';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final filtered = _filter.isEmpty
        ? widget.memos
        : widget.memos
            .where((m) =>
                m.rawContent.toLowerCase().contains(_filter.toLowerCase()))
            .toList();

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        border: Border(
          right: BorderSide(color: AppTheme.dividerBy(isDark), width: 0.6),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // ============== 顶部标题 ==============
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 18, 16, 8),
            child: Row(
              children: [
                Text(
                  'MEMORIES',
                  style: theme.textTheme.labelSmall?.copyWith(
                    letterSpacing: 3,
                    color: AppTheme.inkSoftBy(isDark),
                  ),
                ),
                const Spacer(),
                IconButton(
                  tooltip: '新建记忆 (Ctrl+N)',
                  onPressed: widget.onCreate,
                  icon: const Icon(Icons.add_rounded, size: 18),
                  visualDensity: VisualDensity.compact,
                ),
              ],
            ),
          ),
          // ============== 搜索框 ==============
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: TextField(
              onChanged: (v) => setState(() => _filter = v),
              style: theme.textTheme.bodyMedium,
              decoration: const InputDecoration(
                hintText: '搜索记忆…',
                isDense: true,
                prefixIcon: Icon(Icons.search_rounded, size: 16),
                contentPadding:
                    EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              ),
            ),
          ),
          // ============== 统计 ==============
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 8),
            child: Text(
              '${filtered.length} / ${widget.memos.length} 条',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: AppTheme.inkSoftBy(isDark).withValues(alpha: 0.7),
                fontSize: 12,
              ),
            ),
          ),
          // ============== 列表 ==============
          Expanded(
            child: filtered.isEmpty
                ? _EmptyHint(isDark: isDark, hasFilter: _filter.isNotEmpty)
                : ListView.separated(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    itemCount: filtered.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 2),
                    itemBuilder: (context, i) => _SidebarMemoTile(
                      memo: filtered[i],
                      selected: filtered[i].id == widget.currentId,
                      onTap: () => widget.onSelect(filtered[i]),
                      onDelete: () => widget.onDelete(filtered[i]),
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}

class _SidebarMemoTile extends StatefulWidget {
  final Memo memo;
  final bool selected;
  final VoidCallback onTap;
  final VoidCallback onDelete;

  const _SidebarMemoTile({
    required this.memo,
    required this.selected,
    required this.onTap,
    required this.onDelete,
  });

  @override
  State<_SidebarMemoTile> createState() => _SidebarMemoTileState();
}

class _SidebarMemoTileState extends State<_SidebarMemoTile> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    final preview = widget.memo.rawContent.trim().isEmpty
        ? '（空白记忆）'
        : widget.memo.rawContent.trim().replaceAll(RegExp(r'\s+'), ' ');
    final truncated = preview.length > 60
        ? '${preview.substring(0, 60)}…'
        : preview;
    final timeStr = _formatRelative(widget.memo.updatedAt);

    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: InkWell(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 120),
          margin: const EdgeInsets.symmetric(horizontal: 8),
          padding: const EdgeInsets.fromLTRB(14, 10, 10, 10),
          decoration: BoxDecoration(
            color: widget.selected
                ? theme.colorScheme.primary.withValues(alpha: 0.10)
                : (_hovered
                    ? theme.colorScheme.primary.withValues(alpha: 0.04)
                    : Colors.transparent),
            borderRadius: BorderRadius.circular(8),
            border: Border(
              left: BorderSide(
                color: widget.selected
                    ? theme.colorScheme.primary
                    : Colors.transparent,
                width: 2,
              ),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      truncated,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.bodyMedium?.copyWith(
                        fontWeight: widget.selected
                            ? FontWeight.w500
                            : FontWeight.w400,
                        height: 1.5,
                      ),
                    ),
                  ),
                  if (_hovered)
                    IconButton(
                      tooltip: '删除',
                      onPressed: widget.onDelete,
                      icon: Icon(
                        Icons.close_rounded,
                        size: 14,
                        color: AppTheme.inkSoftBy(isDark),
                      ),
                      visualDensity: VisualDensity.compact,
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(
                        minWidth: 24,
                        minHeight: 24,
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                timeStr,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: AppTheme.inkSoftBy(isDark).withValues(alpha: 0.7),
                  fontSize: 11,
                ),
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
    return DateFormat('yyyy-MM-dd HH:mm').format(t);
  }
}

class _EmptyHint extends StatelessWidget {
  final bool isDark;
  final bool hasFilter;
  const _EmptyHint({required this.isDark, required this.hasFilter});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Text(
          hasFilter ? '没有匹配的记忆' : '还没有记忆\n点击 ＋ 开始',
          textAlign: TextAlign.center,
          style: TextStyle(
            color: AppTheme.inkSoftBy(isDark).withValues(alpha: 0.6),
            height: 1.8,
            letterSpacing: 1.5,
            fontSize: 12,
          ),
        ),
      ),
    );
  }
}