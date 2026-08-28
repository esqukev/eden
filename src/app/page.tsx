import { Events } from "@/components/home/Events";
import { Frequency } from "@/components/home/Frequency";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Intro />
      <Events />
      <Frequency />
    </main>
  );
}
