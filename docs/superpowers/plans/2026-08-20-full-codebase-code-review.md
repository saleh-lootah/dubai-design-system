# Full Codebase Code Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Review all 34 `dda-*` components for accessibility, correctness, API consistency and test coverage, then add automated gates so the same faults cannot come back.

**Architecture:** Build the measuring tools first, because a tool finds facts and a person finds opinions. Run the tools to get a baseline report. Then review by hand only what a tool cannot see. Then turn each tool into a CI gate. Test coverage comes last, because the review tells you which components need tests most.

**Tech Stack:** StencilJS 4.43, Storybook 8.2 (web-components, webpack5), Jest + Puppeteer (Stencil test runner), axe-core, ESLint 9, Prettier 3, GitHub Actions.

**Spec:** No separate spec document. The requirements are in **Goal** and **Global Constraints** below. They come from the scope decision on 2026-08-20: do the review first, then the gates, covering all four priority areas.

## Global Constraints

- Node 22.14.0. It is installed at `/usr/local/bin/node`. npm 10.9.2.
- Run all commands from `packages/stencil` unless a step says something different.
- **The test command must include `--ci`.** Puppeteer will not start as root without it. The `--ci` flag makes Stencil add `--no-sandbox`, `--disable-setuid-sandbox` and `--disable-dev-shm-usage`. The command is `npx stencil test --spec --e2e --ci`.
- **Never edit a file under any `stencil-generated/` directory.** The next `stencil build` writes over it. Edit the `.tsx` in `packages/stencil/src/components/` instead.
- `readme.md` in each component folder is generated. Do not edit it by hand.
- Build order matters. `stencil build` must run before the React, Vue and Angular packages build.
- Components use `shadow: false` and global stylesheets in `src/global/*.css`. Props use snake_case, for example `button_color`.
- CDN URLs in documents must use the placeholder `X.X.X`. Never write `@latest` and never write a fixed release number.
- Do not add `browserArgs` to `stencil.config.ts`. Use the `--ci` flag instead. `browserArgs` would weaken the sandbox for every developer.

## Known Facts (measured on 2026-08-20)

Use these numbers as your baseline. Do not measure them again.

- 34 components. 3311 lines of component code.
- 3 components have tests: `dda-button`, `dda-home-banner`, `dda-ui-card`. The other 31 have none.
- 3 components use `shadow: true`: `dda-footer`, `dda-banner`, `dda-sticky-footer`. The other 31 use `shadow: false`. Global CSS does not reach into a shadow root, so these 3 are a known risk.
- 5 places use `onClick` on a `div`, `span` or `li`. A keyboard cannot operate these. They are in `dda-accordion`, `dda-avatar`, `dda-chip`, and `dda-header` (2 places).
- `dda-banner` and `dda-ui-card` have no story file and no `.mdx` document.
- There is no ESLint, no Prettier, and no CI job that runs the tests. `.github/workflows/` holds only `deploy-storybook.yml`.

---

## File Structure

**Phase 1 creates the review tools:**

| File | Responsibility |
| --- | --- |
| `packages/stencil/eslint.config.mjs` | ESLint rules for TS and JSX a11y. |
| `packages/stencil/.prettierrc` | Format rules. |
| `packages/stencil/.prettierignore` | Keep generated files out of formatting. |
| `packages/stencil/scripts/check-api-consistency.mjs` | Compare declared props against props used in stories and documents. |
| `packages/stencil/.storybook/test-runner.ts` | Run axe on every story, in both themes. |
| `packages/stencil/scripts/wcag22-checks.ts` | Target size and keyboard checks that axe cannot do. |

**Phase 2 creates the report:**

| File | Responsibility |
| --- | --- |
| `docs/a11y/baseline-<date>.md` | The raw output of the tools. |
| `docs/a11y/findings.md` | The full list of faults, with a severity for each one. |
| `docs/a11y/component-matrix.md` | One row for each of the 34 components. Pass or fail for each check. |

**Phase 3 creates the gates:**

| File | Responsibility |
| --- | --- |
| `.github/workflows/ci.yml` | Build, test, lint and a11y on each push and pull request. |
| `CONTRIBUTING.md` | The review list a person must follow. |

**Phase 4 adds the tests:**

| File | Responsibility |
| --- | --- |
| `packages/stencil/src/components/<name>/test/<name>.e2e.ts` | One e2e file for each component. |

---

## Task 1: Add ESLint and Prettier

**Files:**
- Create: `packages/stencil/eslint.config.mjs`
- Create: `packages/stencil/.prettierrc`
- Create: `packages/stencil/.prettierignore`
- Modify: `packages/stencil/package.json` (add `lint` and `format` scripts, add devDependencies)

