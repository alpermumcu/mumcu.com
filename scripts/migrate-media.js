import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const WP_API = 'https://www.mumcu.com/wp-json/wp/v2/media';
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'wp-content', 'uploads');

async function downloadFile(url, dest) {
    if (fs.existsSync(dest)) return; // Skip already downloaded

    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        const buffer = await response.buffer();
        fs.writeFileSync(dest, buffer);
        console.log(`Downloaded: ${url} -> ${dest}`);
    } catch (error) {
        console.error(`Error downloading ${url}: ${error.message}`);
    }
}

async function migrateMedia() {
    let page = 1;
    const perPage = 100;
    let totalDownloaded = 0;

    console.log('Starting media migration...');

    try {
        const initialResponse = await fetch(`${WP_API}?per_page=${perPage}&page=${page}`);
        const totalItems = parseInt(initialResponse.headers.get('X-WP-Total'));
        const totalPages = parseInt(initialResponse.headers.get('X-WP-TotalPages'));
        
        console.log(`Total media items: ${totalItems}, Total pages: ${totalPages}`);

        for (page = 1; page <= totalPages; page++) {
            console.log(`Fetching media page ${page} of ${totalPages}...`);
            const response = await fetch(`${WP_API}?per_page=${perPage}&page=${page}`);
            
            if (!response.ok) {
                console.error(`Error fetching page ${page}: ${response.statusText}`);
                continue;
            }

            const mediaItems = await response.json();
            for (const item of mediaItems) {
                const url = item.source_url;
                if (!url) continue;

                const match = url.match(/\/wp-content\/uploads\/(.+)/);
                if (match) {
                    const relativePath = match[1];
                    const dest = path.join(UPLOADS_DIR, relativePath);
                    await downloadFile(url, dest);
                    totalDownloaded++;
                }
            }
        }
    } catch (error) {
        console.error(`Migration failed: ${error.message}`);
    }

    console.log(`Migration complete. Total images processed: ${totalDownloaded}`);
}

migrateMedia().catch(console.error);
