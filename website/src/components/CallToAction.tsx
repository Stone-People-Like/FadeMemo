/**
 * CallToAction 行动召唤区组件
 * 页面底部区域，包含下载入口、GitHub 链接和页脚信息
 * 提供各平台下载按钮和项目仓库链接，完成用户转化闭环
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, ArrowUpRight, Heart, Monitor, Apple, Smartphone, Globe, Terminal } from "lucide-react";
import { scrollToSection } from "../lib/utils";

/**
 * GitHub 仓库链接
 */
const GITHUB_URL = "https://github.com/Stone-People-Like/FadeMemo";

/**
 * 下载链接配置
 * 包含各平台的标签、路由参数和图标组件
 */
const downloadLinks = [
  { label: "Web", platform: "web", Icon: Globe },
  { label: "iOS", platform: "ios", Icon: Apple },
  { label: "Android", platform: "android", Icon: Smartphone },
  { label: "Windows", platform: "windows", Icon: Monitor },
  { label: "macOS", platform: "macos", Icon: Apple },
  { label: "Linux", platform: "linux", Icon: Terminal },
];

/**
 * CallToAction 组件主函数
 * 包含行动召唤文案、平台下载按钮、GitHub 链接和页脚信息
 */
export default function CallToAction() {
  return (
    <section id="download" className="relative overflow-hidden py-28 md:py-36">
      {/* 背景渐变层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-900/80 to-ink-950" />
      {/* 中心光晕效果 */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />

      <div className="container relative">
        {/* 行动召唤主体区域 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* 主标题 */}
          <h2 className="font-display text-4xl font-semibold leading-tight text-white text-balance md:text-6xl">
            让每一个想法
            <br />
            <span className="gradient-text">都有安放之处</span>
          </h2>
          {/* 副标题 */}
          <p className="mt-8 text-lg text-slate-300 text-balance">
            FadeMemo 完全免费，即将开源。选择你的平台，立即开始记录。
          </p>

          {/* 平台下载按钮网格 */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {downloadLinks.map((link, index) => {
                const Icon = link.Icon;
                return (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  to={`/download/${link.platform}`}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-ink-900/60 px-4 py-5 transition-all hover:-translate-y-1 hover:border-amber-500/40 hover:bg-ink-800"
                >
                  <span className="flex h-8 items-center justify-center text-2xl text-white transition-colors group-hover:text-amber-400">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-medium text-slate-300">
                    {link.label}
                  </span>
                </Link>
              </motion.div>
                );
              })}
          </div>

          {/* 主 CTA 按钮：访问 GitHub */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-4 text-base font-semibold text-ink-950 transition-all hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-500/40"
            >
              <Github className="h-5 w-5" />
              访问 GitHub 仓库
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* 页脚区域 */}
      <footer className="container relative mt-24 border-t border-white/5 pt-10">
        <div className="flex flex-col items-center justify-between gap-6 pb-8 md:flex-row">
          {/* 品牌标识 */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-violet-600">
              <span className="text-sm font-bold text-ink-950">F</span>
            </span>
            <span className="font-display text-lg font-semibold text-white">
              FadeMemo
            </span>
          </div>

          {/* 页脚链接 */}
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-amber-400">
              GitHub
            </a>
            <button onClick={() => scrollToSection("features")} className="transition-colors hover:text-amber-400">功能</button>
            <button onClick={() => scrollToSection("download")} className="transition-colors hover:text-amber-400">下载</button>
          </div>

          {/* 版权信息 */}
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <span>用</span>
            <Heart className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>打造 · MIT License</span>
          </div>
        </div>

        {/* 底部版权声明 */}
        <div className="pb-8 text-center text-xs text-slate-600">
          © 2026 Stone People Like. FadeMemo — 让灵感不再褪色。
        </div>
      </footer>
    </section>
  );
}
