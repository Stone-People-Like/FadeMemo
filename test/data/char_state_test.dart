// CharState 单元测试
//
// 覆盖最小数据单元的 copyWith 行为。
import 'package:flutter_test/flutter_test.dart';

import 'package:fade_memo/data/models/char_state.dart';

void main() {
  group('CharState', () {
    test('copyWith 仅修改指定字段', () {
      final now = DateTime(2024, 1, 1);
      final c = CharState(
        char: '我',
        strength: 0.8,
        importance: 0.85,
        createTime: now,
        lastRecall: now,
      );
      final c2 = c.copyWith(strength: 0.5);
      expect(c2.char, '我');
      expect(c2.strength, 0.5);
      expect(c2.importance, 0.85);
    });
  });
}