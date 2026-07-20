import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:fade_memo/core/constants/constants.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late Box _settingsBox;
  ThemeMode _themeMode = ThemeMode.system;

  @override
  void initState() {
    super.initState();
    _settingsBox = Hive.box('settings');
    final mode = _settingsBox.get('themeMode', defaultValue: 'system');
    _themeMode = _parseThemeMode(mode);
  }

  ThemeMode _parseThemeMode(String mode) {
    switch (mode) {
      case 'light':
        return ThemeMode.light;
      case 'dark':
        return ThemeMode.dark;
      default:
        return ThemeMode.system;
    }
  }

  String _themeModeToString(ThemeMode mode) {
    switch (mode) {
      case ThemeMode.light:
        return 'light';
      case ThemeMode.dark:
        return 'dark';
      default:
        return 'system';
    }
  }

  Future<void> _updateThemeMode(ThemeMode mode) async {
    setState(() => _themeMode = mode);
    await _settingsBox.put('themeMode', _themeModeToString(mode));
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('设置已保存')),
      );
    }
  }

  Future<void> _clearAllData() async {
    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('清除所有数据'),
        content: const Text('确定要清除所有备忘录和分类吗？此操作不可恢复。'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              await Hive.box('memos').clear();
              await Hive.box('categories').clear();
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('数据已清除')),
                );
              }
            },
            child: const Text('清除'),
          ),
        ],
      ),
    );
  }

  Future<void> _launchUrl(String url) async {
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('设置'),
      ),
      body: ListView(
        children: [
          ListTile(
            title: const Text('主题模式'),
            subtitle: Text(
              _themeMode == ThemeMode.system
                  ? '跟随系统'
                  : _themeMode == ThemeMode.light
                      ? '浅色模式'
                      : '深色模式',
            ),
            trailing: PopupMenuButton<ThemeMode>(
              initialValue: _themeMode,
              onSelected: _updateThemeMode,
              itemBuilder: (context) => const [
                PopupMenuItem(
                  value: ThemeMode.system,
                  child: Text('跟随系统'),
                ),
                PopupMenuItem(
                  value: ThemeMode.light,
                  child: Text('浅色模式'),
                ),
                PopupMenuItem(
                  value: ThemeMode.dark,
                  child: Text('深色模式'),
                ),
              ],
            ),
          ),
          const Divider(),
          ListTile(
            title: const Text('分类管理'),
            leading: const Icon(Icons.folder),
            onTap: () => Navigator.pushNamed(context, '/categories'),
          ),
          const Divider(),
          ListTile(
            title: const Text('关于'),
            subtitle: Text('版本 ${Constants.appVersion}'),
            leading: const Icon(Icons.info),
            onTap: () => showAboutDialog(
              context: context,
              applicationName: Constants.appName,
              applicationVersion: Constants.appVersion,
              applicationIcon: const Icon(Icons.sticky_note_2),
            ),
          ),
          ListTile(
            title: const Text('开源协议'),
            leading: const Icon(Icons.file_open),
            onTap: () => _launchUrl('https://opensource.org/licenses/MIT'),
          ),
          const Divider(),
          ListTile(
            title: const Text('清除所有数据'),
            leading: const Icon(Icons.delete_forever),
            textColor: theme.colorScheme.error,
            onTap: _clearAllData,
          ),
        ],
      ),
    );
  }
}