import 'package:flutter/material.dart';
import 'package:fade_memo/data/models/category_model.dart';

class CategoryChip extends StatelessWidget {
  final CategoryModel category;
  final bool selected;
  final VoidCallback? onPressed;

  const CategoryChip({
    super.key,
    required this.category,
    this.selected = false,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    final color = Color(int.parse(category.color.replaceFirst('#', '')));
    final selectedColor = Color(int.parse(category.color.replaceFirst('#', 'FF')));

    return FilterChip(
      label: Text(category.name),
      selectedColor: selectedColor.withOpacity(0.1),
      labelStyle: TextStyle(
        color: selected ? color : Theme.of(context).textTheme.bodyMedium?.color,
      ),
      side: BorderSide(
        color: selected ? color : Colors.transparent,
      ),
      selected: selected,
      onSelected: (_) => onPressed?.call(),
    );
  }
}