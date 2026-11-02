import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import { darkToken } from '../../seo/tokens';

const entries = await getCollection('docs');
const pages = Object.fromEntries(entries.map(({ id, data }) => [id, data]));
const sans = './node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2';

export const { getStaticPaths, GET } = await OGImageRoute({
	pages,
	getSlug: (id) => `${id}.png`,
	getImageOptions: (_id, page) => ({
		title: page.title,
		description: page.description,
		logo: { path: './public/apple-touch-icon.png', size: [88] },
		bgGradient: [darkToken('background'), darkToken('card')],
		border: { color: darkToken('primary'), width: 12, side: 'block-end' },
		padding: 80,
		fonts: [sans],
		font: {
			title: { families: ['IBM Plex Sans'], color: darkToken('foreground'), size: 72, weight: 'SemiBold', lineHeight: 1.1 },
			description: { families: ['IBM Plex Sans'], color: darkToken('muted-foreground'), size: 36, lineHeight: 1.35 },
		},
	}),
});
