import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function fixImagePaths() {
    const files = await glob(`${CONTENT_DIR}/**/*.md`);
    console.log(`Found ${files.length} markdown files to process.`);

    let fixedCount = 0;

    for (const file of files) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        // Pattern for markdown images: ![alt](url)
        const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        
        content = content.replace(imgRegex, (match, alt, src) => {
            let localSrc = src;
            
            // Convert absolute WordPress URLs to relative
            if (src.includes('mumcu.com/wp-content/uploads/')) {
                localSrc = '/wp-content/uploads/' + src.split('/wp-content/uploads/')[1];
            }

            if (!localSrc.startsWith('/wp-content/uploads/')) return match;

            const fullPath = path.join(PUBLIC_DIR, localSrc);
            const exists = fs.existsSync(fullPath);

            // Try to strip WordPress thumbnail suffix: -300x200, -1024x768, -620x249 etc.
            const baseSrc = localSrc.replace(/-\d+x\d+(\.[^.]+)$/, '$1');
            
            if (!exists || baseSrc !== localSrc) {
                const fullBasePath = path.join(PUBLIC_DIR, baseSrc);
                if (fs.existsSync(fullBasePath)) {
                    if (src !== baseSrc) {
                        console.log(`Fixed: ${src} -> ${baseSrc} in ${path.basename(file)}`);
                        fixedCount++;
                        modified = true;
                        return `![${alt}](${baseSrc})`;
                    }
                }
            }

            if (src !== localSrc && exists) {
                console.log(`Localized: ${src} -> ${localSrc} in ${path.basename(file)}`);
                fixedCount++;
                modified = true;
                return `![${alt}](${localSrc})`;
            }

            return match;
        });

        if (modified) {
            fs.writeFileSync(file, content);
        }
    }

    console.log(`Done. Fixed ${fixedCount} image paths.`);
}

fixImagePaths().catch(console.error);
