# dda-alert



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute        | Description                                                                                                                            | Type                                          | Default     |
| ---------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------- |
| `button_name`    | `button_name`    | `name` of the close button.                                                                                                            | `string`                                      | `undefined` |
| `button_text`    | `button_text`    | Not used by the component; nothing is rendered from this value.                                                                        | `string`                                      | `''`        |
| `clickHandler`   | --               | Click handler for the close button, set as a JavaScript property. The alert does not hide itself.                                      | `(event: MouseEvent) => void`                 | `undefined` |
| `component_id`   | `component_id`   | Not used by the component; it is not applied to any element.                                                                           | `string`                                      | `undefined` |
| `component_mode` | `component_mode` | Theme override class for the alert, e.g. `light-mode`.                                                                                 | `string`                                      | `undefined` |
| `custom_class`   | `custom_class`   | Extra CSS classes added to the alert container.                                                                                        | `string`                                      | `''`        |
| `description`    | `description`    | Body text shown below the heading.                                                                                                     | `string`                                      | `''`        |
| `first_button`   | `first_button`   | Label of the first action link. The link shows only when this is set.                                                                  | `string`                                      | `undefined` |
| `first_link`     | `first_link`     | `href` of the first action link.                                                                                                       | `string`                                      | `undefined` |
| `second_button`  | `second_button`  | Label of the second action link. The link shows only when this is set.                                                                 | `string`                                      | `undefined` |
| `second_link`    | `second_link`    | `href` of the second action link.                                                                                                      | `string`                                      | `undefined` |
| `title_text`     | `title_text`     | Heading text of the alert.                                                                                                             | `string`                                      | `''`        |
| `type`           | `type`           | Style: `primary` uses a tinted background and border in the variation color; `secondary` uses a neutral surface and border.            | `"primary" \| "secondary"`                    | `'primary'` |
| `variation`      | `variation`      | Color and screen reader urgency: `info`, `warning`, `error` or `success`. `error` uses `role="alert"`; the others use `role="status"`. | `"error" \| "info" \| "success" \| "warning"` | `'info'`    |


## Events

| Event         | Description                                              | Type                |
| ------------- | -------------------------------------------------------- | ------------------- |
| `firstClick`  | Fires when the first action link is clicked. No detail.  | `CustomEvent<void>` |
| `secondClick` | Fires when the second action link is clicked. No detail. | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
