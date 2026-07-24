/**
 * Features.tsx - Apple / Stripe Commercial Bento Grid (5 大核心训练维度)
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  FileCheck2,
  GitCompare,
  ListOrdered,
  FileText,
  ShieldCheck,
  HardDrive,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Cpu,
} from "lucide-react";
import ScrambleText from "./ui/ScrambleText";

export default function Features() {
  const [activeMode, setActiveMode] = useState(0);

  const challengeModes = [
    {
      id: "error-detect",
      icon: AlertCircle,
      cleanTitle: "维度 01：伪事实攻防",
      subtitleEn: "ERROR DETECTION",
      shortTitle: "维度 01：伪事实攻防",
      tag: "逻辑漏洞与伪事实捕获",
      badgeColor: "border-rose-500/40 bg-rose-500/10 text-rose-400",
      desc: "系统智能注入逻辑漏洞与诱导性错别字，强迫大脑建立敏锐的错漏捕获机制，提升知识精准度。",
      previewContent: (
        <div className="space-y-3 font-sans text-sm">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/5 pb-2">
            <span>DIMENSION 01: ERROR DETECTION</span>
            <span className="text-rose-400 font-bold">1 TRAP INJECTED</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            原文：1789年7月14日，巴黎人民攻占巴士底狱。<br />
            攻防测试：1789年7月14日，巴黎人民攻占
            <span className="mx-1 inline-flex items-center gap-1 rounded bg-rose-500/20 px-2 py-0.5 font-mono text-xs font-bold text-rose-300 border border-rose-500/40">
              <XCircle className="h-3 w-3 text-rose-400" /> 凡尔赛宫？
            </span>
          </p>
          <div className="rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/30 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 攻防识别成功：精准矫正为「巴士底狱」
            </span>
            <span className="text-[10px] font-mono bg-emerald-400/20 px-2 py-0.5 rounded text-emerald-300">+200 XP</span>
          </div>
        </div>
      ),
    },
    {
      id: "fill-blanks",
      icon: FileCheck2,
      cleanTitle: "维度 02：骨架链还原",
      subtitleEn: "INFORMATION RECONSTRUCTION",
      shortTitle: "维度 02：骨架链还原",
      tag: "神经元主动提取",
      badgeColor: "border-[#C5A880]/40 bg-[#C5A880]/10 text-[#E5D2B8]",
      desc: "隐藏核心知识节点与关键术语，触发神经元主动提取，实现从被动阅读到深度掌控的跃迁。",
      previewContent: (
        <div className="space-y-3 font-sans text-sm">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/5 pb-2">
            <span>DIMENSION 02: INFORMATION RECONSTRUCTION</span>
            <span className="text-[#E5D2B8] font-bold">2 KEY NODES BLANKED</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            法国大革命爆发于
            <span className="mx-1 inline-flex items-center gap-1 rounded bg-[#C5A880]/20 px-2.5 py-0.5 font-mono text-xs font-bold text-[#E5D2B8] border border-[#C5A880]/40">
              [ 1789 年 ]
            </span>
            ，巴黎人民成功攻占了
            <span className="mx-1 inline-flex items-center gap-1 rounded bg-[#C5A880]/20 px-2.5 py-0.5 font-mono text-xs font-bold text-[#E5D2B8] border border-[#C5A880]/40">
              [ 巴士底狱 ]
            </span>
            。
          </p>
          <div className="rounded-xl bg-[#C5A880]/10 p-3 border border-[#C5A880]/30 text-xs text-[#E5D2B8] flex items-center justify-between">
            <span>✏️ 答题输出关键节点，激活深层知识神经元</span>
            <span className="font-mono text-[10px] bg-[#C5A880]/20 px-2 py-0.5 rounded">主动固化</span>
          </div>
        </div>
      ),
    },
    {
      id: "comparison",
      icon: GitCompare,
      cleanTitle: "维度 03：概念辨析对抗",
      subtitleEn: "CONTRAST ANALYSIS",
      shortTitle: "维度 03：概念辨析对抗",
      tag: "毫秒级对比决策",
      badgeColor: "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
      desc: "自动对标易混淆概念与模糊考点，在毫秒级对比决策中厘清知识边界。",
      previewContent: (
        <div className="space-y-2.5 font-sans text-xs">
          <div className="rounded-xl bg-[#090B10] p-3 border border-emerald-500/40 flex items-center justify-between">
            <span className="text-slate-200">命题 A: 1789年7月14日 巴黎人民攻占巴士底狱</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
              <CheckCircle2 className="h-3 w-3" /> 正确事实
            </span>
          </div>
          <div className="rounded-xl bg-[#090B10] p-3 border border-rose-500/40 flex items-center justify-between">
            <span className="text-slate-300">命题 B: 1789年7月14日 巴黎人民攻占凡尔赛宫</span>
            <span className="flex items-center gap-1 text-rose-400 font-bold bg-rose-500/20 px-2 py-0.5 rounded">
              <XCircle className="h-3 w-3" /> 易混陷阱
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "reorder",
      icon: ListOrdered,
      cleanTitle: "维度 04：因果时序重塑",
      subtitleEn: "CAUSAL LOGIC REORDERING",
      shortTitle: "维度 04：因果时序重塑",
      tag: "结构化知识图谱重建",
      badgeColor: "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
      desc: "打乱事件链与逻辑发展脉络，通过拖拽互动重建结构化知识图谱。",
      previewContent: (
        <div className="space-y-2 font-sans text-xs">
          <div className="text-slate-400 mb-1 font-mono">拖拽重建因果逻辑图谱:</div>
          {["1. 1789年 巴黎人民攻占巴士底狱 (起因)", "2. 1792年 法兰西第一共和国建立 (发展)", "3. 1804年 拿破仑称帝加冕 (结果)"].map((step, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-xl bg-[#090B10] p-2.5 border border-white/10 text-slate-200">
              <span>{step}</span>
              <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded">NODE {idx + 1}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "abbreviation",
      icon: FileText,
      cleanTitle: "维度 05：语义压缩展开",
      subtitleEn: "ABBREVIATION EXPANSION",
      shortTitle: "维度 05：语义压缩展开",
      tag: "高浓度知识解压缩",
      badgeColor: "border-[#C5A880]/40 bg-[#C5A880]/10 text-[#E5D2B8]",
      desc: "仅保留知识骨架与高浓度缩写，评估大脑在无提示状态下的完整表达输出能力。",
      previewContent: (
        <div className="space-y-3 font-sans text-xs">
          <div className="rounded-xl bg-[#090B10] p-3 border border-[#C5A880]/30 text-[#E5D2B8] font-mono">
            高浓缩骨架: "1789 · 法革 · 攻占巴士底狱"
          </div>
          <div className="rounded-xl bg-white/[0.04] p-3 border border-white/10 text-slate-200 leading-relaxed">
            完整大脑展开表达: "1789年7月14日，法国大革命爆发，起义人民成功攻占了巴士底狱。"
          </div>
        </div>
      ),
    },
  ];

  const archSpecs = [
    {
      icon: Cpu,
      title: "< 1ms 极速响应",
      badge: "WASM / RUST CORE",
      desc: "搭载本地 Rust/WASM 嵌入式计算内核，毫秒级响应上万条高密度知识节点",
      accent: "from-[#C5A880]/10 to-[#C5A880]/5 border-[#C5A880]/30",
    },
    {
      icon: ShieldCheck,
      title: "100% Zero-Knowledge",
      badge: "ZERO CLOUD DEPENDENCY",
      desc: "零云端依赖，端到端本地算法加密，从物理架构层面捍卫绝对数据主权",
      accent: "from-emerald-500/10 to-emerald-500/5 border-emerald-400/30",
    },
    {
      icon: HardDrive,
      title: "∞ 无界存储架构",
      badge: "OFFLINE FIRST ARCH",
      desc: "突破传统笔记数据库性能局限，在无网络连接状态下依然保持极致丝滑",
      accent: "from-cyan-500/10 to-cyan-500/5 border-cyan-400/30",
    },
  ];

  return (
    <section id="features" className="relative py-24 md:py-32 bg-[#090B10] overflow-hidden">
      {/* 柔和暗色极夜光辉 */}
      <div className="pointer-events-none absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-[#111420] blur-[160px]" />

      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 区域 Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#E5D2B8] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>CORE VALUE MATRIX</span>
          </div>

          <h2 className="font-display text-3xl font-black text-white sm:text-5xl tracking-tight leading-tight [text-wrap:balance]">
            5 大核心训练维度，<br />
            把被动阅读转化为 <span className="bg-gradient-to-r from-[#F5EFE4] via-[#E5D2B8] to-[#C5A880] bg-clip-text text-transparent">深层终身能力</span>
          </h2>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
            FadeMemo 独创 5 维记忆训练矩阵，覆盖从错漏捕获、主动提取到因果图谱重组的全过程。
          </p>
        </motion.div>

        {/* Bento Grid 展台 */}
        <div className="mt-14 grid gap-6 md:grid-cols-12 items-stretch">
          
          {/* 左侧选择 Tab 列表 */}
          <div className="md:col-span-5 space-y-2.5">
            {challengeModes.map((mode, index) => {
              const Icon = mode.icon;
              const isActive = activeMode === index;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(index)}
                  className={`w-full rounded-2xl p-4 text-left transition-all duration-200 border flex items-center justify-between ${
                    isActive
                      ? "glass-card border-[#C5A880]/50 bg-[#C5A880]/10 shadow-lg shadow-[#C5A880]/10"
                      : "border-white/[0.06] bg-[#06080C]/40 hover:border-white/15 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                        isActive
                          ? "bg-[#C5A880] text-slate-950 font-bold shadow-md shadow-[#C5A880]/20"
                          : "bg-white/10 text-slate-300"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-white text-sm sm:text-base">
                        {mode.shortTitle}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">{mode.tag}</div>
                    </div>
                  </div>
                  <div
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      isActive ? "bg-[#E5D2B8] scale-125 shadow-sm shadow-[#E5D2B8]" : "bg-slate-700"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* 右侧 Bento Grid 主卡片 (渐隐渐现 + 轻微上浮 200ms，平滑过渡，无乱码) */}
          <div className="md:col-span-7">
            <div className="h-full rounded-3xl glass-card p-6 md:p-8 border border-white/10 flex flex-col justify-between relative overflow-hidden glass-card-hover">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono font-bold ${challengeModes[activeMode].badgeColor}`}>
                    DIMENSION 0{activeMode + 1}
                  </span>
                  <span className="text-xs font-mono text-slate-500">INTERACTIVE VALUE DEMO</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMode}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <h3 className="mt-4 font-display text-xl md:text-2xl font-extrabold text-white">
                      {challengeModes[activeMode].cleanTitle}
                    </h3>
                    <div className="mt-1 font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
                      {challengeModes[activeMode].subtitleEn}
                    </div>
                    <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
                      {challengeModes[activeMode].desc}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* 模式实时卡片 Mockup 预览面板 */}
                <div className="mt-6 rounded-2xl bg-[#06080C] p-5 border border-white/10 shadow-inner">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeMode}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.25 }}
                    >
                      {challengeModes[activeMode].previewContent}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* 底部信息条 */}
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400 relative z-10">
                <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> 大脑主动提取唤醒率 +200%
                </span>
                <span className="text-[#E5D2B8] font-mono flex items-center gap-1">
                  自动演化演练卡片 <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 底层架构亮点 specs */}
        <div className="mt-16 grid gap-6 md:grid-cols-3 items-stretch">
          {archSpecs.map((spec) => {
            const Icon = spec.icon;
            return (
              <div
                key={spec.title}
                className={`rounded-2xl border bg-gradient-to-br ${spec.accent} p-6 glass-card-hover backdrop-blur-md relative overflow-hidden h-full flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white shrink-0">
                      <Icon className="h-5 w-5 text-[#E5D2B8]" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                      {spec.badge}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-white text-lg">
                    {spec.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed font-sans [text-wrap:pretty]">
                    {spec.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
