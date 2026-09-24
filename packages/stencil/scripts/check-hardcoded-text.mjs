import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Every text a user sees or hears must come from a prop, so a page can show it in its own
// language. This counts the text that is still written into component render code.
const TEXT_ATTRIBUTES = new Set(['aria-label', 'title', 'placeholder', 'title_text', 'alt', 'label', 'aria-description']);
const ICON_CLASS = /material-(icons|symbols)/;

function attribute(opening, name) {
  const attr = opening.attributes.properties.find(p => ts.isJsxAttribute(p) && p.name.getText() === name);
  return attr && attr.initializer && ts.isStringLiteral(attr.initializer) ? attr.initializer.text : undefined;
}

function isIconElement(node) {
  const opening = ts.isJsxElement(node) ? node.openingElement : undefined;
  return !!opening && ICON_CLASS.test(attribute(opening, 'class') || '');
}

export function findHardcodedText(source, fileName) {
  const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found = [];
  const line = node => file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1;
  const visit = node => {
    if (ts.isJsxText(node)) {
      const text = node.text.trim();
      if (text && !isIconElement(node.parent)) found.push({ line: line(node), text, kind: 'text' });
    } else if (ts.isJsxAttribute(node) && TEXT_ATTRIBUTES.has(node.name.getText())) {
      const init = node.initializer;
      if (init && ts.isStringLiteral(init) && init.text.trim()) found.push({ line: line(node), text: init.text.trim(), kind: 'attribute' });
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return found;
}

function componentFiles(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === 'test' ? [] : componentFiles(path);
    return name.endsWith('.tsx') && !name.endsWith('.stories.tsx') && !name.endsWith('.spec.tsx') ? [path] : [];
  });
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const root = new URL('../src/components/', import.meta.url).pathname;
  let total = 0;
  for (const path of componentFiles(root)) {
    const found = findHardcodedText(readFileSync(path, 'utf8'), path);
    if (!found.length) continue;
    total += found.length;
    console.log(`${relative(root, path)} (${found.length})`);
    for (const f of found) console.log(`  ${f.line}: ${f.kind} "${f.text}"`);
  }
  console.log(total ? `FAIL: ${total} hardcoded strings` : 'OK: no hardcoded strings');
  process.exit(total ? 1 : 0);
}
