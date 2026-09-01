import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

// The published stylesheet and the directory it is served from. Every relative `url()`
// inside it resolves against this directory, both in a browser and in this checker.
const CSS_PATH = 'dist/dda/dda.css';
const CSS_DIR = 'dist/dda';

// `src/global/fonts.css` declares one @font-face per Dubai weight (Light/Regular/Medium/Bold).
// A different number means a block was lost, duplicated, or that font rules leaked back in
// from somewhere other than fonts.css.
const EXPECTED_FONT_FACES = 4;

// Directories whose compiled component chunks must NOT carry the @font-face rules. Stencil
// injects a chunk's styles as a <style> element, and a URL inside a <style> resolves against
// the *document* URL, not the stylesheet URL — so a font rule there 404s on the consumer's page.
const JS_DIRS = ['dist/dda', 'dist/esm', 'dist/components'];

// The substring that betrays a leaked font rule inside a component chunk.
const FONT_MARKER = 'fonts/dubai';

/**
 * Remove `/* … *​/` comments from CSS text.
 *
 * Every check below is textual, so a comment that merely *mentions* an at-rule or a path
 * would otherwise be counted as the real thing. `src/global/fonts.css` is appended to the
 * built stylesheet verbatim, comments and all, and it documents the very rules it declares
 * — so without this a prose sentence naming the at-rule would fail the build and the only
 * remedy would be to avoid the word. Strip comments instead; nobody should have to write
 * around the guard.
 * @param {string} cssText
 * @returns {string}
 */
export function stripCssComments(cssText) {
  return cssText.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Extract every `url(...)` token from CSS text, returning the raw, unquoted values in
 * source order. Handles the three legal spellings — `url(x)`, `url('x')`, `url("x")` —
 * and tolerates whitespace inside the parentheses. Commented-out URLs are not requested by
 * a browser, so they are not checked.
 * @param {string} cssText
 * @returns {string[]}
 */
export function extractCssUrls(cssText) {
  const urls = [];
  const re = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)'"\s]*))\s*\)/gi;
  let m;
  while ((m = re.exec(stripCssComments(cssText))) !== null) {
    const raw = m[1] ?? m[2] ?? m[3] ?? '';
    if (raw !== '') urls.push(raw);
  }
  return urls;
}

/**
 * Turn one raw `url()` value into the on-disk path it points at, or null when the value
 * does not name a file this package ships.
 *
 * Null is returned for `data:` URIs (the bytes are inline — there is nothing to resolve)
 * and for absolute or protocol-relative URLs (`https://…`, `//cdn/…`), which are fetched
 * from a remote host and are deliberately not part of the shipped tree.
 *
 * A `#fragment` and a `?query` are stripped before resolving: both are request syntax, not
 * part of the filename, and the classic `url("x.eot?#iefix")` idiom carries both.
 * @param {string} rawUrl
 * @param {string} baseDir directory the CSS file is served from
 * @returns {string|null}
 */
export function resolveCssUrl(rawUrl, baseDir) {
  const url = rawUrl.trim();
  if (url === '') return null;
  if (/^data:/i.test(url)) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return null; // https:, file:, any scheme
  if (url.startsWith('//')) return null; // protocol-relative

  const withoutFragment = url.split('#')[0].split('?')[0];
  if (withoutFragment === '') return null;

  return join(baseDir, decodeURIComponent(withoutFragment));
}

/**
 * Find every `url()` in a stylesheet whose target does not exist on disk.
 * @param {string} cssText the stylesheet's text
 * @param {string} baseDir directory the stylesheet is served from (relative urls resolve here)
 * @param {(path: string) => boolean} exists predicate answering "is there a file at this path?"
 * @returns {Array<{url: string, path: string}>} one entry per distinct unresolved url
 */
export function findUnresolvedUrls(cssText, baseDir, exists) {
  const missing = [];
  const seen = new Set();
  for (const raw of extractCssUrls(cssText)) {
    const path = resolveCssUrl(raw, baseDir);
    if (path === null) continue;
    if (exists(path)) continue;
    if (seen.has(path)) continue;
    seen.add(path);
    missing.push({ url: raw, path });
  }
  return missing;
}

/**
 * Count the `@font-face` blocks in CSS text. CSS at-rule names are case-insensitive, so
 * the match is too.
 * @param {string} cssText
 * @returns {number}
 */
export function countFontFaceBlocks(cssText) {
  const m = stripCssComments(cssText).match(/@font-face\b/gi);
  return m ? m.length : 0;
}

/**
 * Find compiled JS files that carry a Dubai font URL. Their presence means the @font-face
 * rules were compiled into a component chunk and will be injected as a <style>, where the
 * relative URL resolves against the consumer's page URL and 404s.
 * @param {Array<{path: string, text: string}>} files
 * @param {string} [marker]
 * @returns {string[]} the offending file paths
 */
export function findFontUrlsInJs(files, marker = FONT_MARKER) {
  return files.filter(f => f.text.includes(marker)).map(f => f.path);
}

/**
 * Run every assertion against plain data and return one human-readable line per failure.
 * An empty array means the build is shippable.
 * @param {{cssText: string, cssDir: string, exists: (path: string) => boolean,
 *          jsFiles: Array<{path: string, text: string}>, expectedFontFaces?: number}} input
 * @returns {string[]}
 */
export function checkDistAssets({ cssText, cssDir, exists, jsFiles, expectedFontFaces = EXPECTED_FONT_FACES }) {
  const failures = [];

  for (const { url, path } of findUnresolvedUrls(cssText, cssDir, exists)) {
    failures.push(`${CSS_PATH}: url("${url}") points at ${path}, which the build does not ship`);
  }

  const fontFaces = countFontFaceBlocks(cssText);
  if (fontFaces !== expectedFontFaces) {
    failures.push(`${CSS_PATH}: expected ${expectedFontFaces} @font-face blocks, found ${fontFaces}`);
  }

  for (const path of findFontUrlsInJs(jsFiles)) {
    failures.push(`${path}: contains "${FONT_MARKER}" — font rules must live only in ${CSS_PATH}, not in a component chunk`);
  }

  return failures;
}

function walkJs(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walkJs(full, out);
    else if (name.endsWith('.js')) out.push(full);
  }
  return out;
}

// Run as a command, not as an import.
if (process.argv[1] && process.argv[1].endsWith('check-dist-assets.mjs')) {
  let cssText;
  try {
    cssText = readFileSync(CSS_PATH, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`${CSS_PATH} not found: run "npx stencil build" first`);
      process.exit(1);
    }
    throw err;
  }

  // A missing output directory means that output target was not built in this run, which
  // is not a packaging fault — only the files that do exist are scanned.
  const jsFiles = JS_DIRS.filter(dir => existsSync(dir))
    .flatMap(dir => walkJs(dir))
    .map(p => ({ path: relative('.', p), text: readFileSync(p, 'utf8') }));

  const failures = checkDistAssets({ cssText, cssDir: CSS_DIR, exists: existsSync, jsFiles });

  for (const line of failures) console.log(line);
  console.log(
    failures.length === 0
      ? 'OK: dist ships every asset its stylesheet asks for'
      : `FAIL: ${failures.length} packaging problem${failures.length === 1 ? '' : 's'}`,
  );
  process.exit(failures.length === 0 ? 0 : 1);
}
