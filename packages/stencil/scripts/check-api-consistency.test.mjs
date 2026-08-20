import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
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

// F1: a Vue event binding (`@click=`) is not an attribute question at all — it must
// never be misread as an undeclared prop named "click".
test('F1: does not mistake a Vue event binding for an attribute', () => {
  const doc = { tag: 'dda-x', props: [{ attr: 'real_prop' }] };
  const files = [{ path: 'c.mdx', text: '<dda-x real_prop="a" @click="handler"></dda-x>' }];

  assert.deepEqual(findGhostProps(doc, files), []);
});

test('F1: does not mistake an Angular event binding, template ref, or structural directive for an attribute', () => {
  const doc = { tag: 'dda-x', props: [{ attr: 'real_prop' }] };
  const files = [
    { path: 'c.mdx', text: '<dda-x real_prop="a" (click)="handler()" #myRef *ngIf="cond"></dda-x>' },
  ];

  assert.deepEqual(findGhostProps(doc, files), []);
});

// F2: an "=" inside a quoted attribute value must never be read as the start of a
// new attribute — only the genuine ghost_prop should be reported.
test('F2: does not mistake "=" inside a quoted attribute value for a new attribute', () => {
  const doc = { tag: 'dda-x', props: [{ attr: 'real_prop' }] };
  const files = [{ path: 'h.mdx', text: '<dda-x real_prop="a=b" ghost_prop="c"></dda-x>' }];

  assert.deepEqual(findGhostProps(doc, files), [{ file: 'h.mdx', tag: 'dda-x', attr: 'ghost_prop' }]);
});

// F2 (near-miss regression): a literal ">" inside a quoted value, as in the real
// on_checked="() => void 0" markup, must not truncate the tag match early and hide
// attributes that come after it.
test('F2: does not truncate the tag match at a ">" that appears inside a quoted value', () => {
  const doc = { tag: 'dda-x', props: [{ attr: 'real_prop' }] };
  const files = [{ path: 'h.mdx', text: '<dda-x on_checked="() => void 0" ghost_prop="b"></dda-x>' }];

  assert.deepEqual(findGhostProps(doc, files), [{ file: 'h.mdx', tag: 'dda-x', attr: 'ghost_prop' }]);
});

// F3: Angular property bindings ([prop]=), Vue/Alpine shorthand bindings (:prop=), and
// Svelte-style bindings (bind:prop=) all name a real prop — strip the sigil and check it,
// rather than ignoring it (which would hide a real ghost prop) or reporting it verbatim
// (which would falsely flag a real prop written with a binding sigil).
test('F3: normalizes and checks Angular property bindings, catching a real ghost prop', () => {
  const doc = { tag: 'dda-home-banner', props: [{ attr: 'aria_label' }] };
  const files = [
    { path: 'x.mdx', text: '<dda-home-banner [autoplay]="true" [interval]="5000" aria_label="Highlights"></dda-home-banner>' },
  ];

  assert.deepEqual(findGhostProps(doc, files), [
    { file: 'x.mdx', tag: 'dda-home-banner', attr: 'autoplay' },
    { file: 'x.mdx', tag: 'dda-home-banner', attr: 'interval' },
  ]);
});

test('F3: normalizes and checks Angular property bindings, staying silent when the bound prop is real', () => {
  const doc = { tag: 'dda-x', props: [{ attr: 'real_prop' }] };
  const files = [{ path: 'x.mdx', text: '<dda-x [real_prop]="value"></dda-x>' }];

  assert.deepEqual(findGhostProps(doc, files), []);
});

test('F3: normalizes and checks Vue/Alpine shorthand (:prop=) and Svelte-style (bind:prop=) bindings', () => {
  const doc = { tag: 'dda-x', props: [{ attr: 'real_prop' }] };
  const files = [{ path: 'x.mdx', text: '<dda-x :real_prop="a" :ghost_prop="b" bind:another_ghost="c"></dda-x>' }];

  assert.deepEqual(findGhostProps(doc, files), [
    { file: 'x.mdx', tag: 'dda-x', attr: 'ghost_prop' },
    { file: 'x.mdx', tag: 'dda-x', attr: 'another_ghost' },
  ]);
});

