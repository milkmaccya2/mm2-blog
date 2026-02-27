export interface NoteArticle {
  title: string;
  url: string;
  pubDate: string;
  description?: string;
  isPaid: boolean;
}

const NOTE_RSS_URL = 'https://note.com/milkmaccya2/rss';

function extractTextContent(xml: string, tag: string): string {
  const cdataMatch = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`,
    'i'
  ).exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();

  const match = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(xml);
  if (match) return match[1].trim();

  return '';
}

function parseItems(xml: string): NoteArticle[] {
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/gi) ?? [];

  return itemMatches.map((item) => {
    const title = extractTextContent(item, 'title');
    const link = extractTextContent(item, 'link');
    const pubDateStr = extractTextContent(item, 'pubDate');
    const description = extractTextContent(item, 'description');

    // note の有料記事はタイトルに「【有料】」や説明に購入を促す表現が入ることがある。
    // RSS の <price> タグ or description に "有料" が含まれるかで判定する。
    const isPaid =
      /<price>/i.test(item) || description.includes('有料') || description.includes('購読');

    const pubDate = pubDateStr
      ? new Date(pubDateStr).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    return {
      title,
      url: link,
      pubDate,
      description: description || undefined,
      isPaid,
    };
  });
}

export async function fetchNoteArticles(limit = 6): Promise<NoteArticle[]> {
  try {
    const response = await fetch(NOTE_RSS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; mm2-blog/1.0)',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch note RSS: ${response.status} ${response.statusText}`);
      return [];
    }

    const xml = await response.text();
    const articles = parseItems(xml);
    return articles.slice(0, limit);
  } catch (error) {
    console.error('Error fetching note RSS feed:', error);
    return [];
  }
}
