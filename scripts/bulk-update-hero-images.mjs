import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const blogDir = 'd:/mumcu.com/src/content/blog/';
const targetDate = '2014-03-15';
const targetCategory = 'Gebelik & Doğum';
const newHeroImage = '../../images/categories/gebelik.png';

async function updateHeroImages() {
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  let updatedCount = 0;

  for (const file of files) {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: body } = matter(content);

    const pubDate = data.pubDate ? String(data.pubDate) : '';
    const categories = data.category || [];

    if (pubDate.startsWith(targetDate) && categories.includes(targetCategory)) {
      if (!data.heroImage) {
        data.heroImage = newHeroImage;
        const newContent = matter.stringify(body, data);
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${file}`);
        updatedCount++;
      } else {
        console.log(`Skipped (already has heroImage): ${file}`);
      }
    }
  }

  console.log(`\nFinished! Updated ${updatedCount} files.`);
}

updateHeroImages();
