export const categories = [
  { id: 1, name: "Makaleler", slug: "makaleler" },
  { id: 4, name: "Bizden Haberler", slug: "bizden-haberler" },
  { id: 5, name: "Hamilelik", slug: "hamilelik" },
  { id: 6, name: "Güncel Haberler", slug: "guncel-haberler" },
  { id: 7, name: "Gündelik Konular", slug: "gundelik-konular" },
  { id: 8, name: "Tüp Bebek Haber", slug: "tup-bebek-haber" },
  { id: 9, name: "Haberler | Hamilelik", slug: "haberler-hamilelik" },
  { id: 10, name: "Hafta Hafta Gebelik", slug: "hafta-hafta-gebelik" },
  { id: 11, name: "Doğum", slug: "dogum" },
  { id: 19, name: "Infertilite", slug: "infertilite" },
  { id: 20, name: "Jinekoloji", slug: "jinekoloji" },
  { id: 21, name: "Sizden Gelen Mektuplar", slug: "sizden-gelen-mektuplar" },
  { id: 22, name: "Kanada'da Doğum Yapanların Yorumları", slug: "kanadada-dogum-yapanlarin-yorumlari" },
  { id: 90, name: "Estetik", slug: "estetik" },
  { id: 91, name: "Kanada Dogum", slug: "kanada-dogum" }
];

export const getCategoryByName = (name: string) => categories.find(c => c.name === name);
export const getCategoryBySlug = (slug: string) => categories.find(c => c.slug === slug);
