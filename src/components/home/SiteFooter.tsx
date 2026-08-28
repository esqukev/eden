"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { legal, navItems, site } from "@/data/site";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-wordmark]",
        { xPercent: 8 },
        {
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <footer ref={root} className={styles.footer}>
      <p className={styles.wordmark} data-wordmark>
        {site.name}
      </p>
      <div className={styles.grid}>
        <nav className={styles.links} aria-label="Footer">
          {navItems.map((item) => (
            <a key={item.id} href={item.href} data-cursor="hover" data-cursor-label="Ir">
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.social}>
          <a href={site.instagram} target="_blank" rel="noreferrer" data-cursor="hover" data-cursor-label="IG">
            Instagram {site.handle}
          </a>
        </div>
        <div className={styles.legal}>
          {legal.map((item) => (
            <span key={item.label}>{item.label}</span>
          ))}
          <span>© {new Date().getFullYear()} {site.name}</span>
        </div>
      </div>
    </footer>
  );
}
