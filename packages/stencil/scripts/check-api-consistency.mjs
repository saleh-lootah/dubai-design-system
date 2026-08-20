import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Attributes that any HTML element accepts. They are never a fault.
const GLOBAL_ATTRS = new Set([
  'class', 'id', 'style', 'slot', 'title', 'lang', 'dir', 'hidden', 'tabindex', 'role', 'part', 'key', 'ref',
]);

const isGlobal = attr => GLOBAL_ATTRS.has(attr) || attr.startsWith('aria-') || attr.startsWith('data-') || attr.startsWith('on');

/**
 * Find attributes used on a component's tag that the component does not declare.
 * @param {{tag: string, props: Array<{attr?: string}>}} doc one entry from stencil-docs.json
 * @param {Array<{path: string, text: string}>} files the story and document files to scan
 * @returns {Array<{file: string, tag: string, attr: string}>}
 */
export function findGhostProps(doc, files) {
  const declared = new Set(doc.props.map(p => p.attr).filter(Boolean));
  const found = [];

  for (const file of files) {
    // Match every opening tag for this component, then read its attribute names.
    const tagRe = new RegExp(`<${doc.tag}\\b([^>]*)>`, 'g');
    let m;
    while ((m = tagRe.exec(file.text)) !== null) {
      const attrRe = /([a-zA-Z_][a-zA-Z0-9_:-]*)\s*=/g;
      let a;
      while ((a = attrRe.exec(m[1])) !== null) {
        const attr = a[1].toLowerCase();
        if (isGlobal(attr) || declared.has(attr)) continue;
        if (found.some(f => f.file === file.path && f.attr === attr)) continue;
        found.push({ file: file.path, tag: doc.tag, attr });
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
  const docs = JSON.parse(readFileSync('stencil-docs.json', 'utf8'));
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
