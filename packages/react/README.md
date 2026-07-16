<p align="center">
  <a href="#">
    <img alt="dda-logo" src="https://www.digitaldubai.ae/ResourcePackages/Theme/assets/dist/images/logo.svg" width="60">
  </a>
</p>

<h1 align="center">
DDA with React
</h1>

React bindings for the Dubai Design System web components.

## Setup

### 1. Install the package

```bash
npm i @dubai-design-system/components-react
```

### 2. Add the icon fonts

DDA components use Material Icons and Material Symbols. Add both inside the `<head>` tag of your `index.html`:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```

### 3. Use the components

No extra registration step is needed — importing a component automatically registers its custom element:

```jsx
import React from 'react';
import { DdaButton } from '@dubai-design-system/components-react';

const App = () => (
  <div>
    <DdaButton
      button_color="default-primary"
      start_icon="sentiment_satisfied"
      end_icon="arrow_forward"
      button_id="button"
      aria_label="button"
      onClick={() => console.log('clicked')}
    >
      Button
    </DdaButton>
  </div>
);

export default App;
```

## License

[MIT](./LICENSE), Copyright (c) 2018-2026 Digital Dubai. The Digital Dubai name and logo are trademarks of Digital Dubai and are not covered by the MIT license.