**Interfaces:**
- Consumes: nothing.
- Produces: the npm scripts `npm run lint` and `npm run format:check`. Task 9 uses both in CI.

- [ ] **Step 1: Install the tools**

```bash
cd packages/stencil
npm install --save-dev eslint@^9.9.0 @eslint/js@^9.9.0 typescript-eslint@^8.2.0 eslint-plugin-jsx-a11y@^6.9.0 prettier@^3.3.3
```

- [ ] **Step 2: Write the ESLint config**

Create `packages/stencil/eslint.config.mjs`:

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  {
    // Generated output and build artifacts are never linted.
    ignores: ['dist/**', 'www/**', 'loader/**', 'storybook-static/**', 'src/components.d.ts', '**/readme.md'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.tsx'],
    plugins: { 'jsx-a11y': jsxA11y },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // These four catch the exact faults found in dda-home-banner.
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/alt-text': 'error',
      // The repo uses implicit any in many places. Report it, do not stop the build.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // TypeScript already finds an unknown name. ESLint does not know the
      // browser globals here, and it would report hundreds of false faults.
      'no-undef': 'off',
    },
  },
);
```

- [ ] **Step 3: Write the Prettier config**

Create `packages/stencil/.prettierrc`:

```json
{
  "printWidth": 180,
  "singleQuote": true,
  "trailingComma": "all",
  "arrowParens": "avoid"
}
```

Create `packages/stencil/.prettierignore`:

```
dist
www
loader
storybook-static
src/components.d.ts
**/readme.md
```

- [ ] **Step 4: Add the scripts**

In `packages/stencil/package.json`, add to `"scripts"`:

```json
"lint": "eslint src",
"lint:report": "eslint src -f json -o ../../docs/a11y/eslint-report.json",
"format:check": "prettier --check \"src/**/*.{ts,tsx,css}\"",
"format": "prettier --write \"src/**/*.{ts,tsx,css}\""
```

- [ ] **Step 5: Run the lint to see the baseline**

Run: `cd packages/stencil && npm run lint`

Expected: It reports errors. **Do not repair them now.** Task 5 records them. Write the total count of errors and warnings in your commit message.

- [ ] **Step 6: Confirm the build is still satisfactory**

Run: `cd packages/stencil && npx stencil build`
Expected: `build finished`.

- [ ] **Step 7: Commit**

```bash
git add packages/stencil/eslint.config.mjs packages/stencil/.prettierrc packages/stencil/.prettierignore packages/stencil/package.json packages/stencil/package-lock.json
git commit -m "chore: add eslint and prettier config"
```

---

## Task 2: Write the API consistency checker

This finds the fault class that `dda-home-banner` had. Its story showed an `images` property, but the component had no properties at all.

**Files:**
- Create: `packages/stencil/scripts/check-api-consistency.mjs`
- Modify: `packages/stencil/package.json` (add the `check:api` script)

**Interfaces:**
- Consumes: `packages/stencil/stencil-docs.json`. `stencil build` writes this file. It holds the real property list for each component.
- Produces: the npm script `npm run check:api`. It exits with code 1 when it finds a fault. Task 9 uses it in CI.

- [ ] **Step 1: Write the failing test**

Create `packages/stencil/scripts/check-api-consistency.test.mjs`:

The Jest preset in this repository matches `.ts` and `.tsx` only. It does not
match `.mjs`. Use the test runner that Node 22 supplies.

```js
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
```

- [ ] **Step 2: Run the test to confirm it fails**

Run: `cd packages/stencil && node --test scripts/check-api-consistency.test.mjs`
Expected: FAIL. The message says it cannot find the module `./check-api-consistency.mjs`.

- [ ] **Step 3: Write the checker**

Create `packages/stencil/scripts/check-api-consistency.mjs`:

```js
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
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `cd packages/stencil && node --test scripts/check-api-consistency.test.mjs`
Expected: `# pass 3` and `# fail 0`.

- [ ] **Step 5: Add the script and run it on the real codebase**

In `packages/stencil/package.json`, add to `"scripts"`:

```json
"check:api": "node scripts/check-api-consistency.mjs",
"check:api:test": "node --test scripts/check-api-consistency.test.mjs"
```

Run: `cd packages/stencil && npx stencil build && npm run check:api`

Expected: It lists the faults it finds. **Do not repair them now.** Task 5 records them.

- [ ] **Step 6: Commit**

```bash
git add packages/stencil/scripts/check-api-consistency.mjs packages/stencil/scripts/check-api-consistency.test.mjs packages/stencil/package.json
git commit -m "test: add api consistency checker for stories and docs"
```

---

