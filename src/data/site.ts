export const site = {
  name: "SOUNDCTUARY",
  markAlt: "SOUNDCTUARY",
  handle: "@soundctuarycr",
  city: "San José",
  country: "Costa Rica",
  cityCode: "SJO",
  timezone: "America/Costa_Rica",
  tagline: "El santuario del sonido",
  instagram: "https://www.instagram.com/soundctuarycr/",
  facebook: "https://www.facebook.com",
  twitter: "https://twitter.com/",
} as const;

export const navItems = [
  { id: "inicio", label: "Inicio", href: "#top" },
  { id: "eventos", label: "Eventos", href: "#rito" },
  { id: "musica", label: "Música", href: "#frecuencia" },
  { id: "contacto", label: "Contacto", href: "#senal" },
] as const;

export const futureNav = {
  id: "sesion",
  label: "Iniciar sesión",
  href: "#",
  note: "Próx.",
} as const;

export const legal = [
  { label: "Términos y Condiciones", href: "#" },
  { label: "Política de Privacidad", href: "#" },
] as const;
