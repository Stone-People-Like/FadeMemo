/**
 * Hero.tsx - Apple / Stripe Commercial Luxury Hero Section
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  BrainCircuit,
  ChevronDown,
  RefreshCw,
  CheckCircle2,
  Cpu,
  Database,
  Layers,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { scrollToSection } from "../lib/utils";
import PromoModal from "./PromoModal";
import HeroBackgroundCanvas from "./ui/HeroBackgroundCanvas";
import CountUpNumber from "./ui/CountUpNumber";

// Spotlight Card component for Trust Metrics
function TrustMetricCard({
  value,
  label,
  icon: Icon,
  color,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
  color: string;
}) {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group relative h-full flex flex-col justify-between rounded-2xl border border-white/5 bg-[#0F121D]/60 p-[18px] backdrop-blur-md transition-all duration-300 hover:-translate-y-[3px] hover:border-[#C5A880]/30 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.5),0_0_15px_rgba(197,168,128,0.15)] overflow-hidden"
    >
      {/* Hover Mouse Light Tracker (Spotlight) */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(180px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(197, 168, 128, 0.14), transparent 80%)`,
        }}
      />

      {/* Internal Icon & Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 group-hover:border-[#C5A880]/40 transition-colors">
            <Icon className={`h-4 w-4 shrink-0 ${color} group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(197,168,128,0.5)] transition-all duration-300`} />
          </div>
          <div className="text-base sm:text-lg font-extrabold text-white tracking-tight font-display">
            <CountUpNumber value={value} />
          </div>
        </div>
      </div>

      {/* 极简描述 */}
      <div className="text-xs text-slate-400 leading-normal font-sans font-medium">
        {label}
      </div>
    </div>
  );
}

export default function Hero() {
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [interactiveRepaired, setInteractiveRepaired] = useState(false);

  const heroMetrics = [
    { value: "全平台覆盖", label: "Web / Desktop / Mobile", icon: Layers, color: "text-[#E5D2B8]" },
    { value: "< 1ms 响应", label: "Rust / WASM 本地内核", icon: Cpu, color: "text-cyan-400" },
    { value: "100% 本地", label: "端到端 Zero-Knowledge 加密", icon: ShieldCheck, color: "text-emerald-400" },
    { value: "∞ 无界存储", label: "突破传统笔记容量限制", icon: Database, color: "text-[#C5A880]" },
  ];

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden pt-28 pb-20 bg-[#090B10]">
      <PromoModal isOpen={isPromoOpen} onClose={() => setIsPromoOpen(false)} />

      {/* 低调克制 Canvas Ambient Background */}
      <HeroBackgroundCanvas />

      {/* 暗黑极夜弥散光辉 */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-[#111420] blur-[150px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/3 h-[450px] w-[450px] rounded-full bg-[#C5A880]/10 blur-[160px]" />

      <div className="container relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* 左侧主视觉区域 (7 栏比例) */}
          <div className="lg:col-span-7 text-left">
            {/* 极简精致 Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 py-1 px-3.5 text-xs rounded-full bg-white/[0.04] border border-[#C5A880]/30 text-[#E5D2B8] mb-6 backdrop-blur-md font-medium shadow-sm"
            >
              <span>✦ FadeMemo 1.0 · 全新一代认知重塑与记忆固化系统</span>
            </motion.div>

            {/* 主标题 (Main Slogan) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight text-white mb-6 [text-wrap:balance]"
            >
              对抗遗忘，重构认知<br />
              <span className="bg-gradient-to-r from-[#F5EFE4] via-[#E5D2B8] to-[#C5A880] bg-clip-text text-transparent">
                让每一份知识，转化为终身能力
              </span>
            </motion.h1>

            {/* 副标题 (Sub-headline) */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl text-base lg:text-lg text-slate-300 leading-relaxed mb-8 [text-wrap:pretty] font-normal"
            >
              告别“存而不学”的假象。FadeMemo 融合艾宾浩斯记忆遗忘模型与主动提取算法，通过智能侵蚀、选择性挖空与多维重塑，唤醒深层神经记忆，建立高密度的结构化知识库。
            </motion.p>

            {/* 行动呼吁 (CTA Buttons) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => scrollToSection("download")}
                className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#E5D2B8] px-7 py-3.5 text-base font-extrabold text-slate-950 shadow-lg shadow-[#C5A880]/20 transition-all duration-200 hover:shadow-[#C5A880]/35 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>免费开启记忆重构</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => setIsPromoOpen(true)}
                className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-base font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C5A880]/20 text-[#E5D2B8] backdrop-blur-md transition-transform group-hover:scale-110">
                  <Play className="h-3 w-3 fill-current ml-0.5" />
                </span>
                <span>播放 3D 产品宣传片 🍿</span>
              </button>
            </motion.div>

            {/* 4 个 Metrics 信任卡片 (Slim & Clean Copy, Spotlight Tracker, Count-Up) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-4 items-stretch pt-6 border-t border-white/10"
            >
              {heroMetrics.map((m) => (
                <TrustMetricCard
                  key={m.value}
                  value={m.value}
                  label={m.label}
                  icon={m.icon}
                  color={m.color}
                />
              ))}
            </motion.div>
          </div>

          {/* 右侧 3D 剧场 Workspace 展示框 (3D Floating Motion y: 0 to -6px in 4s loop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:col-span-5"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
              className={`relative mx-auto max-w-lg lg:max-w-none transition-all duration-500 ${
                isPromoOpen ? "scale-[1.03] blur-[2px] opacity-70" : "scale-100 blur-0 opacity-100"
              }`}
            >
              {/* 微弱柔和底辉 */}
              <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-tr from-[#C5A880]/25 to-cyan-500/15 blur-xl opacity-70 pointer-events-none" />

              {/* 3D 剧场 Workspace 展示框 */}
              <div className="rounded-2xl border border-white/10 bg-[#090B10]/95 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl overflow-hidden relative">
                {/* 顶栏控制条 */}
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-white/[0.03]">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#C5A880]/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                      FadeMemo Workspace 1.0
                    </span>
                  </div>
                </div>

                {/* 剧场内容区 */}
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div>
                      <div className="text-[11px] font-bold text-[#E5D2B8] font-mono uppercase tracking-widest flex items-center gap-1.5">
                        <BrainCircuit className="h-3.5 w-3.5 text-[#C5A880]" /> DECAY & RECONSTRUCTION MATRIX
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white mt-1 font-display">
                        《1789年法国大革命核心考点》
                      </h4>
                    </div>
                    <span className="rounded-full border border-[#C5A880]/40 bg-[#C5A880]/10 px-3 py-1 text-xs font-bold text-[#E5D2B8]">
                      侵蚀等级 3
                    </span>
                  </div>

                  {/* 记忆保留强度 进度条 (暗色呼吸微光 + 往复流动光斑) */}
                  <div className="rounded-xl bg-white/[0.03] p-3.5 border border-white/5 space-y-2">
                    <div className="flex justify-between text-xs text-slate-300 font-semibold">
                      <span className="flex items-center gap-1">
                        🧠 大脑神经留存度: <span className="text-[#E5D2B8] font-mono font-bold">45%</span>
                      </span>
                      <span className="text-[#E5D2B8]/80 font-mono text-[11px]">已触发“关键骨架挖空”</span>
                    </div>

                    <div className="relative h-2.5 w-full rounded-full bg-slate-950/90 overflow-hidden p-[1px] border border-white/10 shadow-inner">
                      {/* 进度填满条 */}
                      <div className="relative h-full w-[45%] rounded-full bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-cyan-400 shadow-[0_0_12px_rgba(197,168,128,0.5)]">
                        {/* 往复流动的暗色呼吸与前端光斑 */}
                        <motion.div
                          animate={{
                            x: ["-20%", "90%", "-20%"],
                            opacity: [0.4, 0.95, 0.4],
                          }}
                          transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute top-0 bottom-0 w-6 rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[1px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 极简一行文字 */}
                  <div className="rounded-xl bg-[#06080C] p-5 border border-white/10 text-sm leading-relaxed text-slate-200 font-sans relative">
                    {interactiveRepaired ? (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 mb-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> 关键骨架匹配成功 · 记忆强度 +100%
                        </div>
                        <p className="text-slate-100 font-medium">
                          1789年7月14日，巴黎人民攻占{" "}
                          <span className="text-[#E5D2B8] font-extrabold underline decoration-[#C5A880] decoration-2 underline-offset-4">
                            巴士底狱
                          </span>
                          。
                        </p>
                      </motion.div>
                    ) : (
                      <p className="text-slate-200 font-medium">
                        1789年7月14日，巴黎人民攻占{" "}
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#C5A880]/20 px-2.5 py-0.5 font-mono text-xs font-bold text-[#C5A880] border border-[#C5A880]/40 shadow-[0_0_10px_rgba(197,168,128,0.2)]">
                          [ 巴士底狱 ]
                        </span>
                        。
                      </p>
                    )}
                  </div>

                  {/* 底部交互按钮区 */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setInteractiveRepaired((r) => !r)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/30 px-4 py-2 text-xs font-bold text-[#E5D2B8] transition-all duration-200 hover:bg-[#C5A880]/25 hover:border-[#E5D2B8] active:scale-95"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${interactiveRepaired ? "rotate-180 transition-transform duration-500" : ""}`} />
                      {interactiveRepaired ? "重置演示" : "点击体验答题修复"}
                    </button>

                    {/* [ ▷ 播放宣传片 ] 香槟金呼吸外发光高亮按钮 */}
                    <button
                      onClick={() => setIsPromoOpen(true)}
                      className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C5A880]/20 via-[#D4AF37]/25 to-[#C5A880]/20 border border-[#C5A880]/50 px-4.5 py-2 text-xs font-extrabold text-[#E5D2B8] shadow-[0_0_15px_rgba(197,168,128,0.35)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(197,168,128,0.6)] hover:border-[#E5D2B8] hover:scale-105 active:scale-95 group"
                    >
                      <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#C5A880]/30 text-[#E5D2B8] transition-transform group-hover:scale-110">
                        <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
                      </span>
                      <span>播放宣传片</span>
                      <Sparkles className="h-3 w-3 text-[#D4AF37] animate-pulse" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 底部 Scroll Arrow */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div
          className="flex flex-col items-center gap-1 text-slate-500 cursor-pointer transition-colors hover:text-[#E5D2B8]"
          onClick={() => scrollToSection("features")}
        >
          <span className="text-[10px] font-mono tracking-widest uppercase">EXPLORE VALUE MATRIX</span>
          <ChevronDown className="h-4 w-4 text-[#C5A880]" />
        </div>
      </div>
    </section>
  );
}

