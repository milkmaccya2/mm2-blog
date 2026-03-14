import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  type Chunk,
  chunkByParagraphs,
  chunkMarkdownBySections,
  createAboutChunks,
} from './chunker';
import { fetchNoteArticles } from './note-fetcher';

const BLOG_DIR = join(process.cwd(), 'src/content/blog/weekly');

async function loadBlogChunks(): Promise<Chunk[]> {
  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  const chunks: Chunk[] = [];

  for (const file of files) {
    const content = readFileSync(join(BLOG_DIR, file), 'utf-8');
    const dateMatch = file.match(/(\d{4}-\d{2}-\d{2})/);
    if (!dateMatch) {
      console.warn(`Skipping file without date in filename: ${file}`);
      continue;
    }
    const date = dateMatch[1];

    const titleMatch = content.match(/title:\s*['"](.+?)['"]/);
    const title = titleMatch?.[1] ?? file.replace('.md', '');

    const blogChunks = chunkMarkdownBySections(content, {
      source: 'blog',
      title,
      date,
      idPrefix: `blog:${date}`,
    });
    chunks.push(...blogChunks);
  }

  return chunks;
}

async function loadNoteChunks(): Promise<Chunk[]> {
  console.log('Fetching note articles...');
  const articles = await fetchNoteArticles();
  console.log(`Fetched ${articles.length} note articles`);

  const chunks: Chunk[] = [];
  for (const article of articles) {
    const articleChunks = chunkByParagraphs(article.body, {
      title: article.title,
      url: article.url,
      idPrefix: `note:${article.url.split('/').pop() ?? ''}`,
    });
    chunks.push(...articleChunks);
  }

  return chunks;
}

async function main() {
  console.log('=== Ingest Start ===');

  const blogChunks = await loadBlogChunks();
  console.log(`Blog chunks: ${blogChunks.length}`);

  const aboutChunks = createAboutChunks();
  console.log(`About chunks: ${aboutChunks.length}`);

  const noteChunks = await loadNoteChunks();
  console.log(`Note chunks: ${noteChunks.length}`);

  const allChunks = [...blogChunks, ...aboutChunks, ...noteChunks];
  console.log(`Total chunks: ${allChunks.length}`);

  console.log(JSON.stringify(allChunks, null, 2));
}

main().catch(console.error);
