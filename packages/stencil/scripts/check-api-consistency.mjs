import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, basename } from 'node:path';

// Attributes that any HTML element accepts. They are never a fault.
const GLOBAL_ATTRS = new Set([
  'class', 'id', 'style', 'slot', 'title', 'lang', 'dir', 'hidden', 'tabindex', 'role', 'part', 'key', 'ref',
]);

const isGlobal = attr => GLOBAL_ATTRS.has(attr) || attr.startsWith('aria-') || attr.startsWith('data-') || attr.startsWith('on');

// Storybook meta keys that sit alongside argTypes/args but are never component props.
// "text" is this codebase's own convention for a story's slot/inner-text content — every
// Template function that reads it explicitly filters it out before building attributes
// (e.g. dda-button, dda-chip, dda-link-button all do `key !== 'text'`) — so it plays the
// same role as React Storybook's "children" and is excluded for the same reason.
const STORYBOOK_RESERVED_KEYS = new Set([
  'children', 'text', 'parameters', 'argTypes', 'args', 'decorators', 'component', 'title', 'render',
  'subcomponents', 'tags', 'play', 'loaders', 'excludeStories', 'includeStories', 'name', 'story', 'storyName',
]);

/**
 * Read the attribute names inside one opening tag's attribute text (the part
 * between the tag name and the closing `>`), quote-aware: an `=` inside a
 * quoted value is never mistaken for the start of the next attribute.
 * Returns the raw tokens as written (sigils like `@`, `[`, `(`, `#`, `:` or
 * `bind:` are left intact for the caller to classify) — only tokens that
 * were actually followed by `=` are returned, matching the original
 * "must be an assignment" behavior.
 */
function readAttrTokens(attrText) {
  const tokens = [];
  const len = attrText.length;
  let i = 0;
  while (i < len) {
    while (i < len && /\s/.test(attrText[i])) i++;
    if (i >= len) break;
    const start = i;
    while (i < len && !/\s/.test(attrText[i]) && attrText[i] !== '=') i++;
    if (i === start) { i++; continue; }
    const name = attrText.slice(start, i);

    let j = i;
    while (j < len && /\s/.test(attrText[j])) j++;
    if (attrText[j] === '=') {
      j++;
      while (j < len && /\s/.test(attrText[j])) j++;
      const quote = attrText[j];
      if (quote === '"' || quote === "'") {
        j++;
        while (j < len && attrText[j] !== quote) j++;
        j++; // skip closing quote
      } else {
        while (j < len && !/\s/.test(attrText[j])) j++;
      }
      tokens.push(name);
      i = j;
    } else {
      i = j; // boolean attribute, no '=' — not a finding candidate
    }
  }
  return tokens;
}

/**
 * Classify a raw attribute token. Returns the real prop name to check, or
 * null when the token is not prop-shaped at all (an event binding or
 * directive, which is not a "does this prop exist" question).
 */
function normalizeAttrToken(raw) {
  if (raw.startsWith('@')) return null; // Vue event binding: @click=
  if (/^\(.*\)$/.test(raw)) return null; // Angular event binding: (click)=
  if (raw.startsWith('#')) return null; // Angular template reference: #ref
  if (raw.startsWith('*')) return null; // Angular structural directive: *ngIf
  if (/^\[.*\]$/.test(raw)) return raw.slice(1, -1); // Angular property binding: [prop]=
  if (raw.startsWith('bind:')) return raw.slice(5); // Svelte-style: bind:prop=
  if (raw.startsWith(':')) return raw.slice(1); // Vue/Alpine shorthand: :prop=
  return raw;
}

/** Find the index of the closing brace that matches the opening brace at text[openIdx], skipping string/template literals. */
function matchBalancedBrace(text, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < text.length; i++) {
    const c = text[i];
    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      i++;
      while (i < text.length && text[i] !== quote) {
        if (text[i] === '\\') i++;
        i++;
      }
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** Split an object literal's inner text into its top-level, comma-separated entries. */
function splitTopLevel(inner) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      i++;
      while (i < inner.length && inner[i] !== quote) {
        if (inner[i] === '\\') i++;
        i++;
      }
      continue;
    }
    if (c === '{' || c === '[' || c === '(') depth++;
    else if (c === '}' || c === ']' || c === ')') depth--;
    else if (c === ',' && depth === 0) {
      parts.push(inner.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(inner.slice(start));
  return parts;
}

const KEY_RE = /^\s*(?:"([^"]*)"|'([^']*)'|([A-Za-z_$][A-Za-z0-9_$]*))\s*:/;

function keyOf(part) {
  const m = KEY_RE.exec(part);
  if (!m) return null;
  return m[1] ?? m[2] ?? m[3] ?? null;
}

/**
 * Find the top-level keys of every `argTypes: {...}` and `args: {...}` (or
 * `X.args = {...}`) object literal in a `.stories.tsx` file's text. These
 * name props directly — unlike tag attributes, there is no HTML markup to
 * parse, so this is the only way to see props set through Storybook's
 * `args`/`argTypes` API rather than through literal `<tag>` markup.
 *
 * `argTypes` keys are Storybook's own per-prop declaration, so they are always
 * checked. `args` keys are only checked when the file shows evidence that
 * `args` is actually spread onto the tag by name (`Object.entries(args)...`) —
 * several real story files instead write a custom template that reads `args`
 * by a story-local name and writes a *different*, correctly-named attribute
 * (for example `args.introTitle` renders as the real attribute `title=`); in
 * those files an `args` key is not a claim that a same-named prop exists, so
 * scanning it would misreport a real story as broken.
 */
