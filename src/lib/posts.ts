import { getCollection } from 'astro:content';

export async function getPublishedPosts() {
  const posts = await getCollection('blog');
  return posts
    .filter((post) => !post.data.hidden)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
