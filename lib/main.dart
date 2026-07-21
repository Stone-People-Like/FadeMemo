import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:provider/provider.dart';

import 'app/app.dart';
import 'core/constants/app_constants.dart';
import 'data/models/char_state.dart';
import 'data/models/memo.dart';
import 'data/models/app_settings.dart';
import 'data/repositories/memo_repository.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 仅竖屏（手机端体验优先；桌面端自动允许）
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);

  // ============== 初始化 Hive ==============
  await Hive.initFlutter();
  if (!Hive.isAdapterRegistered(1)) {
    Hive.registerAdapter(CharStateAdapter());
  }
  if (!Hive.isAdapterRegistered(2)) {
    Hive.registerAdapter(MemoAdapter());
  }
  final memosBox = await Hive.openBox<Memo>(AppConstants.memosBox);

  // ============== 初始化 SharedPreferences ==============
  final settingsRepo = SettingsRepository();
  await settingsRepo.init();

  // ============== 装配 ==============
  final memoRepo = MemoRepository(memosBox);
  final settingsModel = AppSettingsModel(settingsRepo);

  runApp(
    MultiProvider(
      providers: [
        Provider<MemoRepository>.value(value: memoRepo),
        ChangeNotifierProvider<AppSettingsModel>.value(value: settingsModel),
      ],
      child: const FadeMemoApp(),
    ),
  );
}