## Task 3: Add the axe accessibility sweep

**Files:**
- Create: `packages/stencil/.storybook/test-runner.ts`
- Modify: `packages/stencil/package.json` (add `test:a11y` script and devDependencies)

**Interfaces:**
- Consumes: the existing Storybook setup in `packages/stencil/.storybook/`.
- Produces: the npm script `npm run test:a11y`. Task 9 uses it in CI.

- [ ] **Step 1: Install the tools**

```bash
cd packages/stencil
npm install --save-dev @storybook/test-runner@^0.19.1 axe-playwright@^2.0.3
npx playwright install --with-deps chromium
```

- [ ] **Step 2: Write the test-runner config**

Create `packages/stencil/.storybook/test-runner.ts`:

```ts
import type { TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

// The theme lives on <html data-theme>. A contrast fault often exists in
// one theme only, so every story is checked in both.
const THEMES = ['light', 'dark'];

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },

  async postVisit(page, context) {
    await configureAxe(page, {
      rules: [
        // Storybook renders one component, not a page, so these do not apply.
        { id: 'page-has-heading-one', enabled: false },
        { id: 'landmark-one-main', enabled: false },
        { id: 'region', enabled: false },
      ],
    });

    for (const theme of THEMES) {
      await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);

      await checkA11y(page, '#storybook-root', {
        detailedReport: true,
        detailedReportOptions: { html: false },
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
          },
        },
        verbose: false,
      }, false, 'default', { message: `${context.id} [theme=${theme}]` });
    }
  },
};

export default config;
```

- [ ] **Step 3: Add the scripts**

In `packages/stencil/package.json`, add to `"scripts"`:

```json
"test:a11y": "test-storybook --url http://127.0.0.1:6006",
"test:a11y:ci": "concurrently -k -s first -n SB,TEST \"http-server storybook-static --port 6006 --silent\" \"wait-on tcp:127.0.0.1:6006 && npm run test:a11y\""
```

Install the two helpers:

```bash
npm install --save-dev concurrently@^8.2.2 http-server@^14.1.1 wait-on@^7.2.0
```

- [ ] **Step 4: Build Storybook and run the sweep**

```bash
cd packages/stencil
npm run build-storybook
npm run test:a11y:ci
```

Expected: It reports violations for several components. **Do not repair them now.** Task 5 records them.

- [ ] **Step 5: Commit**

```bash
git add packages/stencil/.storybook/test-runner.ts packages/stencil/package.json packages/stencil/package-lock.json
git commit -m "test: add axe a11y sweep over all stories in both themes"
```

---

## Task 4: Add the WCAG 2.2 checks that axe cannot do

axe cannot measure target size or find a focus trap. These checks do it.

**Files:**
- Create: `packages/stencil/scripts/wcag22-checks.ts`
- Modify: `packages/stencil/.storybook/test-runner.ts` (call the new checks)

**Interfaces:**
- Consumes: the Playwright `page` object that `postVisit` supplies.
- Produces: `checkTargetSize(page, storyId)` and `checkKeyboardReach(page, storyId)`. Both throw an `Error` when a check fails. `.storybook/test-runner.ts` calls both.

- [ ] **Step 1: Write the checks**

Create `packages/stencil/scripts/wcag22-checks.ts`:

```ts
import type { Page } from 'playwright';

const INTERACTIVE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * WCAG 2.2 - 2.5.8 Target Size (Minimum).
 * A target must be at least 24x24 CSS px, unless the spacing exception applies:
 * a 24px circle on each undersized target must not touch another target's circle.
 */
export async function checkTargetSize(page: Page, storyId: string) {
  const bad = await page.$$eval(INTERACTIVE, els => {
    const boxes = els
      .map(el => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName.toLowerCase(), cls: el.className, x: r.x, y: r.y, w: r.width, h: r.height };
      })
      .filter(b => b.w > 0 && b.h > 0); // ignore hidden targets

    return boxes.filter(b => {
      if (b.w >= 24 && b.h >= 24) return false;
      // Spacing exception: measure centre to centre against every other target.
      const cx = b.x + b.w / 2;
      const cy = b.y + b.h / 2;
      return boxes.some(o => {
        if (o === b) return false;
        const ox = o.x + o.w / 2;
        const oy = o.y + o.h / 2;
        return Math.hypot(cx - ox, cy - oy) < 24;
      });
    });
  });

  if (bad.length) {
    const list = bad.map(b => `${b.tag}.${b.cls} ${Math.round(b.w)}x${Math.round(b.h)}`).join('; ');
    throw new Error(`${storyId}: WCAG 2.5.8 target size - ${bad.length} target(s) too small and too close: ${list}`);
  }
}

/**
 * WCAG 2.1.1 Keyboard and 2.4.7 Focus Visible.
 * Tab through the story. Every interactive element must be reachable,
 * and the focused element must show a visible focus indicator.
 */
export async function checkKeyboardReach(page: Page, storyId: string) {
  const expected = await page.$$eval(INTERACTIVE, els =>
    els.filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && !el.closest('[inert]') && !el.closest('[aria-hidden="true"]');
    }).length,
  );
  if (expected === 0) return;

  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());

  const seen = new Set<string>();
  let noIndicator: string | null = null;

  for (let i = 0; i < expected + 5; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      const hasRing = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0;
      const hasShadow = s.boxShadow !== 'none';
      return {
        key: el.tagName + '.' + el.className + '#' + el.id,
        visible: hasRing || hasShadow,
      };
    });
    if (!info) break;
    seen.add(info.key);
    if (!info.visible && noIndicator === null) noIndicator = info.key;
  }

  if (seen.size < expected) {
    throw new Error(`${storyId}: WCAG 2.1.1 keyboard - reached ${seen.size} of ${expected} interactive elements by Tab`);
  }
  if (noIndicator) {
    throw new Error(`${storyId}: WCAG 2.4.7 focus visible - no focus indicator on ${noIndicator}`);
  }
}
```

