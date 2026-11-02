# Shared copy deck: every mockup uses exactly this text

## Product nouns
Use only: signal, your agent, run, finding, evidence, your code, your machine.
Never use: incident, alert (except as one example in a list), investigation, hypothesis,
SRE, on-call, Alertmanager, Prometheus, report section names, permission level names,
CLI flags, setting names, any version number, "self-hosted", numeric confidence or %.
Exception: the use-case pages below may use the real nouns (design/GUIDELINES.md rule 4).

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
  Install box: a 3-way switch (macOS & Linux · Windows · npm), preselected by OS, each with [copy];
  commands copied exactly from docs/src/content/docs/install.mdx:
    macOS & Linux   curl -fsSL https://prismalens.io/install.sh | sh
    Windows         irm https://prismalens.io/install.ps1 | iex                     [Preview badge]
    npm             npm install -g prismalens
  Under the box: "Then run `pl up`" · "Also: Homebrew · Scoop · Desktop app" (swap the box)
    Homebrew        brew install prismalens/tap/prismalens
    Scoop           scoop bucket add prismalens https://github.com/prismalens/scoop-bucket
                    scoop install prismalens                                       [Preview badge]
    Desktop app     [Download the app] → https://github.com/prismalens/prismalens/releases/latest  [Preview badge]
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

Footer: logo · Docs · Quick start · Use cases (→ /use-cases/) · About · Privacy (→ docs/trust) · Release notes (→ GitHub releases) · GitHub · Apache-2.0

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

Home <title> (not on the page): PrismaLens: AI root cause analysis with your own coding agent
Home meta description: An open-source app on your machine that sends alerts to the coding agent you already use and returns ranked causes with evidence.

## Use cases (site/src/pages/use-cases/**, rules 4 and 6 exceptions)
Strings live in site/src/lib/use-cases.ts; this deck mirrors it. Real nouns allowed. Order on
each page: hero (H1, line, install box, docs link, visual from the docs) → the query as an H2
with one answer of 60 words or fewer → numbered steps → optional approach table (never
products) → FAQ (answers of 40 words or fewer) → [docs button] [More use cases]. Steps and FAQ
become HowTo and FAQPage JSON-LD, so each line must be true per the linked docs page.

