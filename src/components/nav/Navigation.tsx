"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { site } from "@/data/site";
import styles from "./Navigation.module.css";

function CostaRicaClock() {
  const ref = useRef<HTMLTimeElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const tick = () => {
      el.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: site.timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  });

  return <time ref={ref} className={styles.clock} dateTime="" />;
}

export function Navigation() {
  const root = useRef<HTMLElement>(null);
  const { introDone, menuOpen, setMenuOpen } = useExperience();

  useGSAP(
    () => {
      gsap.to(root.current, {
        autoAlpha: introDone ? 1 : 0,
        y: introDone ? 0 : -12,
        duration: 0.9,
        ease: "power3.out",
      });
    },
    { dependencies: [introDone], scope: root },
  );

  return (
    <header ref={root} className={styles.nav} data-open={menuOpen} data-ready={introDone}>
      <a href="#top" className={styles.brand} data-cursor="hover" data-cursor-label="Home">
        <img src="/images/mark.png" alt="" className={styles.mark} width={40} height={48} />
        <span className={styles.word}>{site.name}</span>
      </a>

      <div className={styles.meta}>
        <span>{site.cityCode}</span>
        <span className={styles.dot} />
        <CostaRicaClock />
      </div>

      <button
        type="button"
        className={styles.toggle}
        aria-expanded={menuOpen}
        aria-controls="site-menu"
        data-cursor="menu"
        data-cursor-label={menuOpen ? "Close" : "Menu"}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className={styles.toggleIndex}>{menuOpen ? "Cerrar" : "Menú"}</span>
        <span className={styles.bars} aria-hidden="true">
          <i />
          <i />
        </span>
      </button>
    </header>
  );
}
