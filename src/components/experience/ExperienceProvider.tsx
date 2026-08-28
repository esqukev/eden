"use client";

import { createContext, useContext, useMemo, useState } from "react";

type IntroContextValue = {
  introDone: boolean;
  setIntroDone: (value: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
};

const IntroContext = createContext<IntroContextValue | null>(null);

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const value = useMemo(
    () => ({ introDone, setIntroDone, menuOpen, setMenuOpen }),
    [introDone, menuOpen],
  );
  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useExperience() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useExperience must be used within ExperienceProvider");
  return ctx;
}
