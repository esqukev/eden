"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { umbral } from "@/data/content";
import styles from "./Umbral.module.css";

export function Umbral() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const scene = el.querySelector<HTMLElement>("[data-scene]");
      const rule = el.querySelector<HTMLElement>("[data-rule]");
      const copy = el.querySelectorAll("[data-copy]");
      if (!scene || !rule) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(rule, { scaleX: 1, scaleY: 1 });
        gsap.set(copy, { autoAlpha: 1, y: 0 });
        return;
      }

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.set(rule, { scaleY: 0, scaleX: 1 });
        gsap.set(copy, { autoAlpha: 0, y: 18 });
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: scene,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
            },
          })
          .to(rule, { scaleY: 1, duration: 0.45 }, 0)
          .to(copy, { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.06 }, 0.22);
      });
      mm.add("(max-width: 767px)", () => {
        gsap.set(rule, { scaleX: 0, scaleY: 1 });
        gsap.set(copy, { autoAlpha: 0, y: 18 });
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: scene,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
            },
          })
          .to(rule, { scaleX: 1, duration: 0.45 }, 0)
          .to(copy, { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.06 }, 0.22);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.section} id="umbral">
      <div className={styles.scene} data-scene>
        <div className={styles.sticky}>
          <p className={styles.line} data-copy>
            {umbral.left}
          </p>
          <span className={styles.rule} data-rule aria-hidden="true" />
          <p className={`${styles.line} ${styles.right}`} data-copy>
            {umbral.right}
          </p>
        </div>
      </div>
    </section>
  );
}
