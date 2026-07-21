// FadeMemo 单元测试
//
// 覆盖遗忘算法、单字符模型、笔记仓库的核心行为。
import 'package:flutter_test/flutter_test.dart';

import 'package:fade_memo/core/forgetting/forgetting_engine.dart';
import 'package:fade_memo/core/forgetting/memory_state.dart';
import 'package:fade_memo/data/models/char_state_model.dart';
import 'package:fade_memo/data/models/memo_model.dart';

void main() {
  group('ForgettingEngine', () {
    test('初始时刻 (t=0) 强度等于 importance', () {
      final now = DateTime(2024, 1, 1);
      final s = ForgettingEngine.computeStrength(
        importance: 0.8,
        lambda: 0.0001,
        createdAt: now,
        now: now,
      );
      expect(s, closeTo(0.8, 1e-6));
    });

    test('强度随时间单调下降', () {
      final t0 = DateTime(2024, 1, 1);
      final s0 = ForgettingEngine.computeStrength(
        importance: 0.8,
        lambda: 0.0001,
        createdAt: t0,
        now: t0,
      );
      final s1 = ForgettingEngine.computeStrength(
        importance: 0.8,
        lambda: 0.0001,
        createdAt: t0,
        now: t0.add(const Duration(hours: 1)),
      );
      final s2 = ForgettingEngine.computeStrength(
        importance: 0.8,
        lambda: 0.0001,
        createdAt: t0,
        now: t0.add(const Duration(days: 1)),
      );
      expect(s1, lessThan(s0));
      expect(s2, lessThan(s1));
    });

    test('状态划分符合阈值', () {
      expect(ForgettingEngine.resolveState(0.95), MemoryState.clear);
      expect(ForgettingEngine.resolveState(0.7), MemoryState.clear);
      expect(ForgettingEngine.resolveState(0.5), MemoryState.blurry);
      expect(ForgettingEngine.resolveState(0.2), MemoryState.garbled);
      expect(ForgettingEngine.resolveState(0.05), MemoryState.disappeared);
    });

    test('回忆行为提升强度且不超过 1', () {
      expect(ForgettingEngine.applyRecall(0.5), closeTo(0.65, 1e-6));
      expect(ForgettingEngine.applyRecall(0.95), 1.0);
    });

    test('加速失忆按比例衰减', () {
      expect(ForgettingEngine.applyAccelerate(0.8), closeTo(0.4, 1e-6));
    });

    test('重置恢复到 importance', () {
      expect(ForgettingEngine.applyReset(0.2, 0.85), closeTo(0.85, 1e-6));
    });

    test('β 与 importance 负相关', () {
      expect(ForgettingEngine.computeBeta(1.0), closeTo(0.5, 1e-6));
      expect(ForgettingEngine.computeBeta(0.0), closeTo(2.0, 1e-6));
      expect(
        ForgettingEngine.computeBeta(0.5),
        closeTo(1.25, 1e-6),
      );
    });

    test('重要性低的字符衰减更快', () {
      final t0 = DateTime(2024, 1, 1);
      final later = t0.add(const Duration(hours: 2));
      final sHigh = ForgettingEngine.computeStrength(
        importance: 1.0,
        lambda: 0.0001,
        createdAt: t0,
        now: later,
      );
      final sLow = ForgettingEngine.computeStrength(
        importance: 0.3,
        lambda: 0.0001,
        createdAt: t0,
        now: later,
      );
      expect(sHigh, greaterThan(sLow));
    });
  });

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