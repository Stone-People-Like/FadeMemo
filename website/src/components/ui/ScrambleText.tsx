/**
 * ScrambleText.tsx - Smooth Fade-In & Slide-Up Text Component (Scramble / Random Chars Disabled)
 */

import { motion, AnimatePresence } from "framer-motion";

interface ScrambleTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export default function ScrambleText({ text, className = "" }: ScrambleTextProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={text}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`inline-block ${className}`}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}

