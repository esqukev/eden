"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { useExperience } from "@/components/experience/ExperienceProvider";
import { hero } from "@/data/content";
import { site } from "@/data/site";
import styles from "./Hero.module.css";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { setIntroDone } = useExperience();

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mm = gsap.matchMedia();
      let split: SplitText | undefined;
      let cancelled = false;

      const finish = () => {
        if (!cancelled) setIntroDone(true);
      };

        const setup = async () => {
        const safety = window.setTimeout(finish, 3200);
        await document.fonts.ready;
        if (cancelled || !root.current) {
          window.clearTimeout(safety);
          return;
        }

        const title = el.querySelector("[data-title]") as HTMLElement;
        split = SplitText.create(title, { type: "chars", mask: "chars", charsClass: "char" });

        if (reduce) {
          window.clearTimeout(safety);
          gsap.set([split.chars, "[data-meta]", "[data-cue]", "[data-slit]"], { clearProps: "all" });
          finish();
          return;
        }

        gsap.set(split.chars, { yPercent: 130, rotate: 8 });
        gsap.set("[data-slit]", { clipPath: "inset(12% 42% 12% 42%)" });
        gsap.set("[data-meta]", { autoAlpha: 0, y: 24 });
        gsap.set("[data-cue]", { autoAlpha: 0 });
        gsap.set("[data-line]", { scaleX: 0 });
        gsap.set("[data-lens]", { autoAlpha: 0 });
        gsap.set("[data-mark]", { autoAlpha: 0, scale: 1.4 });

        const intro = gsap.timeline({
          defaults: { ease: "power4.inOut" },
          onComplete: () => {
            window.clearTimeout(safety);
            finish();
          },
        });

        intro
          .to("[data-mark]", { autoAlpha: 1, scale: 1, duration: 0.9, ease: "power3.out" }, 0.1)
          .to("[data-slit]", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.85, ease: "power3.inOut" }, 0.35)
          .to("[data-mark]", { autoAlpha: 0, duration: 0.45 }, 0.9)
          .to(
            split.chars,
            { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.028, ease: "power4.out" },
            0.72,
          )
          .to("[data-meta]", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power2.out" }, 1.35)
          .to("[data-line]", { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 1.45)
          .to("[data-cue]", { autoAlpha: 1, duration: 0.6 }, 1.7)
          .to("[data-lens]", { autoAlpha: 1, duration: 0.5 }, 1.55);

        mm.add("(min-width: 768px)", () => {
          const scrollTl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "+=160%",
              pin: true,
              scrub: 1.1,
              anticipatePin: 1,
            },
          });

          scrollTl
            .to("[data-photo]", { scale: 1.22, yPercent: 6, ease: "none" }, 0)
            .to("[data-title-wrap]", { yPercent: -22, xPercent: -4, ease: "none" }, 0)
            .to("[data-meta-row]", { y: -80, autoAlpha: 0, ease: "none" }, 0)
            .to("[data-veil]", { yPercent: 0, ease: "none" }, 0.35)
            .to("[data-lens]", { autoAlpha: 0, ease: "none" }, 0.2);
        });

        mm.add("(max-width: 767px)", () => {
          gsap.to("[data-photo]", {
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        });

        mm.add("(pointer: fine)", () => {
          const lens = el.querySelector("[data-lens]") as HTMLElement;
          const visual = el.querySelector("[data-visual]") as HTMLElement;
          const inner = lens.querySelector("img") as HTMLElement;
          if (!lens || !visual || !inner) return;

          const xTo = gsap.quickTo(lens, "x", { duration: 0.55, ease: "power3" });
          const yTo = gsap.quickTo(lens, "y", { duration: 0.55, ease: "power3" });
          const ixTo = gsap.quickTo(inner, "x", { duration: 0.55, ease: "power3" });
          const iyTo = gsap.quickTo(inner, "y", { duration: 0.55, ease: "power3" });

          const place = (x: number, y: number) => {
            const lw = lens.offsetWidth;
            const lh = lens.offsetHeight;
            xTo(x - lw / 2);
            yTo(y - lh / 2);
            ixTo(-(x - lw / 2));
            iyTo(-(y - lh / 2));
          };

          place(visual.clientWidth * 0.62, visual.clientHeight * 0.42);

          const onMove = (e: PointerEvent) => {
            const r = visual.getBoundingClientRect();
            place(e.clientX - r.left, e.clientY - r.top);
          };

          visual.addEventListener("pointermove", onMove);
          return () => visual.removeEventListener("pointermove", onMove);
        });
      };

      setup();
      ScrollTrigger.refresh();

      return () => {
        cancelled = true;
        split?.revert();
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.hero} id="top">
      <div className={styles.visual} data-visual data-cursor="view" data-cursor-label="Ver">
        <div className={styles.slit} data-slit>
          <img
            className={styles.photo}
            data-photo
            src="/images/crowd.jpg"
            alt="Público en un evento SOUNDCTUARY, brazos en el aire bajo las luces del escenario"
            width={1600}
            height={1067}
            fetchPriority="high"
          />
        </div>
        <div className={styles.lens} data-lens aria-hidden="true">
          <img src="/images/crowd.jpg" alt="" data-photo />
        </div>
        <div className={styles.vignette} />
        <div className={styles.veil} data-veil />
      </div>

      <img className={styles.introMark} data-mark src="/images/mark.png" alt="" />

      <div className={styles.metaRow} data-meta-row>
        <p className={styles.meta} data-meta>
          {hero.eyebrow}
        </p>
        <span className={styles.line} data-line />
        <p className={styles.meta} data-meta>
          {site.tagline}
        </p>
      </div>

      <div className={styles.titleWrap} data-title-wrap>
        <p className={styles.sub} data-meta>
          {hero.line}
        </p>
        <h1 className={styles.title} data-title>
          {hero.title}
        </h1>
      </div>

      <div className={styles.cue} data-cue>
        <span>{hero.cue}</span>
        <i />
      </div>
    </section>
  );
}
