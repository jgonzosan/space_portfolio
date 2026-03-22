"use client";

import { useEffect, useRef, useState, Fragment } from "react";
import styles from "./SidePanel.module.css";

export interface PanelContent {
  company: string;
  position: string;
  dateRange: string;
  description: string;
  skills: string[];
  panelWidth?: string;
  skillWidth?: string;
  link?: string;
  linkText?: string;
}

interface Props {
  isActive: boolean;
  content: PanelContent;
}

type PanelState = "hidden" | "collapsed" | "open";

export default function SidePanel({ isActive, content }: Props) {
  const [panelState, setPanelState]     = useState<PanelState>("hidden");
  const [contentVisible, setContentVisible] = useState(false);
  const [isPopping, setIsPopping]       = useState(false);

  const hasPlayedIntro    = useRef(false);
  const rememberedState   = useRef<"open" | "collapsed">("open");

  const t1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t3 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t4 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAll = () =>
    [t1, t2, t3, t4].forEach((t) => { if (t.current) clearTimeout(t.current); });

  // Show content after panel finishes opening (0.6s transition)
  const openPanel = () => {
    setPanelState("open");
    t4.current = setTimeout(() => setContentVisible(true), 600);
  };

  const closePanel = () => {
    setContentVisible(false);
    setTimeout(() => {
      setPanelState("collapsed");
    }, 250);
  };

  useEffect(() => {
    clearAll();
    if (!isActive) return;

    if (hasPlayedIntro.current) {
      // Subsequent visit: restore state immediately
      if (rememberedState.current === "open") {
        setPanelState("open");
        setContentVisible(true);
      } else {
        setPanelState("collapsed");
        setContentVisible(false);
      }
      return;
    }

    // First visit intro sequence
    t1.current = setTimeout(() => {
      setIsPopping(true);
      setPanelState("collapsed");

      t2.current = setTimeout(() => {
        setIsPopping(false);
        openPanel();

        t3.current = setTimeout(() => {
          hasPlayedIntro.current = true;
        }, 600);
      }, 1150);
    }, 500);

    return clearAll;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const handleToggle = () => {
    if (panelState === "open") {
      rememberedState.current = "collapsed";
      closePanel();
    } else {
      rememberedState.current = "open";
      openPanel();
    }
  };

  return (
    <div
      className={[
        styles.panel,
        panelState === "open"      ? styles.panelOpen      : "",
        panelState === "collapsed" ? styles.panelCollapsed : "",
        isPopping                  ? styles.panelPopping   : "",
      ].join(" ")}
      aria-hidden={panelState === "hidden"}
      style={{
        '--panel-width': content.panelWidth || '50vw',
        '--skill-width': content.skillWidth || '120px'
      } as React.CSSProperties}
    >
      {/* ── Toggle button ── */}
      <button
        className={styles.toggleBtn}
        onClick={handleToggle}
        aria-label={panelState === "open" ? "Collapse panel" : "Expand panel"}
      >
        <span className={styles.btnCornerTL} aria-hidden />
        <span className={styles.btnCornerTR} aria-hidden />
        <span className={styles.btnCornerBL} aria-hidden />
        <span className={styles.btnCornerBR} aria-hidden />
        <span className={styles.btnIcon}>
          {panelState === "collapsed" ? "›" : "✕"}
        </span>
      </button>

      {/* ── Panel body ── */}
      <div
        className={[styles.body, contentVisible ? styles.bodyVisible : ""].join(" ")}
        aria-hidden={!contentVisible}
      >
        {/* ── Top row: company ── */}
        <div className={`${styles.topRow} ${styles.fadeInItem}`} style={{ animationDelay: "0ms" }}>
          <h2 className={styles.companyName}>{content.company}</h2>
        </div>

        {content.link && (
          <div className={`${styles.linkRow} ${styles.fadeInItem}`} style={{ animationDelay: "50ms" }}>
            <span className={styles.linkIconBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </span>
            <a href={content.link} target="_blank" rel="noopener noreferrer" className={styles.linkText}>
              {content.linkText || "Visit Website"}
            </a>
          </div>
        )}

        {/* ── Main horizontal dividers (thin + thick) ── */}
        <div className={styles.fadeInItem} style={{ animationDelay: "200ms", width: "100%" }}>
          <div className={styles.dividerThin} />
          <div className={styles.dividerThick} />
        </div>

        {/* ── Role & Dates: full width, larger text ── */}
        <div className={`${styles.roleBlock} ${styles.fadeInItem}`} style={{ animationDelay: "100ms" }}>
          <span className={styles.position}>{content.position}</span>
          <div className={styles.dateChipsWrapper}>
            {content.dateRange.split('-').map((dateStr, idx, arr) => (
              <Fragment key={idx}>
                <span className={styles.dateChip}>{dateStr.trim()}</span>
                {idx < arr.length - 1 && <span className={styles.greenDot} />}
              </Fragment>
            ))}
          </div>
        </div>

        {/* ── Thin divider above description ── */}
        <div className={`${styles.dividerThin} ${styles.fadeInItem}`} style={{ animationDelay: "450ms" }} />

        {/* ── Bottom Content: description stacked above skills ── */}
        <div className={styles.bottomContent}>
          <div className={`${styles.descriptionWrapper} ${styles.fadeInItem}`} style={{ animationDelay: "600ms" }}>
            <div className={styles.descriptionScroll}>
              {content.description.split('\n\n').map((para, i) => (
                <p key={i} className={styles.description}>{para}</p>
              ))}
            </div>
            {/* Dividers are now OUTSIDE the scroll area, fixed at the bottom of the wrapper */}
            <div className={styles.dividerDescGroup}>
              <div className={styles.dividerDescThin} />
              <div className={styles.dividerDescThinDots} />
            </div>
          </div>

          <div className={`${styles.skillsBlock} ${styles.fadeInItem}`} style={{ animationDelay: "300ms" }}>
            <span className={styles.skillsHeader}>SKILLS USED</span>
            <div className={styles.skillsList}>
              {content.skills.map((skill) => (
                <span key={skill} className={styles.skillChip}>
                  {skill}
                </span>
              ))}
              {/* Bottom Decorative Corners */}
              <div className={styles.skillsCornerBL} />
              <div className={styles.skillsCornerBR} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
