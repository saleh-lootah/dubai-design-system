# dda-select



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute                   | Description                                                                                                                                                                                                                  | Type                                   | Default     |
| --------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `aria_label`                | `aria_label`                | Accessible name of the trigger button and the option list. The list falls back to `label`.                                                                                                                                   | `string`                               | `undefined` |
| `button_id`                 | `button_id`                 | `id` of the trigger button. Also used to build the ids of the label, list, helper text and error message, so keep it unique. When it is not set, the component generates a unique id.                                        | `string`                               | `undefined` |
| `component_mode`            | `component_mode`            | Theme override class for the field, e.g. `light-mode`.                                                                                                                                                                       | `string`                               | `undefined` |
| `custom_class`              | `custom_class`              | Extra CSS classes added to the field container.                                                                                                                                                                              | `string`                               | `''`        |
| `disabled`                  | `disabled`                  | Disables the select: the list does not open and options cannot be picked.                                                                                                                                                    | `boolean`                              | `false`     |
| `error`                     | `error`                     | Validation state. `error` shows the error styling.                                                                                                                                                                           | `string`                               | `undefined` |
| `error_message`             | `error_message`             | Error text shown under the field. Also sets `aria-invalid` on the trigger.                                                                                                                                                   | `string`                               | `undefined` |
| `helper_text`               | `helper_text`               | Helper text shown under the field.                                                                                                                                                                                           | `string`                               | `undefined` |
| `input_name`                | `input_name`                | `name` sent in `selectBlurred`. Falls back to `button_id`.                                                                                                                                                                   | `string`                               | `undefined` |
| `label`                     | `label`                     | Label shown above the field. The trigger button is named by the label and its current text.                                                                                                                                  | `string`                               | `undefined` |
| `main_aria_label`           | `main_aria_label`           | 3.x name of `aria_label`, used as the trigger's aria-label only when `label` is not set. `aria_label` wins when both are set; when `label` is set, `main_aria_label` is ignored and the trigger keeps its `aria-labelledby`. | `string`                               | `undefined` |
| `option_select_button_name` | `option_select_button_name` | `name` of each option button in the list.                                                                                                                                                                                    | `string`                               | `undefined` |
| `options`                   | `options`                   | Options: a JSON array, or an array property, of strings (`["Dubai","Sharjah"]`) or 3.x `{ id, text }` objects (`[{"id":1,"text":"Dubai"}]`). Other entries are ignored. Invalid JSON shows "No options available".           | `(string \| SelectOption)[] \| string` | `undefined` |
| `placeholder`               | `placeholder`               | Text in the trigger when nothing is selected. Default: `Select an option`.                                                                                                                                                   | `string`                               | `undefined` |
| `selected`                  | `selected`                  | The selected option: its id, or its text. For string options the id is the text. Updated to the picked option's id (as a string) when the user picks one. Mutable: the component assigns it.                                 | `string`                               | `undefined` |
| `size`                      | `size`                      | Field size. `small` gives the compact field; leave empty for the default size.                                                                                                                                               | `string`                               | `undefined` |
| `toggle_button_name`        | `toggle_button_name`        | `name` of the trigger button.                                                                                                                                                                                                | `string`                               | `undefined` |
| `validation_type`           | `validation_type`           | 3.x name of `error` (the validation state class). `error` wins when both are set.                                                                                                                                            | `string`                               | `undefined` |


## Events

| Event             | Description                                                                                                                                                                                                              | Type                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `selectBlurred`   | 3.x event: emitted when the trigger loses focus, with `{ name, value }` — `input_name` (or `button_id`) and the selected text.                                                                                           | `CustomEvent<{ name: string; value: string; }>`                       |
| `selectChanged`   | 3.x event: emitted each time the user picks one, even if it is already selected. For a string option this is `{ id, text }`; for an object option this is the original option object, extra fields included, as 3.x did. | `CustomEvent<SelectOption>`                                           |
| `selectionChange` | Emitted when the user picks an option other than the selected one, by mouse or keyboard. `detail.value` is the new `selected` value (the option id as a string); `detail.id` and `detail.text` are the option.           | `CustomEvent<{ value: string; id: string \| number; text: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
