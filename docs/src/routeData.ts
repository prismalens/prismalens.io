import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import type { BreadcrumbList, Graph, TechArticle } from 'schema-dts';
import plexSans from '@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2?url';
import plexMono from '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2?url';
import { docsOrigin, docsWebSite, ogImagePath, organization, orgId } from './seo/site';

export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	// Preloaded so the text doesn't reflow when the web fonts swap in (layout shift).
	for (const href of [plexSans, plexMono]) {
		route.head.push({ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href, crossorigin: '' } });
	}
	const { id, entry, lastUpdated } = route;
	if (id === '404') {
		route.head.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } });
		return;
	}

	// The route id of the home page is '', but its collection entry (and og image) is 'index'.
	const page = id || 'index';
	const url = new URL(context.url.pathname, docsOrigin).href;
	const image = new URL(ogImagePath(page), docsOrigin).href;
	const imageAlt = `${entry.data.title}: PrismaLens Docs`;

	route.head.push(
		{ tag: 'meta', attrs: { property: 'og:image', content: image } },
		{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
		{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
		{ tag: 'meta', attrs: { property: 'og:image:alt', content: imageAlt } },
		{ tag: 'meta', attrs: { name: 'twitter:image', content: image } },
		{ tag: 'meta', attrs: { name: 'twitter:image:alt', content: imageAlt } },
	);

	const breadcrumbs: BreadcrumbList = {
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'PrismaLens Docs', item: `${docsOrigin}/` },
			{ '@type': 'ListItem', position: 2, name: entry.data.title, item: url },
		],
	};
	const article: TechArticle = {
		'@type': 'TechArticle',
		'@id': `${url}#article`,
		headline: entry.data.title,
		description: entry.data.description,
		url,
		image,
		inLanguage: 'en',
		isPartOf: { '@id': docsWebSite['@id'] as string },
		publisher: { '@id': orgId },
		author: { '@id': orgId },
		license: 'https://creativecommons.org/licenses/by/4.0/',
		...(lastUpdated ? { dateModified: lastUpdated.toISOString() } : {}),
	};
	const graph: Graph = {
		'@context': 'https://schema.org',
		'@graph': [organization, docsWebSite, article, ...(page === 'index' ? [] : [breadcrumbs])],
	};
	const json = JSON.stringify(graph).replaceAll('<', '\\u003c');
	route.head.push({ tag: 'script', attrs: { type: 'application/ld+json' }, content: json });
});
