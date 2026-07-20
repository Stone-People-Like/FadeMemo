import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:fade_memo/data/models/memo_model.dart';
import 'package:fade_memo/data/models/category_model.dart';
import 'package:fade_memo/core/utils/date_utils.dart';
import 'package:fade_memo/app/routes.dart';

class MemoListScreen extends StatefulWidget {
  const MemoListScreen({super.key});

  @override
  State<MemoListScreen> createState() => _MemoListScreenState();
}

class _MemoListScreenState extends State<MemoListScreen> {
  late Box<MemoModel> _memoBox;
  late Box<CategoryModel> _categoryBox;
  String _searchQuery = '';
  String? _selectedCategoryId;

  @override
  void initState() {
    super.initState();
    _memoBox = Hive.box<MemoModel>('memos');
    _categoryBox = Hive.box<CategoryModel>('categories');
  }

  List<MemoModel> get filteredMemos {
    var memos = _memoBox.values.where((m) => !m.isArchived).toList();
    
    if (_selectedCategoryId != null && _selectedCategoryId!.isNotEmpty) {
      memos = memos.where((m) => m.categoryId == _selectedCategoryId).toList();
    }
    
    if (_searchQuery.isNotEmpty) {
      memos = memos.where((m) =>
          m.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          m.content.toLowerCase().contains(_searchQuery.toLowerCase())).toList();
    }
    
    memos.sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
    return memos;
  }

  CategoryModel? getCategory(String id) {
    return _categoryBox.get(id);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('FadeMemo'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => Navigator.pushNamed(context, Routes.settings),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              decoration: const InputDecoration(
                hintText: '搜索备忘录...',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.all(Radius.circular(12)),
                ),
              ),
              onChanged: (value) => setState(() => _searchQuery = value),
            ),
          ),
          _buildCategoryFilter(),
          Expanded(
            child: ValueListenableBuilder<Box<MemoModel>>(
              valueListenable: _memoBox.listenable(),
              builder: (context, box, child) {
                final memos = filteredMemos;
                if (memos.isEmpty) {
                  return const Center(
                    child: Text('暂无备忘录'),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: memos.length,
                  itemBuilder: (context, index) => _buildMemoCard(memos[index]),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.pushNamed(context, Routes.memoDetail),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildCategoryFilter() {
    final categories = _categoryBox.values.toList();
    if (categories.isEmpty) return const SizedBox();
    
    return SizedBox(
      height: 48,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: categories.length + 1,
        itemBuilder: (context, index) {
          if (index == 0) {
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: FilterChip(
                label: const Text('全部'),
                selected: _selectedCategoryId == null,
                onSelected: (_) => setState(() => _selectedCategoryId = null),
              ),
            );
          }
          final category = categories[index - 1];
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilterChip(
              label: Text(category.name),
              selectedColor: Color(int.parse(category.color.replaceFirst('#', 'FF'))),
              selected: _selectedCategoryId == category.id,
              onSelected: (_) => setState(() => _selectedCategoryId = category.id),
            ),
          );
        },
      ),
    );
  }

  Widget _buildMemoCard(MemoModel memo) {
    final category = getCategory(memo.categoryId);
    final theme = Theme.of(context);
    
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: InkWell(
        onTap: () => Navigator.pushNamed(
          context,
          Routes.memoDetail,
          arguments: memo.id,
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (category != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: Color(int.parse(category.color.replaceFirst('#', '1A'))),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        category.name,
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(int.parse(category.color.replaceFirst('#', ''))),
                        ),
                      ),
                    ),
                  Text(
                    AppDateUtils.formatRelativeTime(memo.updatedAt),
                    style: theme.textTheme.bodyMedium,
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                memo.title.isNotEmpty ? memo.title : '无标题',
                style: theme.textTheme.titleMedium,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              Text(
                memo.content.isNotEmpty ? memo.content : '无内容',
                style: theme.textTheme.bodyMedium,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}