/**
 * DecaySandbox.tsx - Apple / Stripe Style Interactive Decay & Scramble Playground
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  BrainCircuit,
  RotateCcw,
  Play,
  Pause,
  KeyRound,
  Zap,
} from "lucide-react";

interface NodeStage {
  day: number;
  level: number;
  retention: number;
  title: string;
  sub: string;
  statusText: string;
  badgeColor: string;
  barColor: string;
  hint: string;
}

const NODES: NodeStage[] = [
  {
    day: 0,
    level: 0,
    retention: 100,
    title: "Day 0",
    sub: "初始节点",
    statusText: "完好无损 · 100% 清晰",
    badgeColor: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    barColor: "from-emerald-500 to-teal-400",
    hint: "初始知识节点完全清晰，深层神经信号强度处于 100% 峰值。",
  },
  {
    day: 1,
    level: 2,
    retention: 82,
    title: "Day 1",
    sub: "细节变异",
    statusText: "微弱偏移 · 细节变异",
    badgeColor: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400",
    barColor: "from-cyan-500 to-blue-400",
    hint: "24 小时未回顾：知识细节产生微妙偏差，遗忘曲线开始下滑。",
  },
  {
    day: 3,
    level: 5,
    retention: 61,
    title: "Day 3",
    sub: "关键挖空",
    statusText: "骨架挖空 · 主动提取",
    badgeColor: "border-[#C5A880]/40 bg-[#C5A880]/10 text-[#E5D2B8]",
    barColor: "from-[#C5A880] to-[#E5D2B8]",
    hint: "72 小时未回顾：系统自动隐去关键名词，触发大脑主动提取机制。",
  },
  {
    day: 7,
    level: 9,
    retention: 18,
    title: "Day 7",
    sub: "深度侵蚀",
    statusText: "深度侵蚀 · 濒临解构",
    badgeColor: "border-rose-500/40 bg-rose-500/10 text-rose-400",
    barColor: "from-rose-500 to-amber-500",
    hint: "长期未回顾：记忆节点接近解构，必须完成重构测试以完全复原！",
  },
];

/**
 * Elegant Champagne Gold Text Highlight Reveal (Random Character Scramble Disabled)
 */
