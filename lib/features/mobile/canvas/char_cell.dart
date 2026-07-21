import 'dart:async';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

import '../../../core/constants/app_constants.dart';
import '../../../core/forgetting/forgetting_engine.dart';
import '../../../core/forgetting/memory_state.dart';
import '../../../core/utils/garbled_glyphs.dart';
import '../../../data/models/char_state.dart';

/// 单字符渲染单元
///
/// 根据 [CharState.strength] 与 [lambda] 实时计算当前强度，
/// 切换四种视觉退化态：clear / blurry / garbled / disappeared。
/// 渲染时附带动效：
///   - clear: 轻微呼吸
///   - blurry: 高斯模糊 + 微小抖动
///   - garbled: 字符替换 + RGB 偏移
///   - disappeared: 透明占位
class CharCell extends StatefulWidget {
  final CharState charState;
  final double lambda;
  final double fontSize;
  final Color ink;
  final Color inkSoft;
  final VoidCallback? onRecall;

  /// 动画开关。关掉后保持静态视觉（无呼吸/抖/跳变），
  /// 但四种状态的基本样式仍生效。
  final bool animationEnabled;

  const CharCell({
    super.key,
    required this.charState,
    required this.lambda,
    required this.fontSize,
    required this.ink,
    required this.inkSoft,
    this.onRecall,
    this.animationEnabled = true,
  });

  @override
  State<CharCell> createState() => _CharCellState();
}

class _CharCellState extends State<CharCell>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  Timer? _hoverTimer;
  bool _isHovering = false;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: AppConstants.breathingDurationMs),
    );
    if (widget.animationEnabled) {
      _ctrl.repeat();
    } else {
      _ctrl.value = 0.5; // 静态中位
    }
  }

  @override
  void didUpdateWidget(covariant CharCell old) {
    super.didUpdateWidget(old);
    if (widget.animationEnabled != old.animationEnabled) {
      if (widget.animationEnabled) {
        _ctrl.repeat();
      } else {
        _ctrl.stop();
        _ctrl.value = 0.5;
      }
    }
  }

  @override
  void dispose() {
    _ctrl.dispose();
    _hoverTimer?.cancel();
    super.dispose();
  }

  void _onEnter(PointerEnterEvent _) {
    if (widget.onRecall == null) return;
    if (_isHovering) return;
    _isHovering = true;
    // 60ms 节流一次擦亮（连续 hover → 平滑擦亮）
    _hoverTimer?.cancel();
    _hoverTimer = Timer.periodic(
      const Duration(milliseconds: 60),
      (_) {
        if (!_isHovering) {
          _hoverTimer?.cancel();
          return;
        }
        widget.onRecall?.call();
      },
    );
  }

  void _onExit(PointerExitEvent _) {
    _isHovering = false;
    _hoverTimer?.cancel();
    _hoverTimer = null;
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: _onEnter,
      onExit: _onExit,
      cursor: widget.onRecall != null
          ? SystemMouseCursors.click
          : SystemMouseCursors.basic,
      child: AnimatedBuilder(
        animation: _ctrl,
        builder: (context, _) {
          final now = DateTime.now();
          final strength = ForgettingEngine.computeStrength(
            importance: widget.charState.importance,
            lambda: widget.lambda,
            createdAt: widget.charState.createTime,
            now: now,
          );
          final state = ForgettingEngine.resolveState(strength);
          return _buildByState(state, strength);
        },
      ),
    );
  }

  Widget _buildByState(MemoryState state, double strength) {
    switch (state) {
      case MemoryState.clear:
        return _ClearChar(
          ch: widget.charState.char,
          fontSize: widget.fontSize,
          color: widget.ink,
          phase: _ctrl.value,
        );
      case MemoryState.blurry:
        return _BlurryChar(
          ch: widget.charState.char,
          strength: strength,
          fontSize: widget.fontSize,
          color: widget.ink,
          phase: _ctrl.value,
        );
      case MemoryState.garbled:
        return _GarbledChar(
          ch: widget.charState.char,
          fontSize: widget.fontSize,
          color: widget.ink,
          inkSoft: widget.inkSoft,
          phase: _ctrl.value,
        );
      case MemoryState.disappeared:
        return _DisappearedChar(
          ch: widget.charState.char,
          fontSize: widget.fontSize,
        );
    }
  }
}

// ============================================================
// 清晰态
// ============================================================
class _ClearChar extends StatelessWidget {
  final String ch;
  final double fontSize;
  final Color color;
  final double phase;

