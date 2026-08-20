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

---

## Group 2 — Navigation components

`dda-header`, `dda-footer`, `dda-sticky-footer`, `dda-breadcrumb`, `dda-pagination`,
`dda-tabs`, `dda-segmented-tabs`.

### Q1 — `dda-header`'s 2 `onClick`-on-non-button places; can a keyboard operate them?

Grepped `dda-header.tsx` for every `onClick` (24 call sites) and filtered out the ones on
natively interactive elements (`<button>`, `<a href>`, `<dda-button>`,
`<dda-radiobutton>`). Exactly two remain on plain `<div>`s, matching the baseline's "5
places … `dda-header` ×2" count:

1. `dda-header.tsx:268` —
   `<div class={...dda-menu-overley...} onClick={this.toggleMenu}></div>` — a full-screen
   backdrop that closes the mobile side menu when clicked outside it.
2. `dda-header.tsx:271` —
   `<div class="hamburger-menu" onClick={this.toggleMenu}>` — wraps a real
   `<button class="hamburger-menu-btn">` at `:273` inside a `<dda-tooltip>`.

**Keyboard operability, checked individually:**

- **`:271` (hamburger div) — yes, keyboard-operable**, but only incidentally. The actual
  focusable element is the nested `<button>` at `:273`. Activating that button with
  Enter/Space fires a native `click` event, which bubbles up through the DOM to the
  ancestor `<div>`'s `onClick={this.toggleMenu}` handler. So `Tab` reaches the button and
  `Enter`/`Space` opens the menu — the handler is architecturally on the wrong element
  (should be on the button itself, e.g. as a Stencil `onClick` prop on the button), but
  it does work for a keyboard user today because of event bubbling. This is a code-smell,
  not a defect.
- **`:268` (overlay div) — not independently keyboard-operable, and does not need to be.**
  This `<div>` has no `tabindex`, no `role`, and no keydown handler, so it cannot receive
  focus and Enter/Space do nothing on it. But a keyboard user does not need it: the same
  menu can be closed two other ways that a keyboard user can already reach —
  `dda-header.tsx:340`, a real `<button aria-label="Close Sidebar" onClick={this.toggleMenu}>`
  inside the open side menu, and `Escape`, wired at `dda-header.tsx:82-89`
  (`toggleEscapeKey`, registered via `document.addEventListener('keydown', ...)` at `:95`)
  which resets `isMenuOpen` (among other open states) to `false`. So the overlay's
  click-only handler is not a keyboard trap — redundant UI, not a defect.

### Q2 — do `dda-header` and `dda-sticky-footer` hide the focused element when tabbing? (WCAG 2.4.11)

**`dda-header`:** genuinely fixed to the viewport, and with no mitigation in the codebase.
`dda-header.tsx:250` renders `<header class="dda-header ...">`; the `.dda-header` rule
lives in `global/templates/dda-header-main.css:1-10`
(`position: fixed; top: 0; left: 0; z-index: 6;`), which is `@import`ed into
`global/global.css` (confirmed: `grep -n "dda-header-main.css" global/global.css` matches)
and reaches `dda-header` because the component is `shadow: false`
(`dda-header.tsx:6`). Searched the entire `global/` tree for `scroll-padding` or
`scroll-margin` (the standard mitigation that reserves space so a fixed header can't
cover a just-focused element) — **zero matches anywhere in the codebase**. So: the
component is fixed at `top: 0` with a 6-deep z-index and no compensating scroll offset
exists in any shipped stylesheet. A keyboard user tabbing to an element that sits near
the top of a scrolled page is at concrete risk of the browser's native "scroll focused
element into view" landing that element directly under the fixed header. **Not
determined without a browser**: the exact pixel overlap depends on `dda-header`'s
rendered height (which varies by breakpoint/logo size) versus how far a given page's
content sits from the top, so this is reported as "the mitigation is absent," a
verifiable code fact, rather than "confirmed to occur on every page," which would need a
live scroll-and-tab test.
- **`dda-sticky-footer`:** the Q2 premise does not hold as shipped, for a **different**
  reason than dda-header's — see the shadow-root CSS finding in Q4 below.
  `dda-sticky-footer.tsx:7` is `shadow: true`, and its own local stylesheet
  `dda-sticky-footer.css` is a 0-byte empty file (confirmed:
  `wc -l dda-sticky-footer/dda-sticky-footer.css` → 0). The `.dda-footer { position: fixed;
  bottom: 0; ... }` rule that would make it viewport-fixed lives only in
  `global/templates/dda-footer-main.css:1-10`, reached via `global/global.css`'s
  `@import` — but that import can never cross into `dda-sticky-footer`'s shadow root.
  **As shipped, `dda-sticky-footer` is not actually fixed to the viewport at all** — it
  renders as an ordinary block-flow `<footer>` with no positioning, box-shadow, or
  background from either its own (empty) stylesheet or the global one. The scroll-hide
  behavior it clearly intends to have — `dda-sticky-footer.tsx:65-66,82-85` maintain
  `isHidden`/`lastScrollY` state and toggle a `hidden` class
  (`dda-sticky-footer.tsx:91`, `class={{ 'dda-footer': true, 'hidden': this.isHidden }}`)
  on scroll direction — has no visible effect either, because there is no CSS anywhere
  (local or global-but-unreachable) that defines what the `hidden` class does. So the
  2.4.11 question as posed ("does the fixed footer hide the focused element") is
  moot for the component in its current state: it isn't fixed, so it can't obscure
  anything by being fixed — the real defect is that the component doesn't work as
  designed at all, which is a stronger finding than a focus-obscuring one.

