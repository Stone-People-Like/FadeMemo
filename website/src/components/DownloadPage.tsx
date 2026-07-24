/**
 * DownloadPage 下载页面组件
 * 通过路由参数 :platform 区分 6 个平台，每个平台展示独立的下载信息
 * 从首页底部 CallToAction 的各平台按钮跳转至此
 */

import { motion } from "framer-motion";
import { ArrowLeft, Download, Monitor, Smartphone, Apple, Globe } from "lucide-react";
import { Link, useParams } from "react-router-dom";

/**
 * GitHub 仓库链接
 */
const GITHUB_URL = "https://github.com/Stone-People-Like/FadeMemo";

/**
 * 各平台下载信息配置
 * key 对应路由参数 :platform
 */
const platformData: Record<string, {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  version: string;
  size: string;
  desc: string;
  sub?: string;
  available: boolean;
  href: string;
}> = {
  windows: {
    name: "Windows",
    icon: Monitor,
    version: "v0.0.1-alpha.2",
    size: "~45 MB",
    desc: "支持 Windows 10 / 11，64 位",
    sub: "下载 .exe 安装包",
    available: false,
    href: "#",
  },
  macos: {
    name: "macOS",
    icon: Apple,
    version: "v0.0.1-alpha.2",
    size: "~52 MB",
    desc: "支持 macOS 12 Monterey 及以上",
    sub: "下载 .dmg 安装包",
    available: false,
    href: "#",
  },
  linux: {
    name: "Linux",
    icon: Monitor,
    version: "v0.0.1-alpha.2",
    size: "~48 MB",
    desc: "AppImage / deb / rpm 格式",
    sub: "下载安装包",
    available: false,
    href: "#",
  },
  android: {
    name: "Android",
    icon: Smartphone,
    version: "v0.0.1-alpha.2",
    size: "~18 MB",
    desc: "支持 Android 8.0 及以上",
    sub: "下载 APK 安装包",
    available: false,
    href: "#",
  },
  ios: {
    name: "iOS",
    icon: Apple,
    version: "v0.0.1-alpha.2",
    size: "—",
    desc: "即将通过 TestFlight 发布",
    sub: "加入 TestFlight",
    available: false,
    href: "#",
  },
  web: {
    name: "Web",
    icon: Globe,
    version: "v0.0.1-alpha.2",
    size: "—",
    desc: "浏览器直接使用，无需安装",
    sub: "打开网页版",
    available: false,
    href: "#",
  },
};

export default function DownloadPage() {
  const { platform } = useParams<{ platform: string }>();
  const data = platformData[platform ?? ""];

  if (!data) {
    return (
      <div className="relative min-h-screen bg-ink-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">未知平台</p>
          <Link to="/" className="mt-4 inline-block text-amber-400 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-slate-100">
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:64px_64px]" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-amber-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-violet-600/15 blur-[120px]" />

      <div className="container relative py-16 md:py-24">
        {/* 返回链接 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-amber-400"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
        </motion.div>

        {/* 平台标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12 text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#C5A880]/30 bg-[#C5A880]/10 text-[#E5D2B8] shadow-lg shadow-[#C5A880]/15">
            <Icon className="h-10 w-10 text-[#C5A880]" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-black text-white md:text-5xl [text-wrap:balance]">
            {data.name} 版
          </h1>
          <p className="mt-4 mx-auto max-w-lg text-lg text-slate-300 [text-wrap:pretty]">
            {data.desc}
          </p>
          <div className="mt-4 inline-flex items-center gap-3 text-sm text-slate-400">
            <span className="rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10 px-3.5 py-1 text-[#E5D2B8] font-mono font-bold">
              {data.version}
            </span>
            <span className="font-mono">{data.size}</span>
          </div>
        </motion.div>

        {/* 下载按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-12 max-w-md"
        >
          {data.available ? (
            <a
              href={data.href}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#E5D2B8] px-8 py-4 text-lg font-extrabold text-slate-950 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#C5A880]/30 active:scale-[0.98]"
            >
              <Download className="h-5 w-5" />
              {data.sub || "下载安装包"}
            </a>
          ) : (
            <button
              disabled
              className="inline-flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-lg font-medium text-slate-500"
            >
              <Download className="h-5 w-5" />
              即将上线
            </button>
          )}
        </motion.div>

        {/* 底部提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-16 max-w-xl rounded-2xl border border-[#C5A880]/20 bg-[#C5A880]/5 p-6 text-center backdrop-blur-md"
        >
          <p className="text-sm text-slate-300 [text-wrap:pretty]">
            FadeMemo 完全免费，开源透明。关注
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1 text-[#E5D2B8] underline underline-offset-2 hover:text-white font-bold"
            >
              GitHub 官方仓库
            </a>
            获取最新动态。
          </p>
        </motion.div>
      </div>
    </div>
  );
}