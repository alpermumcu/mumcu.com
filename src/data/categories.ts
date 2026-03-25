export const categories = [
  { id: 1, name: "Gebelik & Doğum", slug: "gebelik-dogum" },
  { id: 2, name: "Jinekoloji & Kadın Sağlığı", slug: "jinekoloji" },
  { id: 3, name: "Tüp Bebek & İnfertilite", slug: "tup-bebek-infertilite" },
  { id: 4, name: "Cerrahi İşlemler", slug: "cerrahi-islemler" },
  { id: 5, name: "Estetik Jinekoloji", slug: "estetik-jinekoloji" }
];

export const getCategoryByName = (name: string) => categories.find(c => c.name === name);
export const getCategoryBySlug = (slug: string) => categories.find(c => c.slug === slug);
