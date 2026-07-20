import 'package:hive/hive.dart';
import 'package:equatable/equatable.dart';

part 'memo_model.g.dart';

@HiveType(typeId: 0)
class MemoModel extends Equatable {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String title;

  @HiveField(2)
  final String content;

  @HiveField(3)
  final String categoryId;

  @HiveField(4)
  final DateTime createdAt;

  @HiveField(5)
  final DateTime updatedAt;

  @HiveField(6)
  final bool isArchived;

  const MemoModel({
    required this.id,
    required this.title,
    required this.content,
    required this.categoryId,
    required this.createdAt,
    required this.updatedAt,
    this.isArchived = false,
  });

  MemoModel copyWith({
    String? id,
    String? title,
    String? content,
    String? categoryId,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isArchived,
  }) {
    return MemoModel(
      id: id ?? this.id,
      title: title ?? this.title,
      content: content ?? this.content,
      categoryId: categoryId ?? this.categoryId,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isArchived: isArchived ?? this.isArchived,
    );
  }

  @override
  List<Object?> get props => [
        id,
        title,
        content,
        categoryId,
        createdAt,
        updatedAt,
        isArchived,
      ];
}