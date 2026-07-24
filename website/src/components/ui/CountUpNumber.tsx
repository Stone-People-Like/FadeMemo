/**
 * CountUpNumber.tsx - High frequency count-up animation component
 */

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface CountUpNumberProps {
  value: string;
  duration?: number;
  className?: string;
}

export default function CountUpNumber({ value, duration = 1200, className = "" }: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!isInView) return;

    // Match numbers inside the value string (e.g. "6", "0", "100")
    const numericMatch = value.match(/\d+/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseInt(numericMatch[0], 10);
    const prefix = value.substring(0, numericMatch.index);
    const suffix = value.substring(numericMatch.index! + numericMatch[0].length);

    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuad = 1 - Math.pow(1 - progress, 3);
      const currentNum = Math.floor(easeOutQuad * targetNum);

      setDisplayValue(`${prefix}${currentNum}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
