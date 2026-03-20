import Image from "next/image";
import styles from "./page.module.css";
import WarpTransition from "./components/WarpTransition";

// Placeholder content sections that appear between transitions
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
  return (
    <div className={styles.page}>
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
        <div key={i}>
          <WarpTransition id={`warp-${i + 1}`} />
          <ContentSection index={i} />
        </div>
      ))}
    </div>
  );
}
