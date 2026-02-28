const NOTE_TOP_URL = 'https://note.com/milkmaccya2';

export interface NoteOgp {
  title: string;
  description?: string;
  image?: string;
  url: string;
}

function extractMeta(html: string, property: string): string | undefined {
  // property="og:xxx" content="..." 形式と順序が逆の形式の両方に対応
  const pattern = new RegExp(
    `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']|<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`,
    'i'
  );
  const match = html.match(pattern);
  return match?.[1] ?? match?.[2];
}

/**
 * note トップページから OGP 情報を取得する（ビルド時に1回のみ呼び出す想定）
 */
export async function fetchNoteOgp(): Promise<NoteOgp> {
  try {
    const res = await fetch(NOTE_TOP_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AstroBot/1.0)' },
    });
    const html = await res.text();

    return {
      title: extractMeta(html, 'og:title') ?? 'milkmaccya2のnote',
      description: extractMeta(html, 'og:description'),
      image: extractMeta(html, 'og:image'),
      url: NOTE_TOP_URL,
    };
  } catch (error) {
    console.error('Failed to fetch note OGP:', error);
    return {
      title: 'milkmaccya2のnote',
      url: NOTE_TOP_URL,
    };
  }
}
