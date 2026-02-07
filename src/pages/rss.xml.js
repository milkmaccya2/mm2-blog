import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

// XML escape function
function escapeXML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Helper to ensure trailing slash for site URL
function ensureTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

// Escape CDATA content
function escapeCDATA(str) {
  return str.replace(/]]>/g, ']]]]><![CDATA[>');
}

export async function GET(context) {
  const posts = await getCollection('blog');

  // Sort posts by publication date (newest first)
  posts.sort((a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf());

  const siteUrl = ensureTrailingSlash(context.site.toString());

  const rss = `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<channel>
		<title>${escapeXML(SITE_TITLE)}</title>
		<description>${escapeXML(SITE_DESCRIPTION)}</description>
		<link>${siteUrl}</link>
		<language>ja</language>
		${posts.length > 0 ? `<lastBuildDate>${new Date(posts[0].data.pubDate).toUTCString()}</lastBuildDate>` : ''}
		<generator>Astro</generator>
		${posts
      .map((post) => {
        const postUrl = new URL(`blog/${post.id}/`, siteUrl).toString();
        return `
		<item>
			<title>${escapeXML(post.data.title)}</title>
			<link>${postUrl}</link>
			<guid isPermaLink="true">${postUrl}</guid>
			<description><![CDATA[${escapeCDATA(post.data.description || '')}]]></description>
			<pubDate>${new Date(post.data.pubDate).toUTCString()}</pubDate>
		</item>`;
      })
      .join('')}
	</channel>
</rss>
	`.trim();

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