- [ ] **Step 2: Call the checks from the test runner**

In `packages/stencil/.storybook/test-runner.ts`, add the import at the top:

```ts
import { checkTargetSize, checkKeyboardReach } from '../scripts/wcag22-checks';
```

Then add these two lines inside `postVisit`, after the `for (const theme ...)` loop closes:

```ts
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await checkTargetSize(page, context.id);
    await checkKeyboardReach(page, context.id);
```

- [ ] **Step 3: Run the sweep**

```bash
cd packages/stencil
npm run build-storybook
npm run test:a11y:ci
```

Expected: It now reports target size and keyboard faults as well. **Do not repair them now.**

- [ ] **Step 4: Commit**

```bash
git add packages/stencil/scripts/wcag22-checks.ts packages/stencil/.storybook/test-runner.ts
git commit -m "test: add wcag 2.2 target size and keyboard checks"
```

---

## Task 5: Record the baseline report

**Files:**
- Create: `docs/a11y/baseline-2026-08-20.md`
- Create: `docs/a11y/eslint-report.json` (the `lint:report` script writes it)

**Interfaces:**
- Consumes: `npm run lint`, `npm run check:api`, `npm run test:a11y:ci` from Tasks 1 to 4.
- Produces: `docs/a11y/baseline-2026-08-20.md`. Task 7 reads it.

- [ ] **Step 1: Run every tool and keep the output**

```bash
cd packages/stencil
mkdir -p ../../docs/a11y
npx stencil build 2>&1 | tee ../../docs/a11y/raw-build.txt
npm run lint 2>&1 | tee ../../docs/a11y/raw-lint.txt
npm run check:api 2>&1 | tee ../../docs/a11y/raw-api.txt
npx stencil test --spec --e2e --ci 2>&1 | tee ../../docs/a11y/raw-tests.txt
npm run build-storybook
npm run test:a11y:ci 2>&1 | tee ../../docs/a11y/raw-a11y.txt
```

Note: `test:a11y:ci` will stop at the first failure. That is correct for a gate but not for a survey. Add `--maxWorkers=1 --json --outputFile=../../docs/a11y/a11y.json` to the `test:a11y` script temporarily if you need the full list.

- [ ] **Step 2: Write the baseline document**

Create `docs/a11y/baseline-2026-08-20.md`. Use this exact structure:

```markdown
# Review Baseline - 2026-08-20

Measured with Node 22.14.0, Stencil 4.43.5, 34 components.

## Totals

| Check | Faults |
| --- | --- |
| ESLint errors | <number> |
| ESLint warnings | <number> |
| Ghost attributes (check:api) | <number> |
| axe violations (light theme) | <number> |
| axe violations (dark theme) | <number> |
| Target size (2.5.8) | <number> |
| Keyboard reach (2.1.1) | <number> |
| Unit and e2e tests failing | <number> |

## Faults by component

| Component | ESLint | Ghost attrs | axe | 2.5.8 | Keyboard |
| --- | --- | --- | --- | --- | --- |
| dda-accordion | | | | | |
| ... one row for each of the 34 components ... |

## Raw output

The raw files are in this folder: `raw-build.txt`, `raw-lint.txt`, `raw-api.txt`, `raw-tests.txt`, `raw-a11y.txt`.
```

Fill in every number. Do not leave a cell empty. Write `0` when there is no fault.

