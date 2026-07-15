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

Next, add the two icon fonts used by DDA (Material Icons and Material Symbols) inside the
`<head>` tag of `src/index.html`:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```

Register the DDA custom elements once, before bootstrapping, in `src/main.ts` — without
this step the components never render:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { defineCustomElements } from '@dubai-design-system/components-js/loader';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

defineCustomElements();

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
```

Then add `ComponentLibraryModule` to the `imports` of any standalone component that uses
DDA components (or to your NgModule's `imports` array if your app still uses modules):

```ts
import { Component } from '@angular/core';
import { ComponentLibraryModule } from '@dubai-design-system/components-angular';

@Component({
  selector: 'app-root',
  imports: [ComponentLibraryModule],
  template: `
    <dda-button
      button_color="default-primary"
      start_icon="sentiment_satisfied"
      end_icon="arrow_forward"
      button_id="button"
      aria_label="button">
      Button
    </dda-button>
  `,
})
export class AppComponent {}
```
