// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmActions from 'starlight-llm-actions';
import tailwindcss from '@tailwindcss/vite';

// The docs header has no About link, so About needs a sidebar entry. `astro dev`
// vs `astro build` both put their subcommand in argv: a reliable dev/prod switch.
const isDev = process.argv.includes('dev');
const siteBase = isDev ? 'http://localhost:4321' : 'https://prismalens.io';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.prismalens.io',
	// Astro 7 defaults to JSX whitespace rules, which glue inline text to links and <code>.
	compressHTML: true,
	// 0.5.0 retired the CLI investigator pages (prismalens.io#23); old links land on their successors.
	redirects: {
		'/cli': '/reference/',
		'/cli/commands': '/reference/',
		'/cli/configuration': '/reference/',
		'/cli/troubleshooting': '/reference/#troubleshooting',
		'/cli/api-keys': '/coding-agents/',
		'/cli/listen': '/guides/alerts/',
		'/cli/sandboxing': '/trust/#what-the-agent-can-reach',
		'/cli/sample-report': '/guides/reports/',
		'/concepts/how-it-works': '/',
		'/concepts/byo-agent-and-key': '/coding-agents/',
		'/concepts/ordered-evidence': '/guides/reports/',
		'/concepts/data-and-privacy': '/trust/',
		// Trimmed to the documented contract (docs/POLICY.md).
		'/guides/services': '/quickstart/',
		'/guides/devices': '/trust/#who-can-open-it',
		'/guides/background-service': '/install/#keep-it-running',
		'/guides/conversation': '/guides/reports/',
		'/guides/try-it': '/quickstart/',
		'/guides/alert-sources': '/guides/alerts/',
		'/guides/connect-a-source': '/guides/alerts/',
		'/guides/git-credentials': '/quickstart/',
		'/guides/incident-lifecycle': '/guides/alerts/',
		'/guides/incidents': '/quickstart/',
		'/guides/investigation-data': '/trust/',
		'/guides/overview': '/guides/reports/',
		'/guides/prometheus': '/guides/alerts/',
		'/guides/record-deploys': '/guides/alerts/',
		'/guides/runs': '/guides/reports/',
	},
	server: {
		port: 4322,
	},
	integrations: [
		starlight({
			title: 'PrismaLens Docs',
			description:
				'Install PrismaLens, run it with the coding agent you already use, and read the evidence it keeps.',
			customCss: ['./src/styles/custom.css'],
			expressiveCode: {
				styleOverrides: {
					borderRadius: '12px',
					borderColor: 'var(--pl-line)',
					codeBackground: 'var(--pl-code-bg)',
					frames: {
						editorTabBarBackground: 'var(--pl-code-bar)',
						terminalTitlebarBackground: 'var(--pl-code-bar)',
						terminalTitlebarBorderBottomColor: 'var(--pl-line)',
						editorTabBarBorderBottomColor: 'var(--pl-line)',
						frameBoxShadowCssValue: 'none',
					},
				},
			},
			components: {
				Header: './src/components/CustomHeader.astro',
				Footer: './src/components/CustomFooter.astro',
				Banner: './src/components/AlphaBanner.astro',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/prismalens/prismalens' }],
			editLink: {
				baseUrl: 'https://github.com/prismalens/prismalens.io/edit/main/docs/',
			},
			// Per-page "Last updated" timestamps, so readers can judge whether a
			// time-sensitive gotcha (e.g. the WSL srt caveat) is still current.
			lastUpdated: true,
			// Per-page og:image and JSON-LD.
			routeMiddleware: './src/routeData.ts',
			head: [
				// Dark-first: seeds the theme Starlight reads; any stored choice, auto included, still wins.
				// The synced tokens switch themes on a `.dark` class; Starlight switches on data-theme.
				{
					tag: 'script',
					content:
						"try{if(localStorage.getItem('starlight-theme')===null)localStorage.setItem('starlight-theme','dark')}catch(e){}const r=document.documentElement;const s=()=>r.classList.toggle('dark',r.dataset.theme!=='light');s();new MutationObserver(s).observe(r,{attributeFilter:['data-theme']});",
				},
			],
			plugins: [
				// One renderer for the .md twins, llms.txt and llms-full.txt, so agents read what people read.
				starlightLlmActions({ renderMarkdown: 'simple', linkAlternate: true, llmsTxt: true }),
			],
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'What PrismaLens is', link: '/' },
						{ label: 'Quick start', slug: 'quickstart' },
						{ label: 'Install, upgrade, uninstall', slug: 'install' },
						{ label: 'Coding agents', slug: 'coding-agents' },
					],
				},
				{
					label: 'Using PrismaLens',
					items: [
						{ label: 'Sending alerts', slug: 'guides/alerts' },
						{ label: 'Reading the report', slug: 'guides/reports' },
					],
				},
				{ label: 'What PrismaLens reads', slug: 'trust' },
				{ label: 'Reference', slug: 'reference' },
				{
					label: 'Site',
					items: [
						{ label: 'About', link: `${siteBase}/about/` },
					],
				},
			],
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
