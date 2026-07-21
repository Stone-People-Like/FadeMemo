import 'package:flutter/material.dart';

/// 桌面端原生菜单栏
///
/// Windows / macOS / Linux 都会渲染为平台原生菜单。
/// 手机端不会显示（MenuBar 在 mobile 上是 noop）。
class DesktopMenuBar extends StatelessWidget {
  final VoidCallback onNew;
  final VoidCallback onRecall;
  final VoidCallback onForget;
  final VoidCallback onReset;
  final VoidCallback onToggleTheme;
  final VoidCallback onToggleAnimation;

  const DesktopMenuBar({
    super.key,
    required this.onNew,
    required this.onRecall,
    required this.onForget,
    required this.onReset,
    required this.onToggleTheme,
    required this.onToggleAnimation,
  });

  @override
  Widget build(BuildContext context) {
    return MenuBar(
      style: MenuStyle(
        backgroundColor: WidgetStatePropertyAll(
          Theme.of(context).colorScheme.surface,
        ),
        elevation: const WidgetStatePropertyAll(0),
      ),
      children: [
        SubmenuButton(
          menuChildren: [
            MenuItemButton(
              onPressed: onNew,
              leadingIcon: const Icon(Icons.add_rounded, size: 18),
              child: const Text('新建记忆'),
            ),
            const MenuItemButton(
              onPressed: null,
              child: Text('打开最近'),
            ),
            const Divider(),
            MenuItemButton(
              onPressed: () {},
              leadingIcon: const Icon(Icons.save_outlined, size: 18),
              child: const Text('导出为 JSON'),
            ),
            const Divider(),
            const MenuItemButton(
              onPressed: null,
              child: Text('退出'),
            ),
          ],
          child: const Text('文件'),
        ),
        SubmenuButton(
          menuChildren: [
            MenuItemButton(
              onPressed: onRecall,
              leadingIcon: const Icon(Icons.auto_awesome_outlined, size: 18),
              child: const Text('全员回忆'),
            ),
            MenuItemButton(
              onPressed: onForget,
              leadingIcon: const Icon(Icons.hourglass_bottom_rounded, size: 18),
              child: const Text('加速失忆'),
            ),
            MenuItemButton(
              onPressed: onReset,
              leadingIcon: const Icon(Icons.restart_alt_rounded, size: 18),
              child: const Text('重置记忆'),
            ),
          ],
          child: const Text('记忆'),
        ),
        SubmenuButton(
          menuChildren: [
            MenuItemButton(
              onPressed: onToggleTheme,
              leadingIcon: const Icon(Icons.color_lens_outlined, size: 18),
              child: const Text('切换主题'),
            ),
            MenuItemButton(
              onPressed: onToggleAnimation,
              leadingIcon: const Icon(Icons.animation_outlined, size: 18),
              child: const Text('切换动效'),
            ),
          ],
          child: const Text('视图'),
        ),
        const SubmenuButton(
          menuChildren: [
            MenuItemButton(
              onPressed: null,
              child: Text('使用文档'),
            ),
            MenuItemButton(
              onPressed: null,
              child: Text('关于 FadeMemo'),
            ),
          ],
          child: Text('帮助'),
        ),
      ],
    );
  }
}