/**
 * Preview 产品预览区组件
 * 展示 FadeMemo 应用的三个核心界面：笔记列表、编辑详情、分类管理
 * 左侧为标签导航，右侧为窗口 mockup，支持点击切换和左右箭头导航
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  title: string;
  subtitle: string;
  mockup: "list" | "detail" | "categories";
}

const slides: Slide[] = [
  {
    title: "一览无余的笔记列表",
    subtitle: "首页即列表，分类筛选与全文搜索触手可及，最新内容永远在最上方。",
    mockup: "list",
  },
  {
    title: "沉浸式编辑体验",
    subtitle: "无干扰的写作界面，分类、标题、内容层次分明，让思绪自然流淌。",
    mockup: "detail",
  },
  {
    title: "色彩化的分类管理",
    subtitle: "为每个分类赋予专属颜色，视觉记忆比文字更高效，整理变得赏心悦目。",
    mockup: "categories",
  },
];

export default function Preview() {
  const [active, setActive] = useState(0);

  const next = () => setActive((i) => (i + 1) % slides.length);
  const prev = () => setActive((i) => (i - 1 + slides.length) % slides.length);

  return (
    <section id="preview" className="relative py-28 md:py-36">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            产品预览
          </span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-white text-balance md:text-5xl">
            简约的界面，<br className="hidden sm:block" />
            不简单的体验
          </h2>
        </motion.div>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="space-y-6">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  onClick={() => setActive(index)}
                  className={`block w-full border-l-2 px-5 py-3 text-left transition-all ${
                    active === index
                      ? "border-amber-500"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div
                    className={`font-display text-lg font-semibold transition-colors ${
                      active === index ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {slide.title}
                  </div>
                  <AnimatePresence>
                    {active === index && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 text-sm leading-relaxed text-slate-400"
                      >
                        {slide.subtitle}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3 px-5">
              <button
                onClick={prev}
                aria-label="上一个"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-all hover:border-amber-500 hover:text-amber-400"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                aria-label="下一个"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-all hover:border-amber-500 hover:text-amber-400"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="ml-2 text-sm text-slate-500">
                {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="relative mx-auto max-w-2xl">
              <div className="pointer-events-none absolute -inset-8 bg-gradient-to-br from-amber-500/10 via-transparent to-violet-600/10 blur-2xl" />

              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400/60" />
                    <span className="h-3 w-3 rounded-full bg-amber-400/60" />
                    <span className="h-3 w-3 rounded-full bg-green-400/60" />
                  </div>
                  <span className="text-xs text-slate-500">FadeMemo</span>
                  <span className="w-12" />
                </div>

                <div className="aspect-[16/10] bg-ink-950 p-6">
                  <MockupContent type={slides[active].mockup} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockupContent({ type }: { type: Slide["mockup"] }) {
  if (type === "list") {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="font-display text-xl font-semibold text-white">我的笔记</div>
          <div className="flex gap-2">
            <div className="rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-300">全部</div>
            <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">工作</div>
            <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">生活</div>
          </div>
        </div>
        <div className="flex-1 space-y-3 overflow-hidden">
          {[
            { c: "bg-amber-400", t: "产品迭代会议纪要", d: "本周讨论了 v2.0 版本的核心功能优先级..." },
            { c: "bg-violet-400", t: "周末读书笔记", d: "《原则》第二章关于决策过程的思考..." },
            { c: "bg-amber-400", t: "灵感速记", d: "一个关于本地优先应用架构的新想法..." },
            { c: "bg-violet-400", t: "旅行清单", d: "下一次出行需要准备的物品和行程规划..." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-white/5 bg-ink-900 p-4"
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${item.c}`} />
                <span className="text-sm font-medium text-white">{item.t}</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-400">{item.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "detail") {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-xs text-amber-300">工作</span>
          </div>
          <div className="text-xs text-slate-500">2026.07.20</div>
        </div>
        <div className="font-display text-2xl font-semibold text-white">
          产品迭代会议纪要
        </div>
        <div className="flex-1 space-y-2.5 text-sm text-slate-300">
          <p>本周会议讨论了 FadeMemo v2.0 版本的核心功能优先级。</p>
          <p>团队一致认为本地同步能力是下一阶段的重点方向，需要在保持离线优先的前提下，提供可选的端到端加密同步方案。</p>
          <p className="rounded-lg bg-white/5 p-3 text-slate-400">
            待办事项：<br />
            · 完成同步协议设计文档<br />
            · 评估 CRDT 与 LWW 两种方案<br />
            · 原型验证跨设备冲突合并
          </p>
          <p>下次评审定在周五下午，届时需要给出技术选型的初步结论。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="font-display text-xl font-semibold text-white">分类管理</div>
      <div className="grid flex-1 grid-cols-2 gap-3">
        {[
          { n: "默认", c: "amber", count: 24 },
          { n: "工作", c: "violet", count: 18 },
          { n: "生活", c: "amber", count: 12 },
          { n: "灵感", c: "violet", count: 9 },
          { n: "读书", c: "amber", count: 6 },
          { n: "旅行", c: "violet", count: 3 },
        ].map((cat, i) => (
          <motion.div
            key={cat.n}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className="relative overflow-hidden rounded-xl border border-white/5 bg-ink-900 p-4"
          >
            <div
              className={`absolute right-0 top-0 h-16 w-16 rounded-full blur-2xl ${
                cat.c === "amber" ? "bg-amber-500/30" : "bg-violet-600/30"
              }`}
            />
            <div className="relative">
              <div
                className={`h-2 w-8 rounded-full ${
                  cat.c === "amber" ? "bg-amber-400" : "bg-violet-400"
                }`}
              />
              <div className="mt-3 font-display text-lg font-semibold text-white">
                {cat.n}
              </div>
              <div className="mt-1 text-xs text-slate-400">{cat.count} 条笔记</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
