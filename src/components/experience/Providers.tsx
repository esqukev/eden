"use client";

import { ExperienceProvider } from "./ExperienceProvider";
import { LenisProvider } from "./LenisProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ExperienceProvider>
      <LenisProvider>{children}</LenisProvider>
    </ExperienceProvider>
  );
}
