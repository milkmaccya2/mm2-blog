import Parser from 'rss-parser';

export interface NoteArticle {
  title: string;
  url: string;
  pubDate: string;
  description?: string;
  isPaid: boolean;
}

const NOTE_RSS_URL = 'https://note.com/milkmaccya2/rss';

type CustomFeed = Record<string, never>;
type CustomItem = {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  content?: string;
};

const parser = new Parser<CustomFeed, CustomItem>();

/**
 * noteのRSSフィードを取得してパースする。
 * 有料記事を優先（先頭に）並べ替えたうえで、上位 limit 件を返す。
 */
export async function fetchNoteArticles(limit = 6): Promise<NoteArticle[]> {
  try {
    const feed = await parser.parseURL(NOTE_RSS_URL);

    const articles: NoteArticle[] = feed.items.map((item) => {
      const description = item.contentSnippet ?? item.content ?? '';

      // note の有料記事は description に「有料」「購読」の文言が含まれることがある
      const isPaid = description.includes('有料') || description.includes('購読');

      const pubDate = item.pubDate
        ? new Date(item.pubDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      return {
        title: item.title ?? '',
        url: item.link ?? '',
        pubDate,
        description: description || undefined,
        isPaid,
      };
    });

    // 有料記事を優先（isPaid: true が先頭に来るよう安定ソート）
    articles.sort((a, b) => {
      if (a.isPaid === b.isPaid) return 0;
      return a.isPaid ? -1 : 1;
    });

    return articles.slice(0, limit);
  } catch (error) {
    console.error('Error fetching note RSS feed:', error);
    return [];
  }
}
