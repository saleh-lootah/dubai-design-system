<p align="center">
  <a href="#">
    <img alt="dda-logo" src="https://www.digitaldubai.ae/ResourcePackages/Theme/assets/dist/images/logo.svg" width="60">
  </a>
</p>

This package provides web components built using StencilJS as part of the Dubai Design System (DDA), ensuring consistency, reusability, and performance across modern web applications. These components are framework-agnostic and can be used in custom websites without dependency on React, Angular, or Vue.

#### Key Features

Lightweight & Fast: Uses native Web Components for optimal performance.

Customizable: Designed to align with Dubai Design System branding.

Framework-Agnostic: Works with any HTML, JavaScript, or TypeScript-based project.

Accessible & Scalable: Follows best practices for accessibility and responsive design.

#### Usage

1. Include the Web Components Library

Next, add the two icon fonts used by DDA (Material Icons and Material Symbols) inside the
`<head>` tag:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```

Add the following script to your HTML to load the library:

```html
<script type="module">
  import { defineCustomElements } from "https://cdn.jsdelivr.net/npm/@dubai-design-system/components-js/loader/index.es2017.js";

  defineCustomElements();
</script>
```

#### Using with a bundler (Vite, Rollup)

> ⚠️ When installing from npm and building with Vite (or plain Rollup), do **not** use the
> lazy loader (`@dubai-design-system/components-js/loader`). Its computed dynamic imports
> cannot be statically analyzed by these bundlers, so component chunks are missing from the
> build (404 on `dda-*.entry.js`) and components never render.

Import the self-registering custom-elements build for each component you use instead:

```js
// each import automatically defines its custom element
import '@dubai-design-system/components-js/dist/components/dda-button.js';
```

The CDN `<script>` approach above is unaffected. Angular's builder also handles the lazy
loader correctly — this only concerns Vite/Rollup bundling.

#### Add DDA Components in Your HTML

Now you can use DDA components directly in your HTML files:

```jsx
<dda-button
        button_color="default-primary"
        start_icon="sentiment_satisfied"
        end_icon="arrow_forward"
        custom_class=""
        component_mode=""
        button_id="button"
        aria_label="button"
        onclick="console.log('clicked')"
>Button</dda-button>
```

#### Available Components

<dda-button> - Customizable button component

<dda-dropdown> - Dropdown component with various options

<dda-modal> - Accessible modal dialog

<dda-card> - Card layout with structured content

And more...
