import 'package:hive/hive.dart';
import 'package:uuid/uuid.dart';

import '../../core/constants/app_constants.dart';
import '../models/char_state_model.dart';
import '../models/memo_model.dart';

/// 笔记仓库（基于 Hive）
///
/// 负责：
///   - 创建 / 读取 / 更新 / 删除 Memo
///   - 从纯文本构造 CharState 列表
///   - 修改全局字符强度（加速失忆 / 重置）
class MemoRepository {
  final Box<Memo> _box;
  final _uuid = const Uuid();

  MemoRepository(this._box);

  /// 获取所有笔记（按更新时间倒序）
  List<Memo> getAll() {
    final list = _box.values.toList();
    list.sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
    return list;
  }

  Memo? getById(String id) => _box.get(id);

  /// 监听 box 变化
  Stream<BoxEvent> watch() => _box.watch();

  /// 用纯文本创建新笔记（每个字符绑定 CharState）
  Future<Memo> create(String text, {String title = '', double? importance}) async {
    final now = DateTime.now();
    final imp = importance ?? AppConstants.defaultImportance;
    final memo = Memo(
      id: _uuid.v4(),
      title: title,
      rawContent: text,
      chars: _buildCharStates(text, imp, now),
      createdAt: now,
      updatedAt: now,
      importance: imp,
    );
    await _box.put(memo.id, memo);
    return memo;
  }

  /// 用新文本覆盖一条笔记的字符状态（保留原有 id、createdAt、importance）
  Future<Memo> updateText(Memo memo, String newText) async {
    final now = DateTime.now();
    final imp = memo.importance;
    final oldChars = memo.chars;

    // 尽量保留原有字符的强度；新增字符使用完整初始强度
    final newChars = <CharState>[];
    final newRunes = newText.runes.toList(growable: false);
    for (int i = 0; i < newRunes.length; i++) {
      final ch = String.fromCharCode(newRunes[i]);
      if (i < oldChars.length) {
        // 复用旧字符：保留 strength 和 lastRecall
        newChars.add(CharState(
          char: ch,
          strength: oldChars[i].strength,
          importance: imp,
          createTime: oldChars[i].createTime,
          lastRecall: oldChars[i].lastRecall,
        ));
      } else {
        // 新增字符：满强度
        newChars.add(CharState(
          char: ch,
          strength: imp,
          importance: imp,
          createTime: now,
          lastRecall: now,
        ));
      }
    }

    final updated = memo.copyWith(
      rawContent: newText,
      chars: newChars,
      updatedAt: now,
    );
    await _box.put(updated.id, updated);
    return updated;
  }

  /// 调整整篇笔记的重要性（所有字符同步）
  Future<Memo> updateImportance(Memo memo, double importance) async {
    final newChars = memo.chars
        .map((c) => c.copyWith(importance: importance))
        .toList(growable: false);
    final updated = memo.copyWith(
      chars: newChars,
      importance: importance,
      updatedAt: DateTime.now(),
    );
    await _box.put(updated.id, updated);
    return updated;
  }

  /// 修改单字符强度（回忆行为）
  Future<Memo> boostChar(Memo memo, int index, double newStrength) async {
    if (index < 0 || index >= memo.chars.length) return memo;
    final now = DateTime.now();
    final newChars = List<CharState>.from(memo.chars);
    newChars[index] = newChars[index].copyWith(
      strength: newStrength,
      lastRecall: now,
    );
    final updated = memo.copyWith(chars: newChars, updatedAt: now);
    await _box.put(updated.id, updated);
    return updated;
  }

  /// 「加速失忆」：所有字符强度乘以系数
  Future<Memo> accelerate(Memo memo) async {
    final newChars = memo.chars
        .map((c) => c.copyWith(
              strength: (c.strength * AppConstants.accelerateFactor).clamp(0.0, 1.0),
            ))
        .toList(growable: false);
    final updated = memo.copyWith(
      chars: newChars,
      updatedAt: DateTime.now(),
    );
    await _box.put(updated.id, updated);
    return updated;
  }

  /// 「重置记忆」：所有字符强度恢复到 importance
  Future<Memo> resetMemory(Memo memo) async {
    final now = DateTime.now();
    final newChars = memo.chars
        .map((c) => c.copyWith(
              strength: c.importance,
              lastRecall: now,
            ))
        .toList(growable: false);
    final updated = memo.copyWith(
      chars: newChars,
      updatedAt: now,
    );
    await _box.put(updated.id, updated);
    return updated;
  }

  Future<void> delete(String id) async {
    await _box.delete(id);
  }

  Future<void> clear() => _box.clear();

  /// 把一段纯文本拆成 CharState 列表
  static List<CharState> _buildCharStates(
    String text,
    double importance,
    DateTime now,
  ) {
    return text.runes
        .map((r) => CharState(
              char: String.fromCharCode(r),
              strength: importance,
              importance: importance,
              createTime: now,
              lastRecall: now,
            ))
        .toList(growable: false);
  }
}