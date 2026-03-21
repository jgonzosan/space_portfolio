import { ReactNode } from "react";
import styles from "./WarpTransition.module.css";
import SidePanel, { PanelContent } from "./SidePanel";

interface Props {
  id?: string;
  src: string;
  alt?: string;
  children?: ReactNode;
  isActive?: boolean;
  showPanel?: boolean;
  showGrid?: boolean;
  content?: PanelContent;
}

export default function WarpTransition({ id, src, alt = "Transition image", children, isActive = false, showPanel = false, showGrid = false, content }: Props) {
  return (
    <section id={id} className={styles.section}>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={styles.lunar}
      />

      {showGrid && <div className={styles.gridOverlay} />}

      {/* HUD side panel — shown on warp slides 1–4 */}
      {showPanel && content && <SidePanel isActive={isActive} content={content} />}

      {children && (
        <div className={styles.overlay}>
          {children}
        </div>
      )}
    </section>
  );
}