### Q3 — do `dda-tabs` and `dda-segmented-tabs` follow the WAI tabs pattern?

**`dda-tabs` — no**, on every count that can be checked from source:

- No `role="tablist"` on the container (`dda-tabs.tsx:56`, plain `<div>`), no
  `role="tab"` on the generated buttons (`:58-68`), no `aria-selected` reflecting
  `active_tab` (only a CSS class, `class={... this.active_tab === index ? 'active' : ''}`
  at `:63`), no `aria-controls` linking a tab to a panel, and **no panel is rendered by
  this component at all** — `render()` (`:53-73`) only emits the tab strip; panel content
  is left entirely to the consumer via the `tabClick` event (`:19,22,48-51`), with no
  `role="tabpanel"` guidance anywhere in the component or its docs.
- No keyboard handling beyond native `<button>` behavior: grepped `dda-tabs.tsx` for
  `onKeyDown`/`keydown`/`ArrowLeft`/`ArrowRight` — no matches. The WAI pattern requires
  `ArrowLeft`/`ArrowRight` (or `Up`/`Down`) to move a roving `tabindex` between tabs, and
  `Tab` to leave the tablist entirely and land in the panel. Here, because every tab is a
  real, natively-tabbable `<button>` with no roving-tabindex management, `Tab` moves
  sequentially through **every** tab button (not just the active one) before ever
  reaching a panel — the opposite of the pattern's intent — and arrow keys do nothing.
  No `.e2e.ts`/`.spec.tsx` exists under `dda-tabs/test/` to exercise any of this
  (confirmed: `find` for `*tabs*test*`/`*.e2e.ts` under the tabs folder returns nothing).
- Confirms and adds detail to the baseline's `dda-tabs.tsx:59` duplicate-`id` finding:
  `<button id={this.button_id} ...>` sits inside `this.parsedTabs.map(...)` (`:57-69`), so
  every generated tab button in a single `dda-tabs` instance shares one literal `id`
  string (whatever the consumer passed as the single `button_id` prop, `:14`) — not just
  "a duplicate ID bug" in the abstract, but every tab in every `dda-tabs` instance with
  more than one tab collides on the same `id`.

**`dda-segmented-tabs` — no, and more fundamentally broken than `dda-tabs`.**
`dda-segmented-tabs/dda-segmented-tabs.tsx:21-31` renders a `<div class="dda-segmented-group">`
of plain `<button>`s (`:26-27`) with **no `onClick` handler at all**, no `@State`, and no
selected/active tracking of any kind — grepped the whole file for `onClick`, `@State`, and
`active`: zero matches. This is not a keyboard-vs-mouse accessibility gap, it's that the
component has no interactivity whatsoever: clicking a segment with a mouse does nothing
different from clicking any other segment, and there is no way — keyboard or pointer — to
know which item is "selected," because the component never tracks a selection. Whatever
this component looked like before, as it stands in this source tree it renders a static
row of inert buttons. No ARIA roles (`tablist`/`tab`) are present either. This deserves a
functional bug flag ahead of any accessibility framing — Task 9 should treat "make the
buttons do something" as prerequisite to "make them accessible."

### Q4 — do `dda-footer`, `dda-banner`, `dda-sticky-footer` (all `shadow: true`) render correctly with only `dda.css` loaded?

