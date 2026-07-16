<p align="center">
  <a href="#">
    <img alt="dda-logo" src="https://www.digitaldubai.ae/ResourcePackages/Theme/assets/dist/images/logo.svg" width="60">
  </a>
</p>

<h1 align="center">
Dubai Design System — Web Components
</h1>

Framework-agnostic web components built with StencilJS as part of the Dubai Design System (DDA). Use them in any HTML, JavaScript, or TypeScript project — no dependency on React, Angular, or Vue.

Framework wrappers are also available: [`@dubai-design-system/components-react`](https://www.npmjs.com/package/@dubai-design-system/components-react), [`@dubai-design-system/components-vue`](https://www.npmjs.com/package/@dubai-design-system/components-vue), and [`@dubai-design-system/components-angular`](https://www.npmjs.com/package/@dubai-design-system/components-angular).

#### Key features

- **Lightweight & fast** — native Web Components with lazy loading.
- **Customizable** — aligned with Dubai Design System branding, with light and dark themes.
- **Framework-agnostic** — works in plain HTML or with any framework.
- **Accessible & responsive** — follows accessibility best practices.

## Setup

### 1. Add the icon fonts

DDA components use Material Icons and Material Symbols. Add both inside your `<head>` tag:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```

### 2. Load the components

**Option A — CDN (no build step).** Add this script to your HTML, replacing `X.X.X` with the [latest published version](https://www.npmjs.com/package/@dubai-design-system/components-js). **Always pin an exact version in the CDN URL** — unversioned jsdelivr URLs resolve each file independently, so the loader and its chunks can come from different package versions, which breaks rendering:

```html
<script type="module">
  import { defineCustomElements } from "https://cdn.jsdelivr.net/npm/@dubai-design-system/components-js@X.X.X/loader/index.es2017.js";

  defineCustomElements();
</script>
```

**Option B — npm with a bundler (Vite, Rollup).** Install the package:

```bash
npm i @dubai-design-system/components-js
```

Then import the self-registering build for each component you use:

```js
// each import automatically defines its custom element
import '@dubai-design-system/components-js/dist/components/dda-button.js';
import '@dubai-design-system/components-js/dist/components/dda-header.js';
```

> ⚠️ With Vite or plain Rollup, do **not** use the lazy loader (`@dubai-design-system/components-js/loader`). Its computed dynamic imports cannot be statically analyzed by these bundlers, so component chunks are missing from the build (404 on `dda-*.entry.js`) and components never render. The CDN approach and Angular's builder are unaffected.

### 3. Use the components

```html
<dda-button
  button_color="default-primary"
  start_icon="sentiment_satisfied"
  end_icon="arrow_forward"
  button_id="button"
  aria_label="button"
  onclick="console.log('clicked')"
>Button</dda-button>
```

## Available components

`dda-button`, `dda-dropdown`, `dda-modal`, `dda-card`, `dda-header`, and more.

## License

Copyright (c) 2018-2026 Digital Dubai. All rights reserved. An open-source license is under review and will be announced in a future release.
