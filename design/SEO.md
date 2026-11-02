# Search and AI-answer visibility: operator checklist

Goal: be cited inside AI answers (Google AI Overviews and AI Mode, ChatGPT search, Perplexity,
Copilot) and rank for the queries in section 2. Each item is labelled **in code (done)**,
**dashboard toggle (operator)** or **content (operator)**. Re-read monthly (section 8).

## 1. AI answer visibility (GEO) first

AI answers now take clicks that rankings used to get, so a citation counts as much as a rank.

| Item | Type |
| --- | --- |
| Use-case pages answer first: the query as an H2, a 60-word answer under the hero, then steps, an approach table and a FAQ (answers of 40 words or fewer) | in code (done) |
| HowTo, FAQPage and BreadcrumbList JSON-LD mirroring that text | in code (done) |
| Docs descriptions answer what each page is for (alerts, reports, coding agents, trust, index) | in code (done) |
| `llms.txt` on both sites, `.md` twin of every docs page; cheap, agents read them, crawlers mostly don't | in code (done) |
| robots.txt allows search, agent and training crawlers | in code (done) |
| Off-site mentions (section 3): they correlate with AI visibility far more than backlinks (Ahrefs, 75k brands: mentions 0.664, backlinks 0.218) | content (operator) |
| Bing Webmaster next to GSC: Bing's index feeds ChatGPT search and Copilot | dashboard toggle (operator) |

### Monthly prompt check (content, operator)
Run each by hand, signed out where possible. Record "cited? which URL?" per engine.

| Prompt | Google AI Mode / AIO | ChatGPT search | Perplexity | Copilot |
| --- | --- | --- | --- | --- |
| open source AI incident investigation tool | | | | |
| send Alertmanager alerts to an AI agent | | | | |
| alertmanager webhook AI root cause | | | | |
| can Claude Code investigate production incidents | | | | |
| AI root cause analysis with my own coding agent | | | | |
| prometheus alert AI analysis open source | | | | |
| AI SRE agent that runs locally | | | | |

Keep one dated copy of the filled table per month in the umbrella issue.

## 2. Keyword map

Owners are what ranked in November 2026 web searches; recheck monthly in GSC.

| Query | Target page | Who ranks now | Winnable |
| --- | --- | --- | --- |
| alertmanager AI, alertmanager webhook AI root cause | /use-cases/alertmanager/ | small GitHub repos (KubeRCA, Vigil, claude-alert-analyzer), a KodeKloud tutorial, an n8n workflow | now |
| claude code incident investigation | /use-cases/claude-code/ | dev.to posts, Anthropic's Claude Tag on-call docs, skills directories | now |
| open source AI incident investigation | /use-cases/incident-investigation/ | HolmesGPT (CNCF sandbox), OpenSRE, KubeRCA | now to later |
| prometheus alert AI analysis | /use-cases/alertmanager/ | HolmesGPT, Vigil, kube-dojo guide | later |
| AI on-call assistant open source | /use-cases/incident-investigation/ | HolmesGPT | later |
| AI incident investigation | /use-cases/incident-investigation/ | Grafana Cloud AI Investigations, Rootly | later |
| AI root cause analysis | home `<title>`, /use-cases/incident-investigation/ | Rootly, incident.io, Coroot, Dynatrace, ServiceNow, Grafana | later |
| AI SRE agent | /use-cases/incident-investigation/ | vendor round-ups (Mezmo, Arvo, SourceForge), HolmesGPT | later |
| incident resolution AI | /use-cases/incident-investigation/ | G2 and Capterra lists, incident-management vendors | later |
| alertmanager webhook | docs /guides/alerts/ (title "Alertmanager webhook") | Prometheus docs, tutorials | later |

Home `<title>` (in code, done): "PrismaLens: AI root cause analysis with your own coding agent".
Rule 4 keeps the home body generic. Site pages never name competitors; this table may.

