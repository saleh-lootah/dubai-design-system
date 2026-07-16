<p align="center">
  <a href="#">
    <img alt="dda-logo" src="https://www.digitaldubai.ae/ResourcePackages/Theme/assets/dist/images/logo.svg" width="60">
  </a>
</p>

<h1 align="center">
DDA with Angular
</h1>

Angular bindings for the Dubai Design System web components.

## Setup

### 1. Install the package

```bash
npm i @dubai-design-system/components-angular
```

### 2. Add the icon fonts

DDA components use Material Icons and Material Symbols. Add both inside the `<head>` tag of `src/index.html`:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```

### 3. Register the custom elements

Register the DDA custom elements once, before bootstrapping, in `src/main.ts` — without this step the components never render:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { defineCustomElements } from '@dubai-design-system/components-js/loader';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

defineCustomElements();

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
```

### 4. Use the components

Add `ComponentLibraryModule` to the `imports` of any standalone component that uses DDA components (or to your NgModule's `imports` array if your app still uses modules):

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

## License

Copyright (c) 2018-2026 Digital Dubai. All rights reserved. An open-source license is under review and will be announced in a future release.