  const _ClearChar({
    required this.ch,
    required this.fontSize,
    required this.color,
    required this.phase,
  });

  @override
  Widget build(BuildContext context) {
    // 0.92 ~ 1.0 缓慢呼吸
    final t = (math.sin(phase * 2 * math.pi) + 1) / 2; // 0~1
    final opacity = 0.92 + t * 0.08;
    return Text(
      ch,
      style: TextStyle(
        fontSize: fontSize,
        color: color.withValues(alpha: opacity),
        height: 1.6,
        letterSpacing: 0.5,
      ),
    );
  }
}

// ============================================================
// 模糊态
// ============================================================
class _BlurryChar extends StatelessWidget {
  final String ch;
  final double strength; // 0.4 ~ 0.7
  final double fontSize;
  final Color color;
  final double phase;

  const _BlurryChar({
    required this.ch,
    required this.strength,
    required this.fontSize,
    required this.color,
    required this.phase,
  });

  @override
  Widget build(BuildContext context) {
    // strength 越低，模糊越强、透明度越低
    final t = ((0.7 - strength) / 0.3).clamp(0.0, 1.0); // 0~1
    final sigma = 0.5 + t * 3.0;
    final opacity = 0.85 - t * 0.35;
    // 微小抖动（±1px）
    final dx = math.sin(phase * 2 * math.pi * AppConstants.blurJitterFreq) * 1.2;
    final dy = math.cos(phase * 2 * math.pi * AppConstants.blurJitterFreq) * 0.8;

    return Transform.translate(
      offset: Offset(dx, dy),
      child: ImageFiltered(
        imageFilter: ui.ImageFilter.blur(sigmaX: sigma, sigmaY: sigma),
        child: Text(
          ch,
          style: TextStyle(
            fontSize: fontSize,
            color: color.withValues(alpha: opacity),
            height: 1.6,
            letterSpacing: 0.5,
          ),
        ),
      ),
    );
  }
}

// ============================================================
// 错乱态
// ============================================================
class _GarbledChar extends StatelessWidget {
  final String ch;
  final double fontSize;
  final Color color;
  final Color inkSoft;
  final double phase;

  const _GarbledChar({
    required this.ch,
    required this.fontSize,
    required this.color,
    required this.inkSoft,
    required this.phase,
  });

  @override
  Widget build(BuildContext context) {
    // 用 phase*100 当作「帧编号」让替换稳定（不会高频闪烁到看不清）
    final frame = (phase * 8).floor();
    final glyph = GarbledGlyphs.substitute(ch, frame);

    // RGB 偏移：错乱态标志性的故障风
    final offset =
        AppConstants.garbleRgbOffset * (frame.isEven ? 1 : -1).toDouble();
    final opacity = 0.45 + (frame % 3) * 0.05;

    return SizedBox(
      width: fontSize * 1.0,
      height: fontSize * 1.6,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // 红色通道（向左偏移）
          Text(
            glyph,
            style: TextStyle(
              fontSize: fontSize,
              color: const Color(0xFFE85D75).withValues(alpha: opacity),
              height: 1.6,
            ),
          ),
          // 蓝色通道（向右偏移）
          Transform.translate(
            offset: Offset(offset * 2, 0),
            child: Text(
              glyph,
              style: TextStyle(
                fontSize: fontSize,
                color: const Color(0xFF5B7FBF).withValues(alpha: opacity),
                height: 1.6,
              ),
            ),
          ),
          // 主文本（墨色，居中）
          Text(
            glyph,
            style: TextStyle(
              fontSize: fontSize,
              color: color.withValues(alpha: 0.85),
              height: 1.6,
              letterSpacing: 0.5,
            ),
          ),
          // 微弱底层提示原字符
          Text(
            ch,
            style: TextStyle(
              fontSize: fontSize * 0.6,
              color: inkSoft.withValues(alpha: 0.18),
              height: 1.6,
            ),
          ),
        ],
      ),
    );
  }
}

// ============================================================
// 消失态
// ============================================================
class _DisappearedChar extends StatelessWidget {
  final String ch;
  final double fontSize;

  const _DisappearedChar({required this.ch, required this.fontSize});

  @override
  Widget build(BuildContext context) {
    // 保留占位宽度（用隐形文字撑开布局）
    return Text(
      ch,
      style: TextStyle(
        fontSize: fontSize,
        color: Colors.transparent,
        height: 1.6,
        letterSpacing: 0.5,
      ),
    );
  }
}