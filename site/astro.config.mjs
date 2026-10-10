// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://prismalens.io',
  // Astro 7 defaults to JSX whitespace rules, which glue inline text to links and <code>.
  compressHTML: true,
  integrations: [react(), sitemap()],
  redirects: {
    '/features': '/',
  },

  vite: {
    plugins: [tailwindcss()]
  }
});