const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join('d:', 'mumcu.com', 'src', 'content', 'pages');
const BLOG_DIR = path.join('d:', 'mumcu.com', 'src', 'content', 'blog');

function loadBlogContents() {
    const blogPosts = [];
    if (!fs.existsSync(BLOG_DIR)) {
        console.error(`Error: BLOG_DIR ${BLOG_DIR} not found.`);
        return blogPosts;
    }

    const files = fs.readdirSync(BLOG_DIR);
    console.log(`Loading ${files.length} blog files for content matching...`);
    for (const file of files) {
        if (file.endsWith('.md')) {
            const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
            const titleMatch = content.match(/^title:\s*(.*)$/m);
            const title = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, '').toLowerCase() : '';
            const slug = file.replace('.md', '');
            
            // Clean content for search (remove frontmatter)
            const body = content.replace(/^---[\s\S]*?---/, '').toLowerCase();
            
            blogPosts.push({ title, slug, body, filename: file });
        }
    }
    return blogPosts;
}

function fixLinks() {
    const blogPosts = loadBlogContents();
    console.log(`Loaded ${blogPosts.length} blog posts.`);

    if (!fs.existsSync(PAGES_DIR)) {
        console.error(`Error: PAGES_DIR ${PAGES_DIR} not found.`);
        return;
    }

    const files = fs.readdirSync(PAGES_DIR);
    for (const file of files) {
        if (file.endsWith('.md')) {
            const filePath = path.join(PAGES_DIR, file);
            let content = fs.readFileSync(filePath, 'utf-8');
            const originalContent = content;

            // Updated Regex: escape forward slash and question mark
            const linkRegex = /\[(.*?)\]\(((\/.*?)?\?p=(\d+).*?)\)/g;
            let match;
            
            const matches = [];
            while ((match = linkRegex.exec(originalContent)) !== null) {
                matches.push({
                    fullMatch: match[0],
                    text: match[1],
                    fullLink: match[2],
                    wpId: match[4]
                });
            }

            for (const {fullMatch, text, fullLink, wpId} of matches) {
                const cleanText = text.toLowerCase().trim();
                if (cleanText.length < 3) continue;

                let foundSlug = null;
                
                // 1. Exact Title Match
                const exactTitleMatch = blogPosts.find(p => p.title === cleanText);
                if (exactTitleMatch) {
                    foundSlug = exactTitleMatch.slug;
                } else {
                    // 2. Exact Body Proximity Match (First 2000 chars)
                    const bodyMatch = blogPosts.find(p => p.body.substring(0, 3000).includes(cleanText));
                    if (bodyMatch) {
                        foundSlug = bodyMatch.slug;
                    } else {
                        // 3. Fuzzy Title Match
                        for (const p of blogPosts) {
                            if ((cleanText.length > 8 && p.title.includes(cleanText)) || (p.title.length > 8 && cleanText.includes(p.title))) {
                                foundSlug = p.slug;
                                break;
                            }
                        }
                    }
                }

                if (foundSlug) {
                    const newLink = `[${text}](/blog/${foundSlug}/)`;
                    content = content.replace(fullMatch, newLink);
                    console.log(`Fixed in ${file}: [${text.substring(0, 30)}...] -> /blog/${foundSlug}/`);
                } else {
                    console.warn(`Unmatched in ${file}: [${text}] (ID: ${wpId})`);
                }
            }

            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf-8');
            }
        }
    }
    console.log("Deep link fix completed.");
}

fixLinks();
