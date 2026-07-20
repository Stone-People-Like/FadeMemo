import 'package:hive/hive.dart';
import 'package:fade_memo/data/models/category_model.dart';
import 'package:fade_memo/core/constants/constants.dart';
import 'package:fade_memo/core/errors/errors.dart';

class CategoryRepository {
  final Box<CategoryModel> _categoryBox;

  CategoryRepository(this._categoryBox);

  static Future<CategoryRepository> create() async {
    final box = await Hive.openBox<CategoryModel>(Constants.hiveCategoriesBox);
    final repo = CategoryRepository(box);
    await repo._initializeDefaultCategory();
    return repo;
  }

  Future<void> _initializeDefaultCategory() async {
    final hasDefault = _categoryBox.values.any((cat) => cat.isDefault);
    if (!hasDefault) {
      final defaultCategory = CategoryModel(
        id: 'default',
        name: Constants.defaultCategory,
        color: '#6366f1',
        createdAt: DateTime.now(),
        isDefault: true,
      );
      await _categoryBox.put('default', defaultCategory);
    }
  }

  Future<List<CategoryModel>> getAllCategories() async {
    try {
      final categories = _categoryBox.values.toList();
      categories.sort((a, b) {
        if (a.isDefault) return -1;
        if (b.isDefault) return 1;
        return a.createdAt.compareTo(b.createdAt);
      });
      return categories;
    } catch (e) {
      throw StorageError('获取分类失败: $e');
    }
  }

  Future<CategoryModel?> getCategoryById(String id) async {
    try {
      return _categoryBox.get(id);
    } catch (e) {
      throw StorageError('获取分类失败: $e');
    }
  }

  Future<void> addCategory(CategoryModel category) async {
    try {
      await _categoryBox.put(category.id, category);
    } catch (e) {
      throw StorageError('添加分类失败: $e');
    }
  }

  Future<void> updateCategory(CategoryModel category) async {
    try {
      if (!_categoryBox.containsKey(category.id)) {
        throw CategoryNotFoundError();
      }
      await _categoryBox.put(category.id, category);
    } catch (e) {
      throw StorageError('更新分类失败: $e');
    }
  }

  Future<void> deleteCategory(String id) async {
    try {
      final category = _categoryBox.get(id);
      if (category == null) {
        throw CategoryNotFoundError();
      }
      if (category.isDefault) {
        throw ValidationError('不能删除默认分类');
      }
      await _categoryBox.delete(id);
    } catch (e) {
      throw StorageError('删除分类失败: $e');
    }
  }

  Future<String> getDefaultCategoryId() async {
    final categories = await getAllCategories();
    final defaultCategory = categories.firstWhere((cat) => cat.isDefault);
    return defaultCategory.id;
  }
}