const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach( f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
};

const contentDir = path.join(process.cwd(), 'src', 'content');

walk(contentDir, (filePath) => {
  if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('../../assets../../assets/')) {
      const newContent = content.replace(/\.\.\/\.\.\/assets\.\.\/\.\.\/assets\//g, '../../assets/');
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed: ${filePath}`);
    }
  }
});
