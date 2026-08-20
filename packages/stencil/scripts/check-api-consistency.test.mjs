import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findGhostProps } from './check-api-consistency.mjs';

test('reports an attribute that the component does not declare', () => {
  const doc = { tag: 'dda-x', props: [{ attr: 'real_prop' }] };
  const files = [{ path: 'x.stories.tsx', text: '<dda-x real_prop="a" ghost_prop="b"></dda-x>' }];

  assert.deepEqual(findGhostProps(doc, files), [{ file: 'x.stories.tsx', tag: 'dda-x', attr: 'ghost_prop' }]);
});

test('reports nothing when every attribute is real', () => {
  const doc = { tag: 'dda-x', props: [{ attr: 'real_prop' }] };
  const files = [{ path: 'x.stories.tsx', text: '<dda-x real_prop="a"></dda-x>' }];

  assert.deepEqual(findGhostProps(doc, files), []);
});

test('ignores global HTML attributes', () => {
  const doc = { tag: 'dda-x', props: [] };
  const files = [{ path: 'x.stories.tsx', text: '<dda-x class="c" id="i" style="color:red"></dda-x>' }];

  assert.deepEqual(findGhostProps(doc, files), []);
});
