/**
 * ParticleBurstCanvas.tsx - Interactive particle burst effect for Sandbox slider feedback
 */

import { useEffect, useRef } from "react";

interface ParticleBurstCanvasProps {
  triggerKey: number | string;
  className?: string;
}

export default function ParticleBurstCanvas({ triggerKey, className = "" }: ParticleBurstCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const colors = ["#FFB800", "#FFD866", "#00F2FE", "#C084FC", "#F43F5E"];

    interface BurstParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      life: number;
      maxLife: number;
    }

    const particles: BurstParticle[] = [];
    const count = 35;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      particles.push({
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 30 + 20,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (let p of particles) {
        if (p.life < p.maxLife) {
          alive = true;
          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;

          const alpha = 1 - p.life / p.maxLife;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * alpha, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
      }

      if (alive) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [triggerKey]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-30 h-full w-full ${className}`}
    />
  );
}
