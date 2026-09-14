# dda-avatar



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute             | Description                                                                                                                                           | Type                                                               | Default            |
| --------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------ |
| `aria_label`          | `aria_label`          | Accessible name of the avatar button and of each option button. The avatar button falls back to `Avatar options`.                                     | `string`                                                           | `undefined`        |
| `button_id`           | `button_id`           | `id` applied to each option button in the dropdown.                                                                                                   | `string`                                                           | `undefined`        |
| `button_name`         | `button_name`         | `name` of each option button in the dropdown. Also added as a CSS class on the avatar container.                                                      | `string`                                                           | `undefined`        |
| `component_mode`      | `component_mode`      | Theme override class for the avatar, e.g. `light-mode`.                                                                                               | `string`                                                           | `undefined`        |
| `custom_class`        | `custom_class`        | Extra CSS classes added to the avatar container.                                                                                                      | `string`                                                           | `''`               |
| `design`              | `design`              | Badge: `default` (none), `status` (green dot), `verified` (check badge), `notification` (count from `notification_number`). `story` has no style yet. | `"default" \| "notification" \| "status" \| "story" \| "verified"` | `'default'`        |
| `icon`                | `icon`                | CSS class of the icon font used when `type` is `icon`, e.g. `material-icons`. The icon glyph is always `sentiment_satisfied`.                         | `string`                                                           | `'material-icons'` |
| `notification_number` | `notification_number` | Count shown in the badge when `design` is `notification`. Hidden at sizes `xs` and `sm`.                                                              | `number`                                                           | `0`                |
| `options`             | `options`             | Dropdown options as a JSON array of strings, e.g. `["Profile","Sign out"]`. When set, the avatar becomes a button that opens the list.                | `string`                                                           | `undefined`        |
| `rounded`             | `rounded`             | Shape: `circle` or `square` (rounded corners).                                                                                                        | `"circle" \| "square"`                                             | `'circle'`         |
| `selected`            | `selected`            | The selected option. Matches one entry of `options`; updated when the user picks an option. Mutable: the component assigns it.                        | `string`                                                           | `undefined`        |
| `size`                | `size`                | Size: `xs` (24px), `sm` (32px), `md` (40px), `lg` (48px), `xl` (56px) or `xxl` (64px).                                                                | `"lg" \| "md" \| "sm" \| "xl" \| "xs" \| "xxl"`                    | `'md'`             |
| `src`                 | `src`                 | Image URL shown when `type` is `photo`.                                                                                                               | `string`                                                           | `''`               |
| `text`                | `text`                | Initials shown when `type` is `text`.                                                                                                                 | `string`                                                           | `'AB'`             |
| `type`                | `type`                | Content: `photo` shows the `src` image, `icon` shows a smiley icon, `text` shows `text` as initials.                                                  | `"icon" \| "photo" \| "text"`                                      | `'photo'`          |


## Events

| Event          | Description                                                                                                                    | Type                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| `optionSelect` | Emitted every time the user picks an option from the dropdown, also when it is already selected. `detail.value` is the option. | `CustomEvent<{ value: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
