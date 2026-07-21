import 'dart:math' as math;

import '../constants/app_constants.dart';
import 'memory_state.dart';

/// 遗忘引擎 — 整个 App 的核心算法
///
/// 公式（来自 PRD 3.2）：
///   strength(t) = importance × exp( -λ × (t - createdAt)^β )
///
/// 其中 β 与重要性负相关：
///   - 重要性高 → β 小 → 衰减慢（信息稳固）
///   - 重要性低 → β 大 → 衰减快（容易遗忘）
class ForgettingEngine {
  ForgettingEngine._();

  /// 根据 importance 计算该字符的衰减曲率 β
  ///
  /// 使用 β = 0.5 + (1 - importance) × 1.5
  ///   importance = 1.0 → β = 0.5（衰减最慢）
  ///   importance = 0.0 → β = 2.0（衰减最快）
  static double computeBeta(double importance) {
    final clamped = importance.clamp(0.0, 1.0);
    return 0.5 + (1.0 - clamped) * 1.5;
  }

  /// 给定字符与时间，计算当前记忆强度
  ///
  /// [importance] 字符重要性 0~1
  /// [lambda]     全局遗忘系数（用户滑块调节）
  /// [createdAt]  字符创建时刻
  /// [now]        当前时刻
  static double computeStrength({
    required double importance,
    required double lambda,
    required DateTime createdAt,
    required DateTime now,
  }) {
    final dt = now.difference(createdAt).inMilliseconds / 1000.0;
    if (dt <= 0) return importance;

    final beta = computeBeta(importance);
    final decay = math.exp(-lambda * math.pow(dt, beta));
    final raw = importance * decay;
    return raw.clamp(0.0, 1.0);
  }

  /// 根据强度返回记忆状态
  static MemoryState resolveState(double strength) {
    if (strength >= AppConstants.clearThreshold) return MemoryState.clear;
    if (strength >= AppConstants.blurThreshold) return MemoryState.blurry;
    if (strength >= AppConstants.garbleThreshold) return MemoryState.garbled;
    return MemoryState.disappeared;
  }

  /// 回忆行为：提升单个字符的强度
  ///
  /// [strength] 当前强度
  /// [boost]    增量
  static double applyRecall(double strength, {double? boost}) {
    final b = boost ?? AppConstants.recallBoost;
    return (strength + b).clamp(0.0, 1.0);
  }

  /// 「加速失忆」：所有字符强度乘以系数
  static double applyAccelerate(double strength, {double? factor}) {
    final f = factor ?? AppConstants.accelerateFactor;
    return (strength * f).clamp(0.0, 1.0);
  }

  /// 「重置记忆」：所有字符强度恢复至 importance
  static double applyReset(double strength, double importance) {
    // 重置后取 strength 与 importance 的较大值（避免让原本就很清晰的字符变得模糊）
    return math.max(strength, importance).clamp(0.0, 1.0);
  }
}