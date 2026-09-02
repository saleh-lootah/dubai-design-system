import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findRepoLinks, isTextFile } from './check-no-repo-links.mjs';

const SCRIPT_PATH = fileURLToPath(new URL('./check-no-repo-links.mjs', import.meta.url));

test('reports a release link in a changelog heading', () => {
  const files = [{ path: 'CHANGELOG.md', text: '## [5.0.1](https://github.com/saleh-lootah/dubai-design-system/releases/tag/x) (2026-09-01)' }];

  const found = findRepoLinks(files);

  assert.equal(found.length, 1);
  assert.equal(found[0].path, 'CHANGELOG.md');
  assert.equal(found[0].line, 1);
});

test('reports an inline commit link', () => {
  const files = [{ path: 'CHANGELOG.md', text: '- fix ([0822d3f](https://github.com/saleh-lootah/dubai-design-system/commit/0822d3f))' }];

  assert.equal(findRepoLinks(files).length, 1);
});

// The rule is about the project, not one account. Moving the repository to an
// organisation must not silently re-open the hole.
test('catches the repository under a different owner', () => {
  const files = [{ path: 'CHANGELOG.md', text: 'https://github.com/digital-dubai/dubai-design-system/releases' }];

  assert.equal(findRepoLinks(files).length, 1);
});

test('catches a protocol-relative or bare host reference', () => {
  const files = [{ path: 'a.md', text: 'see github.com/saleh-lootah/dubai-design-system for more' }];

  assert.equal(findRepoLinks(files).length, 1);
});

// dist/ legitimately carries github.com URLs from Stencil's runtime and from Quill.
// Matching those would make the gate unpassable for reasons nobody can fix.
test('ignores third-party github links', () => {
  const files = [
    { path: 'a.js', text: 'https://github.com/ionic-team/stencil/issues/1234' },
    { path: 'b.js', text: 'https://github.com/quilljs/quill' },
    { path: 'c.md', text: 'https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md' },
  ];

  assert.deepEqual(findRepoLinks(files), []);
});

test('reports nothing for a clean changelog', () => {
  const files = [{ path: 'CHANGELOG.md', text: '## 5.0.1 (2026-09-01)\n\n- fix (0822d3f)\n' }];

  assert.deepEqual(findRepoLinks(files), []);
});

test('reports every occurrence, with correct line numbers', () => {
  const text = ['## 5.0.0', 'https://github.com/a/dubai-design-system', 'clean line', 'https://github.com/b/dubai-design-system'].join('\n');

  const found = findRepoLinks([{ path: 'CHANGELOG.md', text }]);

  assert.equal(found.length, 2);
  assert.deepEqual(found.map(f => f.line), [2, 4]);
});

test('reports two occurrences on the same line separately', () => {
  const text = 'https://github.com/a/dubai-design-system and https://github.com/b/dubai-design-system';

  assert.equal(findRepoLinks([{ path: 'x.md', text }]).length, 2);
});

test('isTextFile accepts source and doc formats, rejects binaries', () => {
  for (const p of ['a.md', 'a.tsx', 'a.css', 'a.mjs', 'a.json']) assert.equal(isTextFile(p), true, p);
  for (const p of ['a.woff2', 'a.png', 'a.ttf', 'a.eot']) assert.equal(isTextFile(p), false, p);
});

test('CLI: exits non-zero and names the file when a link is present', () => {
  const dir = mkdtempSync(join(tmpdir(), 'repo-links-'));
  writeFileSync(join(dir, 'CHANGELOG.md'), '## [1.0.0](https://github.com/saleh-lootah/dubai-design-system/releases/tag/v1)\n');

  const result = spawnSync(process.execPath, [SCRIPT_PATH], { cwd: dir, encoding: 'utf8' });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /CHANGELOG\.md:1/);
  assert.match(result.stderr, /source repository/);
});

test('CLI: exits zero on a clean tree', () => {
  const dir = mkdtempSync(join(tmpdir(), 'repo-links-'));
  mkdirSync(join(dir, 'src'), { recursive: true });
  writeFileSync(join(dir, 'CHANGELOG.md'), '## 1.0.0 (2026-01-01)\n');
  writeFileSync(join(dir, 'src', 'a.css'), 'body { color: red; }\n');

  const result = spawnSync(process.execPath, [SCRIPT_PATH], { cwd: dir, encoding: 'utf8' });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /OK: no repository links/);
});

test('CLI: scans src/ recursively, not just the changelog', () => {
  const dir = mkdtempSync(join(tmpdir(), 'repo-links-'));
  mkdirSync(join(dir, 'src', 'components', 'dda-x'), { recursive: true });
  writeFileSync(join(dir, 'CHANGELOG.md'), '## 1.0.0\n');
  writeFileSync(join(dir, 'src', 'components', 'dda-x', 'dda-x.mdx'), 'See https://github.com/saleh-lootah/dubai-design-system\n');

  const result = spawnSync(process.execPath, [SCRIPT_PATH], { cwd: dir, encoding: 'utf8' });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /dda-x\.mdx/);
});
