/**
 * Navbar 导航栏组件
 * 提供固定在页面顶部的导航功能，包含品牌标识、导航链接和下载按钮
 * 支持滚动时背景变化、移动端响应式菜单展开/收起动画
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Feather } from "lucide-react";
import { navLinks } from "../data/content";

/**
 * Navbar 组件主函数
 * 使用 useState 管理滚动状态和移动端菜单展开状态
 * 使用 useEffect 监听滚动事件，实现导航栏背景的动态变化
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-white/5" : "bg-transparent"
      }`}
    >
      <nav className="container flex h-16 items-center justify-between md:h-20">
        <a href="#" className="flex items-center gap-2.5 group">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-violet-600 transition-transform group-hover:scale-110">
            <Feather className="h-5 w-5 text-ink-950" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-white">
            FadeMemo
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-amber-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href="#download"
            className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink-950 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/30"
          >
            立即下载
          </a>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="切换菜单"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass overflow-hidden border-t border-white/5 md:hidden"
          >
            <ul className="container flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-4 py-3 text-base font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-amber-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-2 px-4">
                <a
                  href="#download"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-ink-950"
                >
                  立即下载
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