Confirmed `shadow: true` on all three:
`dda-footer/dda-footer.tsx:6`, `dda-sticky-footer/dda-sticky-footer.tsx:7`,
`dda-banner/dda-banner.tsx:6`. Checked each component's own `styleUrl(s)` declaration and
the actual byte size of the CSS file(s) it references:

| Component | `styleUrls` declared | File size | Imports `global.css`? |
| --- | --- | --- | --- |
| `dda-footer` | `dda-footer.tsx:5`, `styleUrl: 'dda-footer.css'` (singular form, one file only) | `dda-footer.css` is **0 bytes** | No |
| `dda-sticky-footer` | `dda-sticky-footer.tsx:6`, `styleUrl: 'dda-sticky-footer.css'`; note `:5` has a **commented-out** `styleUrls: ['dda-sticky-footer.css', '../../global/global.css']` right above it | `dda-sticky-footer.css` is **0 bytes** | No — the line that would have imported it is commented out |
| `dda-banner` | `dda-banner.tsx:5`, `styleUrls: ['dda-banner.css', '../../global/global.css']` | `dda-banner.css` is 28 bytes, just `:host { display: block; }` | **Yes** |

**Finding, more severe than the brief's framing assumes:** the question "does the global
CSS reach the shadow root" almost doesn't need asking for `dda-footer` and
`dda-sticky-footer`, because **their own local stylesheets are empty** — 0 bytes each,
confirmed with `wc -l`. Even setting aside the shadow-root boundary entirely, these two
components ship with no CSS of their own. Rendered with *only* `dda.css` loaded (the
brief's stated scenario), or with any other combination of global stylesheets loaded, the
result is identical: unstyled raw HTML inside the shadow root, because nothing — local or
global — can put a single declaration inside that shadow root's stylesheet. Concretely,
`dda-footer.tsx`'s render output (`dda-footer.tsx:34-92`) leans entirely on shared utility
classes it never defines itself: `dda-container`, `dda-flex`, `dda-align-center`,
`dda-gap-5`, `dda-fs-display-sm`, `dda-fw-700`, `dda-color-black`, `dda-row`,
`dda-col-lg-4`, `dda-col-6`, `dda-col-sm-6`, `dda-col-md-3`, `mb-3`, `pt-4`,
`dda-justify-space`, `dda-gap-4` (all only defined in `global/global.css`, confirmed by
grep — none appear in `dda-footer.css`, which is empty) — none of it can apply inside the
shadow root. Same story for `dda-sticky-footer.tsx`'s `dda-footer-item`, `foot-icon-btn`,
`foot-logo`, `foot-menu` classes (`dda-sticky-footer.tsx`, various), which also only ever
exist as bare class names with no matching rule anywhere in the source tree once you
exclude the never-reachable global sheet.

`dda-banner` is the one component of the three that got this right: it explicitly lists
`../../global/global.css` as a second `styleUrls` entry (`dda-banner.tsx:5`), and Stencil
bundles a listed `styleUrls` file's content directly into the component-scoped stylesheet
it adopts into the shadow root — regardless of whether that file is also loaded elsewhere
on the page as a page-level stylesheet. So `dda-banner` genuinely does get `global.css`'s
utility classes inside its shadow root, correctly compensating for the shadow boundary.
However, `dda-banner`'s own markup classes (`dda-banner-slider`, `dda-banner-slide`,
`dda-banner.tsx:21,23`) are not defined in `dda-banner.css` (which contains only
`:host { display: block; }`) or in `global.css` (grepped both, no matches) — so the
slider layout itself (positioning/sizing of slides) has no CSS backing it either way.
Given `dda-banner` has no story (baseline, confirmed again here — no `.stories.tsx` file
in `dda-banner/`), this was never visually caught.

**Conclusion for Task 9:** this is not a hypothetical "global CSS doesn't reach shadow
DOM" caveat — for `dda-footer` and `dda-sticky-footer` specifically, the component-local
stylesheets that Stencil would correctly bundle into the shadow root are simply empty
files, so there is no fix that involves loading a different combination of external
stylesheets; the fix has to add real CSS (either directly in the local file, or by
importing `global.css` the way `dda-banner` does, provided the classes used are actually
defined in it).

### `dda-breadcrumb` and `dda-pagination` — not targeted by a specific question in this group, brief note

