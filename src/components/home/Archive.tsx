"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { archive } from "@/data/content";
import styles from "./Archive.module.css";

export function Archive() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      gsap.fromTo(
        "[data-still]",
        { scale: 1.18, yPercent: 8 },
        {
          scale: 1,
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        },
      );

      gsap.from("[data-caption]", {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-caption]",
          start: "top 85%",
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.section} id="archivo">
      <div className={styles.frame}>
        <img
          data-still
          className={styles.still}
          src="/images/crowd.jpg"
          alt="Archivo visual de SOUNDCTUARY: la pista, las luces, el cuerpo"
        />
        <div className={styles.meta} data-caption>
          <p className="kicker">
            {archive.kicker} / {archive.index}
          </p>
          <h2>{archive.caption}</h2>
          <p className={styles.credit}>{archive.credit}</p>
        </div>
      </div>
    </section>
  );
}
