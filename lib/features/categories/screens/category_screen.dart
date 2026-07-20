import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:uuid/uuid.dart';
import 'package:fade_memo/data/models/category_model.dart';

class CategoryScreen extends StatefulWidget {
  const CategoryScreen({super.key});

  @override
  State<CategoryScreen> createState() => _CategoryScreenState();
}

class _CategoryScreenState extends State<CategoryScreen> {
  late Box<CategoryModel> _categoryBox;
  final _nameController = TextEditingController();
  String _selectedColor = '#6366f1';

  final List<String> _availableColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#06b6d4', '#3b82f6', '#64748b', '#9ca3af',
  ];

  @override
  void initState() {
    super.initState();
    _categoryBox = Hive.box<CategoryModel>('categories');
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _addCategory() async {
    final name = _nameController.text.trim();
    if (name.isEmpty) return;

    final newCategory = CategoryModel(
      id: const Uuid().v4(),
      name: name,
      color: _selectedColor,
      createdAt: DateTime.now(),
    );

    await _categoryBox.put(newCategory.id, newCategory);
    _nameController.clear();
    _selectedColor = '#6366f1';

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('分类已添加')),
      );
    }
  }

  Future<void> _deleteCategory(String id) async {
    final category = _categoryBox.get(id);
    if (category != null && !category.isDefault) {
      await showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('删除分类'),
          content: const Text('确定要删除这个分类吗？'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('取消'),
            ),
            TextButton(
              onPressed: () async {
                Navigator.pop(context);
                await _categoryBox.delete(id);
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('分类已删除')),
                  );
                }
              },
              child: const Text('删除'),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('分类管理'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    TextField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        labelText: '分类名称',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text('选择颜色'),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: _availableColors.map((color) {
                        final isSelected = _selectedColor == color;
                        return GestureDetector(
                          onTap: () => setState(() => _selectedColor = color),
                          child: Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: Color(int.parse(color.replaceFirst('#', ''))),
                              borderRadius: BorderRadius.circular(8),
                              border: isSelected
                                  ? Border.all(color: Colors.blue, width: 3)
                                  : null,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _addCategory,
                        child: const Text('添加分类'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Expanded(
            child: ValueListenableBuilder<Box<CategoryModel>>(
              valueListenable: _categoryBox.listenable(),
              builder: (context, box, child) {
                final categories = box.values.toList();
                if (categories.isEmpty) {
                  return const Center(child: Text('暂无分类'));
                }
                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: categories.length,
                  itemBuilder: (context, index) {
                    final category = categories[index];
                    return ListTile(
                      leading: Container(
                        width: 16,
                        height: 16,
                        decoration: BoxDecoration(
                          color: Color(int.parse(category.color.replaceFirst('#', ''))),
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      title: Text(category.name),
                      subtitle: category.isDefault
                          ? const Text('默认分类')
                          : null,
                      trailing: !category.isDefault
                          ? IconButton(
                              icon: const Icon(Icons.delete),
                              onPressed: () => _deleteCategory(category.id),
                            )
                          : null,
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}