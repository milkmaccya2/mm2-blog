// @ts-check

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.milkmaccya.com',
  integrations: [
    sentry({
      sourceMapsUploadOptions: {
        project: 'mm21-blog',
        org: 'private-jh',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
    sitemap(),
    compress(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
