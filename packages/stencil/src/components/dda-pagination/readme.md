# dda-pagination



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute                   | Description                                                                                                                                 | Type                                                                                                   | Default           |
| --------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------- |
| `button_text_next_button`   | `button_text_next_button`   | `name` of the next page button when `type` is `button-text`.                                                                                | `string`                                                                                               | `undefined`       |
| `button_text_prev_button`   | `button_text_prev_button`   | `name` of the previous page button when `type` is `button-text`.                                                                            | `string`                                                                                               | `undefined`       |
| `buttons_next_button`       | `buttons_next_button`       | `name` of the next page button when `type` is `buttons`.                                                                                    | `string`                                                                                               | `undefined`       |
| `buttons_pages_next_button` | `buttons_pages_next_button` | `name` of the next page button when `type` is `buttons-pages`.                                                                              | `string`                                                                                               | `undefined`       |
| `buttons_pages_prev_button` | `buttons_pages_prev_button` | `name` of the previous page button when `type` is `buttons-pages`.                                                                          | `string`                                                                                               | `undefined`       |
| `buttons_prev_button`       | `buttons_prev_button`       | `name` of the previous page button when `type` is `buttons`.                                                                                | `string`                                                                                               | `undefined`       |
| `component_mode`            | `component_mode`            | Theme override class on the pagination element, e.g. `light-mode`.                                                                          | `string`                                                                                               | `undefined`       |
| `current_page`              | `current_page`              | Selected page, counted from 1. Kept between 1 and `total_pages`; updates when the user changes the page. Mutable: the component assigns it. | `number`                                                                                               | `1`               |
| `custom_class`              | `custom_class`              | Extra CSS classes added to the pagination element.                                                                                          | `string`                                                                                               | `''`              |
| `next_button_label`         | `next_button_label`         | Accessible name of the icon-only next page button (`text`, `text-pages`, `button-text` and `buttons-pages` layouts).                        | `string`                                                                                               | `'Next page'`     |
| `previous_button_label`     | `previous_button_label`     | Accessible name of the icon-only previous page button (`text`, `text-pages`, `button-text` and `buttons-pages` layouts).                    | `string`                                                                                               | `'Previous page'` |
| `simple_slider_next_button` | `simple_slider_next_button` | `name` of the next page button when `type` is `simple-slider`.                                                                              | `string`                                                                                               | `undefined`       |
| `simple_slider_prev_button` | `simple_slider_prev_button` | `name` of the previous page button when `type` is `simple-slider`.                                                                          | `string`                                                                                               | `undefined`       |
| `text_next_button`          | `text_next_button`          | `name` of the next page button when `type` is `text`.                                                                                       | `string`                                                                                               | `undefined`       |
| `text_pages_next_button`    | `text_pages_next_button`    | `name` of the next page button when `type` is `text-pages`.                                                                                 | `string`                                                                                               | `undefined`       |
| `text_pages_prev_button`    | `text_pages_prev_button`    | `name` of the previous page button when `type` is `text-pages`.                                                                             | `string`                                                                                               | `undefined`       |
| `text_prev_button`          | `text_prev_button`          | `name` of the previous page button when `type` is `text`.                                                                                   | `string`                                                                                               | `undefined`       |
| `total_pages`               | `total_pages`               | Number of pages. Values below 1 become 1. Mutable: the component corrects out-of-range values.                                              | `number`                                                                                               | `8`               |
| `type`                      | `type`                      | Layout: `simple-slider`, `buttons`, `text`, `text-pages`, `button-text`, `buttons-pages` or `full`.                                         | `"button-text" \| "buttons" \| "buttons-pages" \| "full" \| "simple-slider" \| "text" \| "text-pages"` | `'simple-slider'` |


## Events

| Event        | Description                                                                                     | Type                             |
| ------------ | ----------------------------------------------------------------------------------------------- | -------------------------------- |
| `pageChange` | Emitted when the user moves to a different page. `detail.page` is the new page, counted from 1. | `CustomEvent<{ page: number; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
