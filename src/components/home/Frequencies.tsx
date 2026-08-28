"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { frequencies } from "@/data/content";
import styles from "./Frequencies.module.css";

export function Frequencies() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const track = el.querySelector("[data-track]") as HTMLElement;
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${Math.max(track.scrollWidth - window.innerWidth, window.innerHeight)}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const loop = [...frequencies.words, ...frequencies.words];

  return (
    <section ref={root} className={styles.section} id="frecuencia">
      <div className={styles.head}>
        <p className="kicker">{frequencies.kicker}</p>
        <h2>{frequencies.statement}</h2>
      </div>
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {loop.map((word, i) => (
            <span key={`m-${word}-${i}`}>{word}</span>
          ))}
        </div>
      </div>
      <div className={styles.viewport}>
        <div className={styles.track} data-track>
          {loop.map((word, i) => (
            <span key={`${word}-${i}`} className={styles.word}>
              {word}
              <i>/</i>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
