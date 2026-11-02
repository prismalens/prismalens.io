import type { Graph, Organization, SoftwareApplication, Thing, WebSite } from 'schema-dts';
import { githubUrl } from './links';

// Every value here must be true of today's release: no ratings, prices, counts or versions.
const origin = 'https://prismalens.io';
const docs = 'https://docs.prismalens.io';
const orgId = `${origin}/#organization`;

export const siteDescription =
  'An open-source app on your machine that hands signals to your coding agent and keeps the evidence.';

const organization: Organization = {
  '@type': 'Organization',
  '@id': orgId,
  name: 'PrismaLens',
  url: `${origin}/`,
  logo: `${origin}/apple-touch-icon.png`,
  sameAs: ['https://github.com/prismalens'],
};

const website: WebSite = {
  '@type': 'WebSite',
  '@id': `${origin}/#website`,
  name: 'PrismaLens',
  url: `${origin}/`,
  inLanguage: 'en',
  publisher: { '@id': orgId },
};

const app: SoftwareApplication = {
  '@type': 'SoftwareApplication',
  '@id': `${origin}/#software`,
  name: 'PrismaLens',
  description: siteDescription,
  url: `${origin}/`,
  image: `${origin}/og-default.png`,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'macOS, Linux, Windows (preview)',
  license: 'https://www.apache.org/licenses/LICENSE-2.0',
  isAccessibleForFree: true,
  installUrl: `${docs}/install/`,
  downloadUrl: `${githubUrl}/releases/latest`,
  softwareHelp: { '@type': 'CreativeWork', url: `${docs}/` },
  sameAs: [githubUrl],
  publisher: { '@id': orgId },
  author: { '@id': orgId },
};

/** The JSON-LD graph for a page; the home page also describes the app. */
export function structuredData(pathname: string): string {
  const nodes: Thing[] = [organization, website];
  if (pathname === '/') nodes.push(app);
  const graph: Graph = { '@context': 'https://schema.org', '@graph': nodes };
  return JSON.stringify(graph).replaceAll('<', '\\u003c');
}
