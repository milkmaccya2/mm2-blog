import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import type { ReactNode } from 'react';
import satori from 'satori';
import sharp from 'sharp';
import { SITE_TITLE } from '@/consts';
import { getOgImage, getSatoriOptions, loadGoogleFont } from '@/lib/og-image';

// Load fonts once and cache for all pages
let fontsPromise: Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> | null = null;

function getFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      loadGoogleFont('Noto Sans JP', 400),
      loadGoogleFont('Noto Sans JP', 700),
    ])
      .then(([regular, bold]) => ({ regular, bold }))
      .catch((error) => {
        fontsPromise = null; // Reset on failure to allow retry
        throw error;
      });
  }
  return fontsPromise;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = (await getCollection('blog')).filter((post) => !post.data.hidden);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      pubDate: post.data.pubDate,
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, pubDate } = props as { title: string; pubDate: Date };

  const formattedDate = pubDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const fonts = await getFonts();
  const options = getSatoriOptions(fonts);
  const markup = getOgImage(title, formattedDate, SITE_TITLE);

  const svg = await satori(markup as ReactNode, options);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
};
