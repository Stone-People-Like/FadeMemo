/**
 * TiltCard.tsx - Reusable 3D Tilt Card with Radial Light Tracker
 */

import React, { useRef, useState, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: string;
  enableGlow?: boolean;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 10,
  glowColor = "rgba(255, 184, 0, 0.15)",
  enableGlow = true,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    setMousePos({ x: mouseX, y: mouseY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden transition-shadow duration-300 ${className}`}
      {...(props as any)}
    >
      {/* Radial Light Tracker overlay following cursor */}
      {enableGlow && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 z-10"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 45%)`,
          }}
        />
      )}

      {/* Card Content with slight Z translation */}
      <div style={{ transform: "translateZ(20px)" }} className="relative z-20 h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}
