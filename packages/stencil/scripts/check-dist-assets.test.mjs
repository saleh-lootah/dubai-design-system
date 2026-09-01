import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  stripCssComments,
  extractCssUrls,
  resolveCssUrl,
  findUnresolvedUrls,
  countFontFaceBlocks,
  findFontUrlsInJs,
  checkDistAssets,
} from './check-dist-assets.mjs';

// An in-memory stand-in for the filesystem: the checker only ever asks "does this path
// exist?", so a Set of paths is a complete substitute for a real dist tree.
const existsIn = (...paths) => {
  const set = new Set(paths);
  return path => set.has(path);
};

test('extracts url() values in all three quoting styles', () => {
  const css = `a{background:url(bare.png)} b{background:url('single.png')} c{background:url( "double.png" )}`;

  assert.deepEqual(extractCssUrls(css), ['bare.png', 'single.png', 'double.png']);
});

// The motivating fault: dda.css asked for ../assets/fonts/dubai/* and nothing copied the
// fonts into dist/, so every one of those urls 404'd.
test('reports a url that does not resolve to a shipped file', () => {
  const css = '@font-face{font-family:Dubai;src:url("../assets/fonts/dubai/DubaiRegular.woff2") format("woff2");}';

  assert.deepEqual(findUnresolvedUrls(css, 'dist/dda', existsIn()), [
    { url: '../assets/fonts/dubai/DubaiRegular.woff2', path: 'dist/assets/fonts/dubai/DubaiRegular.woff2' },
  ]);
});

test('reports nothing when the url resolves to a shipped file', () => {
  const css = '@font-face{font-family:Dubai;src:url("../assets/fonts/dubai/DubaiRegular.woff2") format("woff2");}';
  const exists = existsIn('dist/assets/fonts/dubai/DubaiRegular.woff2');

  assert.deepEqual(findUnresolvedUrls(css, 'dist/dda', exists), []);
});

// A data: URI carries its own bytes — there is no file to look for, so it must never be
// reported as missing.
test('ignores a data: URI', () => {
  const css = 'a{background:url("data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=")}';

  assert.deepEqual(findUnresolvedUrls(css, 'dist/dda', existsIn()), []);
  assert.equal(resolveCssUrl('data:image/png;base64,AAAA', 'dist/dda'), null);
});

// A #fragment is request syntax, not part of the filename — resolving it verbatim would
// look for a file called "icons.svg#arrow", which never exists.
test('strips a #fragment before resolving', () => {
  const css = 'a{background:url("../assets/icons.svg#arrow")}';
  const exists = existsIn('dist/assets/icons.svg');

  assert.equal(resolveCssUrl('../assets/icons.svg#arrow', 'dist/dda'), 'dist/assets/icons.svg');
  assert.deepEqual(findUnresolvedUrls(css, 'dist/dda', exists), []);
});

// The classic IE idiom url("x.eot?#iefix") carries a query as well as a fragment.
test('strips a ?query before resolving', () => {
  assert.equal(resolveCssUrl('../assets/fonts/dubai/DubaiRegular.eot?#iefix', 'dist/dda'), 'dist/assets/fonts/dubai/DubaiRegular.eot');
});

// A remote font is fetched from another host and is deliberately not part of the shipped
// tree, so a disk check must not claim it is missing.
test('ignores an absolute or protocol-relative URL', () => {
  const css = 'a{background:url("https://cdn.example.com/f.woff2")} b{background:url("//cdn.example.com/g.woff2")}';

  assert.deepEqual(findUnresolvedUrls(css, 'dist/dda', existsIn()), []);
});

test('reports each distinct unresolved url once, even when repeated', () => {
  const css =
    '@font-face{src:url("../assets/fonts/dubai/DubaiLight.woff2") format("woff2"),url("../assets/fonts/dubai/DubaiLight.woff") format("woff");}' +
    '@font-face{src:url("../assets/fonts/dubai/DubaiLight.woff2") format("woff2");}';

  assert.deepEqual(findUnresolvedUrls(css, 'dist/dda', existsIn()).map(m => m.path), [
    'dist/assets/fonts/dubai/DubaiLight.woff2',
    'dist/assets/fonts/dubai/DubaiLight.woff',
  ]);
});

test('counts @font-face blocks, case-insensitively', () => {
  assert.equal(countFontFaceBlocks('@font-face{}@font-face{}@FONT-FACE{}@Font-Face{}'), 4);
  assert.equal(countFontFaceBlocks('body{color:red}'), 0);
});

test('fails when the stylesheet does not carry exactly 4 @font-face blocks', () => {
  const css = '@font-face{src:url("../assets/f.woff2")}@font-face{src:url("../assets/f.woff2")}';
  const exists = existsIn('dist/assets/f.woff2');

  const failures = checkDistAssets({ cssText: css, cssDir: 'dist/dda', exists, jsFiles: [] });

  assert.equal(failures.length, 1);
  assert.match(failures[0], /expected 4 @font-face blocks, found 2/);
});

