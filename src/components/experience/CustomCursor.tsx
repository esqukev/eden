"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./CustomCursor.module.css";

export function CustomCursor() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce || !root.current) return;

    const dot = root.current.querySelector("[data-dot]") as HTMLElement;
    const ring = root.current.querySelector("[data-ring]") as HTMLElement;
    const label = root.current.querySelector("[data-label]") as HTMLElement;

    gsap.set(root.current, { autoAlpha: 1 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.16, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.16, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: Event) => {
      const target = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      const state = target?.dataset.cursor ?? "";
      root.current?.setAttribute("data-state", state);
      if (label) label.textContent = target?.dataset.cursorLabel ?? "";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
    };
  }, { scope: root });

  return (
    <div ref={root} className={styles.root} aria-hidden="true">
      <div className={styles.dot} data-dot />
      <div className={styles.ring} data-ring>
        <span className={styles.label} data-label />
      </div>
    </div>
  );
}
