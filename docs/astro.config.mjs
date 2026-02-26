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
				{
					label: 'Getting Started',
					items: [
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' },
						{ label: 'Onboarding', slug: 'getting-started/onboarding' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Command Center', slug: 'guides/command-center' },
						{ label: 'Incidents', slug: 'guides/incidents' },
						{ label: 'Investigations', slug: 'guides/investigations' },
						{ label: 'Services', slug: 'guides/services' },
						{ label: 'Settings', slug: 'guides/settings' },
					],
				},
				{
					label: 'Configuration Reference',
					items: [
						{ label: 'Overview', slug: 'reference' },
						{ label: 'Global Configuration', slug: 'reference/config-global' },
						{ label: 'Database', slug: 'reference/config-database' },
						{ label: 'Logging', slug: 'reference/config-logging' },
						{ label: 'LLM Providers', slug: 'reference/config-llm' },
						{ label: 'LangSmith', slug: 'reference/config-langsmith' },
						{ label: 'Skills & MCP', slug: 'reference/config-skills' },
						{ label: 'MCP Servers', slug: 'reference/config-mcp' },
						{ label: 'Queue Configuration', slug: 'reference/config-queue' },
						{ label: 'Deployment Settings', slug: 'reference/config-deployment' },
					],
				},
				{
					label: 'Integrations',
					items: [
						{ label: 'Prometheus', slug: 'integrations/prometheus' },
						{ label: 'Grafana', slug: 'integrations/grafana' },
						{ label: 'Datadog', slug: 'integrations/datadog' },
						{ label: 'New Relic', slug: 'integrations/newrelic' },
						{ label: 'Generic Webhook', slug: 'integrations/generic' },
					],
				},
				{
					label: 'API',
					items: [
						{ label: 'API Reference', slug: 'api/reference' },
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
