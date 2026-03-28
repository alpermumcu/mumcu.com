import gebelik1 from '../assets/images/stock/gebelik-1.png';
import gebelik2 from '../assets/images/stock/gebelik-2.png';
import tupBebek1 from '../assets/images/stock/tup-bebek-1.png';
import tupBebek2 from '../assets/images/stock/tup-bebek-2.png';
import jinekoloji1 from '../assets/images/stock/jinekoloji-1.png';
import jinekoloji2 from '../assets/images/stock/jinekoloji-2.png';
import cerrahi1 from '../assets/images/stock/cerrahi-1.png';
import cerrahi2 from '../assets/images/stock/cerrahi-2.png';
import estetik1 from '../assets/images/stock/estetik-1.png';
import estetik2 from '../assets/images/stock/estetik-2.png';
import genel1 from '../assets/images/stock/genel-1.png';
import genel2 from '../assets/images/stock/genel-2.png';
import genel3 from '../assets/images/stock/genel-3.png';

export const categoryDefaults: Record<string, any[]> = {
  'Gebelik & Doğum': [
    gebelik1,
    gebelik2
  ],
  'Tüp Bebek & İnfertilite': [
    tupBebek1,
    tupBebek2
  ],
  'Jinekoloji & Kadın Sağlığı': [
    jinekoloji1,
    jinekoloji2
  ],
  'Cerrahi İşlemler': [
    cerrahi1,
    cerrahi2
  ],
  'Estetik Jinekoloji': [
    estetik1,
    estetik2
  ],
  'Hafta Hafta Gebelik': [
    gebelik1,
    gebelik2
  ],
  'Default': [
    genel1,
    genel2,
    genel3
  ]
};

/**
 * Deterministically pick an image from a pool based on a string (slug).
 */
export function getHeroImage(slug: string, categoryName?: string, explicitImage?: any) {
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
