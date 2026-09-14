# dda-tabs



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute        | Description                                                                                                                 | Type                                                                                        | Default                                                                   |
| ---------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `aria_label`     | `aria_label`     | Accessible name for the tab group (`aria-label` on the `role="group"` container).                                           | `string`                                                                                    | `undefined`                                                               |
| `border_bottom`  | `border_bottom`  | Not used by the component; it has no effect.                                                                                | `boolean`                                                                                   | `false`                                                                   |
| `button_id`      | `button_id`      | `id` set on every tab button.                                                                                               | `string`                                                                                    | `undefined`                                                               |
| `button_name`    | `button_name`    | `name` set on every tab button.                                                                                             | `string`                                                                                    | `undefined`                                                               |
| `component_mode` | `component_mode` | Theme override class on the tab group, e.g. `light-mode`.                                                                   | `string`                                                                                    | `undefined`                                                               |
| `custom_class`   | `custom_class`   | Extra CSS classes added to the tab group.                                                                                   | `string`                                                                                    | `''`                                                                      |
| `hover_style`    | `hover_style`    | Style of the active and hovered tab: `dda-tab-default`, `dda-tab-filed`, `dda-tab-underline` or `dda-tab-underline-filled`. | `"dda-tab-default" \| "dda-tab-filed" \| "dda-tab-underline" \| "dda-tab-underline-filled"` | `'dda-tab-default'`                                                       |
| `tab_icons`      | `tab_icons`      | Material Icons names, one per tab in the same order, as a JSON string array. Shown when `type` is `text-icon`.              | `string`                                                                                    | `'["sentiment_satisfied", "sentiment_satisfied", "sentiment_satisfied"]'` |
| `tab_texts`      | `tab_texts`      | Tab labels, as a JSON string array, e.g. `'["Details", "Documents"]'`.                                                      | `string`                                                                                    | `'["Tab 1", "Tab 2", "Tab 3"]'`                                           |
| `type`           | `type`           | Tab content: `text` (label only) or `text-icon` (icon from `tab_icons` before the label).                                   | `"text" \| "text-icon"`                                                                     | `'text'`                                                                  |


## Events

| Event      | Description                                                          | Type                |
| ---------- | -------------------------------------------------------------------- | ------------------- |
| `tabClick` | Fires when the user clicks a tab. `detail` is the tab index, from 0. | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
