import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Platforms from "./components/Platforms";
import Preview from "./components/Preview";
import CallToAction from "./components/CallToAction";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-slate-100">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Platforms />
        <Preview />
        <CallToAction />
      </main>
    </div>
  );
}
