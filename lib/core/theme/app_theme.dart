import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// 主题
///
/// 调性：极简、安静、文艺、低饱和度
/// 浅色：奶白底 + 墨灰文字 + 一点藕粉 / 雾紫
/// 深色：墨青底 + 米白文字 + 一点幽蓝
class AppTheme {
  AppTheme._();

  // ============== 配色 ==============
  // 浅色
  static const Color _lightBg = Color(0xFFFBF8F3); // 奶白
  static const Color _lightSurface = Color(0xFFFFFFFF);
  static const Color _lightInk = Color(0xFF2C2A26); // 墨
  static const Color _lightInkSoft = Color(0xFF6B6660); // 淡墨
  static const Color _lightAccent = Color(0xFF7C6F8E); // 雾紫
  static const Color _lightDivider = Color(0x14000000);

  // 深色
  static const Color _darkBg = Color(0xFF14171C); // 墨青
  static const Color _darkSurface = Color(0xFF1B2027);
  static const Color _darkInk = Color(0xFFE8E2D5); // 米白
  static const Color _darkInkSoft = Color(0xFF9A9385); // 米灰
  static const Color _darkAccent = Color(0xFFA6B4D0); // 幽蓝
  static const Color _darkDivider = Color(0x22FFFFFF);

  // 暴露给组件用
  static Color ink(Brightness b) =>
      b == Brightness.dark ? _darkInk : _lightInk;
  static Color inkSoft(Brightness b) =>
      b == Brightness.dark ? _darkInkSoft : _lightInkSoft;
  static Color accent(Brightness b) =>
      b == Brightness.dark ? _darkAccent : _lightAccent;
  static Color divider(Brightness b) =>
      b == Brightness.dark ? _darkDivider : _lightDivider;

  // bool 重载（多数 UI 组件更习惯用 isDark 布尔值）
  static Color inkBy(bool isDark) => isDark ? _darkInk : _lightInk;
  static Color inkSoftBy(bool isDark) => isDark ? _darkInkSoft : _lightInkSoft;
  static Color accentBy(bool isDark) => isDark ? _darkAccent : _lightAccent;
  static Color dividerBy(bool isDark) => isDark ? _darkDivider : _lightDivider;

  /// 公共 TextTheme 工厂
  static TextTheme _buildTextTheme(Color ink, Color inkSoft) {
    // 中文用 Noto Serif SC（衬线，文艺），英文用 Inter
    final base = GoogleFonts.notoSerifScTextTheme().apply(
      bodyColor: ink,
      displayColor: ink,
    );
    return base.copyWith(
      bodyLarge: base.bodyLarge?.copyWith(fontSize: 17, height: 1.7),
      bodyMedium: base.bodyMedium?.copyWith(
        fontSize: 15,
        color: inkSoft,
        height: 1.6,
      ),
      titleLarge: base.titleLarge?.copyWith(
        fontSize: 22,
        fontWeight: FontWeight.w500,
        letterSpacing: 1.2,
      ),
      labelSmall: base.labelSmall?.copyWith(
        color: inkSoft,
        letterSpacing: 1.5,
      ),
    );
  }

  static ThemeData get lightTheme => _build(
        brightness: Brightness.light,
        bg: _lightBg,
        surface: _lightSurface,
        ink: _lightInk,
        inkSoft: _lightInkSoft,
        accent: _lightAccent,
        divider: _lightDivider,
      );

  static ThemeData get darkTheme => _build(
        brightness: Brightness.dark,
        bg: _darkBg,
        surface: _darkSurface,
        ink: _darkInk,
        inkSoft: _darkInkSoft,
        accent: _darkAccent,
        divider: _darkDivider,
      );

  static ThemeData _build({
    required Brightness brightness,
    required Color bg,
    required Color surface,
    required Color ink,
    required Color inkSoft,
    required Color accent,
    required Color divider,
  }) {
    final colorScheme = ColorScheme(
      brightness: brightness,
      primary: accent,
      onPrimary: brightness == Brightness.dark ? _darkBg : _lightBg,
      secondary: accent,
      onSecondary: brightness == Brightness.dark ? _darkBg : _lightBg,
      surface: surface,
      onSurface: ink,
      error: const Color(0xFFB5575C),
      onError: Colors.white,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: bg,
      canvasColor: bg,
      dividerColor: divider,
      textTheme: _buildTextTheme(ink, inkSoft),
      appBarTheme: AppBarTheme(
        backgroundColor: bg,
        foregroundColor: ink,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.notoSerifSc(
          fontSize: 18,
          fontWeight: FontWeight.w500,
          color: ink,
          letterSpacing: 2.5,
        ),
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: divider, width: 0.6),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surface,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        hintStyle: TextStyle(color: inkSoft.withValues(alpha: 0.7)),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: divider),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: divider),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: accent, width: 1.2),
        ),
      ),
      sliderTheme: SliderThemeData(
        activeTrackColor: accent,
        inactiveTrackColor: divider,
        thumbColor: accent,
        overlayColor: accent.withValues(alpha: 0.12),
        trackHeight: 2.5,
      ),
      iconTheme: IconThemeData(color: inkSoft, size: 20),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: accent,
        foregroundColor: brightness == Brightness.dark ? _darkBg : _lightBg,
        elevation: 1,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: accent,
          foregroundColor: brightness == Brightness.dark ? _darkBg : _lightBg,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          textStyle: GoogleFonts.notoSerifSc(
            fontSize: 14,
            letterSpacing: 1.2,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: ink,
          side: BorderSide(color: divider),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: inkSoft,
        ),
      ),
    );
  }
}