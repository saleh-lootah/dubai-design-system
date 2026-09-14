# dda-dropdown



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute              | Description                                                                                                                                                                            | Type                             | Default          |
| ---------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------- |
| `aria_label`           | `aria_label`           | Accessible name of the dropdown button. Set it when `icon_mode` is on.                                                                                                                 | `string`                         | `undefined`      |
| `arrow_button_name`    | `arrow_button_name`    | `name` of the dropdown button that opens the list.                                                                                                                                     | `string`                         | `undefined`      |
| `button_id`            | `button_id`            | `id` of the dropdown button. The label id is built from it. When it is not set, the component generates a unique id.                                                                   | `string`                         | `undefined`      |
| `component_mode`       | `component_mode`       | Theme override class for the dropdown, e.g. `light-mode`.                                                                                                                              | `string`                         | `undefined`      |
| `custom_class`         | `custom_class`         | Extra CSS classes added to the dropdown container.                                                                                                                                     | `string`                         | `''`             |
| `disabled`             | `disabled`             | Disables the dropdown: the list does not open and options cannot be picked.                                                                                                            | `boolean`                        | `false`          |
| `dropdown_button_name` | `dropdown_button_name` | `name` of each option button in the list.                                                                                                                                              | `string`                         | `undefined`      |
| `error`                | `error`                | Error text shown under the dropdown.                                                                                                                                                   | `string`                         | `undefined`      |
| `helper_text`          | `helper_text`          | Helper text shown under the dropdown.                                                                                                                                                  | `string`                         | `undefined`      |
| `icon_mode`            | `icon_mode`            | Shows only the three-dots icon, without the selected text and arrow.                                                                                                                   | `boolean`                        | `false`          |
| `label`                | `label`                | Label shown above the dropdown. The dropdown button is named by the label and its current text.                                                                                        | `string`                         | `undefined`      |
| `options`              | `options`              | Options as a JSON array string, e.g. `'["Edit","Download","Delete"]'`. Invalid JSON shows "No options available".                                                                      | `string`                         | `undefined`      |
| `selected`             | `selected`             | The selected option. Must match an entry in `options`. The button shows "Select an option" when it is empty. Updated when the user picks an option. Mutable: the component assigns it. | `string`                         | `undefined`      |
| `size`                 | `size`                 | Size: `medium` or `small`.                                                                                                                                                             | `"medium" \| "small"`            | `'medium'`       |
| `toggle_button_label`  | `toggle_button_label`  | Accessible name of the dropdown button in `icon_mode` when `aria_label` and `label` are not set.                                                                                       | `string`                         | `'Show options'` |
| `type`                 | `type`                 | Button background: `bg-white` (field style) or `bg-transparent` (no border, background or padding).                                                                                    | `"bg-transparent" \| "bg-white"` | `'bg-white'`     |


## Events

| Event          | Description                                                                                                                                           | Type                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `optionSelect` | Emitted every time the user picks an option, also when it is already selected, so the dropdown works as an action menu. `detail.value` is the option. | `CustomEvent<{ value: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
