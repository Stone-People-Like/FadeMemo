/**
 * About.tsx - Apple / Stripe Style Ebbinghaus Decay Engine & Interactive Cyber Dashboard
 * 包含：科技仪表盘底板、L型角落角标、进场1.5s SVG路径绘制、沿线流光粒子、波谷反弹脉冲波纹、悬浮玻璃 Badge、Hover 垂直辅助线与留存率对比
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  ShieldAlert,
  Zap,
  ShieldCheck,
  Sparkles,
  Activity,
  ArrowRight,
  RefreshCw,
  Eye,
} from "lucide-react";

interface AxisNode {
  id: string;
  x: number; // SVG X 坐标 (out of 800)
  label: string;
  timeText: string;
  passiveRetention: number;
  fadememoRetention: number;
  reversalBoost: string;
  detailHint: string;
}

const AXIS_NODES: AxisNode[] = [
  {
    id: "node-0",
    x: 60,
    label: "学习瞬间",
    timeText: "0 Hours (Day 0)",
    passiveRetention: 100,
    fadememoRetention: 100,
    reversalBoost: "100% 原始信号",
    detailHint: "初始神经元兴奋峰值，知识完全清晰完好。",
  },
  {
    id: "node-1",
    x: 230,
    label: "24小时临界点",
    timeText: "24 Hours (Day 1)",
    passiveRetention: 33,
    fadememoRetention: 92,
    reversalBoost: "+200% 提取固化",
    detailHint: "被动阅读遗忘过半；FadeMemo 智能隐去关键术语，触发主动提取。",
  },
  {
    id: "node-2",
    x: 470,
    label: "72小时临界点",
    timeText: "72 Hours (Day 3)",
    passiveRetention: 18,
    fadememoRetention: 98,
    reversalBoost: "终身化存留",
    detailHint: "被动阅读深度侵蚀；FadeMemo 注入伪事实攻防，锁定终身记忆。",
  },
  {
    id: "node-3",
    x: 740,
    label: "7天终身回路",
    timeText: "168 Hours (Day 7)",
    passiveRetention: 5,
    fadememoRetention: 99,
    reversalBoost: "99% 终身存留",
    detailHint: "168小时（Day 7）：神经突触长时程增强（LTP）完成，知识彻底固化入长久记忆库。",
  },
];

interface LevelItem {
  level: string;
  name: string;
  desc: string;
  colorHex: string;
  pulseSpeed: number; // 0 for steady solid light, >0 for pulse duration (seconds)
  badgeBg: string;
  badgeText: string;
}

const LEVELS: LevelItem[] = [
  {
    level: "0",
    name: "完好无损",
    desc: "内容完全清晰，知识点处于初始峰值状态 (100% 留存率)",
    colorHex: "#10B981", // 完好绿光
    pulseSpeed: 0, // 安稳常亮
    badgeBg: "bg-emerald-500/15 border-emerald-500/30",
    badgeText: "text-emerald-300",
  },
  {
    level: "1",
    name: "微弱偏移",
    desc: "关键数字或符号产生极小偏差 (95% 留存率)",
    colorHex: "#14B8A6",
    pulseSpeed: 3.2,
    badgeBg: "bg-teal-500/15 border-teal-500/30",
    badgeText: "text-teal-300",
  },
  {
    level: "2",
    name: "轻度磨损",
    desc: "个别细节偏离，遗忘曲线开始下滑 (88% 留存率)",
    colorHex: "#06B6D4",
    pulseSpeed: 2.7,
    badgeBg: "bg-cyan-500/15 border-cyan-500/30",
    badgeText: "text-cyan-300",
  },
  {
    level: "3",
    name: "关键挖空",
    desc: "核心术语被智能隐藏，触发主动回忆提醒",
    colorHex: "#3B82F6",
    pulseSpeed: 2.2,
    badgeBg: "bg-blue-500/15 border-blue-500/30",
    badgeText: "text-blue-300",
  },
  {
    level: "4",
    name: "伪事实注入",
    desc: "逻辑漏洞与替代错字注入，考验大脑判断力",
    colorHex: "#E5D2B8",
    pulseSpeed: 1.8,
    badgeBg: "bg-[#C5A880]/15 border-[#C5A880]/30",
    badgeText: "text-[#E5D2B8]",
  },
  {
    level: "5",
    name: "显著侵蚀",
    desc: "核心信息大面积隐去，仅保留骨架 (警告琥珀金)",
    colorHex: "#F59E0B", // 警告琥珀金
    pulseSpeed: 1.4, // 中速呼吸
    badgeBg: "bg-amber-500/15 border-amber-500/30",
    badgeText: "text-amber-300",
  },
  {
    level: "6",
    name: "重度重组",
    desc: "时序与因果关联被打乱，需重新编排重建",
    colorHex: "#F97316",
    pulseSpeed: 1.1,
    badgeBg: "bg-orange-500/15 border-orange-500/30",
    badgeText: "text-orange-300",
  },
  {
    level: "7",
    name: "严重衰减",
    desc: "仅保留标题与核心提纲缩写，依赖神经反推",
    colorHex: "#FF4500",
    pulseSpeed: 0.9,
    badgeBg: "bg-rose-500/15 border-rose-500/30",
    badgeText: "text-rose-300",
  },
  {
    level: "8",
    name: "临界状态",
    desc: "记忆信号急剧衰退，濒临完全解构边缘",
    colorHex: "#E11D48",
    pulseSpeed: 0.7,
    badgeBg: "bg-rose-600/15 border-rose-600/30",
    badgeText: "text-rose-300",
  },
  {
    level: "9",
    name: "高度模糊",
    desc: "仅存元数据标签，急需强力巩固复原",
    colorHex: "#D946EF",
    pulseSpeed: 0.55,
    badgeBg: "bg-fuchsia-500/15 border-fuchsia-500/30",
    badgeText: "text-fuchsia-300",
  },
  {
    level: "10",
    name: "彻底重构",
    desc: "完全重置，需启动新一轮认知系统搭建 (警示紫红)",
    colorHex: "#A855F7", // 警示紫红
    pulseSpeed: 0.4, // 高频脉冲呼吸灯
    badgeBg: "bg-purple-600/20 border-purple-500/40",
    badgeText: "text-purple-300",
  },
];

function LevelCard({ lvl }: { lvl: LevelItem }) {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl border border-white/10 bg-[#090B10]/80 p-4 sm:p-5 backdrop-blur-xl transition-shadow duration-300 overflow-hidden group shadow-lg flex flex-col justify-between"
      style={{
        boxShadow: mousePos ? `0 12px 30px -10px ${lvl.colorHex}35` : undefined,
      }}
    >
      {/* 2px 高亮能量指示线 (Status Light Bar) */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[2px] rounded-l-2xl pointer-events-none"
        style={{
          backgroundColor: lvl.colorHex,
          boxShadow: `0 0 10px ${lvl.colorHex}`,
        }}
        animate={
          lvl.pulseSpeed > 0
            ? { opacity: [0.4, 1, 0.4] }
            : { opacity: 1 }
        }
        transition={
          lvl.pulseSpeed > 0
            ? { duration: lvl.pulseSpeed, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
      />

      {/* 鼠标 Hover 径向高斯模糊质感背景 (Radial Hover Glow) */}
      {mousePos && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, ${lvl.colorHex}18, transparent 75%)`,
          }}
        />
      )}

      {/* 鼠标 Hover 径向微光 Border (Radial Hover Glow Border) */}
      {mousePos && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl p-[1px]"
          style={{
            background: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, ${lvl.colorHex}90, transparent 70%)`,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      )}

      {/* 卡片头部: Level 编号 + 名称 + 动态呼吸灯 Indicator */}
      <div className="flex items-center justify-between font-mono relative z-10">
        <div className="flex items-center gap-2.5">
          {/* 动态呼吸灯 (Breathing Status Pulse Dot) */}
          <div className="relative flex h-2.5 w-2.5 items-center justify-center">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full pointer-events-none"
              style={{ backgroundColor: lvl.colorHex }}
              animate={
                lvl.pulseSpeed > 0
                  ? { scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }
                  : { opacity: 0.9 }
              }
              transition={
                lvl.pulseSpeed > 0
                  ? { duration: lvl.pulseSpeed, repeat: Infinity, ease: "easeInOut" }
                  : {}
              }
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full pointer-events-none"
              style={{
                backgroundColor: lvl.colorHex,
                boxShadow: `0 0 8px ${lvl.colorHex}`,
              }}
            />
          </div>

          <span
            className="font-black text-xs tracking-wider"
            style={{ color: lvl.colorHex }}
          >
            LEVEL {lvl.level}
          </span>
        </div>

        <span
          className={`font-bold text-xs px-2.5 py-0.5 rounded-md border backdrop-blur-md ${lvl.badgeBg} ${lvl.badgeText}`}
        >
          {lvl.name}
        </span>
      </div>

      {/* 卡片描述 */}
      <p className="mt-3 text-xs text-slate-300 leading-relaxed font-sans relative z-10">
        {lvl.desc}
      </p>
    </motion.div>
  );
}