// F4: the motivating fault (dda-home-banner's undeclared `images` prop) lived in a
// Storybook argTypes/args block, not in tag markup — the checker must look there too.
test('F4: reports a ghost prop set through a stories.tsx argTypes block', () => {
  const doc = { tag: 'dda-home-banner', props: [{ attr: 'aria_label' }] };
  const files = [
    {
      path: 'dda-home-banner.stories.tsx',
      text: "export default {\n  component: 'dda-home-banner',\n  argTypes: {\n    aria_label: { control: 'text' },\n    images: { control: 'object' },\n  },\n};\n",
    },
  ];

  assert.deepEqual(findGhostProps(doc, files), [
    { file: 'dda-home-banner.stories.tsx', tag: 'dda-home-banner', attr: 'images' },
  ]);
});

// Real example: dda-sticky-footer declares `hideMiddleSection` (a real @Prop, JS name
// "hideMiddleSection", auto-kebab-cased to attribute "hide-middle-section"). A story's
// argTypes/args key is JS, so it is written as the camelCase JS name, not the attribute —
// checking JS keys only against the kebab-case attr would wrongly flag every real
// multi-word prop as a ghost.
test('F4: recognizes a Storybook key written as the component\'s camelCase JS property name, not just its kebab-case attribute', () => {
  const doc = { tag: 'dda-x', props: [{ name: 'hideMiddleSection', attr: 'hide-middle-section' }] };
  const files = [
    {
      path: 'dda-x.stories.tsx',
      text: "export default {\n  argTypes: { hideMiddleSection: { control: 'boolean' } },\n};\n",
    },
  ];

  assert.deepEqual(findGhostProps(doc, files), []);
});

// The args block is only trusted when the file shows evidence that args are spread onto
// the tag by name (Object.entries(args)...) — matching the real convention used by
// dda-button, dda-chip, dda-checkbox, dda-phonefield, dda-breadcrumb and dda-dropdown.
test('F4: reports a ghost prop set through a stories.tsx args block that is spread onto the tag by name, and skips Storybook-reserved keys', () => {
  const doc = { tag: 'dda-x', props: [{ attr: 'real_prop' }] };
  const files = [
    {
      path: 'dda-x.stories.tsx',
      text:
        "const Template = (args) => {\n" +
        "  const attributes = Object.entries(args).map(([k, v]) => `${k}=\"${v}\"`).join(' ');\n" +
        "  return `<dda-x ${attributes}></dda-x>`;\n" +
        "};\n" +
        "export const Default = Template.bind({});\n" +
        "Default.args = { real_prop: 'a', ghost_prop: 'b' };\n",
    },
  ];

  assert.deepEqual(findGhostProps(doc, files), [
    { file: 'dda-x.stories.tsx', tag: 'dda-x', attr: 'ghost_prop' },
  ]);
});

// Real example: dda-footer's Template reads `args.introTitle` and `args.logoUrl` but
// writes them as the differently-named, correctly-declared attributes `title=` and
// `logo-src=` — an args key here is a story-local variable name, not an attribute name,
// so scanning it would misreport a working story as broken.
test('F4: does not scan an args block when the file has no evidence args are spread onto the tag by name', () => {
  const doc = { tag: 'dda-x', props: [{ attr: 'title' }] };
  const files = [
    {
      path: 'dda-x.stories.tsx',
      text:
        "const Template = (args) => `<dda-x title=\"${args.introTitle}\"></dda-x>`;\n" +
        "export const Default = Template.bind({});\n" +
        "Default.args = { introTitle: 'Welcome' };\n",
    },
  ];

  assert.deepEqual(findGhostProps(doc, files), []);
});

