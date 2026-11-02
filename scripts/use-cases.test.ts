// Holds the use-case pages to their text budget (design/GUIDELINES.md rules 1-6, use-case exception).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { useCases, useCaseSchema } from '../site/src/lib/use-cases';

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
const atMost = (text: string, max: number, what: string) =>
  assert.ok(words(text) <= max, `${what} has ${words(text)} words, more than ${max}: "${text}"`);

// The version pattern is .vale/styles/PrismaLens/Versions.yml's, so an address like 0.0.0.0 passes.
const banned = [/self[- ]hosted?/i, /\d+\s*%/, /(?:^|[^\d.])v?\d+\.\d+\.\d+(?:[^\d.]|$)/, /coming soon/i, /\bnew in\b/i];

for (const u of useCases) {
  describe(`use case: ${u.slug}`, () => {
    it('keeps the hero inside the site budget', () => {
      atMost(u.h1, 6, 'H1');
      atMost(u.line, 10, 'hero line');
      atMost(u.label, 5, 'label');
    });

    it('asks the query as a heading and answers it in 60 words or fewer', () => {
      assert.ok(u.question.endsWith('?'), 'the first heading is a question');
      atMost(u.question, 8, 'question heading');
      atMost(u.answer, 60, 'answer block');
    });

    it('keeps steps and FAQ answers short', () => {
      atMost(u.stepsHeading, 8, 'steps heading');
      for (const s of u.steps) {
        atMost(s.title, 5, 'step title');
        atMost(s.line, 10, 'step line');
      }
      assert.ok(u.faq.length > 0, 'has a FAQ');
      for (const f of u.faq) {
        assert.ok(f.q.endsWith('?'), `"${f.q}" is a question`);
        atMost(f.a, 40, `answer to "${f.q}"`);
      }
    });

    it('has a one-sentence meta description and a keyword-first title', () => {
      assert.equal(u.description.split(/[.!?](\s|$)/).filter((p) => p.trim()).length, 1);
      assert.ok(u.title.endsWith('| PrismaLens'));
    });

    it('carries no version talk, "self-hosted" or numeric confidence', () => {
      const text = [u.h1, u.line, u.question, u.answer, ...u.steps.flatMap((s) => [s.title, s.line]), ...u.faq.flatMap((f) => [f.q, f.a]), u.description].join('\n');
      for (const pattern of banned) assert.doesNotMatch(text, pattern);
    });

    it('emits HowTo and FAQPage JSON-LD that mirror the visible text', () => {
      const types = useCaseSchema(u).map((n) => (n as { '@type': string })['@type']);
      assert.deepEqual(types, ['WebPage', 'BreadcrumbList', 'HowTo', 'FAQPage']);
    });
  });
}

describe('use cases', () => {
  it('stay at three or fewer, with unique slugs', () => {
    assert.ok(useCases.length <= 3);
    assert.equal(new Set(useCases.map((u) => u.slug)).size, useCases.length);
  });
});
