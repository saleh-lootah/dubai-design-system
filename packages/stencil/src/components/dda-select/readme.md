# dda-select



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute                   | Description                                                                                                                                          | Type      | Default     |
| --------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `aria_label`                | `aria_label`                | Accessible name of the trigger button and the option list. The list falls back to `label`.                                                           | `string`  | `undefined` |
| `button_id`                 | `button_id`                 | `id` of the trigger button. Also used to build the ids of the list, helper text and error message, so keep it unique.                                | `string`  | `undefined` |
| `component_mode`            | `component_mode`            | Theme override class for the field, e.g. `light-mode`.                                                                                               | `string`  | `undefined` |
| `custom_class`              | `custom_class`              | Extra CSS classes added to the field container.                                                                                                      | `string`  | `''`        |
| `disabled`                  | `disabled`                  | Disables the select: the list does not open and options cannot be picked.                                                                            | `boolean` | `false`     |
| `error`                     | `error`                     | Validation state. `error` shows the error styling.                                                                                                   | `string`  | `undefined` |
| `error_message`             | `error_message`             | Error text shown under the field. Also sets `aria-invalid` on the trigger.                                                                           | `string`  | `undefined` |
| `helper_text`               | `helper_text`               | Helper text shown under the field.                                                                                                                   | `string`  | `undefined` |
| `label`                     | `label`                     | Label shown above the field and linked to the trigger button.                                                                                        | `string`  | `undefined` |
| `option_select_button_name` | `option_select_button_name` | `name` of each option button in the list.                                                                                                            | `string`  | `undefined` |
| `options`                   | `options`                   | Options as a JSON array string, e.g. `'["Dubai","Abu Dhabi","Sharjah"]'`. Invalid JSON shows "No options available".                                 | `string`  | `undefined` |
| `selected`                  | `selected`                  | The selected option. Must match an entry in `options`. The trigger shows "Select an option" when it is empty. Updated when the user picks an option. | `string`  | `undefined` |
| `size`                      | `size`                      | Field size. `small` gives the compact field; leave empty for the default size.                                                                       | `string`  | `undefined` |
| `toggle_button_name`        | `toggle_button_name`        | `name` of the trigger button.                                                                                                                        | `string`  | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
