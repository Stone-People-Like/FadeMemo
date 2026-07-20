import 'package:flutter/material.dart';
import 'package:fade_memo/core/theme/app_theme.dart';
import 'package:fade_memo/app/routes.dart';

class FadeMemoApp extends StatelessWidget {
  const FadeMemoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FadeMemo',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      initialRoute: Routes.home,
      routes: Routes.routes,
      debugShowCheckedModeBanner: false,
    );
  }
}