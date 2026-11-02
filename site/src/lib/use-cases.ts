import type { BreadcrumbList, FAQPage, HowTo, Thing, WebPage } from 'schema-dts'

// Text mirrors design/COPY.md ("Use cases"); every line must hold true per the linked docs page.
// These pages may name the product's real nouns (design/GUIDELINES.md rule 4, use-case exception).
// Word limits are enforced by scripts/use-cases.test.ts, which is why this file imports nothing from Astro.
export type UseCase = {
  slug: string
  /** Short name for links and breadcrumbs, 5 words or fewer. */
  label: string
  /** The whole <title>, keyword first. */
  title: string
  description: string
  h1: string
  line: string
  docsPath: string
  docsLabel: string
  /** The query, asked as the first H2 and answered right below it in 60 words or fewer. */
  question: string
  answer: string
  stepsHeading: string
  steps: { title: string; line: string }[]
  /** Answers of 40 words or fewer. */
  faq: { q: string; a: string }[]
  /** Compares approaches, never products. */
  compare?: { heading: string; columns: [string, string]; rows: { label: string; cells: [string, string] }[] }
}

const origin = 'https://prismalens.io'
const docs = 'https://docs.prismalens.io'

export const useCases: UseCase[] = [
  {
    slug: 'incident-investigation',
    label: 'Incident investigation',
    title: 'AI incident investigation with your own coding agent | PrismaLens',
    description:
      'Open-source AI incident investigation on your machine: your coding agent reads the code, then ranks hypotheses with evidence for and against.',
    h1: 'AI incident investigation on your machine',
    line: 'Your coding agent reads the code. You check the evidence.',
    docsPath: '/',
    docsLabel: 'How it works',
    question: 'What is AI incident investigation?',
    answer:
      "AI incident investigation hands something that broke to an AI agent that reads the service's code and works out what went wrong. With PrismaLens, the coding agent you already use does that on your machine, in a fresh git worktree. Its report ranks the hypotheses, each with the evidence for and against it.",
    stepsHeading: 'How a run goes',
    steps: [
      { title: 'A signal arrives', line: 'An Alertmanager alert, or an incident you write.' },
      { title: 'Your agent digs in', line: 'It works in a fresh worktree of the last commit.' },
      { title: 'You stay in charge', line: 'Watch it work. Approve or deny what it asks.' },
      { title: 'Read ranked findings', line: 'Hypotheses in order, with evidence for and against.' },
    ],
    compare: {
      heading: 'Direct, or through PrismaLens?',
      columns: ['Your agent, asked directly', 'Your agent, through PrismaLens'],
      rows: [
        { label: 'Starts from', cells: ['A prompt you write', 'An Alertmanager alert, or an incident you write'] },
        { label: 'Works in', cells: ['Wherever you run it', 'A fresh git worktree, never your checkout'] },
        { label: 'Answer', cells: ["The agent's reply", 'Ranked hypotheses, each with evidence'] },
        { label: 'Kept', cells: ['What the agent keeps', 'The whole run: steps, findings, what was ruled out'] },
        { label: 'Model and login', cells: ["The agent's own", "The agent's own; PrismaLens never calls a model"] },
      ],
    },
    faq: [
      {
        q: 'Which coding agents does it drive?',
        a: 'OpenCode, Claude Code, Codex, Gemini CLI and deepagents work out of the box. Other agents that speak the Agent Client Protocol can be added.',
      },
      {
        q: 'Does PrismaLens call a model?',
        a: 'No. Your coding agent does, with its own sign-in, and sends what it reads to its own model provider, as it would if you used it directly.',
      },
      {
        q: 'Why is there no confidence score?',
        a: 'A model has no calibrated way to produce one. The report ranks hypotheses instead, each marked confirmed, supported, speculative or refuted, with the evidence for and against it.',
      },
      {
        q: 'What does it cost?',
        a: 'PrismaLens is free and Apache-2.0 licensed, with no account and no subscription. Your agent uses its own plan or API key.',
      },
    ],
  },
  {
    slug: 'alertmanager',
    label: 'Alertmanager alerts',
    title: 'Alertmanager webhook to your AI coding agent | PrismaLens',
    description:
      'Point a Prometheus Alertmanager webhook at PrismaLens, and by default each critical or high alert starts an investigation by the coding agent you already use.',
    h1: 'Alertmanager alerts, investigated by your agent',
    line: 'One webhook in. Ranked causes and evidence out.',
    docsPath: '/guides/alerts/',
    docsLabel: 'Set up the webhook',
    question: 'How do Alertmanager alerts reach your agent?',
    answer:
      'Add a webhook receiver to Alertmanager that points at PrismaLens, with the token from your first pl up as a bearer credential. An alert reaches a service through its service label. By default, critical and high alerts on a service then start an investigation by your coding agent.',
    stepsHeading: 'Wired in four steps',
    steps: [
      { title: 'Start PrismaLens', line: 'The first pl up writes the webhook token.' },
      { title: 'Add the receiver', line: 'Point a webhook receiver at it, with the token.' },
      { title: 'Match the service', line: "The alert's service label equals a service name." },
      { title: 'Let it run', line: 'By default, critical and high alerts start an investigation.' },
    ],
    faq: [
      {
        q: 'Which alerts start an investigation?',
        a: 'By default, a critical or high alert on a service. Each service can change that, from always to never. An alert with no matching service starts no investigation.',
      },
      {
        q: 'Can Alertmanager run on another machine?',
        a: 'Yes. Start PrismaLens with pl up --host 0.0.0.0. Over plain HTTP the traffic crosses the network in clear, so do this only on a network you trust.',
      },
      {
        q: 'What if my machine is off?',
        a: 'The webhook needs PrismaLens running when the alert fires. Alertmanager sends again only with the next group notification, so write the incident yourself for anything you missed.',
      },
      {
        q: 'Can I test it without Alertmanager?',
        a: 'Yes. Post a sample alert with curl and the token. The alerts guide has the exact command.',
      },
    ],
  },
  {
    slug: 'claude-code',
    label: 'Claude Code',
    title: 'Claude Code incident investigation | PrismaLens',
    description:
      'Hand an incident to Claude Code, Codex, OpenCode or Gemini CLI: PrismaLens runs your agent with its own sign-in and keeps every step and finding.',
    h1: 'Investigate incidents with Claude Code',
    line: 'Codex, OpenCode and Gemini CLI work the same way.',
    docsPath: '/coding-agents/',
    docsLabel: 'Agent setup',
    question: 'Can Claude Code investigate incidents?',
    answer:
      "Yes. PrismaLens drives Claude Code on your machine over the Agent Client Protocol, the way an editor does. Claude Code reads the service's code and writes a report that ranks its hypotheses with evidence, using its own sign-in. Codex, OpenCode, Gemini CLI and deepagents work the same way.",
    stepsHeading: 'From alert to findings',
    steps: [
      { title: 'Install PrismaLens', line: 'One command, then run pl up.' },
      { title: 'Sign in your agent', line: "It uses the agent's own sign-in, as in your terminal." },
      { title: 'Pin Claude Code', line: 'Start with PRISMALENS_HARNESS=claude-code, or choose it in settings.' },
      { title: 'Hand it an incident', line: 'Send an alert, or write the incident yourself.' },
    ],
    faq: [
      {
        q: 'Does PrismaLens see my Claude Code login?',
        a: "No. It never reads or stores the agent's own login. If you enter an API key instead, PrismaLens stores it encrypted and never shows it again.",
      },
      {
        q: 'What may Claude Code do during a run?',
        a: 'You pick one of four permission levels. The default asks before anything beyond reading and searching. A run started by an alert runs at Auto and refuses anything the agent asks. PrismaLens adds no sandbox.',
      },
      {
        q: 'How is Claude Code picked over other agents?',
        a: 'PRISMALENS_HARNESS=claude-code pins it. Otherwise the agent chosen in Settings → Agent runs, and failing that, the first agent that can run.',
      },
    ],
  },
]

