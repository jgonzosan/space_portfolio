"use client";

import { useEffect, useRef, useState, WheelEvent, TouchEvent } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import WarpTransition from "./components/WarpTransition";


export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [utcDate, setUtcDate] = useState("");

  // Update UTC date on mount
  useEffect(() => {
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(now.getUTCDate()).padStart(2, '0');
    setUtcDate(`${yyyy}-${mm}-${dd}`);
  }, []);
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

  // Placeholder content for the 4 side panels
  const panelContents = [
    {
      company: "Meta",
      position: "Software Engineer V",
      dateRange: "JAN 2024 - MAR 2026",
      description: "Collaborated closely with Computer Vision and Machine Learning research groups to architect specialized visualization tools that powered AI-driven 3D asset generation and massive ML pipelines. Using a multifaceted stack including React, GraphQL, Hack, and Python, I built advanced 3D visual inspection platforms—leveraging BabylonJS—that empowered researchers to actively debug model outputs and huge datasets.\n\nOn the infrastructure side, I developed robust backend microservices using Thrift and MySQL, integrating complex Hive analytics to completely streamline critical research workflows.\n\nTo maintain high engineering velocity, I deeply integrated AI-assisted coding tools into my daily process, drastically accelerating feature deployment and automated testing across the entire stack.",
      skills: ["React", "GraphQL", "Python", "BabylonJS", "Hack", "MySQL", "Hive", "AI"],
      link: "https://www.meta.com",
      linkText: "meta.com"
    },
    {
      company: "Universal Music Group",
      position: "Full Stack Software Engineer",
      dateRange: "OCT 2020 - MAR 2024",
      description: "Engineered massive global digital marketing experiences for UMG's top-tier artists—including Taylor Swift, Post Malone, Lady Gaga, and Twice. Leveraging a modern TypeScript stack with Next.js and Node.js, I architected complex real-time engagement platforms integrating Spotify streams, OpenAI systems, and interactive Socket.io chats.\n\nBeyond traditional web applications, I developed immersive 3D and WebAR fan experiences using tools like BabylonJS and 8th Wall, alongside bespoke Apple Wallet download campaigns.\n\nMy work was underpinned by highly resilient backend microservices managed through Prisma and PostgreSQL, and rigorously validated via comprehensive test suites to ensure flawlessly branded, high-traffic global rollouts.",
      skills: ["Next.js", "Node.js", "TypeScript", "PostgreSQL", "Socket.io", "WebAR", "Prisma", "Tailwind CSS"],
      link: "https://www.universalmusic.com",
      linkText: "universalmusic.com"
    },
    {
      company: "CGCookie",
      position: "Lead Game Development Instructor",
      dateRange: "SEP 2014 - SEP 2019",
      description: "Spearheaded expansive educational initiatives by directly producing over 100 hours of professional course content covering Unity, C#, and advanced game development methodologies. Operating as a primary instructor, I mentored thousands of aspiring developers globally through interactive livestreams and dedicated community engagement.\n\nBeyond pure instruction, I actively built and published numerous WebGL, VR, and PC applications powered by highly complex interactive systems. My role consistently merged technical software development with creative execution, punctuated by the creation of over 65 highly optimized, low-poly 3D assets designed explicitly for production environments.",
      skills: ["Unity", "C#", "WebGL", "VR", "Game Dev", "3D Assets", "Mentoring", "Livestreaming"],
      link: "https://cgcookie.com",
      linkText: "cgcookie.com"
    },
    {
      company: "US Air Force",
      position: "Staff Sergeant",
      dateRange: "AUG 2005 - OCT 2013",
      description: "Across an 8-year tenure, I served in three highly technical roles.\n\nAs a Visual Imagery and Intrusion Detection Systems Technician (2E154), including a remote tour at Osan AB, South Korea, I installed and maintained complex security frameworks such as fiber optics, CCTV, and infrared sensors in classified areas.\n\nAs an HH-60 Flight Engineer (1A131), I completed rigorous SERE training, logged 80 flight hours, and executed tactical rescue missions utilizing hoist and fast-rope deployments, alongside Dillon Aero Minigun operations.\n\nFinally, as a Network Infrastructure Supervisor (3D152), I directed a 15-Airmen team, resolved over 1,000 technical tickets for a 5,000+ member base, and deployed to Ali Al Salem AB, Kuwait, serving as a Systems Administrator for over 500 personnel.",
      skills: ["Security Systems", "Fiber Optics", "Networking", "System Admin", "Leadership", "Aviation", "Tactical Rescue"],
      skillWidth: "150px",
      link: "https://www.airforce.com",
      linkText: "airforce.com"
    }
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
            {/* HUD Panel with corner brackets */}
            <div className={styles.hudPanel}>
              {/* Animated corner group wrapper */}
              <div className={styles.hudCornerGroup}>
                <span className={styles.hudCornerTL} aria-hidden />
                <span className={styles.hudCornerTR} aria-hidden />
                <span className={styles.hudCornerBL} aria-hidden />
                <span className={styles.hudCornerBR} aria-hidden />
              </div>

              {/* Decorative status readout */}
              <div className={styles.hudStatusBar}>
                <span>LAT 34.0195°N</span>
                <span>LON 118.4912°W</span>
                <span>ALT 412KM</span>
                <span>SYS ONLINE ▮</span>
              </div>

              <div className={styles.hudRail} />

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

              <div className={styles.hudRail} />

              {/* Bottom status readout */}
              <div className={styles.hudStatusBar}>
                <span>VEC NOMINAL</span>
                <span>SHIELDS 100%</span>
                <span>UTC {utcDate || "2026-03-21"}</span>
              </div>
            </div>

            <Image
              src="/icons/astronaut_transparent.png"
              alt="Floating astronaut"
              width={380}
              height={380}
              priority
              className={styles.astronaut}
            />
          </div>
        </section>


        {/* ── Warp transition slides ── */}
        <WarpTransition id="warp-1" src="/background_images/meta_moon.png" alt="Lunar surface" isActive={currentIndex === 1} showPanel showGrid content={panelContents[0]} />
        <WarpTransition id="warp-2" src="/background_images/universal_mars.jpeg" alt="Mars surface" isActive={currentIndex === 2} showPanel showGrid content={panelContents[1]} />
        <WarpTransition id="warp-3" src="/background_images/cgcookie_pluto.jpeg" alt="Pluto surface" isActive={currentIndex === 3} showPanel showGrid content={panelContents[2]} />
        <WarpTransition id="warp-4" src="/background_images/military_station.jpeg" alt="Military station" isActive={currentIndex === 4} showPanel showGrid content={panelContents[3]} />

        {/* ── Contact slide with astronaut + LinkedIn overlay ── */}
        <WarpTransition id="warp-5" src="/background_images/contact.jpeg" alt="Contact">
          {/* Typewriter heading */}
          <p className={styles.typewriter}>Work with me</p>

          {/* Floating images row */}
          <div className={styles.imagesRow}>
            {/* Floating astronaut */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/astronaut_transparent.png"
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
                src="/icons/linkedin_transparent.png"
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
