# dda-textarea



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute            | Description                                                                                                                                 | Type      | Default     |
| -------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `aria_label`         | `aria_label`         | Accessible name of the textarea. Use it when there is no visible label.                                                                     | `string`  | `undefined` |
| `component_mode`     | `component_mode`     | Theme override class for the field, e.g. `light-mode`.                                                                                      | `string`  | `undefined` |
| `custom_class`       | `custom_class`       | Extra CSS classes added to the field container.                                                                                             | `string`  | `undefined` |
| `enable_rich_editor` | `enable_rich_editor` | Replaces the textarea with a Quill rich text editor and toolbar.                                                                            | `boolean` | `undefined` |
| `error_message`      | `error_message`      | Error text shown below the field with the character count. When set, the field gets `aria-invalid="true"`.                                  | `string`  | `undefined` |
| `helper_text`        | `helper_text`        | Helper text shown below the field with the character count, linked with `aria-describedby`.                                                 | `string`  | `undefined` |
| `input_id`           | `input_id`           | `id` of the textarea or editor. Also used for the label and the helper and error text ids. Optional: an id is generated when it is not set. | `string`  | `undefined` |
| `input_status`       | `input_status`       | Status style. `disabled` shows the disabled styling only; it does not set the native `disabled` attribute.                                  | `string`  | `undefined` |
| `label`              | `label`              | Visible label text, linked to the field through `input_id` (or a generated id).                                                             | `string`  | `undefined` |
| `max_characters`     | `max_characters`     | Maximum number of characters (`maxlength` of the textarea), shown in the character count.                                                   | `number`  | `undefined` |
| `placeholder`        | `placeholder`        | Placeholder text of the textarea or the rich text editor.                                                                                   | `string`  | `undefined` |
| `textarea_name`      | `textarea_name`      | `name` of the textarea, submitted with its form.                                                                                            | `string`  | `undefined` |
| `validation_type`    | `validation_type`    | Validation style. `error` shows the error colors.                                                                                           | `string`  | `undefined` |
| `value`              | `value`              | Value of the textarea. Updates as the user types; in rich text mode it holds the editor HTML.                                               | `string`  | `''`        |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