function findStorybookKeys(text) {
  const keys = [];
  const argsIsSpreadByName = /Object\.entries\s*\(/.test(text);
  const blockRe = /\b(argTypes|args)\s*[:=]\s*\{/g;
  let m;
  while ((m = blockRe.exec(text)) !== null) {
    const keyword = m[1];
    const openIdx = m.index + m[0].length - 1;
    const closeIdx = matchBalancedBrace(text, openIdx);
    if (closeIdx === -1) continue;
    if (keyword === 'args' && !argsIsSpreadByName) {
      blockRe.lastIndex = closeIdx + 1;
      continue;
    }
    const inner = text.slice(openIdx + 1, closeIdx);
    for (const part of splitTopLevel(inner)) {
      const key = keyOf(part);
      if (key && !STORYBOOK_RESERVED_KEYS.has(key)) keys.push(key);
    }
    blockRe.lastIndex = closeIdx + 1;
  }
  return keys;
}

/** The tag a `.stories.tsx` file documents, by filename convention (`dda-x.stories.tsx` -> `dda-x`). */
function storyFileOwnerTag(filePath) {
  const m = /^(.+)\.stories\.tsx$/.exec(basename(filePath));
  return m ? m[1] : null;
}

/**
 * Find every opening `<tag ...>` for `tag` in `text` and return each one's
 * attribute text (the part between the tag name and the closing `>`).
 * Quote-aware in two ways: the tag name must end at a real boundary
 * (`[\s/>]`), so a checker built for `dda-x` never matches `<dda-x-panel>`;
 * and the search for the closing `>` skips over quoted attribute values, so
 * a `>` written inside a value (for example `on_checked="() => void 0"`)
 * never truncates the match early.
 */
function findTagAttrTexts(text, tag) {
  const results = [];
  const startRe = new RegExp(`<${tag}(?=[\\s/>])`, 'g');
  let m;
  while ((m = startRe.exec(text)) !== null) {
    let i = m.index + m[0].length;
    const start = i;
    let closeIdx = -1;
    while (i < text.length) {
      const c = text[i];
      if (c === '"' || c === "'") {
        const quote = c;
        i++;
        while (i < text.length && text[i] !== quote) i++;
        i++; // skip closing quote
        continue;
      }
      if (c === '>') { closeIdx = i; break; }
      i++;
    }
    if (closeIdx === -1) break; // unterminated tag — stop scanning this file
    results.push(text.slice(start, closeIdx));
    startRe.lastIndex = closeIdx + 1;
  }
  return results;
}

/**
 * Find attributes used on a component's tag — or set through its Storybook
 * `args`/`argTypes` — that the component does not declare.
 * @param {{tag: string, props: Array<{attr?: string, name?: string}>}} doc one entry from stencil-docs.json
 * @param {Array<{path: string, text: string}>} files the story and document files to scan
 * @returns {Array<{file: string, tag: string, attr: string}>}
 */
export function findGhostProps(doc, files) {
  // Tag markup always uses the HTML attribute (kebab-case), matched case-insensitively.
  const declaredAttrs = new Set(doc.props.map(p => p.attr).filter(Boolean));
  // A Storybook argTypes/args key is JS, so story authors write the component's actual JS
  // property name (Stencil's `name`, usually camelCase) — not the auto-kebab-cased HTML
  // attribute. A real prop like `hideMiddleSection` (attr `hide-middle-section`) must be
  // recognized by its JS name, or every multi-word camelCase prop looks like a ghost.
  const declaredNames = new Set(doc.props.map(p => p.name).filter(Boolean));

  const found = [];
  const seen = new Set(); // dedupe per (file, attr)

  const record = (file, attr, isDeclared) => {
    if (isGlobal(attr) || isDeclared(attr)) return;
    const dedupeKey = `${file} ${attr}`;
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);
    found.push({ file, tag: doc.tag, attr });
  };

  const isDeclaredAttr = attr => declaredAttrs.has(attr);
  const isDeclaredStorybookKey = key => declaredNames.has(key) || declaredAttrs.has(key.toLowerCase());

  for (const file of files) {
    // Match every opening tag for this component and read its attribute text.
    for (const attrText of findTagAttrTexts(file.text, doc.tag)) {
      for (const raw of readAttrTokens(attrText)) {
        const name = normalizeAttrToken(raw);
        if (name === null) continue; // event binding / directive, not a prop question
        record(file.path, name.toLowerCase(), isDeclaredAttr);
      }
    }

    // Storybook args/argTypes keys name props directly, but only attribute them
    // to a component when the file's own name says it documents that component —
    // a key we can't confidently attribute to a specific dda-* component is skipped.
    if (storyFileOwnerTag(file.path) === doc.tag) {
      for (const key of findStorybookKeys(file.text)) {
        record(file.path, key, isDeclaredStorybookKey);
      }
    }
  }
  return found;
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(stories\.tsx|mdx)$/.test(name)) out.push(full);
  }
  return out;
}

// Run as a command, not as an import.
if (process.argv[1] && process.argv[1].endsWith('check-api-consistency.mjs')) {
  let docs;
  try {
    docs = JSON.parse(readFileSync('stencil-docs.json', 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('stencil-docs.json not found: run "npx stencil build" first');
      process.exit(1);
    }
    throw err;
  }
  const files = walk('src').map(p => ({ path: relative('.', p), text: readFileSync(p, 'utf8') }));

  let total = 0;
  for (const doc of docs.components) {
    for (const f of findGhostProps(doc, files)) {
      console.log(`${f.file}: <${f.tag}> uses "${f.attr}", but the component does not declare it`);
      total++;
    }
  }
  console.log(total === 0 ? 'OK: every documented attribute is real' : `FAIL: ${total} attributes do not exist`);
  process.exit(total === 0 ? 0 : 1);
}
