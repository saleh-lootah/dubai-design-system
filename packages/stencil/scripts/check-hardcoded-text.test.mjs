import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findHardcodedText } from './check-hardcoded-text.mjs';

const tsx = body => `import { h } from '@stencil/core';\nexport class X { render() { return (${body}); } }`;

test('finds JSX text', () => {
  const found = findHardcodedText(tsx('<h2>Contrast</h2>'), 'x.tsx');
  assert.deepEqual(
    found.map(f => [f.kind, f.text]),
    [['text', 'Contrast']],
  );
});

test('finds literal text attributes', () => {
  const found = findHardcodedText(tsx('<button aria-label="Close" title="Close it"><dda-tooltip title_text="Menu"></dda-tooltip></button>'), 'x.tsx');
  assert.deepEqual(found.map(f => f.text).sort(), ['Close', 'Close it', 'Menu']);
});

test('ignores icon ligatures, prop values and whitespace', () => {
  const src = tsx(`<div>
    <i class="material-icons" aria-hidden="true">close</i>
    <span>{this.label}</span>
    <button aria-label={this.closeLabel}></button>
  </div>`);
  assert.deepEqual(findHardcodedText(src, 'x.tsx'), []);
});

test('ignores non-text attributes', () => {
  assert.deepEqual(findHardcodedText(tsx('<a class="btn" href="/x" rel="nofollow"></a>'), 'x.tsx'), []);
});

test('treats any <i> element as an icon ligature, whatever its class', () => {
  const found = findHardcodedText(tsx('<i class={`${this.icon} x`}>sentiment_satisfied</i>'), 'x.tsx');
  assert.deepEqual(found, []);
});

test('ignores icon ligatures whose class is a braced string literal', () => {
  const found = findHardcodedText(tsx("<span class={'material-icons'}>close</span>"), 'x.tsx');
  assert.deepEqual(found, []);
});

test('counts text on a non-<i> element with a dynamic, non-icon class', () => {
  const found = findHardcodedText(tsx('<span class={this.cls}>Hello</span>'), 'x.tsx');
  assert.deepEqual(
    found.map(f => [f.kind, f.text]),
    [['text', 'Hello']],
  );
});
