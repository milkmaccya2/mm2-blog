// @ts-check

import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
// NOTE: @sentry/astro はCloudflare Workers (workerd) のプリレンダラーと非互換
// addEventListener(useCapture: true) がworkerdで使えないためビルドがクラッシュする
// Cloudflare環境でSentryを使うには @sentry/cloudflare を直接設定する必要がある
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import remarkLinkCardPlus from 'remark-link-card-plus';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.milkmaccya.com',
  adapter: cloudflare(),
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
    plugins: [
      tailwindcss(),
      {
        name: 'cloudflare-disable-remote-bindings',
        configResolved() {
          // @astrojs/cloudflare のバグ回避: preview時に cloudflareOptions が
          // globalThis.astroCloudflareOptions にマージされないため、ここで補完する
          const opts = globalThis.astroCloudflareOptions;
          if (opts) {
            opts.remoteBindings = false;
          }
        },
      },
    ],
  },
});
