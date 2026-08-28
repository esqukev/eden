"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { navItems, site } from "@/data/site";
import { EdenMark } from "@/components/brand/EdenMark";
import styles from "./Navigation.module.css";

export function Navigation() {
  const overlay = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  useGSAP(
    () => {
      const panel = overlay.current;
      if (!panel) return;

      if (first.current) {
        first.current = false;
        gsap.set(panel, { display: "none", autoAlpha: 0 });
        if (!open) return;
      }

      const links = panel.querySelectorAll("[data-item]");

      if (open) {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.set(panel, { display: "grid" })
          .to(panel, { autoAlpha: 1, duration: 0.35 })
          .fromTo(
            links,
            { yPercent: 100 },
            { yPercent: 0, duration: 0.8, stagger: 0.07, ease: "power4.out" },
            0.12,
          );
      } else {
        const tl = gsap.timeline({ defaults: { ease: "power3.in" } });
        tl.to(links, { yPercent: -80, duration: 0.35, stagger: 0.04 })
          .to(panel, { autoAlpha: 0, duration: 0.3 }, 0.1)
          .set(panel, { display: "none" });
      }
    },
    { dependencies: [open], scope: overlay },
  );

  const goTo = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const wasOpen = open;
    setOpen(false);
    const run = () => {
      lenis?.start();
      lenis?.scrollTo(href, { offset: 0, duration: 1.4 });
    };
    if (wasOpen) window.setTimeout(run, 420);
    else run();
  };

  return (
    <>
      <header className={styles.nav} data-open={open}>
        <a href="#top" className={styles.brand} data-cursor="hover" onClick={goTo("#top")}>
          <EdenMark tone="white" />
          <span className="sr-only">{site.wordmark}</span>
        </a>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="site-menu"
          data-cursor="hover"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Cerrar" : "Menú"}
        </button>
      </header>

      <div
        ref={overlay}
        id="site-menu"
        className={styles.overlay}
        data-lenis-prevent
        aria-hidden={!open}
      >
        <nav className={styles.menu} aria-label="Principal">
          {navItems.map((item, i) => (
            <a
              key={item.id}
              href={item.href}
              data-item
              data-cursor="hover"
              onClick={goTo(item.href)}
            >
              <span className={styles.num}>0{i + 1}</span>
              <span className={styles.mask}>
                <span>{item.label}</span>
              </span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
