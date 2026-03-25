const QIITA_TOP_URL = 'https://qiita.com/milkmaccya2';

export interface QiitaOgp {
  title: string;
  description?: string;
  image?: string;
  url: string;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function extractMeta(html: string, property: string): string | undefined {
  const pattern = new RegExp(
    `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']|<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`,
    'i'
  );
  const match = html.match(pattern);
  const raw = match?.[1] ?? match?.[2];
  return raw ? decodeHtmlEntities(raw) : undefined;
}

/**
 * Qiita トップページから OGP 情報を取得する（ビルド時に1回のみ呼び出す想定）
 */
export async function fetchQiitaOgp(): Promise<QiitaOgp> {
  try {
    const res = await fetch(QIITA_TOP_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AstroBot/1.0)' },
    });
    const html = await res.text();

    return {
      title: extractMeta(html, 'og:title') ?? 'milkmaccya2のQiita',
      description: extractMeta(html, 'og:description'),
      image: extractMeta(html, 'og:image'),
      url: QIITA_TOP_URL,
    };
  } catch (error) {
    console.error('Failed to fetch Qiita OGP:', error);
    return {
      title: 'milkmaccya2のQiita',
      url: QIITA_TOP_URL,
    };
  }
}