Neither has a dedicated question in the brief for this group; light-touch check only.
Both use real interactive elements (`<a>` in breadcrumb, `<button>` in pagination) so no
keyboard-reach concern. One shared observation worth carrying to Task 9: neither marks the
current position with `aria-current`. `dda-breadcrumb.tsx:31` marks the last crumb with
`class={... index === this.breadcrumbs.length - 1 ? 'active' : ''}` (CSS only, no
`aria-current="page"`); `dda-pagination.tsx:111` marks the current page button with
`class={i === this.current_page ? 'active' : ''}` (same gap, no `aria-current="page"`).
Same shape of gap as the stepper components reviewed in Group 4 (see below) — a screen
reader user gets no non-visual indication of "this is where you are" in either component.

### Group 2 summary

New findings beyond the baseline:

1. `dda-header.tsx:268`'s overlay-div click handler is not a keyboard trap — Escape
   (`:82-89,95`) and a real close button (`:340`) already cover keyboard dismissal.
   `dda-header.tsx:271`'s hamburger-div handler works for keyboard users only because of
   event bubbling from the real nested `<button>` at `:273` — a code smell, not a defect.
2. `dda-header` is fixed (`global/templates/dda-header-main.css:1-10`, reached via
   `global/global.css`) with **zero** `scroll-padding`/`scroll-margin` mitigation anywhere
   in the codebase — a real, unmitigated WCAG 2.4.11 risk, though the exact on-page effect
   needs a browser to confirm.
3. `dda-sticky-footer` is **not actually fixed to the viewport at all** as shipped — its
   local stylesheet is empty and the global rule that would fix it can't cross the shadow
   boundary — reframing the brief's Q2 for this component entirely.
4. `dda-footer.css` and `dda-sticky-footer.css` are both 0-byte empty files — these two
   `shadow: true` components have no CSS backing whatsoever, local or global, confirmed by
   `wc -l`.
5. `dda-banner` correctly imports `global.css` into its shadow-scoped bundle
   (`dda-banner.tsx:5`) — the one of the three `shadow: true` components that got the
   global-CSS-into-shadow-DOM problem right — but its own layout classes
   (`dda-banner-slider`/`dda-banner-slide`) are undefined anywhere, and it has no story to
   have ever caught that.
6. `dda-tabs` implements none of the WAI tabs pattern's ARIA (`tablist`/`tab`/`aria-selected`/
   `aria-controls`) or keyboard behavior (arrow-key roving tabindex) — confirms and
   substantially details the baseline's `dda-tabs.tsx:59` duplicate-id note.
7. `dda-segmented-tabs` has no click handler, no state, and no selection tracking at all
   (`dda-segmented-tabs.tsx:21-31`) — a functional defect prior to any accessibility
   question.
8. `dda-breadcrumb` and `dda-pagination` both mark the "current" item with a CSS class
   only, never `aria-current` — `dda-breadcrumb.tsx:31`, `dda-pagination.tsx:111`.

Not determined without a browser: the precise visual/DOM outcome of tabbing to a
near-top-of-page element under `dda-header`'s fixed positioning (item 2 above) — the
absence of mitigation CSS is a confirmed code fact; the resulting on-screen overlap is
not, and would need a live scroll-and-tab test to quantify.

---

## Group 3 — Disclosure and overlay components

`dda-accordion`, `dda-dropdown`, `dda-tooltip`, `dda-alert`, `dda-banner`.

### Q1 — `dda-accordion`: keyboard-operable? `aria-expanded`?

**No to both, and this is a confirmed WCAG 2.1.1 failure the automated sweep cannot see —
worth explaining why, since the baseline reports 0 failures for 2.1.1 project-wide.**
`dda-accordion.tsx:26`: `<div class="accordion-header" onClick={() => this.toggleAccordion()}>`
— a plain `<div>`, no `tabindex`, no `role="button"`, no `onKeyDown`. Grepped the whole
file for `aria-expanded`/`aria_expanded`/`ariaExpanded` and for
`tabindex`/`tabIndex`/`onKeyDown` — zero matches on every term. There is no nested
natively-focusable element inside the header either (unlike `dda-header`'s hamburger
div, which wraps a real `<button>`) — `dda-accordion.tsx:30-34` is just an icon and two
`<span>`s. **A keyboard-only user cannot open this accordion at all**: `Tab` skips over
it entirely, so there's no way to even reach it, let alone activate it with Enter/Space.