export default function About() {
  const [hoveredNodeIndex, setHoveredNodeIndex] = useState<number | null>(1); // 默认高亮 24h 节点
  const [activeTabNode, setActiveTabNode] = useState<number>(1);

  const selectedNode = hoveredNodeIndex !== null ? AXIS_NODES[hoveredNodeIndex] : AXIS_NODES[activeTabNode];

  // SVG Reversal Path String (800 x 300 viewBox)
  const reversalPath = "M 60 50 C 110 130, 180 195, 230 200 C 245 200, 255 80, 270 65 C 340 85, 410 115, 470 125 C 485 125, 495 70, 510 55 C 590 57, 670 59, 740 60";
  // Red Passive Decay Path String
  const passivePath = "M 60 50 C 130 180, 190 200, 230 200 C 310 200, 390 230, 470 235 C 570 240, 670 255, 740 260";

  return (
    <section id="about" className="relative py-24 md:py-32 bg-[#090B10] overflow-hidden">
      {/* 极夜柔暗光辉背景 */}
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-[550px] w-[550px] rounded-full bg-[#111420] blur-[170px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[450px] w-[450px] rounded-full bg-[#C5A880]/10 blur-[160px]" />

      <div className="container max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 区域 Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#E5D2B8] backdrop-blur-md">
            <Brain className="h-4 w-4 text-[#C5A880]" />
            <span>EBBINGHAUS DECAY ENGINE</span>
          </div>

          <h2 className="font-display text-3xl font-black text-white sm:text-5xl tracking-tight leading-tight [text-wrap:balance]">
            大脑衰减算法与动态逆转引擎
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
            知识不是静态文档，而是随时间衰减的生物电信号。 FadeMemo 实时模拟记忆遗忘曲线，在最恰当的临界点触发修复提醒，以最小的时间成本换取最高的留存效率。
          </p>
        </motion.div>

        {/* 艾宾浩斯科技仪表盘图表 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-14"
        >
          <div className="rounded-3xl bg-[#06080C]/90 p-6 md:p-10 border border-white/10 relative overflow-hidden shadow-2xl backdrop-blur-xl group">
            
            {/* 四个角落 L 型坐标定位角标 (Cyber Corner Brackets) */}
            <div className="pointer-events-none absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#C5A880]/60" />
            <div className="pointer-events-none absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#C5A880]/60" />
            <div className="pointer-events-none absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#C5A880]/60" />
            <div className="pointer-events-none absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#C5A880]/60" />

            {/* 图表顶部控制栏：左上公式 + 右上图例 */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
              
              {/* 左上角公式 rendering 与 [ 动态实时模拟中 ] 绿灯 Status 标签 */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
                    <TrendingUp className="h-5 w-5 text-[#C5A880]" />
                    记忆衰减与动态逆转模拟
                  </h3>
                  
                  {/* Status 标签: 动态实时模拟中 */}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>[ 动态实时模拟中 ]</span>
                  </span>
                </div>

                {/* 修复公式基线对齐：行容器 flex items-center gap-3 text-xs text-slate-400 font-mono mt-2 */}
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-2">
                  <span className="shrink-0">RETENTION FORMULA:</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-amber-200/90 leading-none font-bold">
                    <span>R = e</span>
                    <sup className="text-[10px] text-amber-200/80 leading-none ml-0.5 relative -top-[1px]">
                      -t/S
                    </sup>
                  </span>
                  <span className="hidden sm:inline text-slate-400 shrink-0">| S = 神经巩固因子</span>
                </div>
              </div>

              {/* 右上角图例组件 */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold font-mono">
                {/* 被动阅读（指数断崖）- 红色呼吸灯 */}
                <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-3.5 py-1.5 rounded-full border border-rose-500/30 backdrop-blur-md shadow-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                  <span>被动阅读（指数断崖）</span>
                </div>

                {/* FadeMemo 答题逆转（阶梯固化）- 香槟金/青蓝呼吸灯 */}
                <div className="flex items-center gap-2 text-[#E5D2B8] bg-[#C5A880]/15 px-3.5 py-1.5 rounded-full border border-[#C5A880]/40 backdrop-blur-md shadow-[0_0_15px_rgba(197,168,128,0.2)]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C5A880]"></span>
                  </span>
                  <span className="bg-gradient-to-r from-[#F5EFE4] via-[#E5D2B8] to-[#06B6D4] bg-clip-text text-transparent">
                    FadeMemo 答题逆转（阶梯固化）
                  </span>
                </div>
              </div>
            </div>

            {/* SVG 科技仪表盘画板 (Cyber Grid Canvas) */}
            <div className="mt-8 relative h-72 md:h-80 w-full select-none">
              <svg
                className="w-full h-full overflow-visible cursor-crosshair"
                viewBox="0 0 800 300"
                onMouseLeave={() => setHoveredNodeIndex(null)}
              >
                <defs>
                  {/* 香槟金/青蓝/翡翠绿 渐变 */}
                  <linearGradient id="luxury-reversal-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C5A880" />
                    <stop offset="35%" stopColor="#E5D2B8" />
                    <stop offset="70%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>

                  {/* 红色断崖衰减渐变 */}
                  <linearGradient id="red-decay-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#BE123C" stopOpacity="0.3" />
                  </linearGradient>

                  {/* 粒子高亮滤镜 */}
                  <filter id="tracer-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* 节点波纹滤镜 */}
                  <filter id="ripple-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* 科技网格线背景 (Cyber Grid Lines: border-white/5 交叉网格) */}
                <g stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3">
                  <line x1="60" y1="50" x2="740" y2="50" />
                  <line x1="60" y1="112" x2="740" y2="112" />
                  <line x1="60" y1="175" x2="740" y2="175" />
                  <line x1="60" y1="237" x2="740" y2="237" />

                  <line x1="60" y1="30" x2="60" y2="265" />
                  <line x1="230" y1="30" x2="230" y2="265" />
                  <line x1="470" y1="30" x2="470" y2="265" />
                  <line x1="740" y1="30" x2="740" y2="265" />
                </g>

                {/* Y 轴刻度文字 (留存率 %) */}
                <g fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="monospace" textAnchor="end">
                  <text x="50" y="54">100%</text>
                  <text x="50" y="116">75%</text>
                  <text x="50" y="179">50%</text>
                  <text x="50" y="241">25%</text>
                </g>

                {/* 被动阅读（指数断崖）- 红色虚线 */}
                <path
                  d={passivePath}
                  fill="none"
                  stroke="url(#red-decay-gradient)"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                />

                {/* 进场 SVG 绘制动画 (1.5s Path Draw Animation) - FadeMemo 逆转曲线 */}
                <motion.path
                  d={reversalPath}
                  fill="none"
                  stroke="url(#luxury-reversal-gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* 沿线数据流光 (Glowing Light Tracer Particle) */}
                <g filter="url(#tracer-glow)">
                  {/* 外围晕光粒子 */}
                  <circle r="7" fill="#06B6D4" opacity="0.6">
                    <animateMotion path={reversalPath} dur="6.5s" repeatCount="indefinite" />
                  </circle>
                  {/* 核心高亮光斑 */}
                  <circle r="3.5" fill="#F5EFE4">
                    <animateMotion path={reversalPath} dur="6.5s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* 反弹节点脉冲 (Bounce Pulse at Valleys - 临界波谷反弹) */}
                {/* 波谷 1: (230, 200) */}
                <g transform="translate(230, 200)" filter="url(#ripple-glow)">
                  <circle r="12" fill="none" stroke="#C5A880" strokeWidth="1.5">
                    <animate attributeName="r" values="4; 28; 4" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9; 0; 0.9" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  <circle r="4" fill="#C5A880" />
                </g>

                {/* 波谷 2: (470, 125) */}
                <g transform="translate(470, 125)" filter="url(#ripple-glow)">
                  <circle r="12" fill="none" stroke="#06B6D4" strokeWidth="1.5">
                    <animate attributeName="r" values="4; 28; 4" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9; 0; 0.9" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  <circle r="4" fill="#06B6D4" />
                </g>

                {/* 4 大核心时间轴节点刻度圈 */}
                {AXIS_NODES.map((node, idx) => {
                  const isSelected = selectedNode.id === node.id;
                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredNodeIndex(idx)}
                      onClick={() => setActiveTabNode(idx)}
                    >
                      {/* 节点高亮辅助光环 */}
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.x === 60 ? 50 : node.x === 230 ? 200 : node.x === 470 ? 125 : 60}
                          r="14"
                          fill="rgba(197,168,128,0.15)"
                          stroke="#E5D2B8"
                          strokeWidth="1.5"
                          className="animate-pulse"
                        />
                      )}
                      <circle
                        cx={node.x}
                        cy={node.x === 60 ? 50 : node.x === 230 ? 200 : node.x === 470 ? 125 : 60}
                        r="5"
                        fill={isSelected ? "#F5EFE4" : "#C5A880"}
                        stroke="#090B10"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}

                {/* Hover 垂直高亮辅助虚线 (Inspection Line) */}
                {selectedNode && (
                  <g className="transition-all duration-300">
                    <line
                      x1={selectedNode.x}
                      y1="30"
                      x2={selectedNode.x}
                      y2="265"
                      stroke="#E5D2B8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.8"
                    />
                    {/* 辅助线上高亮激光头 */}
                    <circle
                      cx={selectedNode.x}
                      cy={selectedNode.x === 60 ? 50 : selectedNode.x === 230 ? 200 : selectedNode.x === 470 ? 125 : 60}
                      r="6"
                      fill="#06B6D4"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="shadow-[0_0_12px_#06B6D4]"
                    />
                  </g>
                )}
              </svg>

              {/* 悬浮玻璃 Badge 1: 第1次主动提取巩固 (+200%) - 位置在峰值 1 (X: 270, Y: 65) */}
              <div
                className="absolute left-[31%] top-[8%] -translate-x-1/2 pointer-events-none hidden sm:flex items-center gap-2 rounded-xl backdrop-blur-md bg-[#090B10]/85 px-3 py-1.5 border border-[#C5A880]/50 shadow-[0_0_20px_rgba(197,168,128,0.25)]"
              >
                <div className="h-6 w-6 rounded-lg bg-[#C5A880]/20 flex items-center justify-center border border-[#C5A880]/40">
                  <Zap className="h-3.5 w-3.5 text-[#E5D2B8]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white font-mono flex items-center gap-1.5">
                    <span>第1次主动提取巩固</span>
                    <span className="text-[10px] bg-[#C5A880]/20 text-[#E5D2B8] px-1.5 py-0.5 rounded border border-[#C5A880]/40 font-mono font-extrabold">
                      +200%
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">遗忘临界点成功修复逆转</div>
                </div>
              </div>

              {/* 悬浮玻璃 Badge 2: 第2次临界提取（终身化存留） - 位置在峰值 2 (X: 510, Y: 55) */}
              <div
                className="absolute left-[62%] top-[5%] -translate-x-1/2 pointer-events-none hidden sm:flex items-center gap-2 rounded-xl backdrop-blur-md bg-[#090B10]/85 px-3 py-1.5 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
              >
                <div className="h-6 w-6 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white font-mono flex items-center gap-1.5">
                    <span>第2次临界提取</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/40 font-mono font-extrabold">
                      终身化存留
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">建立抗衰减深度神经回路</div>
                </div>
              </div>

              {/* Dynamic Hover Card Inspection (当前时间节点记忆留存数值与对比) */}
              {selectedNode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-2 right-4 pointer-events-none rounded-2xl backdrop-blur-xl bg-[#090B10]/90 p-3.5 border border-[#C5A880]/40 shadow-[0_0_25px_rgba(197,168,128,0.2)] max-w-xs"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/10 pb-1.5 mb-2">
                    <span className="font-bold text-[#E5D2B8] flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-[#C5A880]" /> {selectedNode.label}
                    </span>
                    <span>{selectedNode.timeText}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                    <div className="rounded-xl bg-rose-500/10 p-2 border border-rose-500/20">
                      <div className="text-[10px] text-rose-300">被动阅读留存</div>
                      <div className="text-base font-extrabold text-rose-400 mt-0.5">
                        {selectedNode.passiveRetention}%
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#C5A880]/15 p-2 border border-[#C5A880]/40 shadow-sm">
                      <div className="text-[10px] text-[#E5D2B8]">FadeMemo 逆转</div>
                      <div className="text-base font-extrabold text-[#E5D2B8] mt-0.5 flex items-center justify-center gap-1">
                        {selectedNode.passiveRetention}% ➔ <span className="text-emerald-400">{selectedNode.fadememoRetention}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* X 轴 4 大时间节点卡片阵列 (Time Grid Cards 4-Card Alignment) */}
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3.5 border-t border-white/10 pt-5">
              {AXIS_NODES.map((node, idx) => {
                const isActive = selectedNode.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => {
                      setActiveTabNode(idx);
                      setHoveredNodeIndex(idx);
                    }}
                    onMouseEnter={() => setHoveredNodeIndex(idx)}
                    className={`p-3.5 rounded-xl backdrop-blur-md flex flex-col justify-between transition-all duration-300 text-left border cursor-pointer ${
                      isActive
                        ? "border-[#C5A880]/40 bg-[#161B2B] shadow-[0_0_15px_rgba(197,168,128,0.1)]"
                        : "bg-[#0F121D]/80 border-white/5 hover:border-white/20 hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs font-mono font-bold tracking-tight ${
                            isActive ? "text-[#E5D2B8]" : "text-slate-200"
                          }`}
                        >
                          {node.label}
                        </span>

                        {/* 香槟金 / 亮青绿 呼吸指示灯 */}
                        <span className="relative flex h-2 w-2 shrink-0">
                          {isActive ? (
                            <>
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A880]"></span>
                            </>
                          ) : idx === 3 ? (
                            <>
                              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#10B981]"></span>
                            </>
                          ) : (
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-600"></span>
                          )}
                        </span>
                      </div>

                      <div className="text-[10px] font-mono text-slate-400">{node.timeText}</div>
                    </div>

                    <div className="mt-3 border-t border-white/5 pt-2 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">被动: {node.passiveRetention}%</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        逆转: {node.fadememoRetention}%
                        {idx === 3 && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-gradient-to-r from-[#C5A880]/20 to-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                            (终身存留)
                          </span>
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 当前选中节点的详细解读提示 */}
            <div className="mt-4 rounded-xl bg-white/[0.02] p-3 border border-white/10 flex items-center justify-between text-xs text-slate-300 font-sans">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C5A880] shrink-0" />
                <span>
                  <strong className="text-white font-mono mr-1">[{selectedNode.label}]</strong>
                  {selectedNode.detailHint}
                </span>
              </div>
              <span className="font-mono text-[10px] bg-[#C5A880]/20 text-[#E5D2B8] px-2 py-0.5 rounded border border-[#C5A880]/30 shrink-0 hidden md:inline">
                {selectedNode.reversalBoost}
              </span>
            </div>

          </div>
        </motion.div>

        {/* 侵蚀等级对照矩阵 (Level 0 - Level 10) 动感重构 */}
        <div className="mt-16 sm:mt-24">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-black text-white flex items-center gap-2.5">
              <ShieldAlert className="h-5 w-5 text-[#C5A880]" />
              侵蚀等级对照矩阵 (Level 0 – Level 10)
            </h3>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">11 PROGRESSIVE STAGES</span>
          </div>

          {/* 11 个 Level 卡片交错瀑布入场 (Staggered Grid Entrance: staggerChildren: 0.05s) */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 items-stretch"
          >
            {LEVELS.map((lvl) => (
              <LevelCard key={lvl.level} lvl={lvl} />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}