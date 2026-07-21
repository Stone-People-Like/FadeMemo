/// 字符记忆状态枚举
/// 强度 strength 范围 0~1，根据阈值划分四种状态：
///   clear       (0.7~1.0)  清晰
///   blurry      (0.4~0.7)  模糊
///   garbled     (0.1~0.4)  错乱
///   disappeared (0.0~0.1)  消失
enum MemoryState {
  clear,
  blurry,
  garbled,
  disappeared;

  /// 状态中文名（用于 UI 文案）
  String get label {
    switch (this) {
      case MemoryState.clear:
        return '清晰';
      case MemoryState.blurry:
        return '模糊';
      case MemoryState.garbled:
        return '错乱';
      case MemoryState.disappeared:
        return '消失';
    }
  }
}