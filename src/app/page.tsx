import { Events } from "@/components/home/Events";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Tickets } from "@/components/home/Tickets";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Intro />
      <Events />
      <Tickets />
    </main>
  );
}
