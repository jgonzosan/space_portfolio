"use client";

import { useEffect, useRef, useState, WheelEvent, TouchEvent } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import WarpTransition from "./components/WarpTransition";

function ContentSection({ index }: { index: number }) {
  const labels = [
    { title: "About Me", sub: "Explorer of code & cosmos" },
    { title: "Projects",  sub: "Things I've built" },
    { title: "Experience", sub: "My journey so far" },
    { title: "Contact",  sub: "Let's connect" },
  ];
  const { title, sub } = labels[index] ?? { title: `Section ${index + 1}`, sub: "" };
  return (
    <section className={styles.contentSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionSub}>{sub}</p>
    </section>
  );
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSections = 1 + 4 * 2; // 1 hero + 4 (transition + content) = 9
  const isTransitioning = useRef(false);
  const touchStartY = useRef(0);

  const navigate = (direction: 1 | -1) => {
    if (isTransitioning.current) return;
    setCurrentIndex((prev) => {
      const next = prev + direction;
      if (next < 0 || next >= totalSections) return prev;
      
      // Lock for the duration of the bounce animation
      isTransitioning.current = true;
      setTimeout(() => {
        isTransitioning.current = false;
      }, 1000); 
      return next;
    });
  };

  const handleWheel = (e: WheelEvent) => {
    // Simple threshold to avoid accidental tiny scrolls
    if (Math.abs(e.deltaY) < 30) return;
    navigate(e.deltaY > 0 ? 1 : -1);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - endY;
    if (Math.abs(diff) < 40) return;
    navigate(diff > 0 ? 1 : -1);
  };

  // Prevent native scroll on mount
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div 
      className={styles.page}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className={styles.container}
        style={{ transform: `translateY(-${currentIndex * 100}vh)` }}
      >
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.content}>
            <h1 className={styles.name}>Jonathan Gonzalez</h1>
            <Image
              src="/astronaut_transparent.png"
              alt="Floating astronaut"
              width={380}
              height={380}
              priority
              className={styles.astronaut}
            />
          </div>
        </section>

        {/* ── 4 Warp transitions, each followed by a content section ── */}
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={styles.sectionGroup}>
            <WarpTransition id={`warp-${i + 1}`} />
            <ContentSection index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
