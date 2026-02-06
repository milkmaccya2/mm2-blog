import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

// XMLエスケープ関数
function escapeXML(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

// サイトURLの末尾スラッシュを保証するヘルパー
function ensureTrailingSlash(url) {
	return url.endsWith('/') ? url : `${url}/`;
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
		<generator>Astro</generator>
		${posts.map((post) => {
			const postUrl = new URL(`blog/${post.id}/`, siteUrl).toString();
			return `
		<item>
			<title>${escapeXML(post.data.title)}</title>
			<link>${postUrl}</link>
			<guid isPermaLink="true">${postUrl}</guid>
			<description><![CDATA[${post.data.description || ''}]]></description>
			<pubDate>${new Date(post.data.pubDate).toUTCString()}</pubDate>
		</item>`;
		}).join('')}
	</channel>
</rss>
	`.trim();

	return new Response(rss, {
		headers: {
			'Content-Type': 'application/xml',
		},
	});
}
