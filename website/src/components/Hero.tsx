/**
 * Hero 主视觉区组件
 * 页面首屏展示区域，包含核心标语、产品介绍、CTA 按钮和统计数据
 * 右侧展示应用界面 mockup 和装饰性动画元素
 */

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { stats } from "../data/content";
import { scrollToSection } from "../lib/utils";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:64px_64px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-ink-950/80 to-ink-950" />

      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-amber-500/20 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: "2s" }} />

      <div className="container relative z-10 grid gap-12 py-20 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            全平台 · 本地优先 · 开源即将到来
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-white text-balance sm:text-6xl lg:text-7xl"
          >
            让灵感
            <span className="relative mx-3 inline-block">
              <span className="gradient-text">不再褪色</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M2 9C75 3 225 3 298 9"
                  stroke="url(#underline)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
                <defs>
                  <linearGradient id="underline" x1="0" y1="0" x2="300" y2="0">
                    <stop stopColor="#f59e0b" />
                    <stop offset="1" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <br />
            记住每一个值得的瞬间
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-slate-300 text-balance"
          >
            FadeMemo 是一款跨平台备忘录应用，以极简交互和本地优先架构，
            让记录变得轻而易举。无需联网，无需注册，打开即写，关闭即存。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => scrollToSection("download")}
              className="group inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 text-base font-semibold text-ink-950 transition-all hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-500/40"
            >
              免费下载
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-base font-medium text-white transition-all hover:border-white/30 hover:bg-white/5"
            >
              了解更多
              <ChevronDown className="h-4 w-4" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl font-semibold text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative lg:col-span-5"
        >
          <div className="relative mx-auto aspect-square max-w-md">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-white/10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 rounded-full border border-dashed border-amber-500/20"
            />

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="glass rounded-2xl border border-white/10 p-5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                  </div>
                  <span className="text-xs text-slate-400">FadeMemo</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg bg-white/5 p-3">
                    <div className="mb-1.5 h-2 w-20 rounded-full bg-amber-400/60" />
                    <div className="h-1.5 w-full rounded-full bg-white/10" />
                    <div className="mt-1 h-1.5 w-4/5 rounded-full bg-white/10" />
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <div className="mb-1.5 h-2 w-16 rounded-full bg-violet-400/60" />
                    <div className="h-1.5 w-full rounded-full bg-white/10" />
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <div className="mb-1.5 h-2 w-24 rounded-full bg-amber-400/60" />
                    <div className="h-1.5 w-3/4 rounded-full bg-white/10" />
                    <div className="mt-1 h-1.5 w-2/3 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 top-12 rounded-xl border border-amber-500/30 bg-ink-900/80 px-4 py-2.5 backdrop-blur"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-xs font-medium text-amber-200">本地存储</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-4 bottom-16 rounded-xl border border-violet-500/30 bg-ink-900/80 px-4 py-2.5 backdrop-blur"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                <span className="text-xs font-medium text-violet-200">秒级搜索</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-xs tracking-widest">SCROLL</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
