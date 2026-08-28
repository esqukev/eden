"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EdenMark } from "@/components/brand/EdenMark";
import styles from "./Loader.module.css";

export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.documentElement.classList.add("is-loading");
      lenisRef.current?.stop();

      const done = () => {
        document.documentElement.classList.remove("is-loading");
        lenisRef.current?.start();
        gsap.set(el, { display: "none" });
      };

      if (reduce) {
        done();
        return;
      }

      const mark = el.querySelector("[data-loader-mark]");
      const panel = el.querySelector("[data-loader-panel]");

      gsap.set(mark, { autoAlpha: 0, scale: 1.08 });

      const tl = gsap.timeline({ onComplete: done });
      tl.to(mark, { autoAlpha: 1, scale: 1, duration: 1.15, ease: "power3.out" })
        .to(mark, { scale: 1.04, duration: 0.65, ease: "power1.inOut" })
        .to(panel, { yPercent: -110, duration: 1.05, ease: "power4.inOut" });

      const failsafe = window.setTimeout(done, 4200);
      return () => window.clearTimeout(failsafe);
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.root} aria-hidden="true">
      <div className={styles.panel} data-loader-panel />
      <div className={styles.mark} data-loader-mark>
        <EdenMark tone="bone" />
      </div>
    </div>
  );
}
