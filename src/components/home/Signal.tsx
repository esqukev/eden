"use client";

import { FormEvent, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { signal } from "@/data/content";
import styles from "./Signal.module.css";

export function Signal() {
  const root = useRef<HTMLElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      const el = btn.current;
      if (!el || window.matchMedia("(pointer: coarse)").matches) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.35);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      };
      const reset = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", reset);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", reset);
      };
    },
    { scope: root },
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "");
    if (!email) return;
    setSent(true);
  };

  return (
    <section ref={root} className={styles.section} id="senal">
      <p className="kicker">{signal.kicker}</p>
      <h2 className={styles.title}>{signal.title}</h2>
      <p className={styles.body}>{signal.body}</p>

      <form className={styles.form} onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="signal-email">
          Email
        </label>
        <input
          id="signal-email"
          name="email"
          type="email"
          required
          placeholder={signal.placeholder}
          autoComplete="email"
        />
        <button ref={btn} type="submit" data-cursor="ticket" data-cursor-label="Send">
          {sent ? signal.success : signal.submit}
        </button>
      </form>
    </section>
  );
}
