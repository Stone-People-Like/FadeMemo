import 'package:fade_memo/core/errors/errors.dart';
import 'package:fade_memo/core/constants/constants.dart';

class ValidationUtils {
  static void validateMemoTitle(String title) {
    if (title.length > Constants.maxMemoTitleLength) {
      throw ValidationError('标题长度不能超过${Constants.maxMemoTitleLength}个字符');
    }
  }

  static void validateMemoContent(String content) {
    if (content.length > Constants.maxMemoContentLength) {
      throw ValidationError('内容长度不能超过${Constants.maxMemoContentLength}个字符');
    }
  }

  static void validateCategoryName(String name) {
    if (name.isEmpty) {
      throw ValidationError('分类名称不能为空');
    }
    if (name.length > 50) {
      throw ValidationError('分类名称长度不能超过50个字符');
    }
  }

  static bool isValidHexColor(String color) {
    final regex = RegExp(r'^#[0-9A-Fa-f]{6}$');
    return regex.hasMatch(color);
  }
}