## 3. Off-site mentions (content, operator; do these first)

| # | Surface | Proposed text |
| --- | --- | --- |
| 1 | GitHub About (description) | Open-source AI incident investigation on your machine: Alertmanager alerts go to your own coding agent (Claude Code, Codex, OpenCode, Gemini CLI), which returns ranked root-cause hypotheses with evidence. |
| 2 | GitHub About (website, topics) | Website `https://prismalens.io`. Topics: ai-agents, incident-response, incident-management, root-cause-analysis, aiops, sre, alertmanager, prometheus, observability, claude-code, codex, opencode, gemini-cli, agent-client-protocol, on-call, devops, llm, local-first, developer-tools, open-source |
| 3 | README first paragraph | PrismaLens is an open-source app for AI incident investigation that runs on your machine. When an alert arrives from Prometheus Alertmanager, or you write the incident yourself, it hands it to the coding agent you already use, such as Claude Code, Codex, OpenCode or Gemini CLI. The agent reads the service's code and returns ranked hypotheses, each with the evidence for and against it. No account, no model bill from us, Apache-2.0. |
| 4 | npm `packages/cli/package.json` (prismalens/prismalens) | `"description": "Open-source AI incident investigation on your machine: hand Alertmanager alerts to your own coding agent (Claude Code, Codex, OpenCode, Gemini CLI) and get ranked root-cause hypotheses with evidence."`, `"homepage": "https://prismalens.io"`, `"keywords": ["incident-investigation", "root-cause-analysis", "ai-agent", "coding-agent", "alertmanager", "prometheus", "sre", "on-call", "aiops", "observability", "claude-code", "codex", "opencode", "gemini-cli", "agent-client-protocol", "acp"]` |
| 5 | Homebrew formula `desc` (brew audit: no leading article or name, 80 chars max) | `AI incident investigation with your own coding agent, on your machine` |
| 6 | Scoop manifest `description` | `Open-source AI incident investigation on your machine, run by your own coding agent.` |
| 7 | GitHub Discussions | Turn on Discussions with a Q&A category; seed it with the FAQ questions from the use-case pages and link answers to the docs. Indexed, and quoted by AI answers. |
| 8 | Awesome lists (read each CONTRIBUTING; activity unverified) | dastergon/awesome-sre, adriannovegil/awesome-observability, hesreallyhim/awesome-claude-code, e2b-dev/awesome-ai-agents, the ACP agent/client registry. Skip last9/awesome-sre-agents (archived). |
| 9 | Show HN | "Show HN: PrismaLens – hand an Alertmanager alert to your own coding agent". First comment: what it is, what it isn't (alpha, no sandbox), ask for feedback. |
| 10 | Reddit, Stack Overflow | Answer existing questions on AI for alerts or agents on incidents (r/sre, r/devops, r/PrometheusMonitoring, r/ClaudeAI; SO tag prometheus-alertmanager). Answer first, link the docs page, disclose you build it; skip threads it doesn't answer. |
| 11 | dev.to or blog posts | One per use case: its steps, a real run, the report. Link back to the use-case page. |
| 12 | Directories | AlternativeTo, OpenAlternative, LibHunt, SaaSHub, Product Hunt, There's An AI For That. |

## 4. Cloudflare (one zone, `prismalens.io`, covers the site, docs and www; audited and set 2026-11-02)

