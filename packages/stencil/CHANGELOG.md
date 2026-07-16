# Changelog

All notable changes to the Dubai Design System packages are documented in this file.
All four published packages (`components-js`, `components-react`, `components-vue`,
`components-angular`) share a version and release together.

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
