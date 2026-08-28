"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

function LenisGsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    const fonts = document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    requestAnimationFrame(refresh);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      window.removeEventListener("load", refresh);
      void fonts;
    };
  }, [lenis]);

  return null;
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: 0.075,
        smoothWheel: true,
        anchors: true,
        wheelMultiplier: 0.88,
        touchMultiplier: 1.15,
        syncTouch: false,
      }}
    >
      <LenisGsapSync />
      {children}
    </ReactLenis>
  );
}
