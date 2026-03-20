"use client";

import { useEffect, useRef, useCallback } from "react";
import styles from "./WarpTransition.module.css";

interface Props {
  id?: string;
}

export default function WarpTransition({ id }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lunarRef = useRef<HTMLImageElement>(null);

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
    if (!section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = vh + rect.height;
      const traveled = vh - rect.top;
      const p = Math.max(0, Math.min(1, traveled / total));
      updateLunar(p);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [updateLunar]);

  return (
    <section ref={sectionRef} id={id} className={styles.section}>
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
