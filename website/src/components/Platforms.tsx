/**
 * Platforms.tsx - Apple / Stripe Style Cross-Platform Grid
 * 彻底重构多平台卡片 HTML/CSS 结构，消除文字叠加重影
 */

import { motion } from "framer-motion";
import { Globe, Smartphone, Monitor, Apple, Terminal } from "lucide-react";

const platforms = [
  { title: "Web 网页端", description: "全端浏览器即用", icon: Globe },
  { title: "iOS", description: "App Store / TestFlight", icon: Apple },
  { title: "Android", description: "原生高能 APK", icon: Smartphone },
  { title: "Windows", description: "Win 10 / 11 64-bit", icon: Monitor },
  { title: "macOS", description: "Apple Silicon & Intel 原生支持", icon: Apple },
  { title: "Linux", description: "AppImage 软件包", icon: Terminal },
];

export default function Platforms() {
  return (
    <section id="platforms" className="relative py-24 md:py-32 bg-[#090B10] overflow-hidden">
      {/* 暗黑弥散 glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] rounded-full bg-[#C5A880]/5 blur-[160px]" />

      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10 px-4 py-1.5 text-xs font-bold tracking-wider text-[#E5D2B8] backdrop-blur-md">
            <span>✦ CROSS PLATFORM COVERAGE</span>
          </div>

          <h2 className="font-display text-4xl font-black text-white sm:text-5xl tracking-tight leading-tight [text-wrap:balance]">
            6 大平台，<br />
            <span className="bg-gradient-to-r from-[#F5EFE4] via-[#E5D2B8] to-[#C5A880] bg-clip-text text-transparent">全终端原生无缝同步</span>
          </h2>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
            无论您使用 iPhone、Mac、Windows 还是 Linux，FadeMemo 均搭载原生高能内核，确保在所有终端体验绝对无缝一致。
          </p>
        </motion.div>

        {/* 6 大平台 Card Array */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <motion.div
                key={platform.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="flex flex-col items-center justify-start p-5 rounded-2xl bg-[#0F121D]/80 border border-white/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A880]/30 hover:shadow-[0_10px_25px_-5px_rgba(197,168,128,0.15)] group">
                  {/* 1. 图标底座 */}
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 shrink-0 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(197,168,128,0.2)] group-hover:border-[#C5A880]/30 group-hover:bg-[#C5A880]/10">
                    <Icon className="w-5 h-5 text-[#C5A880]" strokeWidth={1.75} />
                  </div>

                  {/* 2. 标题 */}
                  <h3 className="text-sm font-bold text-white mb-2 text-center shrink-0 group-hover:text-[#E5D2B8] transition-colors">
                    {platform.title}
                  </h3>

                  {/* 3. 描述文字 (纯文本自然折行，绝不叠加) */}
                  <p className="text-xs text-slate-400 text-center leading-relaxed m-0 p-0 block w-full">
                    {platform.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 底栏 Rust / WASM 标识 */}
        <div className="mx-auto mt-12 flex max-w-2xl items-center justify-center gap-3 rounded-full border border-white/10 bg-[#0F121D]/80 px-6 py-3 text-center backdrop-blur-md">
          <span className="text-xs font-mono text-slate-400">
            ⚡ 搭载 WASM/Rust 本地高能内核 · 毫秒级极速响应与 100% 端到端加密
          </span>
        </div>

      </div>
    </section>
  );
}

