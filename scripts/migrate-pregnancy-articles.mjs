import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const BLOG_DIR = 'd:/mumcu.com/src/content/blog';
const ARCHIVE_DIR = 'd:/mumcu.com/archive_md-backup';

const HERO_IMAGES = {
  1: "/images/blog/trimester-1-hero.png",
  2: "/images/blog/trimester-2-hero.png",
  3: "/images/blog/trimester-3-hero.png",
};

function getHeroImage(week) {
  if (week <= 13) return HERO_IMAGES[1];
  if (week <= 27) return HERO_IMAGES[2];
  return HERO_IMAGES[3];
}

async function migrate() {
  if (!fs.existsSync(ARCHIVE_DIR)) {
      console.error("Archive directory not found at " + ARCHIVE_DIR);
      return;
  }

  const files = fs.readdirSync(ARCHIVE_DIR).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const fullPath = path.join(ARCHIVE_DIR, file);
    const rawContent = fs.readFileSync(fullPath, 'utf-8');
    const parts = rawContent.split('---');
    if (parts.length < 3) continue;

    const data = yaml.load(parts[1]);
    const content = parts.slice(2).join('---').trim();

    if (!data.category?.includes('Hafta Hafta Gebelik')) continue;

    console.log(`Migrating: ${file}`);

    const weekMatch = data.title.match(/(\d+)\./);
    const week = weekMatch ? parseInt(weekMatch[1]) : 0;
    if (week === 0 || week === 1) continue;

    // PRE-CLEAN: Remove rogue backslashes that escape markdown
    const preCleaned = content.replace(/\\(\[|\]|_|\.)/g, '$1');

    let babySize = 'Gelişim devam ediyor';
    let suggestion = '';
    let tests = '';

    const sizeMatch = preCleaned.match(/\*\*Bebeğinizin Büyüklüğü\*\*\s*([\s\S]*?)(\[\/|\[third|$)/i);
    if (sizeMatch) babySize = sizeMatch[1].trim().replace(/\n/g, ' ').replace(/"/g, '&quot;');

    const suggestionMatch = preCleaned.match(/\*\*Öneri:\*\*\s*([\s\S]*?)(\[\/|\[third|$)/i);
    if (suggestionMatch) suggestion = suggestionMatch[1].trim().replace(/\n/g, ' ').replace(/"/g, '&quot;');

    const testsMatch = preCleaned.match(/\*\*Bu haftada yapılacak testler\*\*\s*([\s\S]*?)(\[\/|\[third|$)/i);
    if (testsMatch) tests = testsMatch[1].trim().replace(/\n/g, ' ').replace(/"/g, '&quot;');

    let cleanContent = preCleaned
      .replace(/\[third\][\s\S]*?\[\/third\]/gi, '')
      .replace(/\[third_last\][\s\S]*?\[\/third_last\]/gi, '')
      .replace(/\[box\][\s\S]*?\[\/box\]/gi, '')
      .trim();
    cleanContent = cleanContent.replace(/^# .*\n/, '');

    const heroImage = getHeroImage(week);
    const status = week <= 13 ? "1. Trimester" : week <= 27 ? "2. Trimester" : "3. Trimester";
    
    const mdxHeader = `import FAQAccordion from '../../components/FAQAccordion.astro';

export const faqItems = [
  {
    question: "${week}. haftada bebek neler yapar?",
    answer: "${(babySize.split('.')[0] || babySize).replace(/"/g, '\\"').trim()}. Bu dönemde bebeğinizin organ sistemleri olgunlaşmaya ve yeni yetenekler kazanmaya devam eder."
  },
  {
    question: "Bu hafta için en önemli tavsiye nedir?",
    answer: "${(suggestion.split('.')[0] || suggestion || 'Düzenli doktor kontrollerinizi aksatmamak ve sağlıklı beslenmeye özen göstermek bu dönemin anahtarıdır.').replace(/"/g, '\\"').trim()}"
  }
];

<div class="week-at-a-glance glass">
  <div class="glance-item">
    <span class="icon">📅</span>
    <div>
      <strong>Durum</strong>
      <p>${status}</p>
    </div>
  </div>
  <div class="glance-item">
    <span class="icon">🌱</span>
    <div>
      <strong>Gelişim</strong>
      <p>${babySize.length > 30 ? babySize.substring(0, 27).replace(/"/g, '&quot;') + '...' : babySize.replace(/"/g, '&quot;')}</p>
    </div>
  </div>
  <div class="glance-item">
    <span class="icon">💊</span>
    <div>
      <strong>Önemli</strong>
      <p>${tests.replace(/"/g, '&quot;') || 'Düzenli Takip'}</p>
    </div>
  </div>
</div>

<style>{\`
  .week-at-a-glance {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    padding: 2rem;
    border-radius: 20px;
    margin-bottom: 4rem;
    background: hsl(var(--accent-light) / 0.5);
    border: 1px solid hsl(var(--accent) / 0.1);
  }
  .glance-item {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  .glance-item .icon {
    font-size: 2rem;
    background: white;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
  }
  .glance-item strong {
    display: block;
    font-size: 0.9rem;
    color: hsl(var(--accent));
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .glance-item p {
    margin: 0 !important;
    font-weight: 700;
    color: hsl(var(--primary));
  }
\`}</style>`;

    const mdxFooter = `
## Sıkça Sorulan Sorular

<FAQAccordion items={faqItems} />

<script type="application/ld+json" is:inline>{\`
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "${data.title.replace(/"/g, '\\"')}",
  "author": {
    "@type": "Person",
    "name": "Dr. Alper Mumcu",
    "url": "https://www.mumcu.com/dr-alper-mumcu/"
  },
  "publisher": {
    "@type": "Person",
    "name": "Dr. Alper Mumcu"
  },
  "datePublished": "${new Date(data.pubDate).toISOString()}",
  "dateModified": "${new Date().toISOString()}",
  "image": "https://www.mumcu.com${heroImage}"
}
\`}</script>

---

> **Yasal Uyarı:** Bu sayfada yer alan bilgiler yalnızca genel bilgilendirmeyi amaçlamaktadır ve tıbbi tavsiye niteliği taşımaz. Her gebelik süreci kişiye özeldir. Belirtileriniz, test sonuçlarınız veya tedavi sürecinizle ilgili en doğru kararı sizi takip eden kadın hastalıkları ve doğum uzmanı vermelidir.
`;

    data.heroImage = heroImage;
    data.description = data.description || `${week}. hafta hamilelik sürecinde bebeğinizdeki gelişimler, vücudunuzdaki değişimler ve Dr. Alper Mumcu'nun uzman tavsiyeleri.`;
    
    const newFrontmatter = yaml.dump(data).trim();
    const finalContent = `---\n${newFrontmatter}\n---\n${mdxHeader}\n\n${cleanContent}\n${mdxFooter}`;

    const newFileName = file.replace('.md', '.mdx');
    fs.writeFileSync(path.join(BLOG_DIR, newFileName), finalContent);
  }
}

migrate().catch(console.error);
