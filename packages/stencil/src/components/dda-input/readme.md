# dda-input



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute         | Description                                                                                                                                                             | Type     | Default     |
| ----------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `aria_label`      | `aria_label`      | Accessible name of the inner `<input>`. Use it when there is no visible label.                                                                                          | `string` | `undefined` |
| `component_mode`  | `component_mode`  | Theme override class for the field, e.g. `light-mode`.                                                                                                                  | `string` | `undefined` |
| `custom_class`    | `custom_class`    | Extra CSS classes added to the field container.                                                                                                                         | `string` | `undefined` |
| `error_message`   | `error_message`   | Error text shown below the input. When set, the input gets `aria-invalid="true"`.                                                                                       | `string` | `undefined` |
| `helper_text`     | `helper_text`     | Helper text shown below the input and linked with `aria-describedby`.                                                                                                   | `string` | `undefined` |
| `input_id`        | `input_id`        | `id` of the inner `<input>`. Also used for the label `for` and the helper and error text ids. Optional: an id is generated when it is not set.                          | `string` | `undefined` |
| `input_name`      | `input_name`      | `name` of the inner `<input>`, submitted with its form.                                                                                                                 | `string` | `undefined` |
| `input_status`    | `input_status`    | Status style. `disabled` shows the disabled styling only; it does not set the native `disabled` attribute.                                                              | `string` | `undefined` |
| `label`           | `label`           | Visible label text, linked to the input through `input_id` (or a generated id).                                                                                         | `string` | `undefined` |
| `placeholder`     | `placeholder`     | Placeholder text of the inner `<input>`.                                                                                                                                | `string` | `undefined` |
| `size`            | `size`            | Size. `small` shows a smaller field; omit for the default size.                                                                                                         | `string` | `undefined` |
| `type`            | `type`            | Native input type, e.g. `text`, `password`, `email`, `number`, `date` or `time`. The legacy values `Witherror` and `disabled` only apply the error or disabled styling. | `string` | `'text'`    |
| `validation_type` | `validation_type` | Validation style. `error` shows the error colors.                                                                                                                       | `string` | `undefined` |
| `value`           | `value`           | Value of the inner `<input>`. Updates as the user types.                                                                                                                | `string` | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
