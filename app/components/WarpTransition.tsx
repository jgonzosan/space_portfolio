import { ReactNode } from "react";
import styles from "./WarpTransition.module.css";

interface Props {
  id?: string;
  src: string;
  alt?: string;
  children?: ReactNode;
}

export default function WarpTransition({ id, src, alt = "Transition image", children }: Props) {
  return (
    <section id={id} className={styles.section}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={styles.lunar}
      />
      {children && (
        <div className={styles.overlay}>
          {children}
        </div>
      )}
    </section>
  );
}
