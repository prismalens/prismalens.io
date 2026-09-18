// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// The marketing site's header collapses Features/About below md, and Starlight's
// mobile drawer only shows the page tree — so those links need a sidebar entry
// too, or mobile readers have no way to reach them. `astro dev` vs `astro build`
// both put their subcommand in argv, so this is a reliable dev/prod switch.
const isDev = process.argv.includes('dev');
const siteBase = isDev ? 'http://localhost:4321' : 'https://prismalens.io';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.prismalens.io',
	// 0.5.0 retired the CLI investigator pages (prismalens.io#23); old links land on their successors.
	redirects: {
		'/cli': '/reference/',
		'/cli/commands': '/reference/',
		'/cli/configuration': '/reference/',
		'/cli/troubleshooting': '/reference/#troubleshooting',
		'/cli/api-keys': '/coding-agents/',
		'/cli/listen': '/guides/alerts/',
		'/cli/sandboxing': '/trust/#sandboxing',
		'/cli/sample-report': '/guides/reports/',
		'/concepts/how-it-works': '/',
		'/concepts/byo-agent-and-key': '/coding-agents/',
		'/concepts/ordered-evidence': '/guides/reports/',
		'/concepts/data-and-privacy': '/trust/',
	},
	server: {
		port: 4322,
	},
	integrations: [
		starlight({
			title: 'PrismaLens Docs',
			customCss: ['./src/styles/custom.css'],
			components: {
				Header: './src/components/CustomHeader.astro',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/prismalens/prismalens' }],
			editLink: {
				baseUrl: 'https://github.com/prismalens/prismalens.io/edit/main/docs/',
			},
			// Per-page "Last updated" timestamps, so readers can judge whether a
			// time-sensitive gotcha (e.g. the WSL srt caveat) is still current.
			lastUpdated: true,
			// Social/OG preview card for shared links — reuses the brand card the
			// marketing site ships; wired here because Starlight emits no og:image
			// on its own.
			head: [
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://docs.prismalens.io/og-default.png' } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: 'https://docs.prismalens.io/og-default.png' } },
			],
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'Quick start', slug: 'quickstart' },
						{ label: 'Coding agents', slug: 'coding-agents' },
					],
				},
				{
					label: 'Using PrismaLens',
					items: [
						{ label: 'Services and their code', slug: 'guides/services' },
						{ label: 'Sending alerts', slug: 'guides/alerts' },
						{ label: 'Reading the report', slug: 'guides/reports' },
					],
				},
				{ label: 'What PrismaLens reads', slug: 'trust' },
				{ label: 'Reference', slug: 'reference' },
				{
					label: 'Site',
					items: [
						{ label: 'Features', link: `${siteBase}/features` },
						{ label: 'About', link: `${siteBase}/about` },
					],
				},
			],
		}),
		react(),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
