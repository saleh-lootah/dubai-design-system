# Fix: `dist/dda/dda.css` requests Dubai fonts that 5.0.0 does not ship

**Date:** 2026-09-01
**Reported by:** an external consumer of `@dubai-design-system/components-js@5.0.0`
**Status:** confirmed — plan below

## The report, verified

The consumer's report is accurate in every particular. Verified against the published
tarball (`npm pack @dubai-design-system/components-js@5.0.0`) and against live jsDelivr:

| Claim | Verified |
|---|---|
| `dist/dda/dda.css` carries `@font-face` with `url("../assets/fonts/dubai/…")` | Yes — 4 blocks, 20 URLs |
| No `dist/assets/` exists in the package | Yes — the only `assets/` is `dist/collection/assets/` |
| Only `.svg` fonts are published | Yes — 4 SVG files, no woff2/woff/ttf/eot anywhere |
| jsDelivr returns 404 | Yes — `dist/assets/fonts/dubai/DubaiRegular.woff2` → `404`; `dist/dda/dda.css` → `200` |

## Root cause

Three faults combine.

1. **`src/global/global.css` writes font URLs as `../assets/…`.** That is correct only for
   the `www` output target, where Stencil's default copy task (`{ src: 'assets' }`) puts
   the fonts at `www/assets/` and the stylesheet at `www/build/dda.css`. The `dist`
   layout has no equivalent.

2. **Nothing copies the fonts into `dist/`.** `stencil.config.ts` declares no `copy` task.
   Stencil's `dist` target applies a default copy of `**/*.svg` and `**/*.js` *into
   `dist/collection`* — which is exactly why 4 SVGs, and only SVGs, appear under
   `dist/collection/assets/fonts/dubai/`. `dist.copy` cannot write to the `dist/` root at
   all; it is hard-wired to `collectionDir`.

3. **`dist/dda/dda.css` is new in 5.0.0.** Unpacking 4.1.0 confirms it shipped no global
   stylesheet whatsoever. 5.0.0 therefore published a stylesheet pointing at files the
   package has never contained. This is a genuine 5.0.0 regression.

### A second 404 set the report did not name

`global.css` appears in the `styleUrls` of ~30 components, so the same `@font-face` block
is compiled into the component chunks — 30 files in `dist/dda/`, 61 more across
`dist/esm/` and `dist/components/`. Stencil injects those as `<style>` elements, and URLs
inside a `<style>` resolve against **the document URL**, not the stylesheet URL. Consumers
therefore also get 404s at `https://their-site/<path>/../assets/fonts/dubai/*`. This fault
predates 5.0.0 and has been silently live since at least 4.1.0.

### 4 — corrected: which injection path actually caused the second 404 set

An earlier draft of this plan attributed the head-injection to the `globalStyles` string.
That was wrong, and the correction matters. Verified against the published 5.0.0 artifacts:

- Of the 30 files under `dist/dda/` carrying `fonts/dubai`, **29 are component entry
  chunks**. Their components are `shadow: false`, and Stencil injects such a chunk's styles
  as a `<style>` into `document.head` via `addStyle`. That is the path that put
  page-relative `@font-face` rules on the consumer's page. Because the `<style>` is inserted
  ahead of the first existing one, and the last matching `@font-face` wins, those rules could
  also shadow the correct ones in a linked `dda.css`. D3 removes this.
- The remaining file is the `globalStyles` string. In this build it is referenced **only**
  inside `createShadowRoot`, prepended as a `<style>` into the shadow root of each
  `shadow: true` component — `dda-banner` alone. `@font-face` is ignored inside a shadow
  root, so that copy was inert weight, not a second fault.

So D3 does the load-bearing work. D7 remains justified on narrower grounds: it keeps the
declarations in exactly one artifact and out of the runtime JS, rather than rescuing the fix.

- **D7 — keep the font layer out of the compiled global style.** `dda-bundle.css` does not
  `@import` `fonts.css`. Instead `scripts/emit-font-css.mjs` appends `fonts.css` to
  `dist/dda/dda.css` after the build, before the guard runs. Hygiene, not rescue: it avoids
  shipping dead `@font-face` bytes into shadow roots and the runtime bundle.

  Rejected alternatives: **data: URIs** work in every delivery path but duplicate ~192 KB of
  base64 into the runtime JS as well as the stylesheet; **absolute CDN URLs** in `@font-face`
  work everywhere but hard-wire a CDN dependency into the CSS, which is unacceptable for
  air-gapped and self-hosted government deployments.

## Decisions

