// Checks a built site or docs dist for what search engines and agents read:
// robots.txt, sitemap, llms.txt, per-page meta, and JSON-LD validated against schema.org.
// Usage: tsx scripts/check-seo.mts site|docs [...]
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import Validator from '@adobe/structured-data-validator';
import WebAutoExtractor from '@marbec/web-auto-extractor';

const targets = {
  site: { dist: 'site/dist', origin: 'https://prismalens.io', llms: ['llms.txt'], docs: false },
  docs: { dist: 'docs/dist', origin: 'https://docs.prismalens.io', llms: ['llms.txt', 'llms-full.txt'], docs: true },
} as const;
type Target = (typeof targets)[keyof typeof targets];

const SCHEMA_URL = 'https://schema.org/version/latest/schemaorg-all-https.jsonld';
const failures: string[] = [];
const fail = (where: string, what: string) => failures.push(`${where}: ${what}`);

const read = (t: Target, file: string) => readFileSync(join(t.dist, file), 'utf8');
const distPath = (t: Target, url: string) => {
  const path = new URL(url).pathname;
  return path.endsWith('/') ? `${path}index.html` : path;
};
const one = (tags: Record<string, string[]>, name: string) => tags[name]?.[0]?.trim() ?? '';

async function check(name: keyof typeof targets, validator: Validator) {
  const t = targets[name];
  for (const file of ['robots.txt', 'sitemap-index.xml', ...t.llms]) {
    if (!existsSync(join(t.dist, file))) fail(name, `missing ${file}`);
  }
  if (!read(t, 'robots.txt').includes(`Sitemap: ${t.origin}/sitemap-index.xml`)) {
    fail(name, 'robots.txt does not point at the sitemap');
  }

  const urls = [...read(t, 'sitemap-0.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) fail(name, 'sitemap lists no pages');

  for (const link of read(t, 'llms.txt').matchAll(/\]\((https?:\/\/[^)]+)\)/g)) {
    const url = link[1];
    if (url.startsWith(t.origin) && !existsSync(join(t.dist, distPath(t, url)))) {
      fail(`${name}/llms.txt`, `links to ${url}, which the build does not contain`);
    }
  }

  const seen = { title: new Map<string, string>(), description: new Map<string, string>() };
  for (const url of urls) {
    const file = distPath(t, url);
    const where = `${name}${file}`;
    const html = read(t, file);
    const data = new WebAutoExtractor({ addLocation: true, embedSource: ['rdfa', 'microdata'] }).parse(html);
    const tags = data.metatags as Record<string, string[]>;

    for (const key of ['title', 'description'] as const) {
      const value = one(tags, key);
      if (!value) fail(where, `no ${key}`);
      else if (seen[key].has(value)) fail(where, `${key} duplicates ${seen[key].get(value)}`);
      else seen[key].set(value, file);
    }
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (canonical !== url) fail(where, `canonical is ${canonical}, sitemap says ${url}`);
    const image = one(tags, 'og:image');
    if (!image) fail(where, 'no og:image');
    else if (image.startsWith(t.origin) && !existsSync(join(t.dist, new URL(image).pathname))) {
      fail(where, `og:image ${image} is not in the build`);
    }

    if (t.docs) {
      const md = html.match(/<link rel="alternate" type="text\/markdown" href="([^"]+)"/)?.[1];
      if (!md || !existsSync(join(t.dist, md))) fail(where, `no Markdown twin (${md ?? 'no alternate link'})`);
    }

    if (Object.keys(data.jsonld).length === 0) fail(where, 'no JSON-LD');
    for (const issue of await validator.validate(data)) {
      const message = `${issue.severity} ${issue.issueMessage} (${JSON.stringify(issue.path)})`;
      // The validator reports a property schema.org doesn't define as a warning; here it fails.
      if (issue.severity === 'ERROR' || issue.errorType === 'schemaOrg') fail(where, message);
      else console.warn(`${where}: ${message}`);
    }
  }
  console.log(`${name}: ${urls.length} pages checked`);
}

const names = process.argv.slice(2) as Array<keyof typeof targets>;
if (names.length === 0 || names.some((n) => !(n in targets))) {
  console.error('usage: tsx scripts/check-seo.mts site|docs [...]');
  process.exit(2);
}
const schema = await (await fetch(SCHEMA_URL)).json();
const validator = new Validator(schema);
for (const name of names) await check(name, validator);

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('SEO and agent surfaces OK');
