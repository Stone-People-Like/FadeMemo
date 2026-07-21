/**
 * HomePage 首页组件
 * 聚合所有首页区块，作为路由 "/" 的渲染目标
 */

import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Features from "./Features";
import Platforms from "./Platforms";
import Preview from "./Preview";
import CallToAction from "./CallToAction";
import BackToTop from "./BackToTop";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-slate-100">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <About />
        <Platforms />
        <Preview />
        <CallToAction />
      </main>
      <BackToTop />
    </div>
  );
}