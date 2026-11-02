# Site and docs guidelines

The rules every change to `site/` and `docs/` follows. `docs/POLICY.md` decides
*what* the docs cover; this file decides how the site and docs read, look and move.
`design/COPY.md` holds the site's approved text, and `design/landing.html` and
`design/docs.html` are the reference designs.

Enforced with standard tools; a rule marked [CI] fails the build:
- **[Vale](https://vale.sh)** lints the docs' MDX and the site's built HTML
  against the rules in `.vale/styles/` (wording, versions, text budget).
- **[lychee](https://lychee.cli.rs)** fails on a broken internal link.
- **[Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)** fails a page
  below 0.95 accessibility, 0.9 best practices or 1.0 SEO, and warns below 0.9
  performance (`site/lighthouserc.json`, `docs/lighthouserc.json`).
- **`scripts/check-seo.mts`** fails a build without its sitemap, robots.txt or
  `llms.txt`, a page without a unique title, description, canonical URL or
  social image, a docs page without its `.md` twin, or JSON-LD that
  schema.org doesn't define.
- **Review:** CodeRabbit checks what a tool can't (`.coderabbit.yaml`).
- **Authors:** agents read this file before touching `site/` or `docs/` (`AGENTS.md`).

Locally, after building: `pnpm check` (needs `vale` and `lychee` on your PATH,
for example `brew install vale lychee`) and `pnpm check:a11y` (needs Chrome).
A new rule goes into `.vale/styles/` as a Vale rule when it's about words, and
into this file either way.

## Words

1. **No version numbers, anywhere** [CI]: not of PrismaLens, Node or agents, and
   no "new in", "since", "coming soon" or "upgrading from". Pages describe the
   latest release; history lives in the release notes.
2. **An app on your machine, never "self-hosted"** [CI].
3. **No numeric confidence** [CI]: findings are ranked and backed by evidence,
   never scored. A strength bar has no numbers.
4. **The site stays generic** [CI for the nouns]. The product's direction is
   open, so the site speaks in what holds across every direction: signal, your
   agent, run, finding, evidence, your code, your machine. It never names
   incidents, investigations, hypotheses, SRE or on-call, and never names
   settings, flags or permission levels. The docs describe today's product and
   may use its real nouns.
   **Exception:** use-case pages (`site/src/pages/use-cases/**`) answer search
   intent and may use the product's real nouns, settings and flags. They follow
   every other rule here: no versions, no "self-hosted", no numeric confidence,
   no unchecked claims, the text budget as rule 6 narrows it, and shown rather
   than told. They may be added or retired as the direction changes;
   `design/SEO.md` says which and why.
5. **No unchecked claims.** A sentence nobody traced to the release is deleted,
   not softened. No invented stats, users, logos, testimonials or pricing.
6. **Text budget (site)** [CI]: a hero gets a headline of 6 words or fewer and one
   line of 10 words or fewer. Every other section gets a heading of 5 words or
   fewer and at most one line of 10. No paragraphs, captions, disclaimers,
   explainer tooltips or footnotes: the visual carries the meaning. New site
   text goes into `design/COPY.md` first.
   **Exception (use-case pages only):** right under the hero, the search query as
   a question heading (8 words or fewer) and one answer of 60 words or fewer; then
   numbered steps (title of 5 words, line of 10); an optional table comparing
   approaches, never products; and a FAQ with question headings and answers of
   40 words or fewer. Every answer is true per the docs page it links. The home
   page keeps the strict budget. [CI: `.vale.ini`, `scripts/use-cases.test.ts`]
7. **Docs instruct; they don't narrate.** A step is a title, a command and at
   most one short line. Callouts warn; they don't explain.

## Look

8. **Tokens only.** Colours, radii and fonts come from `design-tokens/`, which
   is synced from the app (`pnpm tokens:sync`). Never hard-code a new colour;
   add a token in the app first.
9. **Dark first:** layered surfaces, one soft glow behind the active area, and a
   translucent sticky header.
10. **One idea per section, shown, not told:** a live visual beats a screenshot,
   and a screenshot beats a sentence.

## Motion and states

11. **Every async surface has three states:** a skeleton shaped like the final
    layout while loading, the content, and an empty or failed state. Never a
    blank panel or a lone spinner where content goes.
12. **A spinner is a ring, never a rotating icon.** When work finishes, the ring
    is replaced by a still tick or cross that pops in (scale up over 200–250ms).
    Never rotate a tick.
13. **Short and purposeful:** entries rise and fade over 250–400ms with an
    ease-out curve. No looping decoration inside something people read. A
    looping demo pauses when hovered, scrolled out of view or the tab is hidden.
14. **`prefers-reduced-motion`** shows the final state with no animation. It
    applies to every animation, with no exceptions.

## Accessibility and quality

15. [CI] Text and controls meet WCAG AA contrast. Every control has a visible focus
    ring and works from the keyboard. A streaming log uses `aria-live="polite"`.
16. Pages work at 390px wide with no sideways scroll. Long code scrolls inside
    its own block.
17. No new runtime dependency for an effect CSS or a few lines of script can do.
18. Copy buttons and outbound links keep the analytics hooks that
    `docs/src/scripts/analytics.ts` reads (`pnpm test` covers them).

## Before you open a PR

- `pnpm build:site`, `pnpm build:docs`, `pnpm check`, `pnpm check:a11y` and `pnpm test` pass.
- Look at the changed pages at desktop width and at 390px, with reduced motion on.