test('passes when the stylesheet carries exactly 4 @font-face blocks and every url resolves', () => {
  const css = ['Light', 'Regular', 'Medium', 'Bold']
    .map(w => `@font-face{font-family:Dubai;src:url("../assets/fonts/dubai/Dubai${w}.woff2") format("woff2");}`)
    .join('');
  const exists = existsIn(
    ...['Light', 'Regular', 'Medium', 'Bold'].map(w => `dist/assets/fonts/dubai/Dubai${w}.woff2`),
  );

  assert.deepEqual(checkDistAssets({ cssText: css, cssDir: 'dist/dda', exists, jsFiles: [] }), []);
});

test('reports nothing for a clean set of js files', () => {
  const jsFiles = [
    { path: 'dist/esm/dda-button.entry.js', text: 'const s = ".btn{color:red}";' },
    { path: 'dist/components/dda-chip.js', text: 'export const x = 1;' },
  ];

  assert.deepEqual(findFontUrlsInJs(jsFiles), []);
});

// The D3 regression guard: styles compiled into a chunk are injected as a <style>, where
// "../assets/fonts/dubai/..." resolves against the page URL and 404s.
test('reports a js file that carries a fonts/dubai url', () => {
  const jsFiles = [
    { path: 'dist/esm/dda-button.entry.js', text: 'const s = ".btn{color:red}";' },
    { path: 'dist/dda/p-abc123.js', text: 'const s = \'@font-face{src:url("../assets/fonts/dubai/DubaiBold.woff2")}\';' },
    { path: 'dist/components/dda-card.js', text: 'const s = "url(../assets/fonts/dubai/DubaiLight.woff)";' },
  ];

  assert.deepEqual(findFontUrlsInJs(jsFiles), ['dist/dda/p-abc123.js', 'dist/components/dda-card.js']);
});

test('checkDistAssets surfaces a leaked font url in a component chunk', () => {
  const css = ['Light', 'Regular', 'Medium', 'Bold']
    .map(w => `@font-face{src:url("../assets/fonts/dubai/Dubai${w}.woff2")}`)
    .join('');
  const exists = existsIn(
    ...['Light', 'Regular', 'Medium', 'Bold'].map(w => `dist/assets/fonts/dubai/Dubai${w}.woff2`),
  );
  const jsFiles = [{ path: 'dist/esm/dda-button.entry.js', text: 'url(../assets/fonts/dubai/DubaiBold.woff2)' }];

  const failures = checkDistAssets({ cssText: css, cssDir: 'dist/dda', exists, jsFiles });

  assert.equal(failures.length, 1);
  assert.match(failures[0], /dist\/esm\/dda-button\.entry\.js: contains "fonts\/dubai"/);
});

// Missing dist: running the CLI without a prior `stencil build` must fail with a helpful
// message, not a raw ENOENT stack.
test('CLI: prints a helpful message and exits non-zero when dist/dda/dda.css is missing', () => {
  const scriptPath = fileURLToPath(new URL('./check-dist-assets.mjs', import.meta.url));
  const emptyDir = mkdtempSync(join(tmpdir(), 'check-dist-assets-'));

  const result = spawnSync(process.execPath, [scriptPath], { cwd: emptyDir, encoding: 'utf8' });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /dist\/dda\/dda\.css/);
  assert.match(result.stderr, /npx stencil build/);
});

// fonts.css is appended to the built stylesheet verbatim, comments included, and its
// comment documents the very rules it declares. Counting textually over raw CSS would make
// that prose fail the build, and the only remedy would be to avoid writing the word — so
// comments are stripped before any textual check.
test('strips block comments before counting', () => {
  const css = '/* declares one @font-face per weight */\n@font-face { font-family: "Dubai"; }';

  assert.equal(countFontFaceBlocks(css), 1);
});

test('a comment mentioning the at-rule many times does not inflate the count', () => {
  const css = '/* @font-face @font-face @font-face */\n@font-face{}\n@font-face{}';

  assert.equal(countFontFaceBlocks(css), 2);
});

test('a commented-out url is not treated as a shipped asset', () => {
  const css = '/* url("gone.woff2") */ @font-face { src: url("here.woff2"); }';

  assert.deepEqual(extractCssUrls(css), ['here.woff2']);
});

test('a url inside a comment is never reported as unresolved', () => {
  const css = '/* was url("deleted.woff2") */ body { color: red; }';

  assert.deepEqual(findUnresolvedUrls(css, 'dist/dda', () => false), []);
});

test('stripCssComments leaves comment-free css untouched', () => {
  const css = '@font-face { src: url("a.woff2"); }';

  assert.equal(stripCssComments(css), css);
});

test('stripCssComments removes a multi-line comment', () => {
  assert.equal(stripCssComments('a{}\n/* one\n   two */\nb{}').replace(/\n+/g, '\n'), 'a{}\n\nb{}'.replace(/\n+/g, '\n'));
});
