# dda-button



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute           | Description                              | Type                          | Default     |
| ------------------- | ------------------- | ---------------------------------------- | ----------------------------- | ----------- |
| `aria_label`        | `aria_label`        |                                          | `string`                      | `''`        |
| `button_color`      | `button_color`      |                                          | `string`                      | `'primary'` |
| `button_id`         | `button_id`         |                                          | `string`                      | `undefined` |
| `button_name`       | `button_name`       |                                          | `string`                      | `''`        |
| `button_shape`      | `button_shape`      |                                          | `string`                      | `''`        |
| `clickHandler`      | --                  | Function to be called on button click    | `(event: MouseEvent) => void` | `undefined` |
| `component_mode`    | `component_mode`    |                                          | `string`                      | `undefined` |
| `custom_class`      | `custom_class`      |                                          | `string`                      | `''`        |
| `disabled`          | `disabled`          | Disable the button                       | `boolean`                     | `false`     |
| `end_icon`          | `end_icon`          |                                          | `string`                      | `''`        |
| `gap`               | `gap`               |                                          | `number`                      | `undefined` |
| `icon_button_shape` | `icon_button_shape` |                                          | `string`                      | `''`        |
| `size`              | `size`              |                                          | `string`                      | `undefined` |
| `start_icon`        | `start_icon`        | Icon class for the starting icon         | `string`                      | `''`        |
| `type`              | `type`              | Type of button, e.g., "button", "submit" | `string`                      | `'button'`  |


## Dependencies

### Used by

 - [dda-footer](../dda-footer)
 - [dda-header](../dda-header)

### Graph
```mermaid
graph TD;
  dda-footer --> dda-button
  dda-header --> dda-button
  style dda-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
