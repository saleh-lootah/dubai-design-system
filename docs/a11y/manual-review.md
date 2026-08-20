# Manual Review — 2026-08-20

Hand review of the 34 `dda-*` components: the judgments an automated tool cannot make.
Companion document to `docs/a11y/baseline-2026-08-20.md` (Tasks 1-5's tool output). Read
that document first — this one does not repeat its counts, only adds detail where the
brief's questions go beyond what a tool can measure.

Every finding below cites the file and line it is based on. Where a question could not be
answered without running the component in a live browser and that was not done, the entry
says so plainly instead of guessing.

Source tree: `packages/stencil/src/components/<dda-name>/`. All line numbers are against
the branch `chore/codebase-review-harness` as of this task.

---

## Group 1 — Form components

`dda-input`, `dda-textarea`, `dda-select`, `dda-checkbox`, `dda-radiobutton`, `dda-toggle`,
`dda-number-field`, `dda-search-input`, `dda-phonefield`, `dda-creditcard-field`,
`dda-attach-file`.

### Cross-cutting finding: no component in this group implements `autocomplete`, `aria-describedby`, or `aria-invalid`

Grepped every `.tsx` file in this group for `autocomplete`, `aria-describedby`, and
`aria-invalid` (and their JSX camelCase forms `autoComplete`, `ariaDescribedby`,
`ariaInvalid`): zero matches in all 11 files. This is not a per-component oversight, it is
systemic — none of the 11 form components has ever wired an error message to its input
via `aria-describedby`, ever set `aria-invalid` when `error_message` is present, or ever
exposed an `autocomplete` prop. Confirmed by:

```
grep -rn "autocomplete\|autoComplete\|aria-describedby\|ariaDescribedby\|aria-invalid\|ariaInvalid" \
  dda-input dda-textarea dda-select dda-checkbox dda-radiobutton dda-toggle \
  dda-number-field dda-search-input dda-phonefield dda-creditcard-field dda-attach-file
```
→ no output.

Every "error_message" prop across this group (e.g. `dda-input/dda-input.tsx:14`,
`dda-textarea/dda-textarea.tsx:14`, `dda-number-field/dda-number-field.tsx:13`,
`dda-search-input/dda-search-input.tsx:12`, `dda-phonefield/dda-phonefield.tsx:14`,
`dda-creditcard-field/dda-creditcard-field.tsx:13`,
`dda-attach-file/dda-attach-file.tsx:18`) renders the message as a plain `<span>` or
`<div>` sibling of the input, with no `id` on the message element and no
`aria-describedby` on the input pointing at it — e.g.
`dda-input/dda-input.tsx:56` (`{this.error_message && <span class="dda-error-message">{this.error_message}</span>}`)
next to the `<input>` at `dda-input/dda-input.tsx:45-54`, which carries no `aria-describedby`.
A screen reader user tabbing into a field in an error state hears the label only, not the
error text — this is a real WCAG 3.3.1 gap, not a documentation gap.

Below, "Q1/Q2/Q3" answers restate this only where a component needs to be singled out for
extra detail; otherwise "systemic, see above" applies.

### `dda-input`

- **Q1 (label/for):** Yes, correctly wired, conditional on the consumer supplying
  `input_id`. `dda-input/dda-input.tsx:44` (`<label htmlFor={this.input_id} ...>`) and
  `:47` (`<input id={this.input_id} ...>`) both key off the same `@Prop() input_id`
  (`:20`). If `input_id` is left unset, the `for`/`id` pair is simply absent (Stencil
  omits `undefined` JSX attributes) rather than mismatched — so the failure mode is "no
  association" not "wrong association." All observed stories set `input_id="input"`
  (`dda-input.stories.tsx:90,123,140,157,...`).
- **Q2 (aria-describedby/aria-invalid):** No. Systemic finding above.
- **Q3 (autocomplete):** No `autocomplete` prop exists at all — `dda-input.tsx:9-22` is
  the full prop list. Not determined whether a consumer can pass a raw `autocomplete`
  HTML attribute through (Stencil components without an explicit `@Prop()` do not forward
  arbitrary attributes to the shadow-less rendered `<input>` — this one has no mechanism
  to do so since the `<input>` at `:45-54` only spreads explicitly-named props).
- **Q5 (mdx vs readme):** Matches. `dda-input-docs.mdx` uses `aria_label`,
  `component_mode`, `custom_class`, `error_message`, `helper_text`, `input_id`, `label`,
  `size`, `type`, `validation_type`, `value` — all real props per `readme.md`'s Properties
  table. No ghost attributes found in this doc.

### `dda-textarea`

- **Q1:** Yes, same pattern. `dda-textarea/dda-textarea.tsx:86` (label
  `htmlFor={this.input_id}`) and `:91` (`<textarea id={this.input_id}`). Note: when
  `enable_rich_editor` is true, the rendered editable surface is a Quill `<div id="editor">`
  (`:88`), not the `<textarea>` the label targets at all — the label's `for` then points at
  an element that doesn't exist in the DOM. Confirmed: `render()` at `:87-100` is a ternary
  that renders either the Quill `<div id="editor">` or the labelled `<textarea>`, never
  both, so the rich-editor mode silently breaks the label association that exists in the
  plain mode.
- **Q2:** No. Systemic finding above; `error_message` at `:107-112` is an unassociated
  `<div>`.
- **Q3:** No `autocomplete` prop; full list `dda-textarea.tsx:11-24`.
- **Q5:** Matches. `dda-textarea-docs.mdx` props checked
  (`aria_label, component_mode, custom_class, error_message, helper_text, input_id, label,
  max_characters, value`) are all real per `readme.md`. `enable_rich_editor` and
  `textarea_name` are real props not shown in the doc's examples — an omission, not a
  ghost attribute.

### `dda-select`

- **Q1:** Yes, but the labelled target is a `<button>`, not a native `<select>` — this is
  a custom combobox-like widget. `dda-select/dda-select.tsx:54`
  (`<label htmlFor={this.button_id}>`) targets the trigger button at `:56`
  (`<button ... id={this.button_id} ... onClick={() => {this.toggleSelect()}}>`). The
  association itself is correct. However the widget does not implement the ARIA pattern a
  custom select needs: the trigger button has no `aria-haspopup`, `aria-expanded`, or
  `aria-controls` anywhere in `:56-59`, and the option list at `:60-75` has no
  `role="listbox"` and its option buttons (`:64-69`) have no `role="option"` or
  `aria-selected`. A screen reader user gets no indication the button opens a list, that
  it's open, or which option is selected — beyond what a plain button's accessible name
  conveys. This is new detail beyond the "ghost attributes" finding; it's a structural gap
  the API checker cannot see because there's no missing/wrong *prop*, there's a missing
  *ARIA pattern*.
- **Q2:** No. Systemic finding above; `error_message` at `dda-select.tsx:78` is
  unassociated.
- **Q3:** No `autocomplete` prop; full list `dda-select.tsx:9-25`.
- **Q5:** Matches (no ghost attrs). `dda-select-docs.mdx` uses
  `aria_label, button_id, component_mode, custom_class, disabled, error_message,
  helper_text, label, options, selected, size` — all real. `error`,
  `option_select_button_name`, `toggle_button_name` are real props the doc's examples
  don't demonstrate (omission, not a fabrication).

### `dda-checkbox`

- **Q1:** Yes. `dda-checkbox/dda-checkbox.tsx:34` (`<input ... id={this.input_id} ...>`)
  and `:35` (`<label htmlFor={this.input_id}>`). Note the `<input>` also carries its own
  `aria-label={this.aria_label}` (`:34`) — when both a `for`-linked `<label>` and
  `aria-label` are present, `aria-label` wins as the accessible name in most browsers,
  silently discarding the visible label text for assistive tech unless the consumer leaves
  `aria_label` unset. Not a broken association, but a footgun: a consumer who fills in
  both `title_text` (rendered as the visible label at `:38`) and `aria_label` gets a
  screen-reader announcement that only matches `aria_label`, potentially out of sync with
  the visible text.
- **Q2:** No `error_message`/error prop of any kind exists on this component at all —
  full prop list `dda-checkbox.tsx:9-19`. There is no error state to associate, so this
  question doesn't apply the same way it does to the text inputs, but it does mean
  `dda-checkbox` cannot express a validation error accessibly (or visually) at all.
- **Q3:** N/A — not a text-entry field; `autocomplete` doesn't apply to a checkbox in the
  same way, and none is present.
- **Q5:** `dda-checkbox-docs.mdx:28,58,79` document `on_checked="() => void 0"` as an
  attribute on `<dda-checkbox>`. **This is a ghost attribute** — `dda-checkbox.tsx:9-19`
  has no `on_checked` prop and no `@Event()` of that name (Stencil events are typically
  exposed as native DOM events like `ddaCheckedChange`, not as an attribute called
  `on_checked` set to a stringified arrow function; nothing in the source implements even
  that pattern). This was not previously flagged by Task 2's `check:api` ghost-attribute
  checker because that tool scans `argTypes`/`args` in `.stories.tsx` files, not prose
  code fences inside `.mdx` — a real gap in what the automated checker's contract covers.

### `dda-radiobutton`

- **Q1:** Yes. `dda-radiobutton/dda-radiobutton.tsx:34-35`, same pattern as checkbox
  (input `id`, label `htmlFor`, both keyed to `input_id`). Same `aria-label`-wins-over-label
  footgun noted above applies here too (`:34` has `aria-label={this.aria_label}`).
- **Q2:** No error-state prop exists at all — full list `dda-radiobutton.tsx:9-19`.
- **Q3:** N/A, none present.
- **Q5:** Matches, no ghost attrs found. `dda-radiobutton-docs.mdx` uses
  `aria_label, checked, component_mode, custom_class, group_name, input_id, size,
  title_text` — all real per `readme.md`. `radio_status`, `supporting`, `variants` are
  real but undemonstrated (omission only).

### `dda-toggle`

- **Q1:** Yes, structurally — `dda-toggle/dda-toggle.tsx:29` wraps the whole control in
  `<label class={toggleClass} htmlFor={this.input_id}>` around the
  `<input id={this.input_id}>` at `:30` — both an implicit (nesting) and explicit
  (`for`/`id`) association, which is redundant but not broken.
- **New finding, not in the baseline:** the visible label text is **hardcoded** and not
  driven by any prop. `dda-toggle.tsx:33-34`:
  ```
  <span class="toggle-title">Radio Button Title</span>
  <span class="toggle-supporting">Supporting Text</span>
  ```
  Every `dda-toggle` on a page reads "Radio Button Title" / "Supporting Text" to a sighted
  or screen-reader user, regardless of what the consumer is toggling — clear copy-paste
  residue from `dda-radiobutton`. `dda-toggle.tsx:10-11` shows the commit history of this:
  commented-out `@Prop() labelOn` / `@Prop() labelOff` that were apparently removed but the
  static strings were never reconnected to any prop. This makes every real-world use of
  `dda-toggle` accessibility-incorrect by construction — the accessible name is
  permanently wrong unless the consumer overrides it entirely via `aria_label`.
- **Q5, consequence of the above:** `dda-toggle-docs.mdx:22-23,51-52,71-72` document
  `label_on="On"` and `label_off="Off"` as attributes. **Both are ghost attributes** —
  `dda-toggle.tsx:9-17` has no `label_on` or `label_off` prop (only the dead, commented-out
  `labelOn`/`labelOff` at `:10-11`, which aren't even the same name). The doc describes a
  configurable on/off label API that was apparently designed, then stripped out of the
  component without updating the doc, leaving the doc actively lying about what the
  component can do. Same gap as `dda-checkbox`: not caught by `check:api` because it's
  inside an `.mdx` code fence, not a `.stories.tsx` `args` object.
- **Q2:** No error-state prop at all — full list `dda-toggle.tsx:9-17`.
- **Q3:** N/A.

### `dda-number-field`

- **Q1:** Yes. `dda-number-field/dda-number-field.tsx:76` (label `htmlFor={this.input_id}`)
  and `:79` (`<input id={this.input_id}`).
- **Q2:** No. Systemic finding above; `error_message` at `:111` unassociated.
- **Q3:** No `autocomplete` prop; full list `:9-26`. Also note (carried forward from
  baseline, with file:line added here): the "Disabled" story never disables the input
  because there is no `disabled` `@Prop()` at all in this list — confirmed, `:9-26` has no
  `disabled` prop, so no story could set one.
- **Q5:** Matches, no ghost attrs in `dda-number-field-docs.mdx`
  (`aria_label, component_mode, custom_class, error_message, helper_text, input_id,
  input_status, label, selected_currency, size, validation_type, value` — all real).

### `dda-search-input`

- **Q1: No — this is a real, newly-found label mis-association, not just a missing one.**
  `dda-search-input/dda-search-input.tsx:39`:
  `{this.label && <label htmlFor={this.button_id} class="dda-input-label">{this.label}</label>}`
  points the label at `this.button_id`. But `button_id` is applied to the **close
  ("clear") button**, not the search text field:
  `dda-search-input.tsx:44` — `<button ... id={this.button_id} ... class="icon-close" ...>`.
  The actual text `<input>` at `:42` has a **hardcoded, prop-independent** `id='search'`
  and no `for` targets it at all:
  `<input name={this.search_input_name} aria-label={this.aria_label} id='search' type="text" ...>`.
  Net effect: when a consumer sets `label`, a screen reader announces that label text as
  the accessible name of the *clear button*, not the search field — and the search field
  itself has no programmatic label unless the consumer separately supplies `aria_label`.
  This is a genuine WCAG 1.3.1/4.1.2 defect, worse than the "missing association" pattern
  seen elsewhere in this group, because the association that does exist is wrong.
- **Second finding:** the hardcoded `id='search'` (`:42`) means two `dda-search-input`
  instances on the same page produce a duplicate `id="search"` in the DOM — the same class
  of bug as the already-documented `dda-tabs.tsx:59` duplicate-id issue, just in a
  different component and not previously recorded.
- **Q2:** No. Systemic finding above; `error_message` at `:51` unassociated.
- **Q3:** No `autocomplete` prop; full list `:9-24`.
- **Q5:** Matches, no ghost attrs in `dda-search-input-docs.mdx`.

### `dda-phonefield`

- **Q1:** Yes for the phone number field itself.
  `dda-phonefield/dda-phonefield.tsx:73` (label `htmlFor={this.input_id}`) and `:90`
  (`<input id={this.input_id}`). The country-code dropdown trigger button (`:76-78`) and
  its option buttons (`:82`) have no label association of their own — they rely solely on
  visible text/flag `alt=""` (`:77,83`, both empty `alt`, so the flag conveys nothing to a
  screen reader), which is a lesser but real gap: a screen reader user hears only the
  numeric country code, e.g. "+971", with no indication it's a "change country" control.
- **New finding: duplicate `id` on every rendered country option.**
  `dda-phonefield.tsx:82`:
  `<button id={this.button_id} name={this.country_select_button_name} ... type="button" class="dda-input-dropdown-item" onClick={() => this.selectCountry(country)}>`
  is inside `this.countries.map(country => (...))` (`:81-85`). `this.button_id` is a
  single static `@Prop()` (`:27`), so **every** country button in the dropdown list (200+
  countries per `CountriesList`, `:2`) renders with the identical `id`. Same class of bug
  as `dda-tabs.tsx:59` and the `dda-search-input` finding above — a third, independently
  discovered instance of this pattern in the codebase.
- **Q2:** No. Systemic finding above; `error_message` at `:106` unassociated.
- **Q3:** No `autocomplete` prop; full list `:10-31`.
- **Q4 (paste):** Paste is **not blocked**. Grepped `dda-phonefield.tsx` for
  `paste`/`onPaste`/`preventDefault` — no matches. The only input handler is
  `handlephonenumberChange` (`:62-66`), bound via `onInput` (`:99`), which strips
  non-numeric characters from whatever value is present (including a pasted one) but never
  calls `preventDefault()` or otherwise rejects the paste action itself. A pasted phone
  number is accepted and reformatted, not blocked — WCAG 3.3.8 compliant on this point.
- **Q5:** Matches, no ghost attrs in `dda-phonefield.mdx` (checked
  `aria_label, button_aria_label, button_id, component_mode, custom_class, disabled,
  error_message, helper_text, input_id, label` — all real per `readme.md`).

### `dda-creditcard-field`

- **Q1:** Yes. `dda-creditcard-field/dda-creditcard-field.tsx:71` (label
  `htmlFor={this.input_id}`) and `:76` (`<input ... id={this.input_id}`).
- **Q2:** No. Systemic finding above; `error_message` at `:89` unassociated. This is the
  one component in the group where the baseline's WCAG 2.4.7-confirmed list already flags
  a related-but-different defect (no focus indicator at all) — the aria-describedby gap is
  additional, not a duplicate of that finding.
- **Q3:** No `autocomplete` prop; full list `:9-24`. A card-number field is exactly the
  kind of field WCAG 1.3.5/3.3.7 cares about (`autocomplete="cc-number"`) — its absence
  here is a concrete, specific miss, not just a generic gap.
- **Q4 (paste):** Not blocked. Grepped for `paste`/`onPaste`/`preventDefault` in
  `dda-creditcard-field.tsx` — no matches. `handleInput` (`:28-40`) strips non-digit/dash
  characters and reformats via `formatCardNumber` (`:42-50`) on the `onInput` event
  (`:82`), same non-blocking reformat-on-input pattern as `dda-phonefield`. A pasted card
  number is accepted, not rejected — WCAG 3.3.8 compliant on this point.
- **Q5:** Matches, no ghost attrs in `dda-creditcard-field-docs.mdx`.

### `dda-attach-file`

- **Q1:** Yes, doubly so. `dda-attach-file/dda-attach-file.tsx:76`
  (`{this.label && <label htmlFor={this.input_id} ...>}`) is the field-level label, and
  `:91-93` wraps the actual `<input type="file">` in a second `<label htmlFor={this.input_id}
  class="dda-file-choose">Choose File<input id={this.input_id} .../></label>` — an implicit
  (nesting) association *and* an explicit `for`/`id` pointing at the same id. If a
  consumer sets both `label` and leaves the default "Choose File" text, two
  `<label for="X">` elements target the same input id. Not broken — most browsers/screen
  readers concatenate or pick the first — but redundant enough to be worth a note for
  Task 9: consolidating to one label would remove the ambiguity.
- **Q2:** No. Systemic finding above; `error_message` at `:99` unassociated.
- **Q3:** No `autocomplete` prop; full list `:16-30`. Not applicable to `type="file"` in
  the same sense as text fields, so this is a lesser gap than for the text inputs.
- **Q5:** Matches, no ghost attrs in `dda-attach-file-docs.mdx`.

### Group 1 summary

New findings beyond the baseline, all with file:line evidence above:

1. Systemic absence of `aria-describedby`/`aria-invalid` across all 11 form components —
   `error_message` is always rendered as an unassociated sibling element.
2. Systemic absence of any `autocomplete` prop across all 11 — `dda-creditcard-field` and
   `dda-phonefield` are the two where this matters most concretely (WCAG 1.3.5/3.3.7).
3. `dda-search-input`'s label targets the wrong element (the clear button, not the search
   field) — a real mis-association, not just a missing one — `dda-search-input.tsx:39,42,44`.
4. `dda-search-input`'s search `<input>` has a hardcoded `id='search'` — duplicate-id risk
   with multiple instances — `dda-search-input.tsx:42`.
5. `dda-phonefield`'s country-option buttons all share the same static `id` —
   `dda-phonefield.tsx:82` — a third instance of the `dda-tabs.tsx:59`-class bug.
6. `dda-toggle`'s visible label text is hardcoded ("Radio Button Title" / "Supporting
   Text") and not driven by any prop — `dda-toggle.tsx:33-34`.
7. `dda-toggle-docs.mdx` documents `label_on`/`label_off` attributes that do not exist on
   the component — `dda-toggle-docs.mdx:22-23,51-52,71-72` vs. `dda-toggle.tsx:9-17`.
8. `dda-checkbox-docs.mdx` documents an `on_checked` attribute that does not exist —
   `dda-checkbox-docs.mdx:28,58,79` vs. `dda-checkbox.tsx:9-19`.
9. `dda-select` implements a custom listbox-like widget with no `aria-expanded`,
   `aria-haspopup`, `role="listbox"`, or `role="option"` — `dda-select.tsx:56-69`.
10. `dda-textarea`'s rich-editor mode (`enable_rich_editor`) renders a Quill `<div
    id="editor">` instead of the labelled `<textarea>`, breaking the label association in
    that mode — `dda-textarea.tsx:86-100`.

Confirmed, not newly found: paste is not blocked in `dda-creditcard-field` or
`dda-phonefield` (WCAG 3.3.8 compliant on that specific point) — findings 7 (Q4) above per
component.

Not determined without a browser: whether `aria-label` silently overriding the visible
`<label>` text (checkbox/radiobutton footgun, noted above) is audible in practice in a
specific screen reader — this needs a live AT test, not just source reading, to confirm
the exact announced string. Recorded as a footgun with file:line evidence, not asserted as
a confirmed failure.