- [ ] **Step 3: Commit**

```bash
git add docs/a11y/
git commit -m "docs: record code review baseline for 34 components"
```

---

## Task 6: Review by hand what the tools cannot see

A tool cannot judge whether a component's API makes sense, whether a document tells the truth, or whether a keyboard interaction follows the correct pattern. A person must do this.

**Files:**
- Create: `docs/a11y/manual-review.md`

**Interfaces:**
- Consumes: `docs/a11y/baseline-2026-08-20.md` from Task 5.
- Produces: `docs/a11y/manual-review.md`. Task 7 reads it.

Review the components in 6 groups. Each group is one work session. Commit after each group.

- [ ] **Step 1: Review the form components**

Components: `dda-input`, `dda-textarea`, `dda-select`, `dda-checkbox`, `dda-radiobutton`, `dda-toggle`, `dda-number-field`, `dda-search-input`, `dda-phonefield`, `dda-creditcard-field`, `dda-attach-file`.

For each component, answer these questions in `docs/a11y/manual-review.md`:

1. Does each field have a `<label>` that the `for` attribute connects to the input? (WCAG 1.3.1, 4.1.2)
2. Does the error message use `aria-describedby` and `aria-invalid`? (WCAG 3.3.1)
3. Does the field have the correct `autocomplete` value? (WCAG 1.3.5, and 3.3.7 Redundant Entry)
4. For `dda-creditcard-field` and `dda-phonefield`: can the user paste a value? WCAG 3.3.8 does not permit a field that blocks paste.
5. Does the `.mdx` document show the real property names? Compare against `readme.md`.

- [ ] **Step 2: Commit the form review**

```bash
git add docs/a11y/manual-review.md
git commit -m "docs: manual review of the form components"
```

- [ ] **Step 3: Review the navigation components**

Components: `dda-header`, `dda-footer`, `dda-sticky-footer`, `dda-breadcrumb`, `dda-pagination`, `dda-tabs`, `dda-segmented-tabs`.

Questions:

1. `dda-header` has 2 places with `onClick` on a non-button element. Find them. Can a keyboard operate them?
2. `dda-header` and `dda-sticky-footer` are fixed to the viewport. Do they hide the focused element when the user tabs? (WCAG 2.4.11 Focus Not Obscured)
3. Do `dda-tabs` and `dda-segmented-tabs` follow the WAI tabs pattern? Arrow keys must move between tabs. `Tab` must move into the panel.
4. `dda-footer`, `dda-banner` and `dda-sticky-footer` use `shadow: true`. The global CSS does not reach into a shadow root. Confirm whether these 3 components render correctly with only `dda.css` loaded. Write down what you find.

- [ ] **Step 4: Commit the navigation review**

```bash
git add docs/a11y/manual-review.md
git commit -m "docs: manual review of the navigation components"
```

- [ ] **Step 5: Review the disclosure and overlay components**

Components: `dda-accordion`, `dda-dropdown`, `dda-tooltip`, `dda-alert`, `dda-banner`.

Questions:

1. `dda-accordion` uses `onClick` on a non-button element. Can a keyboard open it? Does it set `aria-expanded`?
2. `dda-dropdown`: does `Escape` close it? Does focus return to the button that opened it?
3. `dda-tooltip`: WCAG 1.4.13 needs three things. The user must be able to dismiss it without moving the pointer. The pointer must be able to move onto it. It must stay until the user removes the pointer. Test all three.
4. `dda-alert`: does it use `role="alert"` or `role="status"`? A screen reader must announce it.
5. `dda-banner` has no story and no document. Write both, or record why it should be removed.

- [ ] **Step 6: Commit the overlay review**

```bash
git add docs/a11y/manual-review.md
git commit -m "docs: manual review of the disclosure and overlay components"
```

- [ ] **Step 7: Review the remaining components**

Components: `dda-button`, `dda-link-button`, `dda-chip`, `dda-avatar`, `dda-progressbar`, `dda-range-slider`, `dda-credit-card`, `dda-ui-card`, `dda-home-banner`, `dda-horizontal-stepper`, `dda-vertical-stepper`.

Questions:

1. `dda-chip` and `dda-avatar` use `onClick` on a non-button element. Can a keyboard operate them?
2. `dda-range-slider`: WCAG 2.5.7 says a drag must not be the only way. Do arrow keys change the value? Does it have `role="slider"`, `aria-valuenow`, `aria-valuemin` and `aria-valuemax`?
3. `dda-progressbar`: does it use `role="progressbar"` with the value attributes?
4. `dda-ui-card` has no story and no document. Write both.
5. Both stepper components: does the current step use `aria-current="step"`?

