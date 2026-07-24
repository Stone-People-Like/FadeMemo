/**
 * FadeMemoLogo.tsx - Commercial Champagne Gold Dissolving Book Logo
 * Icon: Book on the left dissolving into particles on the right.
 * Micro-interaction: Particles Glow Pulse on hover.
 */

interface FadeMemoLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function FadeMemoLogo({ className = "h-9 w-auto", iconOnly = false }: FadeMemoLogoProps) {
  return (
    <div className={`group flex items-center gap-3 cursor-pointer select-none ${className}`}>
      {/* Dynamic SVG Icon */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-9 w-auto overflow-visible transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Primary Champagne Gold Gradient */}
            <linearGradient id="champagneGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C5A880" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#E5D2B8" />
            </linearGradient>

            {/* Line Dissolve Fade Gradient */}
            <linearGradient id="lineDissolveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E5D2B8" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#C5A880" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#C5A880" stopOpacity="0.1" />
            </linearGradient>

            {/* Glow Filter for Particles Hover Pulse */}
            <filter id="particleGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Left Book Spine & Outer Shell */}
          <path
            d="M 50 28 C 43 28 33 32 33 42 L 33 125 C 33 133 42 137 50 135 C 63 132 78 135 93 142 L 93 44 C 78 34 63 30 50 28 Z"
            fill="url(#champagneGoldGrad)"
            opacity="0.9"
          />

          {/* Main Open Book Body */}
          <path
            d="M 53 35 C 66 33 81 37 96 44 C 110 37 125 33 136 35 C 140 35.5 143 38 143 42 L 143 110 C 130 108 114 112 96 122 C 80 112 64 108 53 110 Z"
            fill="#090B10"
            stroke="url(#champagneGoldGrad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Content Lines (Fading towards right) */}
          <g stroke="url(#lineDissolveGrad)" strokeWidth="3.5" strokeLinecap="round">
            <line x1="66" y1="52" x2="108" y2="52" />
            <line x1="66" y1="68" x2="116" y2="68" />
            <line x1="66" y1="84" x2="102" y2="84" />
            <line x1="66" y1="100" x2="95" y2="100" />
          </g>

          {/* Dissolving Particles on Right (Particles Glow Pulse on hover) */}
          <g className="transition-all duration-500 group-hover:filter-[url(#particleGlowFilter)]">
            {/* Row 1 particles */}
            <circle cx="124" cy="52" r="3.2" fill="#E5D2B8" className="transition-all duration-300 group-hover:animate-ping" />
            <circle cx="136" cy="49" r="2.6" fill="#C5A880" />
            <circle cx="148" cy="45" r="2.1" fill="#E5D2B8" opacity="0.85" />
            <circle cx="160" cy="41" r="1.6" fill="#C5A880" opacity="0.65" />
            <circle cx="172" cy="47" r="1.2" fill="#E5D2B8" opacity="0.45" />

            {/* Row 2 particles */}
            <circle cx="130" cy="68" r="3.4" fill="#C5A880" />
            <circle cx="144" cy="66" r="2.8" fill="#E5D2B8" />
            <circle cx="156" cy="70" r="2.2" fill="#C5A880" opacity="0.8" />
            <circle cx="168" cy="63" r="1.7" fill="#E5D2B8" opacity="0.6" />
            <circle cx="180" cy="67" r="1.2" fill="#C5A880" opacity="0.4" />

            {/* Row 3 particles */}
            <circle cx="118" cy="84" r="3.0" fill="#E5D2B8" />
            <circle cx="132" cy="86" r="2.5" fill="#C5A880" />
            <circle cx="146" cy="82" r="2.0" fill="#E5D2B8" opacity="0.75" />
            <circle cx="158" cy="88" r="1.5" fill="#C5A880" opacity="0.5" />
            <circle cx="170" cy="83" r="1.0" fill="#E5D2B8" opacity="0.3" />

            {/* Row 4 particles */}
            <circle cx="112" cy="100" r="2.8" fill="#C5A880" />
            <circle cx="126" cy="102" r="2.2" fill="#E5D2B8" opacity="0.8" />
            <circle cx="140" cy="98" r="1.7" fill="#C5A880" opacity="0.6" />
            <circle cx="154" cy="104" r="1.2" fill="#E5D2B8" opacity="0.4" />

            {/* Micro Floating Dots */}
            <circle cx="164" cy="77" r="1.1" fill="#E5D2B8" opacity="0.5" />
            <circle cx="176" cy="85" r="1.2" fill="#C5A880" opacity="0.35" />
            <circle cx="182" cy="55" r="0.9" fill="#E5D2B8" opacity="0.4" />
          </g>
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-extrabold tracking-tight text-white">
            Fade<span className="bg-gradient-to-r from-[#E5D2B8] via-[#C5A880] to-[#8C6D46] bg-clip-text text-transparent">Memo</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#E5D2B8]">
            v1.0
          </span>
        </div>
      )}
    </div>
  );
}
