# Changelog

All notable changes to the Dubai Design System packages are documented in this file.
All four published packages (`components-js`, `components-react`, `components-vue`,
`components-angular`) share a version and release together.

## [5.0.0](https://github.com/saleh-lootah/dubai-design-system/releases/tag/%40dubai-design-system%2Fcomponents-js%405.0.0) (2026-08-21)

A full accessibility and correctness review of all 34 components. This is a **major**
release: several fixes change the rendered DOM, remove hardcoded ids, or alter which CSS
selectors match. **See [MIGRATION.md](../../MIGRATION.md) for what to change in your own code.**
`docs/a11y/consumer-impact.md` has the verified, itemised list with file and line
citations, and `docs/a11y/findings.md` records the 51 findings behind them.

**Why 5.0.0 and not 4.x** — a `4.1.0` was published in February 2025 and never tagged
`latest`. Releasing a `4.x` now would let anyone on a `^4` range resolve to that older
build instead of this one. 5.0.0 avoids the collision entirely.

### Breaking Changes

- **dda-footer, dda-sticky-footer:** `shadow: true` → `shadow: false`. `element.shadowRoot`
  is now `null` and `::part()` has nothing to target. Both previously rendered as
  **unstyled raw HTML** — their shadow stylesheet was 0 bytes and global CSS could not
  reach inside — and now render fully styled. A total visual change wherever they are used.
- **dda-search-input:** hardcoded `id='search'` removed (it collided across every instance
  on a page); the id now comes from the new `input_id` prop. `#search` selectors and
  `getElementById('search')` break silently.
- **dda-search-input:** `<label for>` retargeted from the clear button to the text field.
  Consumers relying on the old association must now set `input_id`.
- **dda-textarea:** hardcoded `id="editor"` removed in rich-editor mode, same mechanism.
- **dda-avatar:** content is now nested inside a `.avatar-trigger` wrapper — a `<button>`
  when `options` is non-empty, a `<div>` otherwise. `.dda-avatar > img` no longer matches.
- **dda-accordion:** the header is a real `<button>`, not a `<div>`. The class is unchanged.
- **dda-chip:** the close control is a real `<button>`, not a `<span>`. Class unchanged.
- **dda-home-banner:** slide dots are now `<li><button class="dots">` rather than `<div
  class="dots">` as direct `<ul>` children.

### Behaviour Changes

- **dda-header** now sets `scroll-padding-top` on `:root` (170px, 100px below 767px) so a
  focused element cannot land behind the fixed header. This affects the whole document,
  including a consumer's own anchors and `scrollIntoView` calls.
- **dda-home-banner** writes `inert`, `aria-hidden` and slide roles onto the consumer's own
  `<slide>` elements; offscreen slides are no longer focusable or findable by page search.
- **dda-sticky-footer** marks itself `inert` and `aria-hidden` while scroll-hidden; it was
  previously translated offscreen but still focusable.
- **dda-tabs:** `aria_label` now names the tab group; each button is named by its own text.
- **dda-segmented-tabs:** the first segment renders selected by default.
- **dda-pagination:** dot spacing 8px → 15px to meet the WCAG 2.5.8 spacing exception.
- **Dark theme:** `--dda-primary-variant-95` and `--dda-color-warning-40` changed. See
  `docs/a11y/contrast-decision.md` — no new colour was invented; both are existing palette
  steps chosen to clear 4.5:1.

### Bug Fixes

- **dda-home-banner:** apply its own `home-slider` root class. Without it none of the
  component's layout CSS matched and the banner collapsed into normal document flow.
- **dda-accordion, dda-avatar, dda-chip:** keyboard lockouts — the controls were `div`/`span`
  elements with `onClick` and no keyboard path (WCAG 2.1.1).
- **dda-segmented-tabs:** had no click handler, no state and no selection logic at all.
- **Focus indicators:** 24 confirmed WCAG 2.4.7 failures, nearly all traced to
  `.dda-btn { outline: 0 }` never being overridden. One shared ring idiom now applies.
- **Form fields:** eight components rendered `error_message` with no `id`,
  `aria-describedby` or `aria-invalid` — the error was invisible to screen readers (3.3.1).