- [ ] **Step 8: Commit the remaining review**

```bash
git add docs/a11y/manual-review.md
git commit -m "docs: manual review of the remaining components"
```

---

## Task 7: Write the findings report and the component matrix

**Files:**
- Create: `docs/a11y/findings.md`
- Create: `docs/a11y/component-matrix.md`

**Interfaces:**
- Consumes: `docs/a11y/baseline-2026-08-20.md` (Task 5) and `docs/a11y/manual-review.md` (Task 6).
- Produces: `docs/a11y/findings.md`. Task 11 reads it to set the order of the test work.

- [ ] **Step 1: Write the findings report**

Create `docs/a11y/findings.md`. Give each fault an ID and a severity. Use this structure:

```markdown
# Code Review Findings

Severity: CRITICAL breaks a user task. HIGH fails WCAG at level A or AA.
MEDIUM is a fault that a user can work around. LOW is a defect in quality.

| ID | Component | Severity | Fault | WCAG | Repair |
| --- | --- | --- | --- | --- | --- |
| F-001 | dda-accordion | HIGH | A `div` with `onClick` cannot be operated by a keyboard | 2.1.1 | Change the `div` to a `button` |
| F-002 | ... | | | | |
```

Sort the table. Put CRITICAL first and LOW last.

- [ ] **Step 2: Write the component matrix**

Create `docs/a11y/component-matrix.md` with one row for each of the 34 components:

```markdown
# Component Review Matrix

Key: PASS, FAIL, or N/A.

| Component | axe | Keyboard | Target size | API correct | Docs correct | Has tests |
| --- | --- | --- | --- | --- | --- | --- |
| dda-accordion | | | | | | NO |
| dda-alert | | | | | | NO |
| dda-attach-file | | | | | | NO |
| dda-avatar | | | | | | NO |
| dda-banner | | | | | | NO |
| dda-breadcrumb | | | | | | NO |
| dda-button | | | | | | YES |
| dda-checkbox | | | | | | NO |
| dda-chip | | | | | | NO |
| dda-credit-card | | | | | | NO |
| dda-creditcard-field | | | | | | NO |
| dda-dropdown | | | | | | NO |
| dda-footer | | | | | | NO |
| dda-header | | | | | | NO |
| dda-home-banner | | | | | | YES |
| dda-horizontal-stepper | | | | | | NO |
| dda-input | | | | | | NO |
| dda-link-button | | | | | | NO |
| dda-number-field | | | | | | NO |
| dda-pagination | | | | | | NO |
| dda-phonefield | | | | | | NO |
| dda-progressbar | | | | | | NO |
| dda-radiobutton | | | | | | NO |
| dda-range-slider | | | | | | NO |
| dda-search-input | | | | | | NO |
| dda-segmented-tabs | | | | | | NO |
| dda-select | | | | | | NO |
| dda-sticky-footer | | | | | | NO |
| dda-tabs | | | | | | NO |
| dda-textarea | | | | | | NO |
| dda-toggle | | | | | | NO |
| dda-tooltip | | | | | | NO |
| dda-ui-card | | | | | | YES |
| dda-vertical-stepper | | | | | | NO |
```

Fill every cell.

- [ ] **Step 3: Commit**

```bash
git add docs/a11y/findings.md docs/a11y/component-matrix.md
git commit -m "docs: add code review findings and component matrix"
```

---

## Task 8: Add the CI job for the build and the tests

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: the npm scripts from the root `package.json` and `packages/stencil/package.json`.
- Produces: the GitHub Actions job `build-and-test`. Task 9 adds more jobs to the same file.

- [ ] **Step 1: Write the workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [master]
  pull_request:

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22.14.0'
          cache: npm

      - name: Install
        run: npm ci

      - name: Build the components
        working-directory: packages/stencil
        run: npx stencil build

      # The CI environment variable makes Stencil pass --no-sandbox to
      # Puppeteer. Without it the browser will not start in a container.
      - name: Unit and e2e tests
        working-directory: packages/stencil
        run: npx stencil test --spec --e2e --ci

      # A generated wrapper that differs from the source means somebody
      # edited a generated file, or forgot to commit a rebuild.
      - name: Check that the generated wrappers are current
        run: |
          if [ -n "$(git status --porcelain)" ]; then
            echo "The build changed these files. Commit the rebuild:"
            git status --porcelain
            git diff
            exit 1
          fi
```

- [ ] **Step 2: Test the workflow logic on this machine**

```bash
cd /root/Coding/dubai-design-system
export PATH=/usr/local/bin:$PATH
cd packages/stencil && npx stencil build && npx stencil test --spec --e2e --ci
cd ../.. && git status --porcelain
```

Expected: The build and the tests are satisfactory. `git status --porcelain` shows only files you intend to commit.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add build and test workflow"
```

