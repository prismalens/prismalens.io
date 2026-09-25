// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://prismalens.io',
  integrations: [react(), sitemap()],
  redirects: {
    '/features': '/',
  },

  vite: {
    plugins: [tailwindcss()]
  }
});