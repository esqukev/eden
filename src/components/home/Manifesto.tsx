"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { manifesto } from "@/data/content";
import styles from "./Manifesto.module.css";

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      const splits: SplitText[] = [];

      const run = async () => {
        await document.fonts.ready;
        if (!root.current) return;

        el.querySelectorAll("[data-line]").forEach((node) => {
          const split = SplitText.create(node as HTMLElement, { type: "lines,words", mask: "lines" });
          splits.push(split);
          gsap.from(split.lines, {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.08,
            ease: "power4.out",
            scrollTrigger: {
              trigger: node,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          });
        });

        const scramble = el.querySelector("[data-scramble]") as HTMLElement;
        if (scramble) {
          gsap.to(scramble, {
            duration: 1.4,
            scrambleText: { text: manifesto.highlight, chars: "upperCase", speed: 0.45 },
            scrollTrigger: {
              trigger: scramble,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });
        }
      };

      run();

      mm.add("(min-width: 800px)", () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: 1,
          },
        })
          .fromTo("[data-wash]", { scale: 1.25, autoAlpha: 0.15 }, { scale: 1, autoAlpha: 0.45, ease: "none" }, 0)
          .to("[data-block]", { yPercent: -8, ease: "none" }, 0)
          .to("[data-giant]", { xPercent: -12, ease: "none" }, 0);
      });

      return () => {
        splits.forEach((s) => s.revert());
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.section} id="manifiesto">
      <div className={styles.wash} data-wash>
        <img src="/images/crowd.jpg" alt="" />
      </div>
      <p className={styles.giant} data-giant aria-hidden="true">
        SANTUARIO
      </p>
      <div className={styles.block} data-block>
        <p className="kicker">{manifesto.kicker}</p>
        <h2>
          {manifesto.lines.map((line) => (
            <span key={line} className={styles.line} data-line>
              {line}
            </span>
          ))}
        </h2>
        <p className={styles.body} data-line>
          {manifesto.body}
        </p>
        <p className={styles.highlight}>
          SOUNDCTUARY existe para <em data-scramble>{manifesto.highlight}</em>.
        </p>
      </div>
    </section>
  );
}
