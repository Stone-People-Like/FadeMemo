/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        lg: "2rem",
        xl: "4rem",
      },
    },
    extend: {
      colors: {
        midnight: "#08090A",
        ink: {
          950: "#090B10",
          900: "#0D0F14",
          850: "#111420",
          800: "#181C28",
          700: "#242A3C",
          600: "#363E56",
        },
        gold: {
          50: "#FAF7F2",
          100: "#F5EFE4",
          200: "#E5D2B8",
          300: "#D4AF37",
          400: "#C5A880",
          500: "#B39268",
          600: "#8C6D46",
          700: "#684E2E",
        },
        aurora: {
          950: "#0E0B1A",
          900: "#140F28",
          800: "#1F173D",
          500: "#7C3AED",
          400: "#A78BFA",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#E5D2B8",
          400: "#C5A880",
          500: "#B39268",
          600: "#8C6D46",
          700: "#684E2E",
        },
        cyan: {
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#00F2FE",
          600: "#0891B2",
        },
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
      },
      fontFamily: {
        display: ['"Inter"', '"SF Pro Display"', "-apple-system", "system-ui", "sans-serif"],
        sans: ['"Inter"', '"SF Pro Text"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 12s ease-in-out infinite",
        "gradient-shift": "gradientShift 15s ease infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "border-beam": "borderBeam 6s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        borderBeam: {
          "100%": { offsetDistance: "100%" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "dots-pattern":
          "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

