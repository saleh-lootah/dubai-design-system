<p align="center">
  <a href="#">
    <img alt="dda-logo" src="https://www.digitaldubai.ae/ResourcePackages/Theme/assets/dist/images/logo.svg" width="60">
  </a>
</p>

<h1 align="center">
DDA with Vue
</h1>

This is a step-by-step guide to use the DDA components in Vue.

#### Setup

First, install the package:

```jsx
npm i @dubai-design-system/components-vue
```

Next, add the material-icons package which is the icon package used by DDA:

Start by adding the material-icons package inside the `<head>` tag

```jsx
<style>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</style>
```
In your main.js file, import your component library plugin and use it:

```jsx
<script>
 // src/main.js
import { ComponentLibrary } from '@dubai-design-system/components-vue';

createApp(App).use(ComponentLibrary).mount('#app');

</script>
```

> ⚠️ **Vite users:** `app.use(ComponentLibrary)` relies on the Stencil lazy loader, which
> does not work under Vite — its computed dynamic imports cannot be statically analyzed,
> so component chunks are missing from the build (404 on `dda-*.entry.js`) and components
> never hydrate. In Vite apps, skip the plugin and register the elements you use via the
> self-registering custom-elements build (add `@dubai-design-system/components-js` to your
> dependencies); the Vue component wrappers work unchanged:

```jsx
<script>
 // src/main.js (Vite)
import { createApp } from 'vue';
// each import automatically defines its custom element
import '@dubai-design-system/components-js/dist/components/dda-button.js';
import App from './App.vue';

createApp(App).mount('#app');

</script>
```

You should now be able to use DDA components:

```jsx

<script>
    import { DdaButton } from '@dubai-design-system/components-vue';
</script>

<template>
    <div>
        <DdaButton
            button_color="default-primary"
            start_icon="sentiment_satisfied"
            end_icon="arrow_forward"
            custom_class=""
            component_mode=""
            button_id="button"
            aria_label="button"
            onclick="console.log('clicked')"
        >Button</DdaButton>
    </div>
</template>
```
