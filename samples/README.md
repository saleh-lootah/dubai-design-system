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

These samples pin exact published versions. All of them, and `js-demo/`, pin
`5.3.5`. After you release a new version, bump the pins and run the samples again.

## The demo site in two languages

`js-demo/` is a sample government site in English and Arabic. Each page exists in both:
English at `/<page>.html`, Arabic at `/ar/<page>.html`, with `<html lang="ar" dir="rtl">` and
`hreflang` links between the two. The header's language button opens the same page in the
other language, query string included.

- Page text is in the HTML, translated per page. Text that scripts write (menus, service data,
  form errors, counts) comes from message tables in each script, through `createT()` in
  `js-demo/i18n.js`. Numbers, fees and plurals use `Intl` with `en-AE` or `ar-AE`; Arabic has
  six plural forms, so counted text gives each one.
- Components show some English text of their own (button labels, announcements). On Arabic
  pages, `js-demo/component-labels.js` sets those props in Arabic.
- `style.css` uses logical properties (`margin-inline-start`, `inset-inline-end`), so it
  mirrors in RTL without separate rules.
- Arrow icons do not mirror by themselves: Arabic pages use `arrow_back` where English pages
  use `arrow_forward` (`end_icon`, and the card link icon in `component-labels.js`). The
  breadcrumb chevron is already mirrored by the library; do not flip it again.
- Search ignores case and Arabic spelling variants (hamza on alef, ta marbuta, short vowels).
  The service form accepts Arabic-Indic digits in number fields.

To add a page, write it in English, copy it to `ar/` with the text translated, add both to
`PAGES` in `vite.config.js`, and add the `hreflang` links to both.
