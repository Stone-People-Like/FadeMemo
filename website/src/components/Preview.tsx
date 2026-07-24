/**
 * Preview.tsx - Apple / Linear Style Product Interface Gallery Tabs
 * Upgraded with Floating Spring Indicator, 3D Depth Crossfade, Staggered Cards Entrance & Auto-Play Cruise
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Layers, Layout, Palette, Pause, Sparkles, BookOpen, Clock, Tag } from "lucide-react";
import TiltCard from "./ui/TiltCard";

interface Slide {
  title: string;
  subtitle: string;
  mockup: "list" | "detail" | "categories";
  icon: React.ComponentType<{ className?: string }>;
}

const slides: Slide[] = [
  {
    title: "一览无余笔记列表",
    subtitle: "首页即列表，分类筛选与全文搜索触手可及，最新演化状态一目了然。",
    mockup: "list",
    icon: Layout,
  },
  {
    title: "沉浸式极简编辑",
    subtitle: "无干扰写作界面，分类、标题、Markdown 层次分明，让思维专注于输入与记忆。",
    mockup: "detail",
    icon: Layers,
  },
  {
    title: "色彩化分类图谱",
    subtitle: "为每个分类赋予专属色彩，视觉感知效率远超纯文本，管理知识井井有条。",
    mockup: "categories",
    icon: Palette,
  },
];

const AUTO_PLAY_DURATION = 5000; // 5 seconds

export default function Preview() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto cruise timer with smooth progress bar
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50; // update every 50ms
    const step = (intervalTime / AUTO_PLAY_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActive((curr) => (curr + 1) % slides.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Select tab manually
  const handleSelectTab = (index: number) => {
    setActive(index);
    setProgress(0);
  };

  const next = () => {
    setActive((i) => (i + 1) % slides.length);
    setProgress(0);
  };

  const prev = () => {
    setActive((i) => (i - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  return (
    <section id="preview" className="relative py-28 md:py-36 bg-[#090B10] overflow-hidden">
      {/* 弥散极夜紫/金光 */}
      <div className="pointer-events-none absolute right-10 top-1/4 h-[500px] w-[500px] rounded-full bg-[#111420] blur-[160px]" />
      <div className="pointer-events-none absolute left-10 bottom-1/4 h-[500px] w-[500px] rounded-full bg-[#C5A880]/10 blur-[160px]" />

      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#E5D2B8] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#C5A880]" />
            <span>PRODUCT EXPERIENCE PREVIEW</span>
          </div>

          <h2 className="font-display text-4xl font-black text-white sm:text-5xl tracking-tight leading-tight [text-wrap:balance]">
            极致简约的界面，<br />
            <span className="bg-gradient-to-r from-[#F5EFE4] via-[#E5D2B8] to-[#C5A880] bg-clip-text text-transparent">极致不凡的体验</span>
          </h2>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto [text-wrap:pretty]">
            从初见列表到沉浸写作， FadeMemo 的每一处界面细节都经过极致雕琢。
          </p>
        </motion.div>

        {/* 交互 Tab & 动态演示 Frame */}
        <div
          className="mt-16 grid items-center gap-12 lg:grid-cols-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {/* 左侧选择按钮: 物理滑动胶囊 (Floating Spring Indicator) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative space-y-3">
              {slides.map((slide, index) => {
                const Icon = slide.icon;
                const isActive = active === index;
                return (
                  <button
                    key={slide.title}
                    onClick={() => handleSelectTab(index)}
                    className="group relative block w-full rounded-2xl p-5 text-left outline-none select-none transition-colors"
                  >
                    {/* 物理滑动胶囊 layoutId="activeTabPill" */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute inset-0 rounded-2xl border border-[#C5A880]/40 bg-gradient-to-r from-[#C5A880]/15 via-[#C5A880]/10 to-[#C5A880]/05 shadow-xl shadow-[#C5A880]/10 backdrop-blur-md z-0"
                      >
                        {/* 0.5px 香槟金渐变边框高光微光 */}
                        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A880]/80 to-transparent" />
                      </motion.div>
                    )}

                    <div className="relative z-10 flex items-center gap-3.5">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-[#C5A880] text-slate-950 font-bold shadow-md shadow-[#C5A880]/30"
                            : "bg-white/5 text-slate-400 border border-white/10 group-hover:border-white/20 group-hover:text-slate-200"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div
                        className={`font-display text-base font-bold transition-colors duration-300 ${
                          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      >
                        {slide.title}
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="relative z-10 overflow-hidden"
                        >
                          <p className="text-xs leading-relaxed text-slate-300 pl-13">
                            {slide.subtitle}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>

            {/* 自动巡航进度 (Auto-Play Carousel) & 导航控制 */}
            <div className="pt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:border-[#C5A880] hover:bg-[#C5A880] hover:text-slate-950 active:scale-95 shadow-md"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:border-[#C5A880] hover:bg-[#C5A880] hover:text-slate-950 active:scale-95 shadow-md"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* 5 秒倒计时进度条与 01 / 03 序号 */}
                <div className="ml-2 flex items-center gap-2.5 bg-white/5 border border-white/10 px-3.5 py-2 rounded-full backdrop-blur-md">
                  <span className="font-mono text-xs font-bold text-[#E5D2B8]">
                    0{active + 1} / 0{slides.length}
                  </span>
                  <div className="relative h-1.5 w-16 sm:w-20 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#E5D2B8] via-[#C5A880] to-[#E5D2B8]"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                  {isPaused && (
                    <span className="flex items-center text-[10px] font-mono text-slate-400 gap-1">
                      <Pause className="h-2.5 w-2.5 text-[#C5A880]" />
                      暂停
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：3D Depth Crossfade & 3D Tilt Preview Frame */}
          <div className="lg:col-span-8">
            <div className="relative mx-auto max-w-2xl">
              {/* 背景弥散霓虹斑彩 */}
              <div className="pointer-events-none absolute -inset-4 bg-gradient-to-br from-[#C5A880]/20 via-cyan-500/15 to-violet-500/15 blur-3xl opacity-70" />

              {/* 3D Tilt Outer Window (倾斜角不超过 2 度: maxTilt={2}) */}
              <TiltCard
                maxTilt={2}
                glowColor="rgba(197, 168, 128, 0.18)"
                className="rounded-2xl border border-white/15 bg-[#090B10] shadow-2xl shadow-black/90 overflow-hidden"
              >
                {/* Window Topbar */}
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-white/[0.04] backdrop-blur-md">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <span className="h-3 w-3 rounded-full bg-[#C5A880]/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880] animate-pulse" />
                    <span className="font-mono text-xs text-slate-400 font-bold tracking-wide">
                      FadeMemo Studio v2.4
                    </span>
                  </div>
                  <span className="w-12" />
                </div>

                {/* Main Viewport Content with 3D Depth Crossfade */}
                <div className="aspect-[16/10] bg-[#06080C] p-6 overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, scale: 0.96, y: -10, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.96, y: -10, filter: "blur(4px)" }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="h-full w-full"
                    >
                      <MockupContent type={slides[active].mockup} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </TiltCard>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

// Staggered animation variants for internal cards entrance (staggerChildren: 0.06s)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.215, 0.61, 0.355, 1] },
  },
};

function MockupContent({ type }: { type: Slide["mockup"] }) {
  if (type === "list") {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex h-full flex-col gap-4 font-sans"
      >
        {/* Header */}
        <motion.div variants={cardVariants} className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#C5A880]" />
            <div className="font-display text-xl font-bold text-white">我的 FadeMemo 笔记</div>
          </div>
          <div className="flex gap-2 font-mono">
            <div className="rounded-full bg-[#C5A880] px-3 py-0.5 text-xs font-bold text-slate-950">全部 (24)</div>
            <div className="rounded-full bg-white/5 px-3 py-0.5 text-xs text-slate-400 border border-white/10">历史考点</div>
            <div className="rounded-full bg-white/5 px-3 py-0.5 text-xs text-slate-400 border border-white/10">计算机体系</div>
          </div>
        </motion.div>

        {/* Staggered Note Cards (y: 12px, opacity: 0) */}
        <div className="flex-1 space-y-3 overflow-hidden">
          {[
            { c: "bg-[#C5A880]", t: "1789年法国大革命与遗忘演化", d: "1789年7月14日，巴黎人民攻占巴士底狱...", level: "Level 3" },
            { c: "bg-cyan-400", t: "操作系统 CSAPP 虚拟内存笔记", d: "页表映射与 TLB 快表加速查找机制...", level: "Level 0" },
            { c: "bg-violet-400", t: "Flutter 与 Dart 异步事件循环", d: "Microtask Queue 与 Event Queue 的执行优先级...", level: "Level 1" },
            { c: "bg-rose-400", t: "有机化学反应机理整理", d: "双分子亲核取代反应 SN2 的过渡态...", level: "Level 5" },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="rounded-xl border border-white/10 bg-[#090B10]/80 p-3.5 flex items-center justify-between hover:border-[#C5A880]/40 transition-colors shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.c}`} />
                  <span className="text-sm font-bold text-white">{item.t}</span>
                </div>
                <p className="text-xs text-slate-400">{item.d}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-[10px] font-bold text-[#E5D2B8] bg-[#C5A880]/10 px-2 py-1 rounded border border-[#C5A880]/30">
                  {item.level}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (type === "detail") {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex h-full flex-col gap-4 font-sans"
      >
        <motion.div variants={cardVariants} className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C5A880]" />
            <span className="text-xs font-bold text-[#E5D2B8] font-mono flex items-center gap-1">
              <Tag className="h-3 w-3" /> 计算机体系结构
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-mono text-slate-500">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>2026.07.24 · UPDATED</span>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="font-display text-2xl font-bold text-white">
          操作系统 CSAPP 虚拟内存与 TLB 快表
        </motion.div>

        <motion.div variants={cardVariants} className="flex-1 space-y-3 text-sm text-slate-300 leading-relaxed">
          <p>虚拟内存是计算机系统对物理内存的抽象。它为每个进程提供了一个统一且连续的地址空间。</p>
          <div className="rounded-xl bg-white/5 p-4 border border-[#C5A880]/30 bg-[#C5A880]/5 text-xs font-mono space-y-2 text-slate-300">
            <div className="text-[#E5D2B8] font-bold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#C5A880]" /> 关键考点填空触发区间：
            </div>
            <div className="text-slate-300">· 虚拟地址 (VA) 转换为物理地址 (PA) 依赖 <span className="bg-[#C5A880]/20 text-[#E5D2B8] px-1.5 py-0.5 rounded border border-[#C5A880]/40 font-bold">[ MMU ]</span> 单元</div>
            <div className="text-slate-300">· 页表项 (PTE) 包含有效位 (Valid Bit) 与物理页帧号 (PPN)</div>
          </div>
          <p className="text-slate-400">当 TLB Hit 时，CPU 可以在 1 个时钟周期内快速获取物理地址映射。</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col gap-4 font-sans"
    >
      <motion.div variants={cardVariants} className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="font-display text-xl font-bold text-white flex items-center gap-2">
          <Palette className="h-4 w-4 text-[#C5A880]" />
          色彩化分类图谱
        </div>
        <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
          6 CATEGORIES
        </span>
      </motion.div>

      <div className="grid flex-1 grid-cols-2 gap-3">
        {[
          { n: "历史考点", c: "gold", count: 24 },
          { n: "计算机科学", c: "cyan", count: 18 },
          { n: "英语词根词缀", c: "aurora", count: 12 },
          { n: "医学病理学", c: "rose", count: 9 },
          { n: "法律条文与判例", c: "emerald", count: 6 },
          { n: "哲学与逻辑学", c: "gold", count: 3 },
        ].map((cat) => (
          <motion.div
            key={cat.n}
            variants={cardVariants}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#090B10] p-4 backdrop-blur-md hover:border-[#C5A880]/40 transition-colors group"
          >
            <div
              className={`absolute right-0 top-0 h-16 w-16 rounded-full blur-2xl opacity-40 transition-opacity group-hover:opacity-70 ${
                cat.c === "gold" ? "bg-[#C5A880]" : cat.c === "cyan" ? "bg-cyan-400" : cat.c === "aurora" ? "bg-violet-500" : "bg-rose-500"
              }`}
            />
            <div className="relative">
              <div
                className={`h-2.5 w-8 rounded-full mb-3 ${
                  cat.c === "gold" ? "bg-[#C5A880]" : cat.c === "cyan" ? "bg-cyan-400" : cat.c === "aurora" ? "bg-violet-400" : "bg-rose-400"
                }`}
              />
              <div className="font-display text-base font-bold text-white group-hover:text-[#E5D2B8] transition-colors">
                {cat.n}
              </div>
              <div className="mt-1 font-mono text-xs text-slate-400">{cat.count} 条笔记卡片</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
