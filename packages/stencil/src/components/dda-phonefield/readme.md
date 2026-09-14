# dda-phonefield



<!-- Auto Generated Below -->


## Properties

| Property                     | Attribute                    | Description                                                                               | Type      | Default                 |
| ---------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------- | --------- | ----------------------- |
| `aria_label`                 | `aria_label`                 | Accessible name of the phone input. Use it when there is no visible label.                | `string`  | `undefined`             |
| `autocomplete`               | `autocomplete`               | `autocomplete` token of the phone input. Defaults to `tel`.                               | `string`  | `'tel'`                 |
| `button_aria_label`          | `button_aria_label`          | Accessible name set on each country option button in the open list.                       | `string`  | `undefined`             |
| `button_id`                  | `button_id`                  | `id` set on each country option button in the open list.                                  | `string`  | `undefined`             |
| `component_mode`             | `component_mode`             | Theme override class for the field, e.g. `light-mode`.                                    | `string`  | `undefined`             |
| `country_select_button_name` | `country_select_button_name` | `name` of each country option button.                                                     | `string`  | `undefined`             |
| `custom_class`               | `custom_class`               | Extra CSS classes added to the field container.                                           | `string`  | `undefined`             |
| `disabled`                   | `disabled`                   | Disables the phone input and shows the disabled styling.                                  | `boolean` | `false`                 |
| `error_message`              | `error_message`              | Error text shown below the field. When set, the input gets `aria-invalid="true"`.         | `string`  | `undefined`             |
| `helper_text`                | `helper_text`                | Helper text shown below the field. Hidden when `validation_type` is set.                  | `string`  | `undefined`             |
| `input_id`                   | `input_id`                   | `id` of the phone input. Also used for the label `for` and the helper and error text ids. | `string`  | `undefined`             |
| `label`                      | `label`                      | Visible label text, linked to the phone input through `input_id`.                         | `string`  | `undefined`             |
| `phone_input_name`           | `phone_input_name`           | `name` of the phone input, submitted with its form.                                       | `string`  | `undefined`             |
| `placeholder`                | `placeholder`                | Placeholder text of the phone input.                                                      | `string`  | `'Enter phone number'`  |
| `size`                       | `size`                       | Size. `small` shows a smaller field; omit for the default size.                           | `string`  | `undefined`             |
| `toggle_button_label`        | `toggle_button_label`        | Accessible name of the country code dropdown button; the selected code is added after it. | `string`  | `'Choose country code'` |
| `toggle_button_name`         | `toggle_button_name`         | `name` of the country code dropdown button.                                               | `string`  | `undefined`             |
| `validation_type`            | `validation_type`            | Validation style. `error` shows the error colors. Any value hides `helper_text`.          | `string`  | `undefined`             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
