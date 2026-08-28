"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { upcomingEvents } from "@/data/content";
import { site } from "@/data/site";
import styles from "./Events.module.css";

export function Events() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mm = gsap.matchMedia();
      const track = el.querySelector<HTMLElement>("[data-track]");
      const viewport = el.querySelector<HTMLElement>("[data-viewport]");
      const flyers = Array.from(el.querySelectorAll<HTMLElement>("[data-flyer]"));
      const panes = Array.from(el.querySelectorAll<HTMLElement>("[data-shutter] i"));
      const head = el.querySelector("[data-head]");
      const applyMeta = (node: HTMLElement) => {
        flyers.forEach((flyer) => {
          flyer.dataset.active = flyer === node ? "true" : "false";
        });
      };

      if (flyers[0]) applyMeta(flyers[0]);

      if (!reduce && panes.length) {
        gsap.set(panes, { scaleY: 1 });
        gsap.set([head, viewport], { autoAlpha: 0, y: 28 });

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              end: "top 8%",
              scrub: 0.75,
              invalidateOnRefresh: true,
            },
          })
          .to(panes, { scaleY: 0, stagger: 0.1, duration: 0.7 }, 0)
          .to([head, viewport], { autoAlpha: 1, y: 0, duration: 0.35 }, 0.28)
          .from(flyers, { y: 64, autoAlpha: 0, stagger: 0.08, duration: 0.4 }, 0.32);
      }

      const syncActive = () => {
        const mid = window.innerWidth * 0.5;
        let next = flyers[0];
        let best = Infinity;
        flyers.forEach((flyer) => {
          const box = flyer.getBoundingClientRect();
          const dist = Math.abs(box.left + box.width / 2 - mid);
          if (dist < best) {
            best = dist;
            next = flyer;
          }
        });
        if (next) applyMeta(next);
      };

      mm.add("(min-width: 900px)", () => {
        if (!track || !viewport) return;

        const travel = () => Math.max(track.scrollWidth - viewport.clientWidth, 0);
        const size = () => {
          el.style.height = `${window.innerHeight + travel()}px`;
        };

        size();
        window.addEventListener("resize", size);

        gsap.to(track, {
          x: () => -travel(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${travel()}`,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: syncActive,
            onRefresh: size,
          },
        });

        return () => {
          window.removeEventListener("resize", size);
          el.style.height = "";
        };
      });

      mm.add("(pointer: fine)", () => {
        const cleanups: Array<() => void> = [];
        flyers.forEach((flyer) => {
          const media = flyer.querySelector("[data-media]") as HTMLElement | null;
          if (!media) return;
          const onMove = (e: PointerEvent) => {
            const box = flyer.getBoundingClientRect();
            const px = (e.clientX - box.left) / box.width - 0.5;
            const py = (e.clientY - box.top) / box.height - 0.5;
            gsap.to(media, { x: px * 6, y: py * 4, duration: 0.55, ease: "power3.out" });
          };
          const onLeave = () => {
            gsap.to(media, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
          };
          flyer.addEventListener("pointermove", onMove);
          flyer.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            flyer.removeEventListener("pointermove", onMove);
            flyer.removeEventListener("pointerleave", onLeave);
          });
        });
        return () => cleanups.forEach((fn) => fn());
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.section} id="eventos">
      <div className={styles.sticky}>
        <div className={styles.shutter} data-shutter aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>

        <header className={styles.head} data-head>
          <p className={styles.kicker}>Próximos</p>
        </header>

        <div className={styles.viewport} data-viewport>
          <div className={styles.track} data-track>
            {upcomingEvents.map((event) => (
              <article key={event.id} className={styles.flyer} data-flyer>
                <span className={styles.media} data-media>
                  <span className={styles.hold}>Por anunciar</span>
                </span>
                <span className={styles.caption}>
                  <span className={styles.capTitle}>{event.title}</span>
                  <a
                    className={styles.buy}
                    href={site.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Comprar
                  </a>
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
