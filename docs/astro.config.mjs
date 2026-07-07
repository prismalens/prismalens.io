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
			sidebar: [
				// Server-app sections (Guides, Configuration Reference, Integrations, API,
				// Quick Start, Onboarding) are staged in src/content/unreleased/ until the
				// self-hosted server ships — the 0.0.1 launch is CLI-only.
				{
					label: 'CLI',
					items: [
						{ label: 'Overview & Install', slug: 'cli' },
						{ label: 'Providers & Harnesses', slug: 'cli/providers' },
						{ label: 'Commands', slug: 'cli/commands' },
						{ label: 'Configuration', slug: 'cli/configuration' },
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
