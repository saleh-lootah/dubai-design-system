# dda-chip



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute            | Description                                                                                                                      | Type                          | Default     |
| -------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------- |
| `bg_color`           | `bg_color`           | Color: `grey`, `primary`, `green`, `yellow`, `red` or `purple`. Other values, including the default, use the base primary style. | `string`                      | `'success'` |
| `clickHandler`       | --                   | Click handler for the close button, set as a JavaScript property. The chip does not remove itself.                               | `(event: MouseEvent) => void` | `undefined` |
| `close_button_label` | `close_button_label` | Accessible name of the icon-only close button.                                                                                   | `string`                      | `'Remove'`  |
| `component_mode`     | `component_mode`     | Theme override class for the chip, e.g. `light-mode`.                                                                            | `string`                      | `undefined` |
| `custom_class`       | `custom_class`       | Extra CSS classes added to the chip container.                                                                                   | `string`                      | `undefined` |
| `icon`               | `icon`               | Material Symbols icon name shown before the label, e.g. `check_circle`.                                                          | `string`                      | `undefined` |
| `rounded`            | `rounded`            | Corner radius: `sm`, `md`, `lg` or `circle`.                                                                                     | `string`                      | `''`        |
| `show_close_icon`    | `show_close_icon`    | Shows a close button after the label. Its accessible name comes from `close_button_label`.                                       | `boolean`                     | `false`     |
| `size`               | `size`               | Height: `sm` (24px), `md` (26px) or `lg` (32px).                                                                                 | `string`                      | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
