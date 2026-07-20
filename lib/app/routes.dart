import 'package:flutter/widgets.dart';
import 'package:fade_memo/features/memos/screens/memo_list_screen.dart';
import 'package:fade_memo/features/memos/screens/memo_detail_screen.dart';
import 'package:fade_memo/features/categories/screens/category_screen.dart';
import 'package:fade_memo/features/settings/screens/settings_screen.dart';

class Routes {
  static const String home = '/';
  static const String memoDetail = '/memo-detail';
  static const String categories = '/categories';
  static const String settings = '/settings';

  static Map<String, WidgetBuilder> routes = {
    home: (context) => const MemoListScreen(),
    memoDetail: (context) => const MemoDetailScreen(),
    categories: (context) => const CategoryScreen(),
    settings: (context) => const SettingsScreen(),
  };
}