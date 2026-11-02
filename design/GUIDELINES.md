# Site and docs guidelines

The rules every change to `site/` and `docs/` follows. `docs/POLICY.md` decides
*what* the docs cover; this file decides how the site and docs read, look and move.
`design/COPY.md` holds the site's approved text, and `design/landing.html` and
`design/docs.html` are the reference designs.

Enforced three ways:
- **CI:** `scripts/check-content.mjs` fails a build whose visible text breaks a
  rule marked [CI] below. Run it locally with `pnpm check:content` after building.
- **Review:** CodeRabbit checks the rest (`.coderabbit.yaml`).
- **Authors:** agents read this file before touching `site/` or `docs/` (`AGENTS.md`).

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
5. **No unchecked claims.** A sentence nobody traced to the release is deleted,
   not softened. No invented stats, users, logos, testimonials or pricing.
6. **Text budget (site):** a hero gets a headline of 6 words or fewer and one
   line of 10 words or fewer. Every other section gets a heading of 5 words or
   fewer and at most one line of 10. No paragraphs, captions, disclaimers,
   explainer tooltips or footnotes: the visual carries the meaning. New site
   text goes into `design/COPY.md` first.
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

15. Text and controls meet WCAG AA contrast. Every control has a visible focus
    ring and works from the keyboard. A streaming log uses `aria-live="polite"`.
16. Pages work at 390px wide with no sideways scroll. Long code scrolls inside
    its own block.
17. No new runtime dependency for an effect CSS or a few lines of script can do.
18. Copy buttons and outbound links keep the analytics hooks that
    `docs/src/scripts/analytics.ts` reads (`pnpm test` covers them).

## Before you open a PR

- `pnpm build:site`, `pnpm build:docs`, `pnpm check:content` and `pnpm test` pass.
- Look at the changed pages at desktop width and at 390px, with reduced motion on.