export const useCaseUrl = (slug: string) => `/use-cases/${slug}/`

/** JSON-LD for a use-case page: the page, its breadcrumb, its steps and its questions. */
export function useCaseSchema(u: UseCase): Thing[] {
  const url = `${origin}${useCaseUrl(u.slug)}`
  const docsUrl = `${docs}${u.docsPath}`
  const page: WebPage = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: u.title,
    description: u.description,
    isPartOf: { '@id': `${origin}/#website` },
    about: { '@id': `${origin}/#software` },
    significantLink: docsUrl,
  }
  const breadcrumbs: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'PrismaLens', item: `${origin}/` },
      { '@type': 'ListItem', position: 2, name: 'Use cases', item: `${origin}/use-cases/` },
      { '@type': 'ListItem', position: 3, name: u.label, item: url },
    ],
  }
  const howTo: HowTo = {
    '@type': 'HowTo',
    name: u.stepsHeading,
    description: u.description,
    url: docsUrl,
    step: u.steps.map((s, i) => ({ '@type': 'HowToStep' as const, position: i + 1, name: s.title, text: s.line, url: docsUrl })),
  }
  const faq: FAQPage = {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: [{ q: u.question, a: u.answer }, ...u.faq].map((f) => ({
      '@type': 'Question' as const,
      name: f.q,
      acceptedAnswer: { '@type': 'Answer' as const, text: f.a, url: docsUrl },
    })),
  }
  return [page, breadcrumbs, howTo, faq]
}
