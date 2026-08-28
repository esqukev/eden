"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { intro } from "@/data/content";
import { Marquee } from "./Marquee";
import styles from "./Intro.module.css";

const CLOSED = "inset(50% 50% 50% 50%)";
const OPEN = "inset(0% 0% 0% 0%)";

export function Intro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const scene = el.querySelector<HTMLElement>("[data-scene]");
      if (!scene) return;

      if (reduce) {
        gsap.set("[data-gate]", { clipPath: OPEN });
        return;
      }

      gsap.set("[data-gate]", { clipPath: CLOSED });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "bottom top",
            scrub: 0.9,
          },
        })
        .fromTo("[data-photo]", { scale: 1.28 }, { scale: 1, duration: 0.72, ease: "none" }, 0.1)
        .fromTo("[data-gate]", { clipPath: CLOSED }, { clipPath: OPEN, duration: 0.58, ease: "none" }, 0.1)
        .to("[data-shade]", { opacity: 1, duration: 0.14, ease: "none" }, 0.48)
        .to("[data-gate]", { clipPath: CLOSED, duration: 0.22, ease: "none" }, 0.78);
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.section} id="intro">
      <div className={styles.scene} data-scene>
        <div className={styles.sticky}>
          <div className={styles.gate} data-gate>
            <div className={styles.photo} data-photo>
              <img src={intro.image} alt={intro.alt} />
            </div>
            <div className={styles.shade} data-shade />
          </div>
        </div>
      </div>
      <Marquee words={intro.ticker} />
    </section>
  );
}
