/**
 * Navbar.tsx - Apple / Stripe Commercial Luxury Navbar
 * Features new FadeMemo Champagne Gold Logo with Particles Glow Pulse
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { navLinks } from "../data/content";
import { scrollToSection } from "../lib/utils";
import FadeMemoLogo from "./ui/FadeMemoLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id: string) => {
    setMobileOpen(false);
    scrollToSection(id);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2.5" : "py-5"
      }`}
    >
      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className={`flex h-14 items-center justify-between rounded-full px-5 transition-all duration-300 relative overflow-hidden ${
            scrolled
              ? "glass-header border border-[#C5A880]/25 bg-[#090B10]/90 shadow-2xl backdrop-blur-xl"
              : "bg-[#090B10]/40 backdrop-blur-md border border-white/10"
          }`}
        >
          {/* Top Champagne Gold Glow Line */}
          {scrolled && (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A880]/50 to-transparent" />
          )}

          {/* Brand Logo with Particles Glow Pulse */}
          <a href="#" className="flex items-center">
            <FadeMemoLogo />
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-1 md:flex rounded-full bg-white/[0.03] p-1 border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNav(link.href.replace("#", ""))}
                  className="relative rounded-full px-4 py-1.5 text-xs font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-[#E5D2B8]"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scrollToSection("download")}
              className="relative group overflow-hidden rounded-full bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#E5D2B8] px-5 py-2 text-xs font-extrabold text-slate-950 transition-all duration-200 hover:shadow-lg hover:shadow-[#C5A880]/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                免费开启记忆重构 <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mx-4 mt-2 overflow-hidden rounded-2xl border border-white/10 glass-card p-4 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNav(link.href.replace("#", ""))}
                    className="block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-[#E5D2B8]"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li className="mt-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => handleNav("download")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#E5D2B8] px-5 py-3 text-sm font-extrabold text-slate-950 active:scale-[0.98]"
                >
                  免费开启记忆重构 <ArrowRight className="h-4 w-4" />
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}