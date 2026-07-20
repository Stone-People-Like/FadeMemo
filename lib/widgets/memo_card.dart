import 'package:flutter/material.dart';
import 'package:fade_memo/data/models/memo_model.dart';
import 'package:fade_memo/data/models/category_model.dart';
import 'package:fade_memo/core/utils/date_utils.dart';

class MemoCard extends StatelessWidget {
  final MemoModel memo;
  final CategoryModel? category;
  final VoidCallback onTap;
  final VoidCallback? onLongPress;

  const MemoCard({
    super.key,
    required this.memo,
    this.category,
    required this.onTap,
    this.onLongPress,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: InkWell(
        onTap: onTap,
        onLongPress: onLongPress,
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
                        color: Color(int.parse(category!.color.replaceFirst('#', '1A'))),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        category!.name,
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(int.parse(category!.color.replaceFirst('#', ''))),
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