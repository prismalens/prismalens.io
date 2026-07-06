// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

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
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/prismalens' }],
			editLink: {
				baseUrl: 'https://github.com/prismalens/prismalens.io/edit/main/docs/',
			},
			sidebar: [
				// Server-app sections (Guides, Configuration Reference, Integrations, API,
				// Quick Start, Onboarding) are staged in src/content/unreleased/ until the
				// self-hosted server ships — the 0.0.1 launch is CLI-only.
				{
					label: 'Getting Started',
					items: [
						{ label: 'Installation', slug: 'getting-started/installation' },
					],
				},
				{
					label: 'CLI',
					items: [
						{ label: 'Overview & Install', slug: 'cli' },
						{ label: 'Commands', slug: 'cli/commands' },
						{ label: 'Configuration', slug: 'cli/configuration' },
						{ label: 'Providers & Harnesses', slug: 'cli/providers' },
						{ label: 'Sandboxing & Permissions', slug: 'cli/sandboxing' },
						{ label: 'Troubleshooting', slug: 'cli/troubleshooting' },
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
