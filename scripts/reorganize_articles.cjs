const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const blogDir = path.join(__dirname, '../src/content/blog');
const files = fs.readdirSync(blogDir);

const CATEGORIES = {
  OBSTETRICS: 'Gebelik & Doğum',
  GYNECOLOGY: 'Jinekoloji & Kadın Sağlığı',
  IVF: 'Tüp Bebek & İnfertilite',
  SURGERY: 'Cerrahi İşlemler',
  AESTHETICS: 'Estetik Jinekoloji'
};

const KEYWORDS = {
  OBSTETRICS: ['hafta', 'bebek', 'doğum', 'gebelik', 'trimester', 'amniyo', 'anne', 'fetus', 'fetal', 'plesenta', 'kordon'],
  IVF: ['tüp bebek', 'infertilite', 'sperm', 'yumurta', 'ivf', 'aşılama', 'döllenme', 'ovülasyon', 'embriyo', 'embryo'],
  SURGERY: ['laparoskopi', 'histeroskopi', 'ameliyat', 'myomektomi', 'cerrahi', 'operasyon', 'anestezi', 'leep', 'konizasyon'],
  AESTHETICS: ['estetik', 'lazer', 'labioplasti', 'vajinoplasti', 'renklendirme', 'gençleştirme'],
  GYNECOLOGY: ['hpv', 'smear', 'kist', 'enfeksiyon', 'rahim', 'adet', 'vajinal', 'mantar', 'myom', 'miyom', 'over', 'yumurtalık']
};

files.forEach(file => {
  if (!file.endsWith('.md')) return;
  const filePath = path.join(blogDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, content: body } = matter(content);

  let newCategory = CATEGORIES.GYNECOLOGY; // Default fallback
  const searchStr = (data.title + ' ' + body + ' ' + (data.category || []).join(' ')).toLowerCase();

  if (KEYWORDS.IVF.some(k => searchStr.includes(k))) {
    newCategory = CATEGORIES.IVF;
  } else if (KEYWORDS.OBSTETRICS.some(k => searchStr.includes(k))) {
    newCategory = CATEGORIES.OBSTETRICS;
  } else if (KEYWORDS.SURGERY.some(k => searchStr.includes(k))) {
    newCategory = CATEGORIES.SURGERY;
  } else if (KEYWORDS.AESTHETICS.some(k => searchStr.includes(k))) {
    newCategory = CATEGORIES.AESTHETICS;
  } else if (KEYWORDS.GYNECOLOGY.some(k => searchStr.includes(k))) {
    newCategory = CATEGORIES.GYNECOLOGY;
  }

  const wordCount = body.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  data.category = [newCategory];
  data.readingTime = readingTime;

  const newContent = matter.stringify(body, data);
  fs.writeFileSync(filePath, newContent);
});

console.log(`Successfully reorganized ${files.length} articles.`);
