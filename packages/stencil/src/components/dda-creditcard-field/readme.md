# dda-creditcard-field



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute         | Description                                                                                                                                    | Type      | Default       |
| ----------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------- |
| `aria_label`      | `aria_label`      | Accessible name of the input. Use it when there is no visible `label`.                                                                         | `string`  | `undefined`   |
| `autocomplete`    | `autocomplete`    | `autocomplete` token of the input. Defaults to `cc-number`.                                                                                    | `string`  | `'cc-number'` |
| `card_icon`       | `card_icon`       | URL of an image shown at the start of the input, e.g. a card brand logo.                                                                       | `string`  | `undefined`   |
| `component_mode`  | `component_mode`  | Theme override class for the field, e.g. `light-mode`.                                                                                         | `string`  | `undefined`   |
| `custom_class`    | `custom_class`    | Extra CSS classes added to the field container.                                                                                                | `string`  | `''`          |
| `disabled`        | `disabled`        | Disables the input and applies the disabled look.                                                                                              | `boolean` | `false`       |
| `error_message`   | `error_message`   | Error text shown below the input. Also sets `aria-invalid="true"` on the input.                                                                | `string`  | `undefined`   |
| `helper_text`     | `helper_text`     | Helper text shown below the input. Linked by `aria-describedby` when `input_id` is set.                                                        | `string`  | `undefined`   |
| `input_id`        | `input_id`        | `id` of the inner `<input>`. Also used to link the label, helper text and error message.                                                       | `string`  | `undefined`   |
| `input_name`      | `input_name`      | `name` of the inner `<input>`, submitted with its form.                                                                                        | `string`  | `undefined`   |
| `input_type`      | `input_type`      | Adds the class `dda-input-<value>`. `disabled` gives only the disabled look; use `disabled` to disable the input.                              | `string`  | `undefined`   |
| `label`           | `label`           | Label text shown above the input. Linked to the input when `input_id` is set.                                                                  | `string`  | `undefined`   |
| `placeholder`     | `placeholder`     | Placeholder text of the input, e.g. `0000 - 0000 - 0000 - 0000`.                                                                               | `string`  | `undefined`   |
| `restrict_input`  | `restrict_input`  | Sets the input `maxlength`: 25 characters when `false` (16 digits with separators), 100 when `true`.                                           | `boolean` | `false`       |
| `size`            | `size`            | Size: `default` or `small`.                                                                                                                    | `string`  | `undefined`   |
| `validation_type` | `validation_type` | Validation state: `error` applies the error colors.                                                                                            | `string`  | `undefined`   |
| `value`           | `value`           | Card number. Shown as groups of four digits separated by ` - `; the component updates it as the user types. Mutable: the component assigns it. | `string`  | `''`          |


## Events

| Event         | Description                                                                                                                                   | Type                              |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `valueChange` | Emitted when user input changes `value`, after the component removes characters other than digits and `-`. `detail.value` is the new `value`. | `CustomEvent<{ value: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
