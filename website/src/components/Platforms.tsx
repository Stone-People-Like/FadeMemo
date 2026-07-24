/**
 * Platforms.tsx - Apple / Stripe Style Cross-Platform Grid
 */

import { motion } from "framer-motion";
import { Globe, Smartphone, Monitor, Apple, Terminal } from "lucide-react";

const platformConfig = [
  { name: "Web 网页端", status: "全端浏览器即用", icon: Globe },
  { name: "iOS", status: "App Store / TestFlight", icon: Apple },
  { name: "Android", status: "原生高能 APK", icon: Smartphone },
  { name: "Windows", status: "Win 10 / 11 64-bit", icon: Monitor },
  { name: "macOS", status: "Apple Silicon & Intel 原生支持", icon: Apple },
  { name: "Linux", status: "AppImage 软件包", icon: Terminal },
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
        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-stretch">
          {platformConfig.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="h-full"
              >
                <div
                  className="group relative flex h-full flex-col items-center justify-start p-6 rounded-2xl bg-[#0F121D]/70 border border-white/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A880]/30 hover:shadow-[0_10px_25px_-5px_rgba(197,168,128,0.15)]"
                >
                  {/* 1. 顶部 Icon 底座 */}
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 shrink-0 shadow-inner transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(197,168,128,0.2)] group-hover:border-[#C5A880]/30 group-hover:bg-[#C5A880]/10">
                    <Icon className="w-5 h-5 text-[#C5A880]" strokeWidth={1.75} />
                  </div>

                  {/* 2. 中部标题 */}
                  <div className="text-sm font-bold text-white mb-2 shrink-0 text-center group-hover:text-[#E5D2B8] transition-colors">
                    {item.name}
                  </div>

                  {/* 3. 底部描述 */}
                  <div className="text-xs text-slate-400 text-center leading-relaxed whitespace-normal">
                    {item.status}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 底栏 Rust / WASM 标识 */}
        <div className="mx-auto mt-12 flex max-w-2xl items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.02] px-6 py-3 text-center backdrop-blur-md">
          <span className="text-xs font-mono text-slate-400">
            ⚡ 搭载 WASM/Rust 本地高能内核 · 毫秒级极速响应与 100% 端到端加密
          </span>
        </div>

      </div>
    </section>
  );
}

