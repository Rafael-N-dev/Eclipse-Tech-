export const CATEGORIES = [
  { slug: "curiosidades", label: "Curiosidades" },
  { slug: "bizarro", label: "Bizarro" },
  { slug: "tecnologia", label: "Tecnologia" },
  { slug: "saude", label: "Saúde" },
  { slug: "entretenimento", label: "Entretenimento" },
  { slug: "musicas", label: "Músicas" },
  { slug: "series", label: "Séries" },
  { slug: "bandas", label: "Bandas de Rock/Metal" },
  { slug: "filmes", label: "Filmes" },
  { slug: "animes", label: "Animes" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function categoryLabel(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
