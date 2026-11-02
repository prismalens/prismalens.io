import type { Organization, WebSite } from 'schema-dts';

export const docsOrigin = 'https://docs.prismalens.io';
export const siteOrigin = 'https://prismalens.io';
export const orgId = `${siteOrigin}/#organization`;

export const organization: Organization = {
	'@type': 'Organization',
	'@id': orgId,
	name: 'PrismaLens',
	url: `${siteOrigin}/`,
	logo: `${siteOrigin}/apple-touch-icon.png`,
	sameAs: ['https://github.com/prismalens'],
};

export const docsWebSite: WebSite = {
	'@type': 'WebSite',
	'@id': `${docsOrigin}/#website`,
	name: 'PrismaLens Docs',
	url: `${docsOrigin}/`,
	inLanguage: 'en',
	publisher: { '@id': orgId },
};

/** The image path for a docs entry id, served by src/pages/og/[...slug].ts. */
export const ogImagePath = (id: string) => `/og/${id}.png`;
