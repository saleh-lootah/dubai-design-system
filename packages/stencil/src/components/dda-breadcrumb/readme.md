# dda-breadcrumb



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute        | Description                                                                                                                                                                         | Type                              | Default           |
| ---------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------- |
| `breadcrumbs`    | `breadcrumbs`    | The items, as an array or a JSON string of `{ text, icon?, url? }` objects. The last item is the current page. The `data-breadcrumbs` attribute is still read when this is not set. | `BreadcrumbItem[] \| string`      | `undefined`       |
| `component_mode` | `component_mode` | Theme override class on the wrapper, e.g. `light-mode`.                                                                                                                             | `string`                          | `undefined`       |
| `custom_class`   | `custom_class`   | Extra CSS classes added to the inner `<nav>`.                                                                                                                                       | `string`                          | `''`              |
| `design`         | `design`         | What each item shows: `text` (label only), `icon-text` (icon and label) or `icon` (icon only).                                                                                      | `"icon" \| "icon-text" \| "text"` | `'text'`          |
| `separator`      | `separator`      | Material Symbols icon shown between items: `chevron_right` or `pen_size_2` (a slash).                                                                                               | `"chevron_right" \| "pen_size_2"` | `'chevron_right'` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
