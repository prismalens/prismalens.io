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
				// Server-app sections (Guides, Configuration Reference, Integrations, API,
				// Onboarding) are staged in src/content/unreleased/ until the
				// self-hosted server ships — the 0.1.0 launch is CLI-only.
				{ label: 'Quickstart', slug: 'quickstart' },
				{
					label: 'Concepts',
					items: [
						{ label: 'How PrismaLens works', slug: 'concepts/how-it-works' },
						{ label: 'Bring your own agent & key', slug: 'concepts/byo-agent-and-key' },
						{ label: 'Ordered evidence', slug: 'concepts/ordered-evidence' },
						{ label: 'Data & privacy', slug: 'concepts/data-and-privacy' },
					],
				},
				{
					label: 'CLI Reference',
					items: [
						{ label: 'Overview & Install', slug: 'cli' },
						{ label: 'Providers & Harnesses', slug: 'cli/api-keys' },
						{ label: 'Commands', slug: 'cli/commands' },
						{ label: 'Configuration', slug: 'cli/configuration' },
						{ label: 'Unattended Alerts', slug: 'cli/listen' },
						{ label: 'Sandboxing & Permissions', slug: 'cli/sandboxing' },
						{ label: 'Troubleshooting', slug: 'cli/troubleshooting' },
					],
				},
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
