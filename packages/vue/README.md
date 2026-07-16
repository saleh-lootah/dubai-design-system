<p align="center">
  <a href="#">
    <img alt="dda-logo" src="https://www.digitaldubai.ae/ResourcePackages/Theme/assets/dist/images/logo.svg" width="60">
  </a>
</p>

<h1 align="center">
DDA with Vue
</h1>

Vue 3 bindings for the [Dubai Design System](https://saleh-lootah.github.io/dubai-design-system/) web components.

📖 **Full documentation, live examples, and the complete component list:** https://saleh-lootah.github.io/dubai-design-system/

## Setup

### 1. Install the package

```bash
npm i @dubai-design-system/components-vue
```

### 2. Add the icon fonts

DDA components use Material Icons and Material Symbols. Add both inside the `<head>` tag of your `index.html`:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```

### 3. Register the custom elements

**Vite (the default Vue tooling):** in `src/main.js`, import the self-registering build for each DDA component you use. Add `@dubai-design-system/components-js` to your dependencies so the import resolves in every package manager:

```js
// src/main.js
import { createApp } from 'vue';
// each import automatically defines its custom element
import '@dubai-design-system/components-js/dist/components/dda-button.js';
import App from './App.vue';

createApp(App).mount('#app');
```

> ⚠️ Under Vite, do **not** use the `ComponentLibrary` plugin below. It relies on the Stencil lazy loader, whose computed dynamic imports Vite cannot statically analyze — component chunks end up missing from the build (404 on `dda-*.entry.js`) and components never render.

**Webpack-based setups (e.g. Vue CLI):** register everything at once with the plugin:

```js
// src/main.js
import { createApp } from 'vue';
import { ComponentLibrary } from '@dubai-design-system/components-vue';
import App from './App.vue';

createApp(App).use(ComponentLibrary).mount('#app');
```

### 4. Use the components

The Vue wrappers give you typed components and native Vue event binding:

```vue
<script setup>
import { DdaButton } from '@dubai-design-system/components-vue';
</script>

<template>
  <DdaButton
    button_color="default-primary"
    start_icon="sentiment_satisfied"
    end_icon="arrow_forward"
    button_id="button"
    aria_label="button"
    @click="console.log('clicked')"
  >Button</DdaButton>
</template>
```
