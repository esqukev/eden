export type EventRecord = {
  id: string;
  index: string;
  status: "upcoming" | "archive";
  title: string;
  kicker: string;
  dateLabel: string;
  location: string;
  note: string;
  cta: string;
  href: string;
};

export const featuredEvent: EventRecord = {
  id: "proximo-rito",
  index: "01",
  status: "upcoming",
  title: "Próximo rito",
  kicker: "Eventos",
  dateLabel: "— —  .  — —  .  2 6",
  location: "Costa Rica",
  note: "La fecha se revela a quienes están cerca. El anuncio vive donde late la noche.",
  cta: "Seguir el anuncio",
  href: "https://www.instagram.com/soundctuarycr/",
};

export const events: EventRecord[] = [featuredEvent];
