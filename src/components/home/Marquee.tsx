"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./Marquee.module.css";

export function Marquee({ words }: { words: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  const tape = Array.from({ length: 6 }, () => words).flat();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const track = el.querySelector<HTMLElement>("[data-track]");
      const seq = el.querySelector<HTMLElement>("[data-seq]");
      if (!track || !seq) return;

      const clone = seq.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      clone.removeAttribute("data-seq");
      track.appendChild(clone);

      if (reduce) {
        return () => clone.remove();
      }

      const tween = gsap.to(track, {
        x: () => -seq.offsetWidth,
        duration: () => Math.max(seq.offsetWidth / 70, 14),
        ease: "none",
        repeat: -1,
      });

      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          tween.timeScale(self.direction === 1 ? 1 : -1);
        },
      });

      return () => {
        clone.remove();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.marquee}>
      <div className={styles.track} data-track>
        <div className={styles.seq} data-seq>
          {tape.map((word, i) => (
            <span key={`${word}-${i}`}>{word}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
