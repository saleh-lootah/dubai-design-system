<p align="center">
  <a href="#">
    <img alt="dda-logo" src="https://www.digitaldubai.ae/ResourcePackages/Theme/assets/dist/images/logo.svg" width="60">
  </a>
</p>

<h1 align="center">
DDA with Angular
</h1>

This is a step-by-step guide to use the DDA components in Angular.

#### Setup

First, install the package:

```jsx

npm i @dubai-design-system/components-angular

```

Next, add the material-icons package which is the icon package used by DDA:

Start by adding the material-icons package inside the `<head>` tag

```jsx
<style>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</style>
```

Import and add the following to your `app.module.ts` file

```jsx

import { ComponentLibraryModule } from '@dubai-design-system/components-angular';

@NgModule({
  imports: [ComponentLibraryModule],
})
export class AppModule {}

```

You should now be able to use DDA components inside your `app.component.html` file:

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
