"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Atmosphere.module.css";

function SparkGlyph() {
  return (
    <svg className={styles.glyph} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M6 0C6.35 3.45 8.55 5.65 12 6C8.55 6.35 6.35 8.55 6 12C5.65 8.55 3.45 6.35 0 6C3.45 5.65 5.65 3.45 6 0Z" />
    </svg>
  );
}

export function Atmosphere() {
  const root = useRef<HTMLDivElement>(null);
  const drive = useRef<{
    ax: (v: number) => void;
    ay: (v: number) => void;
    bx: (v: number) => void;
    by: (v: number) => void;
    scan: (v: number) => void;
    tick: (v: number) => void;
    sparks: Array<(v: number) => void>;
  } | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const a = el.querySelector<HTMLElement>("[data-orb-a]");
      const b = el.querySelector<HTMLElement>("[data-orb-b]");
      const scan = el.querySelector<HTMLElement>("[data-scan]");
      const tick = el.querySelector<HTMLElement>("[data-tick]");
      const sparks = Array.from(el.querySelectorAll<HTMLElement>("[data-spark]"));
      if (!a || !b || !scan || !tick) return;

      const smooth = { duration: 1.6, ease: "power3.out" as const };
      drive.current = {
        ax: gsap.quickTo(a, "x", smooth),
        ay: gsap.quickTo(a, "y", { duration: 1.9, ease: "power3.out" }),
        bx: gsap.quickTo(b, "x", { duration: 2.1, ease: "power3.out" }),
        by: gsap.quickTo(b, "y", { duration: 2.4, ease: "power3.out" }),
        scan: gsap.quickTo(scan, "y", { duration: 1.1, ease: "power3.out" }),
        tick: gsap.quickTo(tick, "y", { duration: 1.1, ease: "power3.out" }),
        sparks: sparks.map((spark) =>
          gsap.quickTo(spark, "y", { duration: 2.2, ease: "power3.out" }),
        ),
      };

      const w = window.innerWidth;
      const h = window.innerHeight;
      gsap.set(a, { x: w * 0.22, y: h * 0.12 });
      gsap.set(b, { x: w * 0.78, y: h * 0.68 });
    },
    { scope: root },
  );

  useLenis((lenis) => {
    const d = drive.current;
    if (!d) return;
    const p = lenis.progress;
    const v = gsap.utils.clamp(-1, 1, lenis.velocity / 48);
    const w = window.innerWidth;
    const h = window.innerHeight;
    d.ax(w * (0.2 + p * 0.18) + v * 28);
    d.ay(h * (0.1 + p * 0.34));
    d.bx(w * (0.82 - p * 0.16) - v * 18);
    d.by(h * (0.62 + p * 0.14));
    d.scan(p * h * 0.92);
    d.tick(p * h * 0.92);
    d.sparks[0]?.(h * (0.18 + p * 0.12));
    d.sparks[1]?.(h * (0.58 + p * 0.08));
  });

  return (
    <div ref={root} className={styles.field} aria-hidden="true">
      <span className={styles.orb} data-orb-a />
      <span className={`${styles.orb} ${styles.orbB}`} data-orb-b />
      <span className={styles.scan} data-scan />
      <span className={`${styles.rail} ${styles.railL}`} />
      <span className={`${styles.rail} ${styles.railR}`} />
      <span className={styles.tick} data-tick />
      <span className={`${styles.spark} ${styles.sparkL}`} data-spark>
        <SparkGlyph />
      </span>
      <span className={`${styles.spark} ${styles.sparkR}`} data-spark>
        <SparkGlyph />
      </span>
    </div>
  );
}
