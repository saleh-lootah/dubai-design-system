# DDA npm package smoke tests

Standalone sample sites that install the published `@dubai-design-system/*`
packages from the npm registry (NOT workspace links) and verify a component
actually renders in a headless browser.

| Sample     | Package                                  | Build          |
| ---------- | ----------------------------------------- | -------------- |
| `js/`      | `@dubai-design-system/components-js`      | Vite (vanilla) |
| `react/`   | `@dubai-design-system/components-react`   | Vite + React   |
| `vue/`     | `@dubai-design-system/components-vue`     | Vite + Vue     |
| `angular/` | `@dubai-design-system/components-angular` | Angular CLI 19 |

## Run everything

```bash
bash samples/verify-all.sh
```

## Run one sample

```bash
(cd samples/harness && npm ci)   # first time only
cd samples/react && npm ci && npm run build
node ../harness/verify.mjs dist
```

The harness (`harness/verify.mjs`) serves a build directory and asserts the
selector `dda-button.hydrated button` appears — i.e. Stencil loaded, upgraded
the element, and rendered its inner markup.

## Integration notes (learned from these samples)

- **Vite cannot bundle the Stencil lazy loader.** `defineCustomElements()` from
  `@dubai-design-system/components-js/loader` — and the Vue package's documented
  `app.use(ComponentLibrary)`, which calls it — fail under Vite: the loader's
  computed dynamic imports are not statically analyzable, so component entry
  chunks are missing from the build (404 on `dda-button.entry.js`). In Vite
  apps, import the auto-defining custom-elements build instead:
  `import '@dubai-design-system/components-js/dist/components/dda-button.js'`.
  The `js/` and `vue/` samples do this.
- **The React package needs no manual registration** — its generated proxies
  self-register their custom elements.
- **Angular's esbuild builder handles the lazy loader fine** — the `angular/`
  sample registers via `defineCustomElements()` in `main.ts`.
- **`components-angular` requires >= 3.12.13** — 3.12.12 and earlier shipped
  broken package entry points and cannot be imported at all.

These samples pin exact published versions — `angular/` pins `3.12.13`, the
others pin `3.12.12`. After releasing a new version, bump the pins and
re-run.
