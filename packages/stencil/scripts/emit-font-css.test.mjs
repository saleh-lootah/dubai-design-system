import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appendFontLayer, fontLayerBanner } from './emit-font-css.mjs';

const SCRIPT_PATH = fileURLToPath(new URL('./emit-font-css.mjs', import.meta.url));
const FONT_CSS = '@font-face {\n  font-family: "Dubai";\n  src: url("../assets/fonts/dubai/DubaiRegular.woff2") format("woff2");\n}\n';
const BUNDLE_CSS = 'body {\n  color: red;\n}\n';

test('the combined text contains both inputs', () => {
  const out = appendFontLayer(BUNDLE_CSS, FONT_CSS);

  assert.ok(out.includes('body {'), 'the original stylesheet must survive');
  assert.ok(out.includes('@font-face'), 'the font layer must be present');
  assert.ok(out.includes('../assets/fonts/dubai/DubaiRegular.woff2'), 'the font URLs must be present');
});

test('a generated banner naming the source file separates the two', () => {
  const out = appendFontLayer(BUNDLE_CSS, FONT_CSS);

  assert.ok(out.includes(fontLayerBanner()), 'the banner must be written');
  assert.match(fontLayerBanner(), /src\/global\/fonts\.css/);
  assert.ok(out.indexOf(fontLayerBanner()) > out.indexOf('body {'), 'the banner must follow the original text');
  assert.ok(out.indexOf('@font-face') > out.indexOf(fontLayerBanner()), 'the font rules must follow the banner');
});

// The font layer is appended, never prepended: only `@import` must come first in a
// stylesheet, and prepending would push the bundle's own @import rules below it and
// invalidate them.
test('appends rather than prepends, leaving a leading @import first', () => {
  const withImport = "@import url('./x.css');\nbody { color: red; }\n";

  const out = appendFontLayer(withImport, FONT_CSS);

  assert.ok(out.startsWith("@import url('./x.css');"), 'the @import must stay first');
});

// The emit step runs on every build and may see a stylesheet a previous run already
// extended — a second pass must not duplicate the rules.
test('running twice is idempotent', () => {
  const once = appendFontLayer(BUNDLE_CSS, FONT_CSS);
  const twice = appendFontLayer(once, FONT_CSS);

  assert.equal(twice, once);
  assert.equal(twice.match(/@font-face/g).length, 1);
});

test('is idempotent even when the font text has changed since the first append', () => {
  const once = appendFontLayer(BUNDLE_CSS, FONT_CSS);

  const twice = appendFontLayer(once, FONT_CSS + '@font-face { font-family: "Other"; }\n');

  assert.equal(twice, once, 'the banner alone decides — no second append');
});

test('empty font text leaves the stylesheet untouched', () => {
  assert.equal(appendFontLayer(BUNDLE_CSS, ''), BUNDLE_CSS);
});

test('whitespace-only font text leaves the stylesheet untouched', () => {
  assert.equal(appendFontLayer(BUNDLE_CSS, '   \n\t\n  '), BUNDLE_CSS);
});

test('an empty stylesheet still receives the font layer', () => {
  const out = appendFontLayer('', FONT_CSS);

  assert.ok(out.includes(fontLayerBanner()));
  assert.ok(out.includes('@font-face'));
});

test('a stylesheet with no trailing newline is still separated from the banner', () => {
  const out = appendFontLayer('body{color:red}', FONT_CSS);

  assert.ok(out.includes('body{color:red}\n'), 'a newline must be inserted after the original text');
});

function fixture() {
  const dir = mkdtempSync(join(tmpdir(), 'emit-font-css-'));
  mkdirSync(join(dir, 'src', 'global'), { recursive: true });
  mkdirSync(join(dir, 'dist', 'dda'), { recursive: true });
  return dir;
}

test('CLI: appends the font layer to dist/dda/dda.css and exits zero', () => {
  const dir = fixture();
  writeFileSync(join(dir, 'src/global/fonts.css'), FONT_CSS);
  writeFileSync(join(dir, 'dist/dda/dda.css'), BUNDLE_CSS);

  const result = spawnSync(process.execPath, [SCRIPT_PATH], { cwd: dir, encoding: 'utf8' });

  assert.equal(result.status, 0, result.stderr);
  const out = readFileSync(join(dir, 'dist/dda/dda.css'), 'utf8');
  assert.ok(out.includes('body {'));
  assert.ok(out.includes('@font-face'));
});

test('CLI: a second run does not duplicate the font layer', () => {
  const dir = fixture();
  writeFileSync(join(dir, 'src/global/fonts.css'), FONT_CSS);
  writeFileSync(join(dir, 'dist/dda/dda.css'), BUNDLE_CSS);

  spawnSync(process.execPath, [SCRIPT_PATH], { cwd: dir, encoding: 'utf8' });
  const result = spawnSync(process.execPath, [SCRIPT_PATH], { cwd: dir, encoding: 'utf8' });

  assert.equal(result.status, 0, result.stderr);
  const out = readFileSync(join(dir, 'dist/dda/dda.css'), 'utf8');
  assert.equal(out.match(/@font-face/g).length, 1);
});

test('CLI: extends www/build/dda.css too when that output target was built', () => {
  const dir = fixture();
  mkdirSync(join(dir, 'www', 'build'), { recursive: true });
  writeFileSync(join(dir, 'src/global/fonts.css'), FONT_CSS);
  writeFileSync(join(dir, 'dist/dda/dda.css'), BUNDLE_CSS);
  writeFileSync(join(dir, 'www/build/dda.css'), BUNDLE_CSS);

  const result = spawnSync(process.execPath, [SCRIPT_PATH], { cwd: dir, encoding: 'utf8' });

  assert.equal(result.status, 0, result.stderr);
  assert.ok(readFileSync(join(dir, 'www/build/dda.css'), 'utf8').includes('@font-face'));
});

test('CLI: skips www/build/dda.css silently when it was not built', () => {
  const dir = fixture();
  writeFileSync(join(dir, 'src/global/fonts.css'), FONT_CSS);
  writeFileSync(join(dir, 'dist/dda/dda.css'), BUNDLE_CSS);

  const result = spawnSync(process.execPath, [SCRIPT_PATH], { cwd: dir, encoding: 'utf8' });

  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stderr, /www/);
});

test('CLI: fails loudly when src/global/fonts.css is missing', () => {
  const dir = fixture();
  writeFileSync(join(dir, 'dist/dda/dda.css'), BUNDLE_CSS);

  const result = spawnSync(process.execPath, [SCRIPT_PATH], { cwd: dir, encoding: 'utf8' });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /src\/global\/fonts\.css/);
});

test('CLI: fails loudly when dist/dda/dda.css is missing', () => {
  const dir = fixture();
  writeFileSync(join(dir, 'src/global/fonts.css'), FONT_CSS);

  const result = spawnSync(process.execPath, [SCRIPT_PATH], { cwd: dir, encoding: 'utf8' });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /dist\/dda\/dda\.css/);
  assert.match(result.stderr, /stencil build/);
});
