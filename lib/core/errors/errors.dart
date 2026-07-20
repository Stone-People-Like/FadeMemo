abstract class AppError implements Exception {
  final String message;

  const AppError(this.message);

  @override
  String toString() => message;
}

class MemoNotFoundError extends AppError {
  const MemoNotFoundError() : super('备忘录不存在');
}

class CategoryNotFoundError extends AppError {
  const CategoryNotFoundError() : super('分类不存在');
}

class StorageError extends AppError {
  const StorageError(String message) : super(message);
}

class ValidationError extends AppError {
  const ValidationError(String message) : super(message);
}