| Item | Type | Steps or finding |
| --- | --- | --- |
| AI crawlers allowed | done (API, 2026-11-02) | Bot settings had AI training disallowed and Bot Fight Mode on: GPTBot and ClaudeBot got 403. Now Bot Fight Mode off, AI bot blocking off (Search, Agent, Training not blocked), managed robots.txt off. Verified: GPTBot, ClaudeBot, OAI-SearchBot and Googlebot get 200 on both sites, and our robots.txt is served without the Cloudflare-managed block. Re-check after any dashboard change: `curl -s -o /dev/null -w "%{http_code}" -A "GPTBot/1.2" https://docs.prismalens.io/`. |
| Bot Fight Mode | done: off | It can't exempt verified bots or agents on Free, and a static site gains little from it. DDoS protection and the managed WAF rules stay on. |
| Crawler Hints (IndexNow) | dashboard toggle (operator) | API tokens can't change it. **Caching → Configuration → Crawler Hints** on. Cloudflare then signals changed URLs to IndexNow (Bing, Yandex and others). |
| `www.prismalens.io` | done (API) | It returned 525: its DNS still pointed at the old Hostinger CDN. A single redirect rule now sends `www` to `https://prismalens.io` with a 301, keeping path and query. |
| Early Hints | done: on | Free speed gain for page loads. HTTPS redirect, HSTS, TLS 1.3, HTTP/3 and Brotli were already on. |
| Deploy failure alert | done | Notification "PrismaLens site or docs deploy failed" emails on a failed production deployment of `prismalens-site` or `prismalens-docs`. The docs project deploys from the `live` branch, not `main`. |
| AI Crawl Control metrics | dashboard (operator) | The one thing PostHog can't see: requests per AI crawler, by category. Free keeps 24 hours, so check it during the monthly loop and after each launch. |
| Web Analytics | optional | Cookieless and free, but it measures what PostHog already does. Skip unless PostHog is ever removed. |
| Markdown for Agents | dashboard toggle (operator), **Pro or above** | Converts HTML to Markdown at the edge for clients sending `Accept: text/markdown` (Claude Code, OpenCode do); passes through anything the origin already serves as `text/markdown`. Not on Free. If a zone moves to Pro: enable it for **prismalens.io** (no `.md` twins there). For docs it adds little, since `.md` twins and `rel="alternate"` already exist; enabling it does not conflict with `docs/public/_headers`, which only sets the type of the `.md` files. |
| `_headers`: immutable cache for `/_astro/*`; `.md` as `text/markdown; charset=utf-8` | in code (done) | `site/public/_headers`, `docs/public/_headers`. Verify after deploy: `curl -sI https://docs.prismalens.io/quickstart.md`. |
| `_redirects` for `/use-cases` | not needed | `/use-cases/` is a real hub page. |

## 5. Search consoles

| Tool | Type | Steps |
| --- | --- | --- |
| Google Search Console | dashboard toggle (operator) | A `google-site-verification` TXT record is already on the apex, so the property likely exists: open it and submit the sitemaps. If not, add a **Domain** property `prismalens.io` (covers docs and www) → copy the TXT record → Cloudflare DNS → add TXT on the apex → Verify. Submit `https://prismalens.io/sitemap-index.xml` and `https://docs.prismalens.io/sitemap-index.xml`. |
| Bing Webmaster Tools | dashboard toggle (operator) | A Bing verification CNAME is already in DNS, so the site is likely added: submit both sitemaps there. Otherwise: sign in → My Sites → **Import** → sign in with Google → Allow → select both → Import. If GSC access lapses, verify by DNS. Feeds ChatGPT search and Copilot. |
| Ahrefs Webmaster Tools | dashboard toggle (operator) | Free sign-up → add project → verify with **Google Search Console** (needs Owner on the property). Monthly Site Audit; Site Explorer for backlinks and mentions. |

robots.txt (in code, done): Googlebot alone feeds Google Search, AI Overviews and AI Mode.
Google-Extended only governs Gemini training and grounding outside Search; it is allowed too.

## 6. Measurement (PostHog first)

