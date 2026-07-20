import 'package:hive/hive.dart';
import 'package:fade_memo/data/models/memo_model.dart';
import 'package:fade_memo/core/constants/constants.dart';
import 'package:fade_memo/core/errors/errors.dart';

class MemoRepository {
  final Box<MemoModel> _memoBox;

  MemoRepository(this._memoBox);

  static Future<MemoRepository> create() async {
    final box = await Hive.openBox<MemoModel>(Constants.hiveMemosBox);
    return MemoRepository(box);
  }

  Future<List<MemoModel>> getAllMemos() async {
    try {
      final memos = _memoBox.values.toList();
      memos.sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
      return memos;
    } catch (e) {
      throw StorageError('获取备忘录失败: $e');
    }
  }

  Future<List<MemoModel>> getMemosByCategory(String categoryId) async {
    try {
      final memos = _memoBox.values
          .where((memo) => memo.categoryId == categoryId)
          .toList();
      memos.sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
      return memos;
    } catch (e) {
      throw StorageError('获取分类备忘录失败: $e');
    }
  }

  Future<MemoModel?> getMemoById(String id) async {
    try {
      return _memoBox.get(id);
    } catch (e) {
      throw StorageError('获取备忘录失败: $e');
    }
  }

  Future<void> addMemo(MemoModel memo) async {
    try {
      await _memoBox.put(memo.id, memo);
    } catch (e) {
      throw StorageError('添加备忘录失败: $e');
    }
  }

  Future<void> updateMemo(MemoModel memo) async {
    try {
      if (!_memoBox.containsKey(memo.id)) {
        throw MemoNotFoundError();
      }
      await _memoBox.put(memo.id, memo.copyWith(updatedAt: DateTime.now()));
    } catch (e) {
      throw StorageError('更新备忘录失败: $e');
    }
  }

  Future<void> deleteMemo(String id) async {
    try {
      if (!_memoBox.containsKey(id)) {
        throw MemoNotFoundError();
      }
      await _memoBox.delete(id);
    } catch (e) {
      throw StorageError('删除备忘录失败: $e');
    }
  }

  Future<void> toggleArchive(String id) async {
    try {
      final memo = _memoBox.get(id);
      if (memo == null) {
        throw MemoNotFoundError();
      }
      await _memoBox.put(id, memo.copyWith(isArchived: !memo.isArchived));
    } catch (e) {
      throw StorageError('归档操作失败: $e');
    }
  }

  Future<List<MemoModel>> searchMemos(String query) async {
    try {
      final memos = _memoBox.values
          .where((memo) =>
              memo.title.toLowerCase().contains(query.toLowerCase()) ||
              memo.content.toLowerCase().contains(query.toLowerCase()))
          .toList();
      memos.sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
      return memos;
    } catch (e) {
      throw StorageError('搜索失败: $e');
    }
  }
}