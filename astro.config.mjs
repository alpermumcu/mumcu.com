import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mumcu.com',
  // Trigger build to restore stable version
  integrations: [sitemap()],
});