| Item | Type | Steps or finding |
| --- | --- | --- |
| `traffic_source` and `traffic_from` on every event | in code (done) | `ai_assistant` (chatgpt, perplexity, claude, gemini, copilot, grok, deepseek, mistral, meta_ai, you, phind), `search` (google, bing, duckduckgo, …), `social`, `campaign`, `referral`, `internal`, `direct`. `utm_source=chatgpt.com` counts as AI even when the referrer is stripped. Cookieless: recomputed per page load, never stored. Tests: `scripts/analytics.test.ts`. |
| Weekly channel insight | dashboard (operator) | Product analytics → New insight → Trends → event `$pageview` → breakdown `traffic_source` → interval Week → filter `site` = site → Save as "Channels, weekly". Duplicate with breakdown `traffic_from` and filter `traffic_source` = ai_assistant for "AI assistants, weekly". |
| Landing → install funnel by channel | dashboard (operator) | New insight → Funnels → step 1 `$pageview` (filter `$pathname` in /, /use-cases/*), step 2 `install_command_copied` → breakdown `traffic_source` → conversion window 1 hour. Cookieless mode counts within a page visit, so treat it as a per-visit funnel. |
| GSC data in PostHog | dashboard toggle (operator) | Data pipeline → Sources → New source → **Google Search Console** → sign in with read access → pick the query and page tables. One source per property. See posthog.com/docs/data-warehouse/sources/google-search-console |
| "How did you hear about us?" survey | **not recommended** | PostHog's cookieless docs say surveys are disabled without stored consent, and `cookieless_mode: "always"` never stores anything. Not worth dropping cookieless for. |
| Google AI Overviews and AI Mode | limit | They pass a plain Google referrer, so PostHog counts them as `search`. GSC is the only signal: their clicks and impressions fall under the "Web" search type, with no separate filter. |

## 7. What is in code (done)

- Three use-case pages and a hub, answer-first, with HowTo, FAQPage and BreadcrumbList JSON-LD.
- Keyword-first titles and descriptions: home, use cases, docs alerts, reports, coding agents,
  trust and index.
- `llms.txt` on both sites linking the use cases; `.md` twins of every docs page.
- robots.txt allowing all search, AI and training crawlers.
- `_headers` cache and charset rules; PostHog channel properties.
- CI: `scripts/check-seo.mts`, `scripts/use-cases.test.ts`, Vale (`PrismaLensUseCase` style for
  use-case pages), Lighthouse SEO 1.0.

## 8. Monthly loop

1. GSC → Performance → last 28 days → Queries: note new queries with impressions.
2. Run the prompt check (section 1); fill the table.
3. PostHog "Channels, weekly" and "AI assistants, weekly"; the install funnel by channel.
4. Cloudflare AI Crawl Control: which crawlers came, and none blocked.
5. Update the keyword map: move rows between "later" and "now"; add long-tail rows.
6. Adjust a use-case page (title, question, answer, FAQ) or add one for a query with impressions
   and no page; retire a page whose query shows nothing for three months. At most three
   use-case pages; new lines go through `design/COPY.md` and are checked against the docs.

## Sources
- Google, AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- Ahrefs, AI Overview brand correlation: https://ahrefs.com/blog/ai-overview-brand-correlation/
- ChatGPT citation position study: https://searchengineland.com/chatgpt-citations-content-study-469483
- Cloudflare Markdown for Agents: https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents
- Cloudflare AI crawler changes (secondary): https://www.helpnetsecurity.com/2026/07/02/cloudflare-ai-crawler-controls/
- Cloudflare Crawler Hints: https://developers.cloudflare.com/cache/about/crawler-hints
- Cloudflare managed robots.txt: https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt
- Bing import from GSC: https://blogs.bing.com/webmaster/september-2019/Import-sites-from-Search-Console-to-Bing-Webmaster-Tools
- Ahrefs verification: https://help.ahrefs.com/en/articles/3275938-verifying-ownership-of-your-project-or-website
- PostHog cookieless tracking: https://posthog.com/docs/data/cookieless-tracking
- PostHog GSC source: https://posthog.com/docs/data-warehouse/sources/google-search-console
- Google FAQ and HowTo rich results restricted (markup still valid): https://developers.google.com/search/blog/2023/08/howto-faq-changes
