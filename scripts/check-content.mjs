// Content rules from design/GUIDELINES.md that a machine can check, run on the built HTML
// so only text a visitor sees is judged. Usage: node scripts/check-content.mjs site|docs
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const target = process.argv[2];
if (!['site', 'docs'].includes(target)) {
	console.error('usage: node scripts/check-content.mjs site|docs');
	process.exit(2);
}
const dist = fileURLToPath(new URL(`../${target}/dist`, import.meta.url));
if (!existsSync(dist)) {
	console.error(`${target}/dist is missing; build first.`);
	process.exit(2);
}

const both = [
	[/(?<![\d.])v?\d+\.\d+\.\d+(?![\d.])/, 'a version number'],
	[/\b\d+\.x\b/, 'a version range'],
	[/\bnode(\.js)?\s+\d+/i, 'a Node version'],
	[/\bself[- ]hosted?\b/i, '"self-hosted": PrismaLens is an app on your machine'],
	[/\d+\s*%\s*(likely|confiden|probab|sure)/i, 'a numeric confidence'],
	[/\b(coming soon|coming in|new in|since v?\d|as of v?\d|will (ship|land|arrive)|not yet (shipped|released))\b/i, 'version talk'],
];
// The site stays generic while the product's direction is open; the docs describe today's product.
const siteOnly = [[/\b(incidents?|investigat\w*|hypothes[ie]s|SRE|on-call)\b/i, 'a product noun the site keeps generic']];
const rules = target === 'site' ? [...both, ...siteOnly] : both;

const visibleText = (html) =>
	html
		.replace(/<(script|style|svg|template)\b[\s\S]*?<\/\1>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;|&#160;/g, ' ')
		.replace(/\s+/g, ' ');

const files = readdirSync(dist, { recursive: true, withFileTypes: true })
	.filter((e) => e.isFile() && e.name.endsWith('.html') && !e.parentPath.includes('pagefind'))
	.map((e) => join(e.parentPath, e.name));

const hits = [];
for (const file of files) {
	const text = visibleText(readFileSync(file, 'utf8'));
	for (const [re, why] of rules) {
		const m = text.match(re);
		if (m) hits.push(`${relative(dist, file)}: ${why}: "…${text.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40).trim()}…"`);
	}
}
if (hits.length) {
	console.error(`${target}: ${hits.length} content rule(s) broken (design/GUIDELINES.md):\n${hits.join('\n')}`);
	process.exit(1);
}
console.log(`check-content ${target}: ${files.length} pages clean.`);
