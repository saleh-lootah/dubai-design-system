# dda-search-input



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute            | Description                                                                                                | Type      | Default          |
| -------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------- | --------- | ---------------- |
| `aria_label`         | `aria_label`         | Accessible name of the search input. Use it when there is no visible label.                                | `string`  | `undefined`      |
| `button_aria_label`  | `button_aria_label`  | Accessible name of the clear button, e.g. `Clear search`.                                                  | `string`  | `undefined`      |
| `button_id`          | `button_id`          | `id` of the clear button.                                                                                  | `string`  | `undefined`      |
| `clear_button_label` | `clear_button_label` | Accessible name of the clear button. `button_aria_label` wins when set.                                    | `string`  | `'Clear search'` |
| `close_button_name`  | `close_button_name`  | `name` of the clear button.                                                                                | `string`  | `undefined`      |
| `component_mode`     | `component_mode`     | Theme override class for the field, e.g. `light-mode`.                                                     | `string`  | `undefined`      |
| `custom_class`       | `custom_class`       | Extra CSS classes added to the field container.                                                            | `string`  | `''`             |
| `error_message`      | `error_message`      | Error text shown below the field. When set, the input gets `aria-invalid="true"`.                          | `string`  | `undefined`      |
| `has_error`          | `has_error`          | Shows the error colors.                                                                                    | `boolean` | `false`          |
| `helper_text`        | `helper_text`        | Helper text shown below the field and linked with `aria-describedby`.                                      | `string`  | `undefined`      |
| `input_id`           | `input_id`           | `id` of the search input. Also used for the label `for` and the helper and error text ids.                 | `string`  | `undefined`      |
| `input_status`       | `input_status`       | Status style. `disabled` shows the disabled styling only; it does not set the native `disabled` attribute. | `string`  | `undefined`      |
| `label`              | `label`              | Visible label text, linked to the search input through `input_id`.                                         | `string`  | `undefined`      |
| `placeholder`        | `placeholder`        | Placeholder text of the search input.                                                                      | `string`  | `'Search'`       |
| `search_button_name` | `search_button_name` | `name` of the "Search" button.                                                                             | `string`  | `undefined`      |
| `search_input_name`  | `search_input_name`  | `name` of the search input, submitted with its form.                                                       | `string`  | `undefined`      |
| `show_button`        | `show_button`        | Shows a "Search" button after the clear button.                                                            | `boolean` | `false`          |
| `size`               | `size`               | Size. `small` shows a smaller field; other values show the default size.                                   | `string`  | `'sm'`           |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
