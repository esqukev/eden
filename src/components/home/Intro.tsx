"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { intro } from "@/data/content";
import { Marquee } from "./Marquee";
import styles from "./Intro.module.css";

export function Intro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mm = gsap.matchMedia();
      const scene = el.querySelector<HTMLElement>("[data-scene]");
      if (!scene) return;

      const play = (closed: string) => {
        if (reduce) {
          gsap.set("[data-gate]", { clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set("[data-copy]", { autoAlpha: 1, y: 0 });
          return;
        }

        gsap
          .timeline({
            scrollTrigger: {
              trigger: scene,
              start: "top top",
              end: "bottom top",
              scrub: 0.9,
            },
          })
          .fromTo(
            "[data-gate]",
            { clipPath: closed },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.72, ease: "none" },
            0,
          )
          .fromTo("[data-photo]", { scale: 1.22 }, { scale: 1, duration: 1, ease: "none" }, 0)
          .fromTo(
            "[data-copy]",
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.28, ease: "none" },
            0.38,
          )
          .to("[data-shade]", { opacity: 1, duration: 0.25, ease: "none" }, 0.55);
      };

      mm.add("(min-width: 768px)", () => play("inset(47.5% 22% 47.5% 22%)"));
      mm.add("(max-width: 767px)", () => play("inset(46% 8% 46% 8%)"));

      return () => mm.revert();
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

          <div className={styles.copy} data-copy>
            <p>{intro.kicker}</p>
            <h2>{intro.line}</h2>
          </div>
        </div>
      </div>

      <Marquee words={intro.ticker} />
    </section>
  );
}
