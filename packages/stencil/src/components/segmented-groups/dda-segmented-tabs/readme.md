# dda-segmented-tabs



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute        | Description                                                                                                                                                                  | Type     | Default     |
| ---------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `aria_label`     | `aria_label`     | Accessible name for the group (applied as aria-label on the group container).                                                                                                | `string` | `undefined` |
| `button_name`    | `button_name`    | `name` set on every segment button.                                                                                                                                          | `string` | `undefined` |
| `component_mode` | `component_mode` | Theme override class on the group, e.g. `light-mode`.                                                                                                                        | `string` | `undefined` |
| `custom_class`   | `custom_class`   | Extra CSS classes added to the group.                                                                                                                                        | `string` | `undefined` |
| `items`          | `items`          | Segments, as a JSON string array, e.g. `'["All", "Pending", "Approved"]'`. An item that starts with `fo` renders as a Material Symbols icon name (e.g. `format_align_left`). | `string` | `undefined` |
| `radius_type`    | `radius_type`    | Corner shape of the group: `square` or `rounded`.                                                                                                                            | `string` | `undefined` |
| `selected_index` | `selected_index` | Index of the segment selected on load, from 0. An out-of-range value selects the first segment.                                                                              | `number` | `0`         |


## Events

| Event           | Description                                                                         | Type                  |
| --------------- | ----------------------------------------------------------------------------------- | --------------------- |
| `segmentChange` | Fires when the user selects a different segment. `detail` is the new index, from 0. | `CustomEvent<number>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
