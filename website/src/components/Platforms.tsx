/**
 * Platforms 平台支持区组件
 * 展示 FadeMemo 支持的 6 大平台：Web、iOS、Android、Windows、macOS、Linux
 * 使用网格布局，每个平台卡片包含图标、名称和状态信息
 */

import { motion } from "framer-motion";
import { platforms } from "../data/content";

const platformIcon: Record<string, string> = {
  globe: "🌐",
  apple: "",
  android: "🤖",
  windows: "⊞",
  terminal: ">_",
};

export default function Platforms() {
  return (
    <section id="platforms" className="relative py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-violet-600/5 to-transparent" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            全平台覆盖
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-white text-balance md:text-5xl">
            一处记录，<br className="hidden sm:block" />
            随处可及
          </h2>
          <p className="mt-6 text-lg text-slate-400 text-balance">
            无论你身处哪个设备，FadeMemo 都能以一致体验陪伴左右。
            基于 Flutter 构建，原生性能，跨平台如一。
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="group relative flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-ink-900/40 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30 hover:bg-ink-800/60"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-ink-950 text-2xl font-bold text-white transition-all duration-300 group-hover:border-amber-500/40 group-hover:text-amber-400">
                {platformIcon[platform.icon] || "□"}
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-white">
                  {platform.name}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {platform.status}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-16 flex max-w-3xl items-center justify-center gap-3 rounded-xl border border-white/5 bg-ink-900/40 px-6 py-4 text-center"
        >
          <span className="text-sm text-slate-400">
            基于 Flutter 构建 · Material Design 3 · 原生渲染引擎
          </span>
        </motion.div>
      </div>
    </section>
  );
}