Hub /use-cases/
  H1:   Use cases
  Line: Point the agent you already use at real signals.
  Cards: Incident investigation · Alertmanager alerts · Claude Code (each with its page's line)

/use-cases/incident-investigation/  (docs: /)
  <title>: AI incident investigation with your own coding agent | PrismaLens
  Meta:  Open-source AI incident investigation on your machine: your coding agent reads the code, then ranks hypotheses with evidence for and against.
  H1:    AI incident investigation on your machine
  Line:  Your coding agent reads the code. You check the evidence.
  Link:  How it works →
  H2:    What is AI incident investigation?
         AI incident investigation hands something that broke to an AI agent that reads the service's code and works out what went wrong. With PrismaLens, the coding agent you already use does that on your machine, in a fresh git worktree. Its report ranks the hypotheses, each with the evidence for and against it.
  H2:    How a run goes
    1 A signal arrives      An Alertmanager alert, or an incident you write.
    2 Your agent digs in    It works in a fresh worktree of the last commit.
    3 You stay in charge    Watch it work. Approve or deny what it asks.
    4 Read ranked findings  Hypotheses in order, with evidence for and against.
  H2:    Direct, or through PrismaLens?
    | | Your agent, asked directly | Your agent, through PrismaLens |
    | Starts from | A prompt you write | An Alertmanager alert, or an incident you write |
    | Works in | Wherever you run it | A fresh git worktree, never your checkout |
    | Answer | The agent's reply | Ranked hypotheses, each with evidence |
    | Kept | What the agent keeps | The whole run: steps, findings, what was ruled out |
    | Model and login | The agent's own | The agent's own; PrismaLens never calls a model |
  H2:    Questions, answered
    Q Which coding agents does it drive?
    A OpenCode, Claude Code, Codex, Gemini CLI and deepagents work out of the box. Other agents that speak the Agent Client Protocol can be added.
    Q Does PrismaLens call a model?
    A No. Your coding agent does, with its own sign-in, and sends what it reads to its own model provider, as it would if you used it directly.
    Q Why is there no confidence score?
    A A model has no calibrated way to produce one. The report ranks hypotheses instead, each marked confirmed, supported, speculative or refuted, with the evidence for and against it.
    Q What does it cost?
    A PrismaLens is free and Apache-2.0 licensed, with no account and no subscription. Your agent uses its own plan or API key.

/use-cases/alertmanager/  (docs: /guides/alerts/)
  <title>: Alertmanager webhook to your AI coding agent | PrismaLens
  Meta:  Point a Prometheus Alertmanager webhook at PrismaLens, and by default each critical or high alert starts an investigation by the coding agent you already use.
  H1:    Alertmanager alerts, investigated by your agent
  Line:  One webhook in. Ranked causes and evidence out.
  Link:  Set up the webhook →
  H2:    How do Alertmanager alerts reach your agent?
         Add a webhook receiver to Alertmanager that points at PrismaLens, with the token from your first pl up as a bearer credential. An alert reaches a service through its service label. By default, critical and high alerts on a service then start an investigation by your coding agent.
  H2:    Wired in four steps
    1 Start PrismaLens      The first pl up writes the webhook token.
    2 Add the receiver      Point a webhook receiver at it, with the token.
    3 Match the service     The alert's service label equals a service name.
    4 Let it run            By default, critical and high alerts start an investigation.
  H2:    Questions, answered
    Q Which alerts start an investigation?
    A By default, a critical or high alert on a service. Each service can change that, from always to never. An alert with no matching service starts no investigation.
    Q Can Alertmanager run on another machine?
    A Yes. Start PrismaLens with pl up --host 0.0.0.0. Over plain HTTP the traffic crosses the network in clear, so do this only on a network you trust.
    Q What if my machine is off?
    A The webhook needs PrismaLens running when the alert fires. Alertmanager sends again only with the next group notification, so write the incident yourself for anything you missed.
    Q Can I test it without Alertmanager?
    A Yes. Post a sample alert with curl and the token. The alerts guide has the exact command.

/use-cases/claude-code/  (docs: /coding-agents/)
  <title>: Claude Code incident investigation | PrismaLens
  Meta:  Hand an incident to Claude Code, Codex, OpenCode or Gemini CLI: PrismaLens runs your agent with its own sign-in and keeps every step and finding.
  H1:    Investigate incidents with Claude Code
  Line:  Codex, OpenCode and Gemini CLI work the same way.
  Link:  Agent setup →
  H2:    Can Claude Code investigate incidents?
         Yes. PrismaLens drives Claude Code on your machine over the Agent Client Protocol, the way an editor does. Claude Code reads the service's code and writes a report that ranks its hypotheses with evidence, using its own sign-in. Codex, OpenCode, Gemini CLI and deepagents work the same way.
  H2:    From alert to findings
    1 Install PrismaLens    One command, then run pl up.
    2 Sign in your agent    It uses the agent's own sign-in, as in your terminal.
    3 Pin Claude Code       Start with PRISMALENS_HARNESS=claude-code, or choose it in settings.
    4 Hand it an incident   Send an alert, or write the incident yourself.
  H2:    Questions, answered
    Q Does PrismaLens see my Claude Code login?
    A No. It never reads or stores the agent's own login. If you enter an API key instead, PrismaLens stores it encrypted and never shows it again.
    Q What may Claude Code do during a run?
    A You pick one of four permission levels. The default asks before anything beyond reading and searching. A run started by an alert runs at Auto and refuses anything the agent asks. PrismaLens adds no sandbox.
    Q How is Claude Code picked over other agents?
    A PRISMALENS_HARNESS=claude-code pins it. Otherwise the agent chosen in Settings → Agent runs, and failing that, the first agent that can run.

Buttons: [docs link label] · More use cases

OG image (1200×630): mark + wordmark, the hero H1, the hero line.
