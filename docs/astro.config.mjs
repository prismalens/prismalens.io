// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.prismalens.io',
	integrations: [
		starlight({
			title: 'PrismaLens Docs',
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
	],
});
