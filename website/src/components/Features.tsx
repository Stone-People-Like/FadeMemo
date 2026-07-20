/**
 * Features 功能特性区组件
 * 展示 FadeMemo 的 6 大核心功能：极简记录、智能分类、秒级检索、昼夜双主题、本地优先、隐私守护
 * 使用卡片式布局，支持 hover 动效和滚动触发渐入动画
 */

import { motion } from "framer-motion";
import { features } from "../data/content";

export default function Features() {
  return (
    <section id="features" className="relative py-28 md:py-36">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            核心特性
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-white text-balance md:text-5xl">
            为记录而生，<br className="hidden sm:block" />
            每一处细节都恰到好处
          </h2>
          <p className="mt-6 text-lg text-slate-400 text-balance">
            从打开应用到保存笔记，FadeMemo 把每一个环节都打磨到极致，
            让你只需专注思考本身。
          </p>
        </motion.div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isAmber = feature.accent === "amber";

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900/40 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${
                    isAmber ? "bg-amber-500/30" : "bg-violet-600/30"
                  }`}
                />

                <div className="relative">
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110 ${
                      isAmber
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : "border-violet-500/30 bg-violet-500/10 text-violet-400"
                    }`}
                  >
                    <Icon className="h-7 w-7" strokeWidth={1.5} />
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-400">
                    {feature.description}
                  </p>

                  <div
                    className={`mt-6 h-px w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                      isAmber
                        ? "bg-gradient-to-r from-amber-500/60 to-transparent"
                        : "bg-gradient-to-r from-violet-500/60 to-transparent"
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
