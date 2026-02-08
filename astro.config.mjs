// @ts-check

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.milkmaccya.com',
  integrations: [sitemap(), compress()],
  vite: {
    plugins: [tailwindcss()],
  },
});
