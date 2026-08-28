"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EdenMark } from "@/components/brand/EdenMark";
import styles from "./Hero.module.css";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mm = gsap.matchMedia();

      const play = (open: string) => {
        if (reduce) {
          gsap.set("[data-gate]", { clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set("[data-mark]", { autoAlpha: 0 });
          return;
        }

        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom top",
              scrub: 0.85,
            },
          })
          .fromTo(
            "[data-gate]",
            { clipPath: open },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "none" },
            0,
          )
          .fromTo("[data-photo]", { scale: 1.18 }, { scale: 1, duration: 1, ease: "none" }, 0)
          .to("[data-mark]", { autoAlpha: 0, scale: 1.12, duration: 0.4, ease: "none" }, 0.35)
          .to("[data-shade]", { opacity: 1, duration: 0.3, ease: "none" }, 0.55);
      };

      mm.add("(min-width: 768px)", () => play("inset(11% 38% 11% 38%)"));
      mm.add("(max-width: 767px)", () => play("inset(18% 10% 18% 10%)"));

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.hero} id="top">
      <div className={styles.sticky}>
        <div className={styles.gate} data-gate>
          <div className={styles.photo} data-photo>
            <img
              src="/images/crowd.jpg"
              alt="Noche en Eden"
              width={1600}
              height={1067}
              fetchPriority="high"
            />
          </div>
          <div className={styles.shade} data-shade />
        </div>

        <h1 className="sr-only">Edén</h1>
        <div className={styles.mark} data-mark aria-hidden="true">
          <EdenMark tone="bone" />
        </div>
      </div>
    </section>
  );
}