This is not caught by the baseline's automated WCAG 2.1.1 checker
(`packages/stencil/scripts/wcag22-checks.ts:103-130`) by design, not oversight — I read
its implementation to understand why. Its `expected` set of "should be reachable"
elements is built from a fixed selector,
`INTERACTIVE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'`
(`wcag22-checks.ts:3`). The checker verifies that everything matching that selector *is*
reachable by `Tab` — it has no way to notice that a `<div>` with a click handler *should*
have matched that selector but doesn't, because it was never given a `tabindex` in the
first place. A click-handler-bearing `<div>` that was never made focusable is invisible to
this check on both sides of the comparison: it isn't "expected," so failing to reach it
can't register as a shortfall. This is exactly the class of gap Task 6 exists to catch —
recording it here as a new, confirmed defect, and as a documented limitation of the
automated checker for Task 9/future task-writers to know about.

### Q2 — `dda-dropdown`: does Escape close it? Does focus return to the opening button?

**No to both.** Grepped `dda-dropdown.tsx` for `Escape`, `keydown`, `KeyDown`, `.focus(`,
`outside`, `Outside`, and `blur`/`Blur` — zero matches on every term. The component's only
dismissal path is `selectOption()` (`dda-dropdown.tsx:41-46`, sets `isopen = false` when
an option is picked) or pressing the toggle button again (`toggleDropdown()`,
`:35-39`, called from the button's own `onClick` at `:62`). There is no `Escape` key
handler, no outside-click handler (contrast with `dda-header`, which does have
`handleOutsideClick`/`handleOutsideAccessibilityClick`/`handleOutsideMegaMenuClick` at
`dda-header.tsx:92-94` — `dda-dropdown` has no equivalent at all), and no `.focus()` call
anywhere in the file, so there is no code path that could return focus to the trigger
button under any circumstance, because there's no code path that closes it any way other
than an explicit click inside the widget. A keyboard user who opens the dropdown and wants
to back out without picking an option has no way to close it except tabbing to the same
toggle button again and re-activating it — workable, but not the WAI-ARIA menu/listbox
pattern's expected `Escape`-to-close-and-return-focus behavior.

### Q3 — `dda-tooltip`: the three WCAG 1.4.13 requirements

`dda-tooltip.tsx` (27 lines total) has **no JavaScript show/hide logic at all** — it is a
pure CSS `:hover` tooltip. The only trigger rule, `dda-tooltip.css:17-20`:
```
.dda-tooltip-container:hover .dda-tooltip-box {
  visibility: visible;
  opacity: 1;
}
```
Grepped `dda-tooltip.css` and `dda-tooltip.tsx` for `:focus` and `setTimeout` — zero
matches for either.

1. **Dismissible without moving the pointer (e.g. `Escape`) — fails.** There is no
   JavaScript in this component at all, so there is no `Escape` handler and no way to
   dismiss the tooltip except moving the pointer away (which the criterion explicitly
   says must not be the only way).
2. **Pointer can move onto the tooltip content — passes, verified structurally.**
   `.dda-tooltip-box` (`dda-tooltip.tsx:20-23`) is a DOM descendant of
   `.dda-tooltip-container` (`:18`), absolutely positioned within it
   (`dda-tooltip.css:6-16`), not a sibling rendered elsewhere (e.g. via a portal). Because
   `:hover` matches as long as the pointer is anywhere within the ancestor's box,
   including over a descendant, moving the pointer from the trigger onto the rendered
   tooltip box keeps `.dda-tooltip-container:hover` true and the box visible. This one
   holds up.
3. **Persistent until the user dismisses it — passes on its own terms, but see the more
   fundamental problem below.** No `setTimeout`/timer of any kind exists in the file, so
   there's no auto-hide-after-N-seconds behavor to fail this specific sub-criterion.

**A more fundamental problem than any of the three sub-criteria: this tooltip is
invisible to keyboard users, full stop.** The show/hide rule is keyed on `:hover` only —
`dda-tooltip.css:17` has no `:focus` or `:focus-within` counterpart. A sighted keyboard
user who tabs to whatever's inside the tooltip's `<slot>` (`dda-tooltip.tsx:19`) never
sees the tooltip appear at all, because nothing about focusing that element matches the
`:hover` selector. WCAG 1.4.13 governs content that *is* shown on hover or focus; this
component only ever satisfies the hover half of that trigger, so a keyboard user gets no
equivalent of whatever information the tooltip conveys — arguably a more basic failure
(closer to 4.1.2/2.1.1 territory: keyboard users get strictly less information than mouse
users) than the three-part 1.4.13 test the brief asks about, and worth flagging as more
urgent than the dismiss-without-moving-pointer gap above.

### Q4 — `dda-alert`: `role="alert"` or `role="status"`?

**Neither — no `role` attribute at all.** `dda-alert.tsx:36`:
`<div class={`dda-alert dda-alert-${this.type} dda-alert-${this.variation} ...`}>` is the
entire root element, with no `role` anywhere in the file (grepped `dda-alert.tsx` for
`role=` — zero matches). A screen reader user will not be automatically notified when a
`dda-alert` is inserted into the page (e.g. a toast-style validation summary appearing
after a form submit) — the element carries no live-region semantics, so assistive tech
only discovers it if the user happens to navigate onto it. This is a plain, confirmed gap
against the brief's own framing of the question — no judgment call needed, just an absent
attribute.

### Q5 — `dda-banner`: no story, no document

Confirmed, with the directory listing itself as evidence:
`packages/stencil/src/components/dda-banner/` contains only `dda-banner.tsx`,
`dda-banner.css`, and the auto-generated `readme.md` — no `.stories.tsx`, no `.mdx`. Per
this task's brief ("write both, or record why it should be removed") and this task's own
constraint (no repairs — Task 9 repairs), recording the judgment rather than authoring the
files:

**Recommendation: fix and document, do not remove — but the component needs real work
first, not just a story.** `dda-banner` is a small, plausible primitive (an image slider),
and its `@Prop()` surface (`slides`, `slider_width`, `slider_height`,
`dda-banner.tsx:9-11`) is coherent enough to write a story and doc for. But two defects
found in Group 2's Q4 review should be fixed *before* a story is written, or the story
will document broken behavior: (1) `dda-banner-slider`/`dda-banner-slide`
(`dda-banner.tsx:21,23`) have no CSS anywhere — grepped `dda-banner.css` and
`global/global.css`, neither defines them — so the "slider" currently has no layout
styling of its own (images stack with only inline `width`/`height` from `:24`, no
flex/grid/overflow/scroll-snap to make it behave like a slider); and (2) there is no
autoplay, navigation, or interactivity of any kind in `dda-banner.tsx` — it's a static
map over `parsedSlides` with no `@State` beyond that array and no controls, despite the
baseline listing story names `components-home-banner--default/autoplay` that suggest
autoplay is an established pattern in this library for the *similarly-named*
`dda-home-banner` (a different, already-storied component — see Group 4/`dda-home-banner`
below) that `dda-banner` does not share. Writing a story today would either need to leave
the slider looking unstyled and static (documenting the bug as if it were the design) or
be written against behavior that doesn't exist yet. Recommend Task 9 treat "give
`dda-banner` real slide styling and pick a documented interaction model (static grid vs.
actual carousel)" as a prerequisite step before "write its story and doc."

### Group 3 summary

New findings beyond the baseline:

1. `dda-accordion`'s clickable header is a plain, non-focusable `<div>`
   (`dda-accordion.tsx:26`) with no `tabindex`, `role`, `onKeyDown`, or `aria-expanded` —
   a confirmed WCAG 2.1.1 failure invisible to the automated checker because its
   `INTERACTIVE` selector (`wcag22-checks.ts:3`) only verifies reachability of elements
   already marked interactive, and this one never was.
2. `dda-dropdown` has no `Escape` handler, no outside-click handler, and no `.focus()`
   call anywhere — it cannot be closed except by picking an option or re-clicking the
   trigger, and focus is never programmatically returned to the trigger.
3. `dda-tooltip` is pure-CSS, `:hover`-only (`dda-tooltip.css:17-20`) with no `:focus`
   trigger at all — content is invisible to keyboard users entirely, a more basic gap than
   the three WCAG 1.4.13 sub-criteria the brief asks about. Of those three: hoverable
   (pass, structurally verified), persistent/no-timeout (pass, no `setTimeout` in the
   file), dismissible-without-moving-pointer (fail, no `Escape` handling anywhere).
4. `dda-alert` has no `role` attribute at all — neither `role="alert"` nor `role="status"`
   — confirmed by grep, `dda-alert.tsx:36`.
5. `dda-banner` has no story or doc (confirmed by directory listing) and, per this task's
   Group 2 findings, has undefined layout CSS for its slider classes and no interactivity
   — recommend those be fixed before a story is written, not written now (out of scope for
   this task).

Not determined without a browser: none in this group — every question here was answerable
directly from source (presence/absence of handlers, selectors, and attributes), unlike
some of Group 1/2's timing- or rendering-dependent questions.
