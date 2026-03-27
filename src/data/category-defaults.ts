export const categoryDefaults: Record<string, string[]> = {
  'Gebelik & Doğum': [
    '/images/stock/gebelik-1.png',
    '/images/stock/gebelik-2.png'
  ],
  'Tüp Bebek & İnfertilite': [
    '/images/stock/tup-bebek-1.png',
    '/images/stock/tup-bebek-2.png'
  ],
  'Jinekoloji & Kadın Sağlığı': [
    '/images/stock/jinekoloji-1.png',
    '/images/stock/jinekoloji-2.png'
  ],
  'Cerrahi İşlemler': [
    '/images/stock/cerrahi-1.png',
    '/images/stock/cerrahi-2.png'
  ],
  'Estetik Jinekoloji': [
    '/images/stock/estetik-1.png',
    '/images/stock/estetik-2.png'
  ],
  'Hafta Hafta Gebelik': [
    '/images/stock/gebelik-1.png',
    '/images/stock/gebelik-2.png'
  ],
  'Default': [
    '/images/stock/genel-1.png',
    '/images/stock/genel-2.png',
    '/images/stock/genel-3.png'
  ]
};

/**
 * Deterministically pick an image from a pool based on a string (slug).
 */
export function getHeroImage(slug: string, categoryName?: string, explicitImage?: string) {
  if (explicitImage) return explicitImage;
  
  const pool = categoryDefaults[categoryName || 'Default'] || categoryDefaults['Default'];
  
  // Simple hash for index selection
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % pool.length;
  
  return pool[index];
}
