import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	
	// Sort posts by publication date (newest first)
	posts.sort((a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf());

	const rss = `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>${SITE_TITLE}</title>
		<description>${SITE_DESCRIPTION}</description>
		<link>${context.site}</link>
		<generator>Astro</generator>
		${posts.map((post) => `
		<item>
			<title><![CDATA[${post.data.title}]]></title>
			<link>${context.site}blog/${post.id}/</link>
			<guid isPermaLink="true">${context.site}blog/${post.id}/</guid>
			<description><![CDATA[${post.data.description || ''}]]></description>
			<pubDate>${new Date(post.data.pubDate).toUTCString()}</pubDate>
		</item>`).join('')}
	</channel>
</rss>
	`.trim();

	return new Response(rss, {
		headers: {
			'Content-Type': 'application/xml',
		},
	});
}
