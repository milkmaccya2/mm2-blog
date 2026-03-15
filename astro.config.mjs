// @ts-check

import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
// NOTE: @sentry/astro integration は workerd プリレンダラーと非互換のため使わない。
// クライアント側は BaseLayout.astro で直接 @sentry/astro を import して初期化している。
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import remarkLinkCardPlus from 'remark-link-card-plus';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.milkmaccya.com',
  adapter: cloudflare({
    platformProxy: {
      // CI ではリモート Cloudflare 接続が不可（wrangler 未ログイン）のため無効化
      enabled: !process.env.CI,
      configPath: 'wrangler.json',
    },
  }),
  image: {
    remotePatterns: [{ protocol: 'https' }],
  },
  markdown: {
    remarkPlugins: [
      [
        remarkLinkCardPlus,
        {
          cache: true,
          shortenUrl: true,
          thumbnailPosition: 'right',
        },
      ],
    ],
  },
  integrations: [mdx(), react(), sitemap(), compress()],
  vite: {
    plugins: [tailwindcss()],
  },
});
