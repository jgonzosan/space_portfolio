"use client";

import { useEffect, useRef, useState, WheelEvent, TouchEvent } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import WarpTransition from "./components/WarpTransition";


export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSections = 6; // 1 hero + 5 transition slides
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
      }, 550); 
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

  // Subtitle cycler logic
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const subtitles = [
    "Software Engineer",
    "Game Developer",
    "Creative Technologist",
    "Veteran"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % subtitles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [subtitles.length]);

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
            <div className={styles.titleGroup}>
              <h1 className={styles.name}>Jonathan Gonzalez</h1>
              <div className={styles.subtitleWrapper}>
                {subtitles.map((text, i) => (
                  <span 
                    key={text} 
                    className={`${styles.subtitle} ${i === subtitleIndex ? styles.subtitleActive : ''}`}
                  >
                    {text}
                  </span>
                ))}
              </div>
            </div>
            
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

        {/* ── Warp transition slides ── */}
        <WarpTransition id="warp-1" src="/meta_moon.png"        alt="Lunar surface" />
        <WarpTransition id="warp-2" src="/universal_mars.jpeg"  alt="Mars surface" />
        <WarpTransition id="warp-3" src="/cgcookie_pluto.jpeg"  alt="Pluto surface" />
        <WarpTransition id="warp-4" src="/military_station.jpeg" alt="Military station" />

        {/* ── Contact slide with astronaut + LinkedIn overlay ── */}
        <WarpTransition id="warp-5" src="/contact.jpeg" alt="Contact">
          {/* Typewriter heading */}
          <p className={styles.typewriter}>Work with me!</p>

          {/* Floating images row */}
          <div className={styles.imagesRow}>
            {/* Floating astronaut */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/astronaut_transparent.png"
              alt="Floating astronaut"
              className={styles.astronaut}
            />

            {/* LinkedIn button */}
            <button
              className={styles.linkedinBtn}
              onClick={() => window.open("https://www.linkedin.com/in/jonathangonzalez01/", "_blank")}
              aria-label="Visit LinkedIn profile"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/linkedin_transparent.png"
                alt="LinkedIn"
                className={styles.linkedinImg}
              />
            </button>
          </div>

          {/* Copyright footer */}
          <footer className={styles.copyrightBar}>
            © 2026 Jonathan Gonzalez &mdash; Made with love with Nano Banana Pro, Antigravity, and Claude
          </footer>
        </WarpTransition>



      </div>
    </div>
  );
}
