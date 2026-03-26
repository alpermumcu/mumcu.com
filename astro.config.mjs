import { defineConfig } from 'astro/config';
// SADECE astro ve site tanımlayın, sitemap'i kaldırın
export default defineConfig({
  site: 'https://mumcu.com', // BU SATIR MUTLAKA OLMALI
  integrations: [] // sitemap'i geçici olarak kaldırın
});
