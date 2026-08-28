"use client";

import { Archive } from "./Archive";
import { Frequencies } from "./Frequencies";
import { Hero } from "./Hero";
import { Manifesto } from "./Manifesto";
import { NextRite } from "./NextRite";
import { Signal } from "./Signal";
import { SiteFooter } from "./SiteFooter";

export function HomeExperience() {
  return (
    <main>
      <Hero />
      <NextRite />
      <Manifesto />
      <Frequencies />
      <Archive />
      <Signal />
      <SiteFooter />
    </main>
  );
}
