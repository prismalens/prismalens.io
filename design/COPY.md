# Shared copy deck: every mockup uses exactly this text

## Product nouns
Use only: signal, your agent, run, finding, evidence, your code, your machine.
Never use: incident, alert (except as one example in a list), investigation, hypothesis,
SRE, on-call, Alertmanager, Prometheus, report section names, permission level names,
CLI flags, setting names, any version number, "self-hosted", numeric confidence or %.

## Text budget
- Hero: one headline (6 words or fewer) + one line (10 words or fewer) + install box + one secondary link.
- Every other section: a heading (5 words or fewer), optionally one line (10 words or fewer). No paragraphs.
- No captions, disclaimers, "illustration" notes, explainer tooltips, step descriptions or footnotes.
  Visuals carry the meaning. Demo labels inside visuals stay short (2-4 words).

## Copy
Nav: Docs · GitHub · Install (button, scrolls to the closing install tabs)

Hero
  H1:   Your agent, working while you're not.
  Line: Signals in. Your agent digs in. Evidence out.
  Install box (tabs, each with [copy]; commands copied exactly from docs/src/content/docs/install.mdx):
    macOS & Linux          curl -fsSL https://prismalens.io/install.sh | sh
    npm                    npm install -g prismalens
    Homebrew               brew install prismalens/tap/prismalens
    Windows (preview)      irm https://prismalens.io/install.ps1 | iex
    Scoop (preview)        scoop bucket add prismalens https://github.com/prismalens/scoop-bucket
                           scoop install prismalens
    Desktop app (preview)  [Download the app] → https://github.com/prismalens/prismalens/releases/latest
  Next step: Then run `pl up`
  Platform chips: macOS · Linux · WSL2 · Windows (preview)
  Link: Read the docs → (to the Quick start)

Pillars (3)
  Any signal        Alerts, webhooks, or you.
  Your agent        The one you already pay for.
    Agent chips: OpenCode · Claude Code · Codex · Gemini CLI · deepagents · + any ACP agent
  Evidence, ranked  What it found, and why.

Trust strip (chips, no sentences)
  Open source (→ GitHub) · Runs on your machine (→ docs/trust) · No account · No model bill ·
  You approve what it does (→ docs/trust)

Closing
  H2:  Try it in a minute.
  Install box again + GitHub link.

Footer: logo · Docs · Quick start · About · Privacy (→ docs/trust) · Release notes (→ GitHub releases) · GitHub · Apache-2.0

About
  H1:   About PrismaLens
  Line: Your agent already reads code. Point it at signals.
  Cards:
    Evidence over scores     Ranked findings, each with its evidence. Never a percentage.
    Your agent, your login   It never calls a model. No account, nothing to pay.
    Limits, said plainly     It adds no sandbox, and the docs say so.
    Yours to run             Open source under Apache-2.0, on your machine.
  Button: Feedback on GitHub

404
  H1:   No page at this address.
  Buttons: Home · Docs · Report a broken link

OG image (1200×630): mark + wordmark, the hero H1, the hero line.
