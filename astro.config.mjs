import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mumcu.com',
  integrations: [sitemap()],
});
