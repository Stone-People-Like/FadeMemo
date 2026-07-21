// Memo 单元测试
//
// 覆盖 Memo.content 从 chars 拼接的回退行为。
import 'package:flutter_test/flutter_test.dart';

import 'package:fade_memo/data/models/char_state.dart';
import 'package:fade_memo/data/models/memo.dart';

void main() {
  group('Memo', () {
    test('content 自动从 chars 拼接', () {
      final now = DateTime(2024, 1, 1);
      final memo = Memo(
        id: 'test',
        rawContent: 'hi',
        chars: [
          CharState(
            char: 'h',
            strength: 0.9,
            importance: 0.85,
            createTime: now,
            lastRecall: now,
          ),
          CharState(
            char: 'i',
            strength: 0.9,
            importance: 0.85,
            createTime: now,
            lastRecall: now,
          ),
        ],
        createdAt: now,
        updatedAt: now,
      );
      expect(memo.content, 'hi');
    });
  });
}