"use client";

import { useEffect, useRef, useCallback } from "react";
import styles from "./WarpTransition.module.css";

interface WarpStar {
  angle: number;
  speed: number;
  length: number;
  opacity: number;
  distance: number;
}

interface Props {
  id?: string;
}

const NUM_STARS = 220;

function initStars(): WarpStar[] {
  return Array.from({ length: NUM_STARS }, () => ({
    angle: Math.random() * Math.PI * 2,
    speed: 0.3 + Math.random() * 0.7,
    length: 0,
    opacity: 0.5 + Math.random() * 0.5,
    distance: 20 + Math.random() * 180,
  }));
}

export default function WarpTransition({ id }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lunarRef = useRef<HTMLImageElement>(null);
  
  const progressRef = useRef(0);
  const lastDrawnProgressRef = useRef(-1);
  const isVisibleRef = useRef(false);
  const rafRef = useRef<number>(0);
  const starsRef = useRef<WarpStar[]>(initStars());

  const drawFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    const ease = Math.pow(progress, 0.7); // ease-in curve
    const intensity = ease;

    if (intensity < 0.01) return;

    const stars = starsRef.current;
    stars.forEach((star) => {
      const maxLen = (star.distance + 200) * intensity * star.speed * 3.2;
      const len = maxLen;
      const startDist = star.distance * (0.6 + intensity * 0.4);

      const sx = cx + Math.cos(star.angle) * startDist;
      const sy = cy + Math.sin(star.angle) * startDist;
      const ex = cx + Math.cos(star.angle) * (startDist + len);
      const ey = cy + Math.sin(star.angle) * (startDist + len);

      const alpha = star.opacity * Math.min(intensity * 2, 1);
      const width = 0.5 + intensity * 2.5 * star.speed;

      const grad = ctx.createLinearGradient(sx, sy, ex, ey);
      grad.addColorStop(0, `rgba(255,255,255,0)`);
      grad.addColorStop(0.3, `rgba(200,220,255,${alpha * 0.6})`);
      grad.addColorStop(1, `rgba(255,255,255,${alpha})`);

      ctx.save();
      ctx.strokeStyle = grad;
      ctx.lineWidth = width;
      ctx.shadowColor = "rgba(160, 200, 255, 0.4)";
      ctx.shadowBlur = 3 * intensity;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.restore();
    });

    if (intensity > 0.05) {
      const glowR = 60 + intensity * 120;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      glow.addColorStop(0, `rgba(180, 210, 255, ${0.18 * intensity})`);
      glow.addColorStop(1, `rgba(0,0,0,0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const updateLunar = useCallback((progress: number) => {
    const lunar = lunarRef.current;
    if (!lunar) return;
    const rise = Math.max(0, (progress - 0.12) / 0.73);
    const clampedRise = Math.min(rise, 1);
    const translateY = 100 - clampedRise * 55;
    lunar.style.transform = `translateX(-50%) translateY(${translateY}%)`;
    lunar.style.opacity = String(Math.min(clampedRise * 1.8, 1));
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const resize = () => {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
      lastDrawnProgressRef.current = -1; // force redraw on resize
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = vh + rect.height;
      const traveled = vh - rect.top;
      const p = Math.max(0, Math.min(1, traveled / total));
      progressRef.current = p;
    };

    const animate = () => {
      // Only draw if visible and progress has changed
      if (isVisibleRef.current && progressRef.current !== lastDrawnProgressRef.current) {
        drawFrame(progressRef.current);
        updateLunar(progressRef.current);
        lastDrawnProgressRef.current = progressRef.current;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    // Intersection Observer to pause animation when off-screen
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
            // Force an initial draw when becoming visible
            onScroll();
            lastDrawnProgressRef.current = -1; 
        }
      });
    }, { threshold: 0 });
    
    io.observe(section);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); 
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame, updateLunar]);

  return (
    <section ref={sectionRef} id={id} className={styles.section}>
      <canvas ref={canvasRef} className={styles.canvas} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={lunarRef}
        src="/lunar_transparent.png"
        alt="Lunar surface"
        className={styles.lunar}
      />
    </section>
  );
}
