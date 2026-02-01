// import rss from '@astrojs/rss';
// import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
    return new Response('RSS disabled temporarily due to Astro v6 compatibility.', { status: 404 });
	// const posts = await getCollection('blog');
	// return rss({
	// 	title: SITE_TITLE,
	// 	description: SITE_DESCRIPTION,
	// 	site: context.site,
	// 	items: posts.map((post) => ({
	// 		...post.data,
	// 		link: `/blog/${post.id}/`,
	// 	})),
	// });
}
