export const intro = {
  kicker: "Experiencia",
  line: "Hacemos noches de electrónica.",
  image: "/images/intro/recinto.jpg",
  alt: "El recinto de Edén",
  ticker: ["HOUSE", "PULSO", "FRECUENCIA", "COMUNIDAD", "ESCENA", "UNDERGROUND", "EDÉN"],
};

export type UpcomingEvent = {
  id: string;
  title: string;
};

export const upcomingEvents: UpcomingEvent[] = [
  { id: "eden-i", title: "Por anunciar" },
  { id: "eden-ii", title: "Por anunciar" },
  { id: "eden-iii", title: "Por anunciar" },
];

export const umbral = {
  left: "Las noches se anuncian.",
  right: "La puerta es el Edén.",
} as const;