- **D1 — keep the `../assets/fonts/dubai/` path.** Ship the fonts to
  `dist/assets/fonts/dubai/` so the existing URL resolves. No URL churn, and it matches
  both the consumer's expectation and the working `www` layout.
- **D2 — ship `woff2` + `woff` + `ttf`; drop `eot` and `svg`.** `eot` is IE-only and `svg`
  fonts were dropped by Safari long ago; together they are ~1.6 MB of the 2.4 MB font
  directory. The three retained formats are exactly what the consumer's remediation
  request named, and `ttf` is kept as a universal fallback for embedded/kiosk webviews.
  Removing `eot`/`svg` from the `src:` lists means no browser requests them, so no 404s.
- **D3 — move `@font-face` out of `global.css`** into a new `src/global/fonts.css`, so the
  rules stop being compiled into every component chunk. This shrinks 91 build artifacts
  and removes the bulk of the page-relative 404 set. Superseded in part by D7: `fonts.css`
  is *not* imported by `dda-bundle.css`, it is appended to the built stylesheet.
- **D4 — Storybook must import `fonts.css` explicitly.** `.storybook/preview.js` imports
  only `global.css`; without this, D3 silently removes the Dubai font from Storybook.
- **D5 — add a packaging guard** following the existing `scripts/check-api-consistency.mjs`
  convention, wired into `postbuild` so a release cannot repeat this.

### Consequence accepted

A consumer bundling from `dist/collection` who does *not* load `dda.css` loses the
`@font-face` declarations and falls back to `sans-serif`. Those URLs resolved to
SVG-only files before, so nothing that worked stops working. Documented in D6.

## Work

### A — stylesheet restructure
- Create `src/global/fonts.css` with the 4 `@font-face` blocks, `src:` listing only
  `woff2`, `woff`, `ttf`, in that order, keeping the existing `font-weight` /
  `font-style` values (300/400/500/700, all `normal`).
- Delete the 4 `@font-face` blocks from `src/global/global.css`. Keep
  `--font-family-main` and the `body { font-family: … }` rule.
- Do NOT `@import` `fonts.css` from `src/global/dda-bundle.css` (see D7); it is appended to
  the built stylesheet by `scripts/emit-font-css.mjs` instead.
- Add `import "../src/global/fonts.css";` to `.storybook/preview.js`, before the
  existing `global.css` import.

### B — build config and guard
- Add a `copy` task to the existing `dist-custom-elements` output target in
  `stencil.config.ts`. That target's copy tasks resolve `dest` against `rootDir`, which is
  the only lever that writes to the `dist/` root:
  ```ts
  copy: [
    { src: 'assets/fonts/dubai/*.woff2', dest: 'dist/assets/fonts/dubai', warn: true },
    { src: 'assets/fonts/dubai/*.woff',  dest: 'dist/assets/fonts/dubai', warn: true },
    { src: 'assets/fonts/dubai/*.ttf',   dest: 'dist/assets/fonts/dubai', warn: true },
  ]
  ```
- Add `scripts/check-dist-assets.mjs` exporting a pure checker plus a thin CLI, and
  `scripts/check-dist-assets.test.mjs` using `node:test`. Assertions:
  1. every `url()` in `dist/dda/dda.css` resolves to a file that exists on disk,
     relative to `dist/dda/`;
  2. `dist/dda/dda.css` contains exactly 4 `@font-face` blocks;
  3. no `.js` under `dist/dda/`, `dist/esm/` or `dist/components/` contains
     `fonts/dubai` (the D3 regression guard).
- Add `check:dist`, `check:dist:test` and `postbuild` npm scripts.

### C — documentation
- `src/storybook/DDA with Web Components.mdx` — state that `dda.css` pulls the Dubai
  fonts from `dist/assets/fonts/dubai/`, and that self-hosters must copy that directory
  alongside the stylesheet.
- `src/components/dda-home-banner/dda-home-banner.mdx` — same note where the CDN `<link>`
  is shown.
- CDN URLs keep the `@X.X.X` placeholder. Never unversioned, never a hardcoded release.

### D — verify (not delegated)
`npm run build`, then confirm: `dist/assets/fonts/dubai/` holds 12 files; `dda.css` has no
`.eot`/`.svg` font URL; no chunk mentions `fonts/dubai`; `check:dist` and
`check:dist:test` pass; `www/` still renders.

## Out of scope
- `font-display: swap` — a real improvement, but a rendering-behaviour change unrelated
  to the 404. Separate change.
- The `src/global/dda.css` vs `dist/dda/dda.css` name collision.
