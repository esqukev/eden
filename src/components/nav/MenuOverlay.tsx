"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { futureNav, navItems, site } from "@/data/site";
import styles from "./MenuOverlay.module.css";

export function MenuOverlay() {
  const root = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const { menuOpen, setMenuOpen } = useExperience();

  useGSAP(
    (context, contextSafe) => {
      const panel = root.current;
      if (!panel) return;

      if (first.current) {
        first.current = false;
        gsap.set(panel, { display: "none", clipPath: "inset(0 0 100% 0)" });
        if (!menuOpen) return;
      }

      const links = panel.querySelectorAll("[data-link]");
      const media = panel.querySelector("[data-media]");
      const mediaImg = panel.querySelector("[data-media] img");
      const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

      const onEnter = contextSafe((e: Event) => {
        const i = Number((e.currentTarget as HTMLElement).dataset.i || 0);
        gsap.to(mediaImg, {
          xPercent: -6 * ((i % 3) - 1),
          yPercent: -5 * ((i % 2) - 0.5),
          scale: 1.12,
          duration: 1.1,
          ease: "power3.out",
        });
      });

      links.forEach((link) => link.addEventListener("mouseenter", onEnter));

      if (menuOpen) {
        document.body.classList.add("is-menu-open");
        tl.set(panel, { display: "grid" })
          .fromTo(panel, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9 })
          .fromTo(
            links,
            { yPercent: 110, rotate: 6 },
            { yPercent: 0, rotate: 0, duration: 1, stagger: 0.06, ease: "power4.out" },
            0.28,
          )
          .fromTo(media, { scale: 1.18, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.1 }, 0.35);
      } else {
        document.body.classList.remove("is-menu-open");
        tl.to(links, { yPercent: -80, duration: 0.45, stagger: 0.04, ease: "power2.in" })
          .to(panel, { clipPath: "inset(100% 0 0 0)", duration: 0.7 }, 0.1)
          .set(panel, { display: "none" });
      }
      return () => {
        links.forEach((link) => link.removeEventListener("mouseenter", onEnter));
      };
    },
    { dependencies: [menuOpen], scope: root },
  );

  const close = () => setMenuOpen(false);

  return (
    <div
      ref={root}
      id="site-menu"
      className={styles.overlay}
      data-lenis-prevent
      aria-hidden={!menuOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
    >
      <div className={styles.media} data-media>
        <img src="/images/crowd.jpg" alt="" />
      </div>

      <div className={styles.panel}>
        <p className={styles.kicker}>
          {site.city} / {site.country}
        </p>
        <ul className={styles.list}>
          {navItems.map((item, i) => (
            <li key={item.id}>
              <a
                href={item.href}
                data-link
                data-i={i}
                data-cursor="hover"
                data-cursor-label="Ir"
                onClick={close}
              >
                <span className={styles.num}>0{i + 1}</span>
                <span className={styles.mask}>
                  <span>{item.label}</span>
                </span>
              </a>
            </li>
          ))}
          <li className={styles.future}>
            <span data-link>
              <span className={styles.num}>05</span>
              <span className={styles.mask}>
                <span>
                  {futureNav.label} <small>{futureNav.note}</small>
                </span>
              </span>
            </span>
          </li>
        </ul>
        <a
          className={styles.social}
          href={site.instagram}
          target="_blank"
          rel="noreferrer"
          data-cursor="hover"
          data-cursor-label="IG"
        >
          {site.handle}
        </a>
      </div>
    </div>
  );
}
