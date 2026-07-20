import 'package:hive/hive.dart';
import 'package:equatable/equatable.dart';

part 'category_model.g.dart';

@HiveType(typeId: 1)
class CategoryModel extends Equatable {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final String color;

  @HiveField(3)
  final DateTime createdAt;

  @HiveField(4)
  final bool isDefault;

  const CategoryModel({
    required this.id,
    required this.name,
    required this.color,
    required this.createdAt,
    this.isDefault = false,
  });

  CategoryModel copyWith({
    String? id,
    String? name,
    String? color,
    DateTime? createdAt,
    bool? isDefault,
  }) {
    return CategoryModel(
      id: id ?? this.id,
      name: name ?? this.name,
      color: color ?? this.color,
      createdAt: createdAt ?? this.createdAt,
      isDefault: isDefault ?? this.isDefault,
    );
  }

  @override
  List<Object?> get props => [
        id,
        name,
        color,
        createdAt,
        isDefault,
      ];
}