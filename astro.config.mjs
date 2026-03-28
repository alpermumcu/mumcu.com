import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://www.mumcu.com',
  integrations: [sitemap(), mdx(), icon()],
  build: {
    inlineStylesheets: 'always'
  }
});