---

## Task 9: Add the lint and accessibility gates to CI

Add these gates only after Task 5 records the baseline. A gate that fails on the first day is a gate that people turn off.

**Files:**
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: `npm run lint`, `npm run format:check`, `npm run check:api`, `npm run test:a11y:ci` from Tasks 1 to 4.
- Produces: the CI jobs `lint` and `accessibility`.

- [ ] **Step 1: Add the lint job**

Add this job to `.github/workflows/ci.yml`, at the same level as `build-and-test`:

```yaml
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22.14.0'
          cache: npm
      - run: npm ci

      - name: ESLint
        working-directory: packages/stencil
        run: npm run lint

      - name: Prettier
        working-directory: packages/stencil
        run: npm run format:check

      - name: Test the API checker itself
        working-directory: packages/stencil
        run: npm run check:api:test

      # stencil-docs.json must exist before this check can run.
      - name: API consistency
        working-directory: packages/stencil
        run: npx stencil build && npm run check:api
```

- [ ] **Step 2: Add the accessibility job**

Add this job to the same file:

```yaml
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22.14.0'
          cache: npm
      - run: npm ci

      - name: Install the browser
        working-directory: packages/stencil
        run: npx playwright install --with-deps chromium

      - name: Build Storybook
        working-directory: packages/stencil
        run: npm run build-storybook

      - name: axe and WCAG 2.2 sweep
        working-directory: packages/stencil
        run: npm run test:a11y:ci
```

- [ ] **Step 3: Repair the faults that stop the gates**

The `lint` and `accessibility` jobs will fail until you repair the faults from Task 7.

Repair them in the order of the severity in `docs/a11y/findings.md`. Repair CRITICAL and HIGH first.

For each repair:
1. Write an e2e test that fails. Use the recipe in Task 11.
2. Run it. Confirm it fails.
3. Repair the component `.tsx`. Never edit a generated file.
4. Run the test. Confirm it is satisfactory.
5. Run `npx stencil build`. Confirm it is satisfactory.
6. Commit with the fault ID: `git commit -m "fix(dda-accordion): F-001 make the header a button"`

- [ ] **Step 4: Confirm every gate is satisfactory**

```bash
cd packages/stencil
npm run lint && npm run format:check && npm run check:api
npm run build-storybook && npm run test:a11y:ci
npx stencil test --spec --e2e --ci
```

Expected: Every command exits with code 0.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add lint and accessibility gates"
```

---

## Task 10: Write the review list for people

**Files:**
- Create: `CONTRIBUTING.md`

**Interfaces:**
- Consumes: the faults in `docs/a11y/findings.md`. Each repeated fault becomes a line in the list.
- Produces: `CONTRIBUTING.md`. A reviewer follows it for each pull request.

- [ ] **Step 1: Write the document**

Create `CONTRIBUTING.md` at the root of the repository:

```markdown
# How to Contribute

## Before you open a pull request

Run these commands. All of them must be satisfactory.

```bash
cd packages/stencil
npx stencil build
npx stencil test --spec --e2e --ci     # --ci is necessary: it adds --no-sandbox
npm run lint
npm run format:check
npm run check:api
```

## Rules you must obey

1. **Never edit a file under `stencil-generated/`.** The next build writes over it.
   Edit the `.tsx` in `packages/stencil/src/components/` instead.
2. **Never edit `readme.md` in a component folder.** The build generates it.
3. **Commit the rebuild.** If your change alters a wrapper package, commit that change too.
   CI fails when the working tree is not clean after a build.
4. **Use the placeholder `X.X.X` in a CDN URL.** Never write `@latest`.

## The review list

A reviewer must confirm each of these.

### The API
- [ ] Every property in the story exists in the component. Compare against `readme.md`.
- [ ] Property names use snake_case, for example `button_color`.
- [ ] The `.mdx` document describes this component, not a different one.

### Accessibility
- [ ] A click handler is on a `button` or an `a`, never on a `div` or a `span`.
- [ ] Each control has an accessible name. Use text, or `aria-label`.
- [ ] A keyboard can reach and operate every control.
- [ ] The focus indicator is visible. Test it above an image, not only above a plain colour.
- [ ] A target is at least 24x24 px, or the targets are at least 24 px apart, centre to centre.
- [ ] Content that moves on its own has a control to stop it.
- [ ] The component obeys `prefers-reduced-motion`.

### Tests
- [ ] The component has a `test/` folder with an e2e file.
- [ ] A new repair has a test that fails before the repair.

