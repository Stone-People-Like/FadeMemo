/**
 * PromoModal.tsx - Apple Video Showcase Theater & 3D Concept Modal with Spring Physics & Zoom Scale
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X, RotateCcw, Sparkles, Brain, Shield, Zap, Film } from "lucide-react";

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PromoModal({ isOpen, onClose }: PromoModalProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const scenes = [
    {
      id: 1,
      title: "第一幕：存储与记忆的悖论",
      tagline: "传统笔记工具存得越完美，大脑越容易懒惰遗忘",
      icon: Brain,
      badge: "PROBLEM PARADOX",
      visual: (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[#090B10] border border-white/15 shadow-2xl shadow-[#C5A880]/20">
            <span className="text-4xl">📚</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-3xl border border-[#C5A880]/50"
            />
          </div>
          <p className="max-w-md text-slate-300 text-sm md:text-base leading-relaxed font-sans [text-wrap:pretty]">
            您记录了上百篇笔记存满硬盘，但在关键时刻，大脑中却一片空白...<br />
            <strong className="text-[#E5D2B8] font-bold">“完美的静态存储，往往制造了记忆的幻觉。”</strong>
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: "第二幕：艾宾浩斯遗忘演化引擎",
      tagline: "笔记文字随时间自然退化、错字偏离、产生变体",
      icon: Sparkles,
      badge: "DECAY ENGINE",
      visual: (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 w-full">
          <div className="w-full max-w-md rounded-2xl bg-[#06080C] p-5 border border-[#C5A880]/40 shadow-xl font-mono">
            <div className="flex justify-between text-xs text-[#E5D2B8] mb-2 font-bold">
              <span>DECAY ALGORITHM ACTIVE</span>
              <span className="text-rose-400 font-bold">LEVEL 6 / 10</span>
            </div>
            <p className="text-base md:text-lg font-bold text-slate-200">
              法国大革命爆发于 <span className="text-[#E5D2B8] underline">1789</span> 年，攻占了{" "}
              <span className="decay-blur bg-[#C5A880]/20 px-2 py-0.5 rounded text-[#E5D2B8] border border-[#C5A880]/40">[ 巴士底狱 ]</span>。
            </p>
          </div>
          <p className="max-w-md text-slate-300 text-sm leading-relaxed font-sans [text-wrap:pretty]">
            FadeMemo 套用遗忘曲线，逼迫您通过 <strong className="text-[#E5D2B8]">主动回忆与填空</strong> 救回自己的知识！
          </p>
        </div>
      ),
    },
    {
      id: 3,
      title: "第三幕：五大记忆挑战模式",
      tagline: "伪事实攻防 · 骨架链还原 · 概念辨析 · 因果时序重塑 · 语义压缩",
      icon: Zap,
      badge: "CHALLENGE MODES",
      visual: (
        <div className="grid grid-cols-2 gap-3 p-6 max-w-md w-full">
          {["伪事实攻防", "骨架链还原", "概念辨析", "因果时序"].map((mode, i) => (
            <motion.div
              key={mode}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-[#C5A880]/40 bg-[#C5A880]/15 p-3 text-center text-xs font-bold text-[#E5D2B8] shadow-md backdrop-blur-md"
            >
              🎯 {mode}
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      id: 4,
      title: "第四幕：纯本地·零延时·隐私守护",
      tagline: "WASM/Rust + WASM 计算内核，数据 100% 掌控在您自己手中",
      icon: Shield,
      badge: "100% LOCAL PRIVACY",
      visual: (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-5 py-2 text-xs font-bold text-emerald-400 shadow-lg shadow-emerald-500/10">
            🔒 100% 本地计算 · 零数据上云
          </div>
          <p className="text-slate-300 text-sm max-w-sm font-sans leading-relaxed [text-wrap:pretty]">
            无需网络连接，无需注册账号。您的每一字每一句都安全加密保存在本地磁盘上。
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && isPlaying) {
      timer = setInterval(() => {
        setCurrentScene((prev) => (prev + 1) % scenes.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isOpen, isPlaying, scenes.length]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const current = scenes[currentScene];
  const IconComponent = current.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))] [padding-left:max(0.75rem,env(safe-area-inset-left))] [padding-right:max(0.75rem,env(safe-area-inset-right))] [padding-top:max(0.75rem,env(safe-area-inset-top))] sm:p-6 md:p-10">
        {/* 高斯模糊全屏遮罩 Modal Zoom & Blur Scale */}
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          onClick={onClose}
          className="absolute inset-0 bg-[#090B10]/90"
        />

        {/* 演播卡片大屏 带有极致物理弹簧 (Spring Physics) */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-modal-title"
          className="glass-card relative z-10 max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-2xl border border-white/15 p-4 shadow-2xl shadow-black sm:rounded-3xl sm:p-6 md:p-10"
        >
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            aria-label="关闭宣传片"
            className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#090B10]/90 text-white transition-all hover:bg-white/15 active:scale-95 sm:right-5 sm:top-5"
          >
            <X className="h-5 w-5" />
          </button>

          {/* 顶栏 Scene 标签 */}
          <div className="flex flex-wrap items-center gap-2 pr-12 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C5A880]/40 bg-[#C5A880]/15 px-3.5 py-1 text-xs font-mono font-bold text-[#E5D2B8]">
              <IconComponent className="h-3.5 w-3.5 text-[#C5A880]" />
              {current.badge}
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Film className="h-3 w-3 text-cyan-400" /> SCENE 0{currentScene + 1} / 0{scenes.length}
            </span>
          </div>

          {/* 标题 & 副标题 */}
          <div className="mt-4">
            <h3 id="promo-modal-title" className="font-display text-xl font-extrabold text-white [text-wrap:balance] sm:text-3xl">
              {current.title}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-300 [text-wrap:pretty]">
              {current.tagline}
            </p>
          </div>

          {/* 主场景视觉演示 */}
          <div className="relative mt-5 flex min-h-[180px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#06080C] shadow-inner sm:mt-6 sm:min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene}
                initial={{ opacity: 0, x: 30, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -30, filter: "blur(6px)" }}
                transition={{ duration: 0.4 }}
                className="w-full flex justify-center"
              >
                {current.visual}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 控制条与场景进度指示器 */}
          <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? "暂停宣传片" : "播放宣传片"}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#C5A880] to-[#E5D2B8] font-bold text-slate-950 shadow-md transition-all hover:scale-105 active:scale-95"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
              </button>

              <button
                onClick={() => setCurrentScene(0)}
                aria-label="从第一幕重新播放"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-slate-300 transition-all hover:bg-white/10 active:scale-95"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* 场景点指示器 */}
            <div className="flex items-center justify-between gap-2 sm:justify-start">
              {scenes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentScene(idx)}
                  aria-label={`切换到第 ${idx + 1} 幕`}
                  aria-current={currentScene === idx ? "step" : undefined}
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                >
                  <span
                    className={`h-2.5 rounded-full transition-all ${
                      currentScene === idx ? "w-8 bg-[#C5A880] shadow-sm shadow-[#C5A880]" : "w-2.5 bg-slate-700 hover:bg-slate-500"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
