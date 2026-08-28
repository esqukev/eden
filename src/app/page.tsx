import { Events } from "@/components/home/Events";
import { Frequency } from "@/components/home/Frequency";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Umbral } from "@/components/home/Umbral";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Intro />
      <Events />
      <Umbral />
      <Frequency />
    </main>
  );
}
