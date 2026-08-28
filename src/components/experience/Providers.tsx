"use client";

import { LenisProvider } from "./LenisProvider";
import { Atmosphere } from "./Atmosphere";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <Atmosphere />
      {children}
    </LenisProvider>
  );
}
