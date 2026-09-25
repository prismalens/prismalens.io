import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as siteAnalytics from '../site/src/scripts/analytics';
import * as docsAnalytics from '../docs/src/scripts/analytics';

const modules = [
  { name: 'site', mod: siteAnalytics },
  { name: 'docs', mod: docsAnalytics },
];

for (const { name, mod } of modules) {
  describe(`analytics (${name})`, () => {
    describe('analyticsHost', () => {
      it('returns "site" for production hosts prismalens.io and www.prismalens.io', () => {
        assert.equal(mod.analyticsHost('prismalens.io'), 'site');
        assert.equal(mod.analyticsHost('www.prismalens.io'), 'site');
      });

      it('returns "docs" for production host docs.prismalens.io', () => {
        assert.equal(mod.analyticsHost('docs.prismalens.io'), 'docs');
      });

      it('returns null for localhost, preview domains, and other hosts', () => {
        assert.equal(mod.analyticsHost('localhost'), null);
        assert.equal(mod.analyticsHost('prismalens-docs.pages.dev'), null);
        assert.equal(mod.analyticsHost('main.prismalens-docs.pages.dev'), null);
        assert.equal(mod.analyticsHost('evil-prismalens.io'), null);
      });
    });

    describe('installTarget', () => {
      it('identifies npm package URLs (including paths under it)', () => {
        assert.equal(mod.installTarget('https://www.npmjs.com/package/prismalens'), 'npm');
        assert.equal(mod.installTarget('https://npmjs.com/package/prismalens'), 'npm');
        assert.equal(mod.installTarget('https://www.npmjs.com/package/prismalens/v/0.5.0'), 'npm');
      });

      it('identifies desktop releases URLs (releases and releases/latest)', () => {
        assert.equal(mod.installTarget('https://github.com/prismalens/prismalens/releases'), 'desktop');
        assert.equal(mod.installTarget('https://github.com/prismalens/prismalens/releases/latest'), 'desktop');
        assert.equal(mod.installTarget('https://github.com/prismalens/prismalens/releases/tag/v0.5.0'), 'desktop');
      });

      it('identifies github repo URLs (repo root and /issues)', () => {
        assert.equal(mod.installTarget('https://github.com/prismalens/prismalens'), 'github');
        assert.equal(mod.installTarget('https://github.com/prismalens/prismalens/issues'), 'github');
        assert.equal(mod.installTarget('https://github.com/prismalens/prismalens/pulls'), 'github');
      });

      it('returns null for other repo or domains or malformed input', () => {
        assert.equal(mod.installTarget('https://github.com/prismalens/prismalens.io'), null);
        assert.equal(mod.installTarget('https://example.com'), null);
        assert.equal(mod.installTarget('not a url::'), null);
      });
    });

    describe('copiedCommand', () => {
      it('identifies npm_global commands (npm i -g, npm install -g, npm install --global)', () => {
        assert.equal(mod.copiedCommand('npm i -g prismalens'), 'npm_global');
        assert.equal(mod.copiedCommand('npm install -g prismalens'), 'npm_global');
        assert.equal(mod.copiedCommand('npm install --global prismalens'), 'npm_global');
      });

      it('identifies npx commands', () => {
        assert.equal(mod.copiedCommand('npx prismalens@latest up'), 'npx');
      });

      it('returns null when command does not contain "prismalens"', () => {
        assert.equal(mod.copiedCommand('pl up'), null);
      });

      it('returns other for curl or other commands containing "prismalens"', () => {
        assert.equal(mod.copiedCommand('curl -fsSL https://example.com | prismalens'), 'other');
      });
    });
  });
}

describe('byte-identical copies', () => {
  it('site and docs analytics.ts are byte-identical', () => {
    const siteContent = fs.readFileSync(new URL('../site/src/scripts/analytics.ts', import.meta.url));
    const docsContent = fs.readFileSync(new URL('../docs/src/scripts/analytics.ts', import.meta.url));
    assert.ok(
      siteContent.equals(docsContent),
      'site/src/scripts/analytics.ts and docs/src/scripts/analytics.ts must be byte-identical'
    );
  });
});
