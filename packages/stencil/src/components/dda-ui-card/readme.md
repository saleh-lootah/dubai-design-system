# dda-ui-card



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute       | Description                                                                                                             | Type                    | Default           |
| --------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------- | ----------------- |
| `heading_level` | `heading_level` | Heading level (1–6) of the title; pick the level that fits the page outline.                                            | `number`                | `3`               |
| `icon`          | `icon`          | Material Icons name shown at the top of the card, e.g. `description`.                                                   | `string`                | `''`              |
| `image`         | `image`         | URL of an image shown at the top of the card. Its alt text is `maintitle`.                                              | `string`                | `''`              |
| `link`          | `link`          | URL of the card link. The link shows only when this is set.                                                             | `string`                | `''`              |
| `linkicon`      | `linkicon`      | Material Icons name shown after the link text. Set it to an empty string to hide the icon.                              | `string`                | `'arrow_forward'` |
| `linktext`      | `linktext`      | Text of the card link.                                                                                                  | `string`                | `''`              |
| `maintitle`     | `maintitle`     | Card title, rendered as a heading at `heading_level`.                                                                   | `string`                | `''`              |
| `subtitle`      | `subtitle`      | Muted text shown below the title.                                                                                       | `string`                | `''`              |
| `type`          | `type`          | `default` renders the icon, image, title, subtitle and link from props before the slot; `custom` renders only the slot. | `"custom" \| "default"` | `'default'`       |


## Events

| Event       | Description                                                                                                                                     | Type                      |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `linkClick` | Emitted when the user clicks the card link. `detail` is the original click `MouseEvent`; call `detail.preventDefault()` to stop the navigation. | `CustomEvent<MouseEvent>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
