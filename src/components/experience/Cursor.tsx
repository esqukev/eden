"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Cursor.module.css";

export function Cursor() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce || !root.current) return;

    document.documentElement.classList.add("has-cursor");
    gsap.set(root.current, { autoAlpha: 1 });

    const dot = root.current.querySelector("[data-dot]") as HTMLElement;
    const ring = root.current.querySelector("[data-ring]") as HTMLElement;
    const xDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const onOver = (e: Event) => {
      const target = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      root.current?.setAttribute("data-state", target?.dataset.cursor ?? "default");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
    };
  }, { scope: root });

  return (
    <div ref={root} className={styles.root} aria-hidden="true">
      <div className={styles.dot} data-dot />
      <div className={styles.ring} data-ring />
    </div>
  );
}
