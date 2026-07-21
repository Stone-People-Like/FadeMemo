import 'package:hive/hive.dart';

import 'char_state_model.dart';

/// 一条笔记
///
/// 每条笔记保存为独立 Hive 对象，按 id 索引。
/// 字符状态以 List<CharState> 存储，逐字携带遗忘信息。
class Memo {
  /// 唯一 ID
  String id;

  /// 标题（用于列表展示、可选）
  String title;

  /// 原始文本（不可变快照，便于重建 / 重新分词）
  String rawContent;

  /// 逐字符状态（与 rawContent 一一对应）
  List<CharState> chars;

  /// 创建时间
  DateTime createdAt;

  /// 更新时间
  DateTime updatedAt;

  /// 该笔记的全局重要性（所有字符默认此值，可在编辑时调整）
  double importance;

  Memo({
    required this.id,
    this.title = '',
    required this.rawContent,
    required this.chars,
    required this.createdAt,
    required this.updatedAt,
    this.importance = 0.85,
  });

  /// 当前纯文本（基于 charStates 拼接，仅作为回退）
  String get content => chars.map((c) => c.char).join();

  Memo copyWith({
    String? id,
    String? title,
    String? rawContent,
    List<CharState>? chars,
    DateTime? createdAt,
    DateTime? updatedAt,
    double? importance,
  }) {
    return Memo(
      id: id ?? this.id,
      title: title ?? this.title,
      rawContent: rawContent ?? this.rawContent,
      chars: chars ?? this.chars,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      importance: importance ?? this.importance,
    );
  }
}

/// Memo 的 Hive TypeAdapter
///
/// 字段编号：
///   0: id (String)
///   1: title (String)
///   2: rawContent (String)
///   3: chars (List<CharState>)
///   4: createdAt (int millis)
///   5: updatedAt (int millis)
///   6: importance (double)
class MemoAdapter extends TypeAdapter<Memo> {
  @override
  final int typeId = 2;

  @override
  Memo read(BinaryReader reader) {
    final fieldCount = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < fieldCount; i++) reader.readByte(): reader.read(),
    };
    return Memo(
      id: fields[0] as String,
      title: (fields[1] as String?) ?? '',
      rawContent: fields[2] as String,
      chars: (fields[3] as List).cast<CharState>(),
      createdAt: DateTime.fromMillisecondsSinceEpoch(fields[4] as int),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(fields[5] as int),
      importance: (fields[6] as double?) ?? 0.85,
    );
  }

  @override
  void write(BinaryWriter writer, Memo obj) {
    writer
      ..writeByte(7)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.title)
      ..writeByte(2)
      ..write(obj.rawContent)
      ..writeByte(3)
      ..write(obj.chars)
      ..writeByte(4)
      ..write(obj.createdAt.millisecondsSinceEpoch)
      ..writeByte(5)
      ..write(obj.updatedAt.millisecondsSinceEpoch)
      ..writeByte(6)
      ..write(obj.importance);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is MemoAdapter && other.typeId == typeId;
}