import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:uuid/uuid.dart';
import 'package:fade_memo/data/models/memo_model.dart';
import 'package:fade_memo/data/models/category_model.dart';
import 'package:fade_memo/core/utils/date_utils.dart';
import 'package:fade_memo/core/constants/constants.dart';

class MemoDetailScreen extends StatefulWidget {
  const MemoDetailScreen({super.key});

  @override
  State<MemoDetailScreen> createState() => _MemoDetailScreenState();
}

class _MemoDetailScreenState extends State<MemoDetailScreen> {
  late Box<MemoModel> _memoBox;
  late Box<CategoryModel> _categoryBox;
  MemoModel? _memo;
  final _titleController = TextEditingController();
  final _contentController = TextEditingController();
  String? _selectedCategoryId;

  @override
  void initState() {
    super.initState();
    _memoBox = Hive.box<MemoModel>('memos');
    _categoryBox = Hive.box<CategoryModel>('categories');
    _selectedCategoryId = _categoryBox.values.firstWhere((c) => c.isDefault).id;
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments as String?;
    if (args != null) {
      _memo = _memoBox.get(args);
      if (_memo != null) {
        _titleController.text = _memo!.title;
        _contentController.text = _memo!.content;
        _selectedCategoryId = _memo!.categoryId;
      }
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _contentController.dispose();
    super.dispose();
  }

  Future<void> _saveMemo() async {
    final title = _titleController.text.trim();
    final content = _contentController.text.trim();
    final categoryId = _selectedCategoryId ?? _categoryBox.values.firstWhere((c) => c.isDefault).id;

    if (_memo != null) {
      final updatedMemo = _memo!.copyWith(
        title: title,
        content: content,
        categoryId: categoryId,
        updatedAt: DateTime.now(),
      );
      await _memoBox.put(_memo!.id, updatedMemo);
    } else {
      final newMemo = MemoModel(
        id: const Uuid().v4(),
        title: title,
        content: content,
        categoryId: categoryId,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      await _memoBox.put(newMemo.id, newMemo);
    }

    if (mounted) {
      Navigator.pop(context);
    }
  }

  Future<void> _deleteMemo() async {
    if (_memo != null) {
      await _memoBox.delete(_memo!.id);
      if (mounted) {
        Navigator.pop(context);
      }
    }
  }

  Future<void> _showDeleteDialog() async {
    if (_memo != null) {
      await showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('删除备忘录'),
          content: const Text('确定要删除这个备忘录吗？'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('取消'),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                _deleteMemo();
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
    final categories = _categoryBox.values.toList();
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(_memo != null ? '编辑备忘录' : '新建备忘录'),
        actions: [
          if (_memo != null)
            IconButton(
              icon: const Icon(Icons.delete),
              onPressed: _showDeleteDialog,
            ),
          IconButton(
            icon: const Icon(Icons.save),
            onPressed: _saveMemo,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            DropdownButtonFormField<String>(
              value: _selectedCategoryId,
              items: categories.map((category) {
                return DropdownMenuItem(
                  value: category.id,
                  child: Row(
                    children: [
                      Container(
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          color: Color(int.parse(category.color.replaceFirst('#', ''))),
                          borderRadius: BorderRadius.circular(6),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(category.name),
                    ],
                  ),
                );
              }).toList(),
              onChanged: (value) => setState(() => _selectedCategoryId = value),
              decoration: const InputDecoration(
                labelText: '分类',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: '标题',
                border: OutlineInputBorder(),
              ),
              maxLength: Constants.maxMemoTitleLength,
              style: theme.textTheme.titleMedium,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _contentController,
              decoration: const InputDecoration(
                labelText: '内容',
                border: OutlineInputBorder(),
                alignLabelWithHint: true,
              ),
              maxLines: null,
              maxLength: Constants.maxMemoContentLength,
              keyboardType: TextInputType.multiline,
              style: theme.textTheme.bodyLarge,
            ),
            if (_memo != null)
              Padding(
                padding: const EdgeInsets.only(top: 16),
                child: Text(
                  '创建于 ${AppDateUtils.formatDateTime(_memo!.createdAt)}',
                  style: theme.textTheme.bodyMedium,
                ),
              ),
          ],
        ),
      ),
    );
  }
}