function ScrambleDecryptWord({
  targetText,
}: {
  targetText: string;
  isDecrypting?: boolean;
  onComplete?: () => void;
}) {
  return (
    <motion.span
      initial={{ scale: 0.96, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="inline-flex items-center px-2.5 py-0.5 font-extrabold text-[#E5D2B8] bg-[#C5A880]/20 rounded border border-[#C5A880]/50 shadow-[0_0_18px_rgba(197,168,128,0.35)] mx-1"
    >
      {targetText}
    </motion.span>
  );
}

export default function DecaySandbox() {
  const [nodeIndex, setNodeIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [repaired, setRepaired] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showGlowPulse, setShowGlowPulse] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const currentStage = NODES[nodeIndex];
  const activePosPercent = (nodeIndex / (NODES.length - 1)) * 100;

  // Auto-play mode loop
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setNodeIndex((prev) => (prev + 1) % NODES.length);
      setRepaired(false);
      setFeedback(null);
    }, 2200);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleSelectNode = (idx: number) => {
    setIsAutoPlaying(false);
    setNodeIndex(idx);
    setRepaired(false);
    setFeedback(null);
  };

  const triggerReconstruction = () => {
    setFeedback("correct");
    setIsDecrypting(true);
    setRepaired(true);

    // Trigger subtle champagne glow pulse
    setShowGlowPulse(true);
    setTimeout(() => {
      setShowGlowPulse(false);
    }, 1200);
  };

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    if (userInput.includes("巴士底狱") || userInput.toLowerCase().includes("bastille")) {
      triggerReconstruction();
    } else {
      setFeedback("incorrect");
    }
  };

  const currentRetention = repaired ? 100 : currentStage.retention;

  return (
    <section className="relative py-20 md:py-32 bg-[#090B10] overflow-hidden">
      {/* 暗黑香槟金弥散背景 */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[850px] rounded-full bg-[#C5A880]/10 blur-[170px]" />

      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 标题头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#E5D2B8] backdrop-blur-md">
            <BrainCircuit className="h-4 w-4 text-[#C5A880]" />
            <span>INTERACTIVE EBBINGHAUS SANDBOX</span>
          </div>

          <h2 className="font-display text-3xl font-black text-white sm:text-5xl tracking-tight leading-tight [text-wrap:balance]">
            拖动时间轴
            <br />
            体验知识如何“<span className="bg-gradient-to-r from-[#E5D2B8] to-[#C5A880] bg-clip-text text-transparent">动态侵蚀</span>”
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed [text-wrap:pretty] max-w-2xl mx-auto">
            FadeMemo 实时模拟大脑神经电信号衰减。点击 4 大核心节点或开启动态演播，
            <br />
            感受隐去提取与答题解密
          </p>
        </motion.div>

        {/* 主沙盒交互卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-12 max-w-4xl"
        >
          <div className="rounded-3xl glass-card p-6 shadow-2xl md:p-10 border border-white/10 relative overflow-hidden glass-card-hover">
            {/* 顶栏控件与自动演播按钮 */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#E5D2B8] shadow-sm">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">TIME AXIS</div>
                  <div className="text-xl font-extrabold text-white font-display">
                    第 {currentStage.day} 天 (Day {currentStage.day})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* 自动演播按钮 */}
                <button
                  onClick={() => setIsAutoPlaying((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold font-mono transition-all duration-300 active:scale-95 ${
                    isAutoPlaying
                      ? "border-[#C5A880] bg-[#C5A880]/20 text-[#F5EFE4] shadow-[0_0_15px_rgba(197,168,128,0.4)]"
                      : "border-white/15 bg-white/5 text-slate-300 hover:border-[#C5A880]/50 hover:text-[#E5D2B8]"
                  }`}
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5 text-[#E5D2B8] animate-pulse" />
                      <span>❚❚ 暂停演播</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 text-[#C5A880]" />
                      <span>▷ 动态演播 / Auto Play</span>
                    </>
                  )}
                </button>

                {/* Level 状态 Tag */}
                <div className={`hidden sm:inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold font-mono ${currentStage.badgeColor}`}>
                  <ShieldCheck className="h-4 w-4" />
                  Level {currentStage.level} · {currentStage.statusText}
                </div>
              </div>
            </div>

            {/* 丝滑时间轴滑块与 4 节点选择 */}
            <div className="mt-8">
              {/* 4 节点自由点击按钮 */}
              <div className="grid grid-cols-4 text-center mb-4">
                {NODES.map((n, idx) => {
                  const isActive = nodeIndex === idx;
                  return (
                    <button
                      key={n.day}
                      onClick={() => handleSelectNode(idx)}
                      className={`group flex flex-col items-center transition-all duration-300 py-1 rounded-lg ${
                        isActive ? "scale-105" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <span
                        className={`text-xs md:text-sm font-mono font-bold transition-colors ${
                          isActive ? "text-[#E5D2B8] font-black" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      >
                        {n.title}
                      </span>
                      <span className="text-[11px] font-sans text-slate-400 hidden sm:inline">{n.sub}</span>
                    </button>
                  );
                })}
              </div>

              {/* 丝滑 Slider 轨道与 Thumb */}
              <div className="relative py-4 cursor-pointer" onClick={(e) => {
                // 支持点击轨道任意位置直接定位最近节点
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = clickX / rect.width;
                const closestIdx = Math.round(ratio * 3);
                handleSelectNode(Math.max(0, Math.min(3, closestIdx)));
              }}>
                {/* 底轨 */}
                <div className="h-3.5 w-full rounded-full bg-[#06080C] border border-white/10 relative overflow-hidden shadow-inner">
                  {/* 流光渐变充填条 (Spring Animation) */}
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#C5A880] via-[#E5D2B8] to-[#F5EFE4] shadow-[0_0_12px_rgba(197,168,128,0.5)]"
                    animate={{ width: `${activePosPercent}%` }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                </div>

                {/* 4 节点刻度磁吸点 */}
                <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none flex justify-between px-1">
                  {NODES.map((n, idx) => (
                    <div
                      key={n.day}
                      className={`h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                        nodeIndex >= idx
                          ? "border-[#E5D2B8] bg-[#06080C] shadow-[0_0_8px_rgba(197,168,128,0.6)]"
                          : "border-slate-700 bg-[#06080C]"
                      }`}
                    />
                  ))}
                </div>

                {/* 磁吸 Slider Thumb Handle */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-gradient-to-br from-[#F5EFE4] to-[#C5A880] border-2 border-white shadow-[0_0_16px_rgba(197,168,128,0.8)] pointer-events-none flex items-center justify-center"
                  animate={{ left: `calc(${activePosPercent}% - 14px)` }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                >
                  <div className="h-2 w-2 rounded-full bg-slate-950" />
                </motion.div>

                {/* 隐式 Range Slider 供标准拖拽/无障碍交互 */}
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={nodeIndex}
                  onChange={(e) => handleSelectNode(Number(e.target.value))}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* 笔记卡片预览区 (排版优化 & 神经保留度) */}
            <motion.div
              animate={
                showGlowPulse
                  ? {
                      boxShadow: [
                        "0 0 0px rgba(197,168,128,0)",
                        "0 0 45px rgba(197,168,128,0.35)",
                        "0 0 0px rgba(197,168,128,0)",
                      ],
                      borderColor: ["rgba(255,255,255,0.1)", "rgba(197,168,128,0.5)", "rgba(255,255,255,0.1)"],
                    }
                  : {}
              }
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="mt-8 rounded-2xl bg-[#06080C] p-6 md:p-8 border border-white/10 relative min-h-[170px] flex flex-col justify-between shadow-inner transition-all duration-300"
            >
              {/* 笔记顶部 Header: Symbol + 神经保留度与进度条 */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 border-b border-white/5 pb-3 font-mono">
                <span className="font-semibold text-slate-300">📝 KNODE #082 · 《1789年法国大革命与结构化考点》</span>

                {/* 神经保留度数字与平滑缩减进度条 */}
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-400">神经保留度:</span>
                  <div className="w-20 md:w-28 h-2 rounded-full bg-slate-800/80 overflow-hidden border border-white/10">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${currentStage.barColor}`}
                      animate={{ width: `${currentRetention}%` }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    />
                  </div>
                  <span className="text-[#E5D2B8] font-bold font-mono w-9 text-right">
                    {currentRetention}%
                  </span>
                </div>
              </div>

              {/* 笔记正文 Typography (字号加大 text-lg/xl, 突出对比) */}
              <div className="my-4 text-lg md:text-xl font-medium text-slate-100 leading-relaxed transition-all duration-300">
                {repaired ? (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 mb-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      认知重构成功！神经强度已全量恢复！
                    </div>
                    <div>
                      1789年7月14日，巴黎人民爆发革命，成功攻占了
                      <ScrambleDecryptWord
                        targetText="巴士底狱"
                        isDecrypting={isDecrypting}
                        onComplete={() => setIsDecrypting(false)}
                      />
                      。
                    </div>
                  </motion.div>
                ) : (
                  <div>
                    {nodeIndex === 0 && (
                      <span>
                        1789年7月14日，巴黎人民爆发革命，成功攻占了
                        <strong className="text-[#E5D2B8] font-bold mx-1">巴士底狱</strong>。
                      </span>
                    )}

                    {nodeIndex === 1 && (
                      <span>
                        1789年7月
                        <span className="line-through text-rose-400/90 decoration-2 decoration-rose-500 mx-1">
                          16
                        </span>
                        <span className="text-[#E5D2B8] font-bold bg-[#C5A880]/20 px-1.5 py-0.5 rounded border border-[#C5A880]/30 mr-1">
                          14
                        </span>
                        日，巴黎人民爆发革命，攻占了
                        <span className="line-through text-rose-400/90 decoration-2 decoration-rose-500 mx-1">
                          凡尔赛宫
                        </span>
                        <span className="text-[#E5D2B8] font-bold bg-[#C5A880]/20 px-1.5 py-0.5 rounded border border-[#C5A880]/30">
                          巴士底狱
                        </span>
                        。
                      </span>
                    )}

                    {nodeIndex === 2 && (
                      <span>
                        1789年7月14日，巴黎人民爆发革命，攻占了{" "}
                        <span className="inline-flex items-center gap-1.5 border-b-2 border-dashed border-[#C5A880] px-3 py-0.5 font-mono text-[#E5D2B8] bg-[#C5A880]/15 rounded animate-pulse mx-1 shadow-[0_0_12px_rgba(197,168,128,0.25)]">
                          [ 挖空: 关键堡垒名称? ]
                        </span>
                        。
                      </span>
                    )}

                    {nodeIndex === 3 && (
                      <span className="opacity-40 blur-[1.8px] transition-all duration-500 select-none text-slate-300">
                        这是一条关于 [ 法国大革命 / 核心考点 ] 的笔记，关键文字已高度侵蚀...
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* 提示与重置 */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/5 pt-3">
                <span className="italic text-slate-300">💡 {currentStage.hint}</span>
                {repaired && (
                  <button
                    onClick={() => {
                      setRepaired(false);
                      setUserInput("");
                      setFeedback(null);
                      setIsDecrypting(false);
                    }}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-[#E5D2B8] font-mono text-xs transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> 重置演炼状态
                  </button>
                )}
              </div>
            </motion.div>

            {/* 答题交互区 (极简解密微光反馈，彻底废除烟花) */}
            <div className="mt-8 rounded-2xl bg-white/[0.02] p-5 border border-white/10">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-200 font-bold">
                  <Sparkles className="h-4 w-4 text-[#C5A880]" />
                  <span>触发主动回忆测试：</span>
                </div>

                {nodeIndex === 0 ? (
                  <div className="text-xs text-slate-400 font-mono italic">
                    当前知识点处于 100% 峰值状态。请点击/拖动时间轴节点模拟时间流逝。
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 flex-1 max-w-lg">
                    <form onSubmit={handleTestSubmit} className="flex gap-2 flex-1 min-w-[240px]">
                      <input
                        type="text"
                        placeholder="输入正确答案 (例如: 巴士底狱)"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="flex-1 rounded-xl bg-[#06080C] px-4 py-2.5 text-sm text-white border border-white/15 focus:border-[#C5A880] focus:outline-none transition-colors"
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-gradient-to-r from-[#C5A880] to-[#E5D2B8] px-5 py-2.5 text-sm font-extrabold text-slate-950 transition-all hover:from-[#E5D2B8] hover:to-[#C5A880] whitespace-nowrap active:scale-95 shadow-[0_0_12px_rgba(197,168,128,0.3)]"
                      >
                        提交重构
                      </button>
                    </form>

                    {/* 快捷一键重构演示按钮 */}
                    {!repaired && (
                      <button
                        onClick={triggerReconstruction}
                        className="rounded-xl border border-[#C5A880]/40 bg-[#C5A880]/10 px-3.5 py-2.5 text-xs font-bold text-[#E5D2B8] hover:bg-[#C5A880]/20 transition-all active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                        title="一键演示文字解密重构与微光脉冲"
                      >
                        <Zap className="h-3.5 w-3.5 text-[#C5A880]" />
                        <span>演示解密</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 答题反馈 */}
              <AnimatePresence>
                {feedback === "correct" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/30"
                  >
                    <CheckCircle2 className="h-4 w-4" /> 回答正确！解密完成，神经记忆强化值 +200%，侵蚀已完全逆转。
                  </motion.div>
                )}
                {feedback === "incorrect" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-3 flex items-center gap-2 text-xs font-bold text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/30"
                  >
                    <AlertTriangle className="h-4 w-4" /> 提示：该堡垒是法国大革命爆发的关键标志（尝试输入：巴士底狱）
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
