// Docs describe what the product does now; version numbers live in the changelog and in example commands.
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../docs/src/content', import.meta.url));
const repo = fileURLToPath(new URL('..', import.meta.url));
const pattern =
	/\b(coming in|coming soon|in 0\.\d|since 0\.\d|as of 0\.\d|new in|will (ship|land|arrive)|not yet (shipped|released))\b|\b0\.5\.\d/i;
const allowlist = [];

const files = readdirSync(root, { recursive: true, withFileTypes: true })
	.filter((e) => e.isFile() && /\.mdx?$/.test(e.name))
	.map((e) => join(e.parentPath, e.name))
	.sort();

const hits = [];
for (const file of files) {
	const rel = relative(repo, file).split(sep).join('/');
	if (allowlist.includes(rel)) continue;
	let fence = null;
	readFileSync(file, 'utf8')
		.split(/\r?\n/)
		.forEach((line, i) => {
			const open = line.match(/^(\s*)(`{3,}|~{3,})(.*)$/);
			if (fence) {
				// CommonMark closer: opener's marker, at least its length, at most 3 spaces deeper, only blanks after.
				if (
					open &&
					open[2][0] === fence.marker[0] &&
					open[2].length >= fence.marker.length &&
					open[1].length <= fence.indent + 3 &&
					/^[ \t]*$/.test(open[3])
				)
					fence = null;
				return;
			}
			// CommonMark: a backtick fence's info string cannot contain a backtick.
			if (open && !(open[2][0] === '`' && open[3].includes('`'))) {
				fence = { marker: open[2], indent: open[1].length };
				return;
			}
			const prose = line.replace(/(`+)[^`]*?\1/g, '');
			if (pattern.test(prose)) hits.push(`${rel}:${i + 1}: ${line.trim()}`);
		});
}

if (hits.length) {
	console.error(`Docs talk about versions (${hits.length}). Say what the product does, in present tense:\n`);
	console.error(hits.join('\n'));
	process.exit(1);
}
console.log(`check-version-talk: ${files.length} pages, no version talk.`);
