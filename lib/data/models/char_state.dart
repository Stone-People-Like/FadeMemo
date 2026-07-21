import 'package:hive/hive.dart';

/// 单个字符的记忆状态（最小颗粒度）
///
/// 每个字符独立携带：本体、记忆强度、重要性、创建时间、最近回忆时间。
class CharState {
  /// 字符本体（单个字或符号）
  String char;

  /// 记忆强度 0~1（1=清晰，0=消失）
  double strength;

  /// 重要性 0~1（决定衰减快慢：越高越慢遗忘）
  double importance;

  /// 创建时间戳
  DateTime createTime;

  /// 最后一次「回忆」的时间戳
  DateTime lastRecall;

  CharState({
    required this.char,
    required this.strength,
    required this.importance,
    required this.createTime,
    required this.lastRecall,
  });

  CharState copyWith({
    String? char,
    double? strength,
    double? importance,
    DateTime? createTime,
    DateTime? lastRecall,
  }) {
    return CharState(
      char: char ?? this.char,
      strength: strength ?? this.strength,
      importance: importance ?? this.importance,
      createTime: createTime ?? this.createTime,
      lastRecall: lastRecall ?? this.lastRecall,
    );
  }

  @override
  String toString() =>
      'CharState("$char", s=${strength.toStringAsFixed(2)}, '
      'i=${importance.toStringAsFixed(2)})';
}

/// CharState 的 Hive TypeAdapter（手写版，无需 build_runner）
///
/// 字段编号：
///   0: char (String)
///   1: strength (double)
///   2: importance (double)
///   3: createTime (DateTime, 存为 millis)
///   4: lastRecall (DateTime, 存为 millis)
class CharStateAdapter extends TypeAdapter<CharState> {
  @override
  final int typeId = 1;

  @override
  CharState read(BinaryReader reader) {
    final fieldCount = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < fieldCount; i++) reader.readByte(): reader.read(),
    };
    return CharState(
      char: fields[0] as String,
      strength: fields[1] as double,
      importance: fields[2] as double,
      createTime: DateTime.fromMillisecondsSinceEpoch(fields[3] as int),
      lastRecall: DateTime.fromMillisecondsSinceEpoch(fields[4] as int),
    );
  }

  @override
  void write(BinaryWriter writer, CharState obj) {
    writer
      ..writeByte(5)
      ..writeByte(0)
      ..write(obj.char)
      ..writeByte(1)
      ..write(obj.strength)
      ..writeByte(2)
      ..write(obj.importance)
      ..writeByte(3)
      ..write(obj.createTime.millisecondsSinceEpoch)
      ..writeByte(4)
      ..write(obj.lastRecall.millisecondsSinceEpoch);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CharStateAdapter && other.typeId == typeId;
}