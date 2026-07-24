/**
 * CallToAction.tsx - Apple / Stripe Dark Commercial Luxury CTA & Footer
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, ArrowUpRight, Heart, Monitor, Apple, Smartphone, Globe, Terminal, Sparkles } from "lucide-react";
import { scrollToSection } from "../lib/utils";
import FadeMemoLogo from "./ui/FadeMemoLogo";

const GITHUB_URL = "https://github.com/Stone-People-Like/FadeMemo";

const downloadLinks = [
  { label: "Web 网页端", platform: "web", Icon: Globe, tag: "全端浏览器即用" },
  { label: "iOS", platform: "ios", Icon: Apple, tag: "App Store / TestFlight" },
  { label: "Android", platform: "android", Icon: Smartphone, tag: "原生高能 APK" },
  { label: "Windows", platform: "windows", Icon: Monitor, tag: "Win 10 / 11 64-bit" },
  { label: "macOS", platform: "macos", Icon: Apple, tag: "Apple Silicon 原生" },
  { label: "Linux", platform: "linux", Icon: Terminal, tag: "AppImage 软件包" },
];

export default function CallToAction() {
  return (
    <section id="download" className="relative overflow-hidden py-24 md:py-32 bg-[#090B10]">
      {/* 极夜弥散光层 */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C5A880]/10 blur-[160px]" />

      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* CTA 主体 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#E5D2B8] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>START YOUR COGNITIVE RECONSTRUCTION TODAY</span>
          </div>

          <h2 className="font-display text-4xl font-black text-white tracking-tight sm:text-6xl leading-[1.12] [text-wrap:balance]">
            对抗遗忘，重构认知<br />
            <span className="bg-gradient-to-r from-[#F5EFE4] via-[#E5D2B8] to-[#C5A880] bg-clip-text text-transparent">
              让每一份知识，转化为终身能力
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
            FadeMemo 100% 零知识端到端加密，开源透明。选择您日常使用的平台，即刻开启全维度记忆固化体验！
          </p>

          {/* 6 大平台 Cards */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-stretch">
            {downloadLinks.map((link, index) => {
              const Icon = link.Icon;
              return (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="h-full"
                >
                  <Link to={`/download/${link.platform}`} className="block h-full">
                    <div
                      className="group flex h-full min-h-[160px] flex-col items-center justify-between rounded-2xl border border-white/5 bg-[#0F121D]/60 p-5 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A880]/30"
                    >
                      {/* 3D 超圆角底座 (Squircle Tile) */}
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(197,168,128,0.2)] group-hover:border-[#C5A880]/30 group-hover:bg-[#C5A880]/10">
                        <Icon className="w-5 h-5 text-[#C5A880]" strokeWidth={1.75} />
                      </div>

                      {/* 文本限制与对齐 */}
                      <div className="w-full text-center space-y-1">
                        <div className="font-display text-sm font-bold text-white group-hover:text-[#E5D2B8] transition-colors line-clamp-1">
                          {link.label}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 line-clamp-1 h-4 flex items-center justify-center">
                          {link.tag}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* GitHub 主按钮 */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#E5D2B8] px-9 py-4 text-base font-extrabold text-slate-950 shadow-lg shadow-[#C5A880]/20 transition-all duration-200 hover:shadow-[#C5A880]/35 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Github className="h-5 w-5" />
              <span>访问 GitHub 官方开源仓库</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* 页脚 */}
      <footer className="container max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 mt-24 border-t border-white/10 pt-10">
        <div className="flex flex-col items-center justify-between gap-6 pb-8 md:flex-row">
          
          {/* Logo Component */}
          <div className="flex items-center">
            <FadeMemoLogo />
          </div>

          {/* 导航 */}
          <div className="flex items-center gap-6 text-xs font-medium text-slate-400">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#E5D2B8]">
              GitHub 仓库
            </a>
            <button onClick={() => scrollToSection("features")} className="transition-colors hover:text-[#E5D2B8]">
              核心价值矩阵
            </button>
            <button onClick={() => scrollToSection("about")} className="transition-colors hover:text-[#E5D2B8]">
              衰减逆转引擎
            </button>
            <button onClick={() => scrollToSection("download")} className="transition-colors hover:text-[#E5D2B8]">
              全终端同步下载
            </button>
          </div>

          {/* License */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span>· MIT License</span>
          </div>
        </div>

        {/* 版权 */}
        <div className="pb-8 text-center text-[11px] font-mono text-slate-600">
          © 2026 Stone People Like. FadeMemo v1.0 — 全新一代认知重塑与记忆固化系统.
        </div>
      </footer>
    </section>
  );
}