### Style
- [ ] The component uses `shadow: false`, the same as the other 31 components.
- [ ] The styles are in a global stylesheet, or in the component stylesheet. Not both.
```

- [ ] **Step 2: Commit**

```bash
git add CONTRIBUTING.md
git commit -m "docs: add contributing guide and pull request review list"
```

---

## Task 11: Write an e2e test for each component

31 of 34 components have no test. Add one file for each. Work through the list in the order of `docs/a11y/findings.md`. Start with the components that have the worst faults.

**Files:**
- Create: `packages/stencil/src/components/<name>/test/<name>.e2e.ts` (31 files)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: the `test/` folder for each component. `npx stencil test --e2e --ci` finds them.

- [ ] **Step 1: Learn the recipe**

Every file follows this shape. This example uses `dda-chip`. Copy it, then change the tag, the properties and the assertions to match the component you are testing.

```ts
import { newE2EPage } from '@stencil/core/testing';

describe('dda-chip', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-chip label="Filter"></dda-chip>');

    const el = await page.find('dda-chip');
    expect(el).toHaveClass('hydrated');
  });

  it('shows the label text', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-chip label="Filter"></dda-chip>');

    const el = await page.find('dda-chip');
    expect(el.textContent).toContain('Filter');
  });

  it('builds a class from each style prop', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-chip label="Filter" chip_color="primary"></dda-chip>');

    const inner = await page.find('dda-chip .dda-chip');
    expect(inner).toHaveClass('chip-color-primary');
  });

  // WCAG 2.1.1. A keyboard must operate the control.
  it('can be operated by a keyboard', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-chip label="Filter"></dda-chip>');

    const focusedTag = await page.evaluate(() => {
      const el = document.querySelector('dda-chip button, dda-chip a') as HTMLElement;
      el.focus();
      return document.activeElement.tagName.toLowerCase();
    });
    expect(['button', 'a']).toContain(focusedTag);
  });

  // WCAG 4.1.2. The control must have an accessible name.
  it('gives the control an accessible name', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-chip label="Filter"></dda-chip>');

    const control = await page.find('dda-chip button, dda-chip a');
    const name = control.getAttribute('aria-label') || control.textContent.trim();
    expect(name.length).toBeGreaterThan(0);
  });
});
```

Three rules for these tests:

1. **The component uses `shadow: false`.** Use a plain selector such as `dda-chip button`. A `>>>` piercing selector finds nothing.
2. **`E2EElement` has no `hasAttribute` method.** Use `getAttribute('x')` and compare against `null`. A boolean attribute that is present reads back as an empty string.
3. **Attach a click spy after `setContent`.** `setContent` replaces the document and removes any earlier listener.

- [ ] **Step 2: Read the real property names before you write a test**

Run this for the component you are testing. Never guess a property name.

```bash
cat packages/stencil/src/components/<name>/readme.md
```

- [ ] **Step 3: Write the file, then run it**

```bash
cd packages/stencil
npx stencil test --e2e --ci -- <name>
```

Expected: All tests are satisfactory. If a test fails, first decide whether the test is wrong or the component is wrong. A component fault becomes a new row in `docs/a11y/findings.md`.

- [ ] **Step 4: Commit after each component**

```bash
git add packages/stencil/src/components/<name>/test/
git commit -m "test(<name>): add e2e coverage"
```

- [ ] **Step 5: Work through every component**

Mark each one when its tests are satisfactory.

- [ ] dda-accordion
- [ ] dda-alert
- [ ] dda-attach-file
- [ ] dda-avatar
- [ ] dda-banner
- [ ] dda-breadcrumb
- [ ] dda-checkbox
- [ ] dda-chip
- [ ] dda-credit-card
- [ ] dda-creditcard-field
- [ ] dda-dropdown
- [ ] dda-footer
- [ ] dda-header
- [ ] dda-horizontal-stepper
- [ ] dda-input
- [ ] dda-link-button
- [ ] dda-number-field
- [ ] dda-pagination
- [ ] dda-phonefield
- [ ] dda-progressbar
- [ ] dda-radiobutton
- [ ] dda-range-slider
- [ ] dda-search-input
- [ ] dda-segmented-tabs
- [ ] dda-select
- [ ] dda-sticky-footer
- [ ] dda-tabs
- [ ] dda-textarea
- [ ] dda-toggle
- [ ] dda-tooltip
- [ ] dda-vertical-stepper

- [ ] **Step 6: Confirm the full suite**

```bash
cd packages/stencil
npx stencil test --spec --e2e --ci
```

Expected: 34 suites. Every test is satisfactory.

- [ ] **Step 7: Final commit**

```bash
git commit --allow-empty -m "test: complete e2e coverage for all 34 components"
```
