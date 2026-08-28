"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { featuredEvent } from "@/data/events";
import styles from "./NextRite.module.css";

export function NextRite() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      let split: SplitText | undefined;

      const run = async () => {
        await document.fonts.ready;
        if (!root.current) return;
        const title = el.querySelector("[data-event-title]") as HTMLElement;
        split = SplitText.create(title, { type: "chars", charsClass: "char" });

        gsap.set(split.chars, { yPercent: 110 });

        gsap.to(split.chars, {
          yPercent: 0,
          stagger: 0.03,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });
      };

      run();

      mm.add("(min-width: 900px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=170%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        tl.fromTo("[data-index]", { yPercent: 40, autoAlpha: 0.2 }, { yPercent: -8, autoAlpha: 1, ease: "none" }, 0)
          .fromTo("[data-frame]", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: "none" }, 0)
          .fromTo("[data-date]", { xPercent: 18 }, { xPercent: -8, ease: "none" }, 0)
          .fromTo("[data-copy]", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: "none" }, 0.15);
      });

      mm.add("(max-width: 899px)", () => {
        gsap.from("[data-frame]", {
          clipPath: "inset(18% 18% 18% 18%)",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-frame]",
            start: "top 80%",
            end: "top 30%",
            scrub: 0.8,
          },
        });
      });

      return () => {
        split?.revert();
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.section} id="rito">
      <p className={styles.kicker}>{featuredEvent.kicker}</p>
      <p className={styles.index} data-index>
        {featuredEvent.index}
      </p>

      <div className={styles.layout}>
        <div className={styles.copy} data-copy>
          <p className={styles.status}>{featuredEvent.status === "upcoming" ? "Próximamente" : "Archivo"}</p>
          <h2 className={styles.title} data-event-title>
            {featuredEvent.title}
          </h2>
          <p className={styles.date} data-date>
            {featuredEvent.dateLabel}
          </p>
          <p className={styles.location}>{featuredEvent.location}</p>
          <p className={styles.note}>{featuredEvent.note}</p>
          <a
            className={styles.cta}
            href={featuredEvent.href}
            target="_blank"
            rel="noreferrer"
            data-cursor="ticket"
            data-cursor-label="IG"
          >
            <span>{featuredEvent.cta}</span>
            <i />
          </a>
        </div>

        <div className={styles.frame} data-frame>
          <img
            src="/images/crowd.jpg"
            alt="Fragmento del archivo visual de SOUNDCTUARY"
            className={styles.image}
          />
          <span className={styles.stamp}>LIVE / CR</span>
        </div>
      </div>
    </section>
  );
}