- **dda-textarea:** in rich-editor mode the label targeted an element that no longer existed.
- **dda-alert, dda-progressbar, dda-tabs, dda-select:** missing roles and ARIA state.
- **dda-tooltip:** hover-only, unreachable by keyboard; now satisfies all three parts of
  WCAG 1.4.13.
- **dda-creditcard-field, dda-phonefield:** added `autocomplete` (1.3.5).
- **dda-header:** use the standard Material accessibility icon.
- Repo-level: `packages/angular/projects/stencil-wrapper/package.json` had been invalid JSON
  since the initial commit; `package-lock.json` shipped only the Windows `@swc/core` binary,
  so Storybook could not build on Linux; `@stencil/core` is now pinned exactly.

### Tooling

- ESLint, Prettier, an API-consistency checker, an axe sweep over every story in both
  themes, and WCAG 2.2 target-size and keyboard checks.
- CI runs build, tests, lint and accessibility. The lint and accessibility gates are a
  **ratchet** against `.github/quality-baseline.env` — they pass today and fail on
  regression. The numbers are meant to go down.
- Test suite grew from 41 tests on 3 components to **290 tests covering all 34**.

### Known Issues

- `dda-progressbar`'s residual, the two `Tabs` stories axe flags but computation scores at
  21:1, and three known-flaky stories — all recorded in `docs/a11y/findings.md`.
- `docs/a11y/consumer-impact.md` is thorough but not guaranteed exhaustive; two items were
  found after it was first considered complete.

## [3.12.16](https://github.com/saleh-lootah/dubai-design-system/releases/tag/%40dubai-design-system%2Fcomponents-js%403.12.16) (2026-07-16)

### Chores

- update licensing metadata
- documentation cleanup

## [3.12.15](https://github.com/saleh-lootah/dubai-design-system/releases/tag/%40dubai-design-system%2Fcomponents-js%403.12.15) (2026-07-16)

### Bug Fixes

- **header:** give the mobile search button a 40x40 touch target (was 30x22) — matches the hamburger and toolbar buttons and meets the 40px minimum target size on mobile breakpoints

## [3.12.14](https://github.com/saleh-lootah/dubai-design-system/releases/tag/%40dubai-design-system%2Fcomponents-js%403.12.14) (2026-07-16)

### Documentation

- rewrite all four package readmes: clear install steps, links to the hosted documentation, corrected code examples (Vue `@click`/`<script setup>`, fixed code fences)
- pin CDN loader URLs to an exact version in examples — unversioned jsdelivr URLs mix chunk versions and break rendering; examples now use an `X.X.X` placeholder
- document the Vite/Rollup lazy-loader limitation and the `dist/components` workaround in the `components-js` readme

## [3.12.13](https://github.com/saleh-lootah/dubai-design-system/releases/tag/%40dubai-design-system%2Fcomponents-js%403.12.13) (2026-07-15)

### Bug Fixes

- **angular:** fix broken package entry points — `main`/`module`/`types`/`exports` now resolve into the ng-packagr output under `dist/stencil-wrapper/`

## [3.12.12](https://github.com/saleh-lootah/dubai-design-system/releases/tag/%40dubai-design-system%2Fcomponents-js%403.12.12) (2026-07-15)

### Chores

- ship CHANGELOG.md in the `components-js` npm package

## [3.12.11](https://github.com/saleh-lootah/dubai-design-system/releases/tag/%40dubai-design-system%2Fcomponents-js%403.12.11) (2026-07-15)

### Bug Fixes

- **header:** enforce 40x40 touch targets for nav-bar buttons ([0822d3f](https://github.com/saleh-lootah/dubai-design-system/commit/0822d3f))

### Chores

- publish all packages with public npm access ([7f30032](https://github.com/saleh-lootah/dubai-design-system/commit/7f30032))
- rename the color palette creator app and mark it private so it is excluded from publishing ([7f30032](https://github.com/saleh-lootah/dubai-design-system/commit/7f30032))
- regenerate stencil type declarations ([8f77df6](https://github.com/saleh-lootah/dubai-design-system/commit/8f77df6))

## 3.12.10 and earlier

Releases up to and including 3.12.10 were published before this repository's history
began (it starts at an initial-commit snapshot versioned 3.1.2), so their changes are
not recorded here. See the [npm version history](https://www.npmjs.com/package/@dubai-design-system/components-js?activeTab=versions).