// argTypes is Storybook's own per-prop declaration, so it is checked unconditionally,
// even in a file whose Template does not spread args generically.
test('F4: still scans an argTypes block even when args is not spread onto the tag by name', () => {
  const doc = { tag: 'dda-x', props: [{ attr: 'title' }] };
  const files = [
    {
      path: 'dda-x.stories.tsx',
      text:
        "export default {\n  argTypes: { title: { control: 'text' }, ghost_prop: { control: 'text' } },\n};\n" +
        "const Template = (args) => `<dda-x title=\"${args.introTitle}\"></dda-x>`;\n",
    },
  ];

  assert.deepEqual(findGhostProps(doc, files), [
    { file: 'dda-x.stories.tsx', tag: 'dda-x', attr: 'ghost_prop' },
  ]);
});

// "text" is this codebase's slot/inner-text convention (analogous to React Storybook's
// "children") — it must never be reported as a ghost prop.
test('F4: treats "text" as a reserved slot-content key, not a prop', () => {
  const doc = { tag: 'dda-x', props: [{ attr: 'real_prop' }] };
  const files = [
    {
      path: 'dda-x.stories.tsx',
      text:
        "const Template = (args) => {\n" +
        "  const attributes = Object.entries(args).filter(([k]) => k !== 'text').map(([k, v]) => `${k}=\"${v}\"`).join(' ');\n" +
        "  return `<dda-x ${attributes}>${args.text}</dda-x>`;\n" +
        "};\n" +
        "export const Default = Template.bind({});\n" +
        "Default.args = { real_prop: 'a', text: 'Button label' };\n",
    },
  ];

  assert.deepEqual(findGhostProps(doc, files), []);
});

test('F4: is conservative — skips argTypes/args in a stories.tsx file whose name does not match the component', () => {
  const doc = { tag: 'dda-x', props: [{ attr: 'real_prop' }] };
  const files = [
    {
      path: 'dda-other.stories.tsx',
      text: "export default {\n  argTypes: { ghost_prop: { control: 'text' } },\n};\n",
    },
  ];

  assert.deepEqual(findGhostProps(doc, files), []);
});

// F5: covering tests — a multi-tag file, where two different components' markup sits in
// the same file, must only report ghost props against the tag they actually belong to.
test('F5: in a multi-tag file, only reports ghost props for the component being checked', () => {
  const doc = { tag: 'dda-x', props: [{ attr: 'real_prop' }] };
  const files = [
    {
      path: 'mixed.mdx',
      text: '<dda-y other_ghost="z"></dda-y>\n<dda-x real_prop="a" ghost_prop="b"></dda-x>\n<dda-x real_prop="c"></dda-x>',
    },
  ];

  assert.deepEqual(findGhostProps(doc, files), [{ file: 'mixed.mdx', tag: 'dda-x', attr: 'ghost_prop' }]);
});

// Tag prefix collision: a checker built for "dda-x" must not match "dda-x-panel".
test('does not match a tag name that is merely a prefix of another tag', () => {
  const doc = { tag: 'dda-x', props: [{ attr: 'real_prop' }] };
  const files = [
    { path: 'panel.mdx', text: '<dda-x-panel real_prop="a" ghost_prop="b"></dda-x-panel>' },
  ];

  assert.deepEqual(findGhostProps(doc, files), []);
});

// Missing stencil-docs.json: running the CLI without a prior `stencil build` must fail
// with a helpful message, not a raw ENOENT stack.
test('CLI: prints a helpful message and exits non-zero when stencil-docs.json is missing', () => {
  const scriptPath = fileURLToPath(new URL('./check-api-consistency.mjs', import.meta.url));
  const emptyDir = mkdtempSync(join(tmpdir(), 'check-api-consistency-'));

  const result = spawnSync(process.execPath, [scriptPath], { cwd: emptyDir, encoding: 'utf8' });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /stencil-docs\.json/);
  assert.match(result.stderr, /npx stencil build/);
});
