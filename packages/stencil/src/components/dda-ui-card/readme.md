# dda-ui-card



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                                                                                             | Type                    | Default           |
| ----------- | ----------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------- | ----------------- |
| `icon`      | `icon`      | Material Icons name shown at the top of the card, e.g. `description`.                                                   | `string`                | `''`              |
| `image`     | `image`     | URL of an image shown at the top of the card. Its alt text is `maintitle`.                                              | `string`                | `''`              |
| `link`      | `link`      | URL of the card link. The link shows only when this is set.                                                             | `string`                | `''`              |
| `linkicon`  | `linkicon`  | Material Icons name shown after the link text. Set it to an empty string to hide the icon.                              | `string`                | `'arrow_forward'` |
| `linktext`  | `linktext`  | Text of the card link.                                                                                                  | `string`                | `''`              |
| `maintitle` | `maintitle` | Card title, rendered as an `<h1>`.                                                                                      | `string`                | `''`              |
| `subtitle`  | `subtitle`  | Muted text shown below the title.                                                                                       | `string`                | `''`              |
| `type`      | `type`      | `default` renders the icon, image, title, subtitle and link from props before the slot; `custom` renders only the slot. | `"custom" \| "default"` | `'default'`       |


## Events

| Event       | Description                                                                                                 | Type                |
| ----------- | ----------------------------------------------------------------------------------------------------------- | ------------------- |
| `linkClick` | Declared but never emitted by the current version. Listen for the native `click` event on the link instead. | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
