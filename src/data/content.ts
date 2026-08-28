export const intro = {
  kicker: "Experiencia",
  line: "Hacemos noches de electrónica.",
  image: "/images/intro/recinto.jpg",
  alt: "El recinto de Edén",
  ticker: ["NOCHE", "FRECUENCIA", "CUERPO", "RECINTO", "PULSO", "EDÉN"],
};

export type UpcomingEvent = {
  id: string;
  title: string;
  flyer: string;
};

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "eden-i",
    title: "Apertura",
    flyer: "/images/flyers/eden-i.jpg",
  },
  {
    id: "eden-ii",
    title: "El recinto",
    flyer: "/images/flyers/eden-ii.jpg",
  },
  {
    id: "eden-iii",
    title: "Umbral",
    flyer: "/images/flyers/eden-iii.jpg",
  },
];
