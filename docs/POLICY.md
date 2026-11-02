# What docs.prismalens.io documents

PrismaLens is alpha and changes every release. The docs cover the few things a
user needs to install it, run it, trust it and read its output. Everything else
is described by the app itself, `pl <command> --help` and the
[release notes](https://github.com/prismalens/prismalens/releases).

## Leave it out rather than guess

Every sentence must be checked against the release the docs describe: its
code, its `--help` or its README. A claim nobody checked is deleted, not
kept "probably right". A shorter page that is true beats a fuller one that
might not be.

## The documented contract

A product PR that changes one of these updates the docs, or opens a docs issue.
Nothing else does.

| Item | Page |
| --- | --- |
| What PrismaLens is: an app on your machine, your own coding agent, no account | `index` |
| Install, upgrade and uninstall: one command per channel | `install` |
| First run to first report: `pl up`, pairing, add a service, investigate | `quickstart` |
| Which coding agents work and how one signs in | `coding-agents` |
| The alert webhook: URL, token, the `service` label | `guides/alerts` |
| The report's sections and the ranked, unscored hypotheses | `guides/reports` |
| What the agent can reach, what leaves the machine, where data lives | `trust` |
| Top-level `pl` commands, one line each, and common fixes | `reference` |

## Keep out

- Settings screens and click-paths beyond the one a task needs. Screens move.
- Terminal transcripts of `pl doctor` or logs, except one line a reader must match.
- Limits, timeouts, rate limits, retry windows and other tuning constants.
- Flags and environment variables nobody needs for the tasks above. `--help` lists them.
- Version tables, "upgrading from 0.x" notes and other release history.
- Features a release just added or is still reshaping. Document one only once it
  is on the contract and has held through a release.
- Internal APIs, CI-only switches, implementation details and roadmap.

## How a change reaches the docs

1. Product PRs: CodeRabbit flags a docs gap only for an item in the table above
   (`.coderabbit.yaml` in prismalens/prismalens).
2. Each release: one docs PR checks the contract pages against the release and
   fixes what drifted. It is the only routine docs PR.
3. Adding a page or a contract item is a change to this file, decided in its own
   PR.
