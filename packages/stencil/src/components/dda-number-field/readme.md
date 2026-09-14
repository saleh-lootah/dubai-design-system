# dda-number-field



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute              | Description                                                                                                | Type     | Default             |
| ---------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------- | -------- | ------------------- |
| `aria_label`           | `aria_label`           | Accessible name of the amount input. Use it when there is no visible label.                                | `string` | `undefined`         |
| `component_mode`       | `component_mode`       | Theme override class for the field, e.g. `light-mode`.                                                     | `string` | `undefined`         |
| `currencies`           | `currencies`           | Currency options for the dropdown, as a JSON array string, e.g. `'["AED","USD"]'`.                         | `string` | `undefined`         |
| `currency_button_name` | `currency_button_name` | `name` of each currency option button.                                                                     | `string` | `undefined`         |
| `custom_class`         | `custom_class`         | Extra CSS classes added to the field container.                                                            | `string` | `''`                |
| `error_message`        | `error_message`        | Error text shown below the field. When set, the input gets `aria-invalid="true"`.                          | `string` | `undefined`         |
| `helper_text`          | `helper_text`          | Helper text shown below the field and linked with `aria-describedby`.                                      | `string` | `undefined`         |
| `input_id`             | `input_id`             | `id` of the amount input. Also used for the label `for` and the helper and error text ids.                 | `string` | `undefined`         |
| `input_name`           | `input_name`           | `name` of the amount input, submitted with its form.                                                       | `string` | `undefined`         |
| `input_status`         | `input_status`         | Status style. `disabled` shows the disabled styling only; it does not set the native `disabled` attribute. | `string` | `undefined`         |
| `label`                | `label`                | Visible label text, linked to the amount input through `input_id`.                                         | `string` | `undefined`         |
| `placeholder`          | `placeholder`          | Placeholder text of the amount input.                                                                      | `string` | `undefined`         |
| `selected_currency`    | `selected_currency`    | Currency shown on the dropdown button. Updates when the user picks a currency.                             | `string` | `'USD'`             |
| `size`                 | `size`                 | Size. `small` shows a smaller field; omit for the default size.                                            | `string` | `undefined`         |
| `toggle_button_label`  | `toggle_button_label`  | Accessible name of the currency dropdown button; the selected currency is added after it.                  | `string` | `'Choose currency'` |
| `toggle_button_name`   | `toggle_button_name`   | `name` of the currency dropdown button.                                                                    | `string` | `undefined`         |
| `validation_type`      | `validation_type`      | Validation style. `error` shows the error colors.                                                          | `string` | `undefined`         |
| `value`                | `value`                | Initial value of the amount input. Characters other than digits and `.` are removed as the user types.     | `string` | `undefined`         |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
