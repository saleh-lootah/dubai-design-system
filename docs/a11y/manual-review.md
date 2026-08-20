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

---

## Group 4 — Remaining components

`dda-button`, `dda-link-button`, `dda-chip`, `dda-avatar`, `dda-progressbar`,
`dda-range-slider`, `dda-credit-card`, `dda-ui-card`, `dda-home-banner`,
`dda-horizontal-stepper`, `dda-vertical-stepper`.

### The 15 needs-manual-contrast cases — verdict, with computed numbers

This is the highest-value work in this task. I traced each case to the exact CSS rule
responsible and, for 11 of the 15, computed the actual WCAG relative-luminance contrast
ratio between the unfocused and focused colors using the real token hex values from
`global/color.css`. The common 3:1 threshold for a perceivable UI-state change (per WCAG
1.4.11 Non-text Contrast, the standard most reviewers apply when judging whether a
"focus changed something, but not via outline/box-shadow" case actually satisfies 2.4.7)
is the bar used throughout.

**Root cause confirmed for 8 of 15 (`dda-button`/`dda-link-button`) plus 3 more that
turn out to share it (`dda-home-banner` x2, `dda-search-input` x1) — 11 of 15 total:**
`global/dda-button.css:8` sets `.dda-btn { outline: 0; }` unconditionally, and every
`btn-color-*:focus` rule that attempts to restore a focus outline uses a malformed
single-value shorthand, e.g. `dda-button.css:25-28`:
```
.btn-color-default-primary:focus {
  background-color: var(--dda-on-primary-variant-20);
  outline: var(--dda-on-primary-variant-20);
}
```
`outline: <color>` is syntactically legal CSS, but a shorthand property resets every
sub-property it doesn't mention to its initial value — `outline-style`'s initial value is
`none`. So `outline: var(...)` sets `outline-color` and silently forces
`outline-style: none`, producing **no rendered outline at all**, regardless of which color
variable is passed. This is present in essentially every `btn-color-*:focus` block
(`dda-button.css:25-28,58-61,72-74,130-134,145-149,162-165,176-179,333-336,347-351,
363-367,378-382,395-399,411-415,427-431,442-446,458-462,473-477` — the `link`-variant
rules at `:115-117,219-221,318-320` use `outline: auto`, which *is* syntactically valid
and would restore a real outline — those three are not part of the needs-manual set and
are not examined further here). With the outline gone, the only surviving focus
indication is whatever `background-color`/`border-color` change the same rule declares —
exactly the shape of change the automated checker calls "needs manual contrast check."

I computed the actual contrast ratio between the resting and focused background color for
the three `button_color` variants the baseline's 4 button/4 link-button entries map to
(`DefaultPrimary` → `btn-color-default-primary`, `ErrorPrimary` → `btn-color-error-primary`,
`SurfacePrimary` → `btn-color-onsurface-primary`, `IconButton` → `btn-color-default-primary`
again — confirmed against `dda-button/dda-button.stories.tsx:91-149`), in both themes,
using the real hex values from `global/color.css`:

| Variant | Light: resting → focus | Light ratio | Dark: resting → focus | Dark ratio |
| --- | --- | --- | --- | --- |
| `btn-color-default-primary` (`dda-button.css:16-28`) | `#006A67` → `#003735` | **2.04:1** | `#21BEBA` → `#C2FFFB` | **2.08:1** |
| `btn-color-error-primary` (`dda-button.css:121-134`) | `#C0000A` → `#930005` | **1.45:1** | `#FF8A7B` → `#FFDAD5` | **1.77:1** |
| `btn-color-onsurface-primary` (`dda-button.css:225-237`) | `#000000` → `#444747` | **2.24:1** | `#FFFFFF` → `#C4C7C6` | **1.70:1** |

**Verdict: all three variants, in both themes, fail the 3:1 threshold.** None comes
within a full point of it; `error-primary` is the worst at 1.45:1–1.77:1 — barely
perceptible as a change at all, let alone a reliable one. This resolves all 4
`dda-button` and all 4 `dda-link-button` needs-manual entries (`dda-link-button` shares
the exact same `btn-color-*` classes via its own `styleUrls: ['../../global/dda-button.css',
...]`, `dda-link-button.tsx:5`, and renders them on an `<a>`, `dda-link-button.tsx:43-50`)
as **confirmed WCAG 2.4.7 failures**, not passes. Source for the token values:
`global/color.css:1-76` (primary scale, light `:root` and `:root[data-theme='dark']`
blocks), `:150-210` (error scale), `:461-520` (neutral/surface scale). Method: standard
WCAG relative-luminance formula (sRGB → linear, `L = 0.2126R + 0.7152G + 0.0722B`,
ratio `(L_lighter+0.05)/(L_darker+0.05)`), computed by hand against the hex pairs above.

**Side finding, not one of the 15 but discovered while tracing this:** every
`.light-mode.btn-color-*` rule in `dda-button.css` (e.g. `:30-45,63-75,91-101`) is dead
code. The library's actual theme switch is the `data-theme` attribute on `<html>`
(`.storybook/preview.js:12-13`, `setThemeAttribute` → `document.documentElement.setAttribute
('data-theme', theme)`; `global/color.css:53` uses `:root[data-theme='dark']`), but
`dda-button.css`'s light-specific overrides are gated behind a literal `.light-mode` CSS
class. Grepped the entire non-`dist` source tree (`.ts`/`.js`, excluding `node_modules`)
for anywhere that adds a `light-mode` class — zero matches. These rules can never match
any element as the codebase is wired today. They happen to be harmless here (the base,
always-applied rule already resolves to the same color via the CSS-variable cascade for
light theme), but it's dead, misleading code worth flagging for Task 9's cleanup pass.

**`dda-home-banner--default`/`--autoplay` (2 of 15) — same root cause, confirmed by
tracing the actual slotted markup.** `dda-home-banner.stories.tsx:5-14` defines each
slide's content, including `<dda-button button_color="default-primary" size="lg">Call to
action</dda-button>` (`:12`). `dda-home-banner` is `shadow: false`
(`dda-home-banner.tsx:8`), so this slotted `<dda-button>` is a normal reachable Tab stop
that receives the same global `dda-button.css` as everywhere else. I checked
`dda-home-banner`'s own CSS first, since the component's other four controls
(prev/next/pause/dots) do have a correctly-formed focus-visible rule —
`dda-home-banner/home-banner.css:181-186`:
```
.slider-nav .prev:focus-visible, .slider-nav .next:focus-visible,
.slider-nav .pause:focus-visible, .slider-nav .dots:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px rgba(0, 0, 0, 0.65);
}
```
— a real, well-designed box-shadow ring (the code comment above it even explains the
white/black double-ring choice for legibility over photography). Those four controls are
correctly excluded from the needs-manual list entirely. The slotted `dda-button`
"Call to action" is the one element in this story without a dedicated rule, and it falls
through to the exact same broken `btn-color-default-primary:focus` chain analyzed above.
**Verdict: fails, same 2.04:1/2.08:1 numbers as the `dda-button` case above** — this is
not a defect in `dda-home-banner` itself (which is otherwise carefully built — proper
`role="region"`, `aria-roledescription="carousel"`, `aria-current` on the dots at
`dda-home-banner.tsx:250`, a live region at `:262` — see also the baseline's note that
this component was recently repaired), it inherits the `dda-button` defect through
composition.

**`dda-search-input--with-button` (1 of 15) — same root cause again.** The `WithButton`
story sets `show_button: true` (`dda-search-input.stories.tsx:145`), which renders
`dda-search-input.tsx:46`: `<button ... class="dda-btn btn-color-default-primary
dda-btn-sm">Search</button>` — the identical class combination. **Verdict: fails, same
numbers.**

**`dda-footer--default` (1 of 15) — cannot pass, for a reason unrelated to contrast
math.** Per this task's Group 2 findings: `dda-footer.css` is a confirmed 0-byte file and
`dda-footer` is `shadow: true`, so no authored CSS of any kind (local or global) can reach
inside its shadow root. There is no deliberate, designed focus-color change here to
measure a ratio for — whatever the automated checker detected as "a color difference" is,
at best, an artifact of browser default UA styling on the native `<button>` elements
Stencil renders for the nested `<dda-button>` instances, not anything this codebase
authored. **Verdict: treat as failing regardless of the precise browser mechanism** — the
fix is "give `dda-footer` real CSS" (Group 2's recommendation), not "adjust a contrast
value," so a pass/fail contrast ruling on the current broken state isn't a meaningful
target.

**`dda-number-field--disabled`/`--error` and `dda-phonefield--error` (3 of 15) — a real
but different mechanism than the button case; contrast math alone doesn't settle it.**
Both components' actual text `<input>` carries class `dda-field-group-input`
(`dda-number-field.tsx:89`, `dda-phonefield.tsx:94`), not the generic `dda-input-field`
class that `dda-input`/`dda-textarea`/etc. use — so the codebase's main focus ring rule
(`global/input.css:76-79`, box-shadow-bearing) never matches these two components' actual
input element at all (it does match their wrapping `.dda-input-field-group` div, but that
div's `box-shadow` and `border-color` get overridden back to a static value by the later,
equal-specificity `.dda-validation-error .dda-input-field-group` (`input.css:243-247`) or
`.dda-input-disabled .dda-input-field-group` (`input.css:301-307`) rules — both apply
unconditionally, focused or not, so I could not find any property on the wrapper div that
actually changes with focus in either state). The element that **does** change is the
input itself, via `global/input.css:341-342`:
```
.dda-number-field .dda-field-group-input:focus,
.dda-phone-field .dda-field-group-input:focus {
  border-inline-start: solid 1px var(--dda-color-primary-40);
}
```
This adds a single 1px colored edge (left border only, in the RTL-aware `inline-start`
direction) where the base rule (`input.css:21-30`) had set `border: none`. Nothing in the
error/disabled rules overrides this specific longhand property, so it does survive in
both the "Disabled" and "Error" stories. **This is a genuine, if unusually weak, focus
indicator** — not the "no change at all" I initially expected from tracing the wrapper
div, and not a simple two-color-swatch contrast question either, since it's "no border" →
"one 1px colored edge appears," not a background recolor. I did not compute a formal
ratio for this one: the honest description is that `--dda-color-primary-40` (a fully
saturated teal, `#006A67` light / `#21BEBA` dark) would read with strong contrast against
either theme's typical light/dark field background if you could see it, but a single-pixel
partial-edge line is a genuinely marginal indicator at real-world screen density and zoom
levels — exactly the kind of edge case that benefits from an actual rendered check rather
than a token comparison. **Recording this as not fully resolved by static analysis**:
the mechanism and the file:line are confirmed, but whether a 1px inline-start-only border
change reliably reads as "focused" to a sighted low-vision user needs a live render to
settle, and I did not run one. Recommend Task 9 treat this as a design smell regardless
(a full-border or box-shadow ring would remove the ambiguity) rather than wait on a
contrast verdict that a screenshot would resolve in seconds.

**Summary verdict on the 15:** 11 of 15 are confirmed WCAG 2.4.7 failures with computed
numbers (`dda-button` x4, `dda-link-button` x4, `dda-home-banner` x2,
`dda-search-input` x1) — all trace to the same malformed `outline: <color>` shorthand
defect in `global/dda-button.css`. 1 of 15 (`dda-footer`) is unmeasurable-as-a-contrast-
question because there is no authored CSS behind it at all — treat as failing. 3 of 15
(`dda-number-field` x2, `dda-phonefield` x1) have a confirmed, different mechanism (a
1px partial-edge border, `input.css:341-342`) that is weak but real, and I'm not
confident enough in a static reading to call pass or fail — flagged as needing a live
check rather than guessed.

### Q1 — `dda-chip` and `dda-avatar`: keyboard-operable?

**Neither — no to both, same class of defect as `dda-accordion` in Group 3.**
`dda-chip.tsx:25`: `<span class="chip-close" onClick={this.clickHandler}>` — a `<span>`,
no `tabindex`, no `role`, no `onKeyDown` (grepped the file, confirmed zero matches on all
three). This is the chip's *only* dismiss control (`show_close_icon`, `:12,24`) — there is
no alternate keyboard path, unlike `dda-header`'s hamburger div which had a nested real
button. A keyboard user cannot remove/dismiss a chip that has `show_close_icon` set.

`dda-avatar.tsx:45`: `<div onClick={() => this.toggleDropdown()} class={{'dda-avatar':
true, ...}}>` — here the handler sits on the **entire root element** of the component,
not a small child, and again with no `tabindex`/`role`/`onKeyDown` (grepped, zero
matches). Same failure mode: not reachable by `Tab`, not operable if it somehow were
focused another way. Same automated-checker blind spot explained in Group 3's
`dda-accordion` finding applies identically here (`INTERACTIVE` selector in
`wcag22-checks.ts:3` never counts either element as "should be reachable").

**Additional finding while reading `dda-avatar.tsx`, a fourth instance of the recurring
duplicate-`id` bug:** `dda-avatar.tsx:59`:
`<button id={this.button_id} name={this.button_name} ... type="button" ...>` sits inside
`this.parsedOptions.map(option => (...))` (`:58-65`) — every rendered dropdown option
shares the one static `id` from the single `button_id` prop. Same pattern already found at
`dda-tabs.tsx:59`, `dda-phonefield.tsx:82`, and `dda-search-input.tsx:42`'s hardcoded id —
this is the fourth independent occurrence of this exact class of bug across the codebase,
strongly suggesting it's a copy-paste-propagated pattern rather than four unrelated
mistakes, worth a single systemic fix in Task 9 rather than four separate ones.

### Q2 — `dda-range-slider`: arrow keys, `role="slider"`, `aria-valuenow/min/max`?

**Yes to all — this component gets it right, unlike most of this codebase's custom
widgets, because it uses two real native `<input type="range">` elements instead of a
custom div-based control.** `dda-range-slider.tsx:64-76` and `:78-92` are both genuine
`<input type="range" min={this.min} max={this.max} step={this.step} value={...}>`
elements. A native range input has an implicit ARIA role of `slider` and the browser
automatically exposes `aria-valuenow`/`aria-valuemin`/`aria-valuemax` to the accessibility
tree directly from its `value`/`min`/`max` attributes — no explicit ARIA authoring is
needed or missing here, unlike `dda-select`/`dda-dropdown`'s custom button-and-list
widgets reviewed in Groups 1 and 3. Native range inputs also natively respond to
`ArrowLeft`/`ArrowRight` (and `ArrowUp`/`ArrowDown`) to change `value` by `step`, with no
custom keydown code required — confirmed there is none in the file, and none is needed.
The baseline's separate WCAG 2.5.8 finding (3 target-size failures for this component) is
a distinct, already-recorded issue about the touch-target hit area, not about the
keyboard/ARIA question asked here.

### Q3 — `dda-progressbar`: `role="progressbar"` with value attributes?

**No.** `dda-progressbar.tsx:16-39` is the entire component; grepped for `role`,
`aria-valuenow`, `aria-valuemin`, `aria-valuemax` — zero matches on every term. The
visual bar (`:24-31`, `<div class="dda-progress-value" style={{width: `${this.progress}%`}}>`)
conveys `this.progress` only through inline `width`, with no ARIA of any kind. A screen
reader user gets no indication this is a progress indicator or what value it holds — a
plain, confirmed gap.

### Q4 — `dda-ui-card`: no story, no document

Confirmed by directory listing: `packages/stencil/src/components/dda-ui-card/` has
`dda-ui-card.tsx`, `dda-ui-card.css`, `readme.md`, and (unlike `dda-banner`) a `test/`
folder with `dda-ui-card.e2e.ts` and `dda-ui-card.spec.tsx` — so it has test coverage but
no story and no `.mdx`. One functional defect worth fixing before a story is written:
`dda-ui-card.tsx:17` declares `@Event() linkClick?: EventEmitter<void>;` but it is never
emitted anywhere in the file (grepped `dda-ui-card.tsx` for `linkClick` — the only match
is the declaration itself) — the `<a>` at `:38-47` that would logically fire it has no
`onClick` handler at all. Per this task's no-repair constraint, not fixed here, but flagged
so Task 9 doesn't write a story that silently documents a dead event as if it worked.

### Q5 — do both steppers mark the current step with `aria-current="step"`?

**No, neither one — confirmed by grep, zero matches in both files.**
`stepper/dda-horizontal-stepper/dda-horizontal-stepper.tsx:24`:
`<div class={`h-step ${index === this.current_step ? 'active' : ''} ...}>`} — CSS class
only. `stepper/dda-vertical-stepper/dda-vertical-stepper.tsx:24`:
`<div class={`v-step ${index <= this.current_Step ? 'active' : ''}`}>` — same gap. Same
shape of finding as Group 2's `dda-breadcrumb`/`dda-pagination` note — a screen reader
user gets no non-visual signal of "you are here" in either stepper.

**Two additional bugs found while reading these, worth flagging even though not directly
asked:**
1. `dda-horizontal-stepper.tsx:10,24` — `current_step` defaults to `1`
   (`@Prop() current_step: number = 1`) but the active-step comparison is
   `index === this.current_step` against a 0-based `.map((step, index) => ...)` — so with
   the documented default, the step at `index === 1` (the **second** step) is marked
   active out of the box, not the first. Either the default should be `0` or the
   comparison should be `index === this.current_step - 1`; as shipped they disagree.
2. `dda-vertical-stepper.tsx:10`: `@Prop() current_Step: number = 0;` — capitalized `Step`
   mid-prop-name. Every other prop in this file, and across the whole codebase per
   CLAUDE.md's stated convention ("Props use `snake_case` names"), is fully lower snake_case
   (`custom_class`, `component_mode`). This one attribute would have to be written
   `current_-step`... no — as an HTML attribute, Stencil lowercases prop names by default
   unless an explicit `attribute:` mapping is given, so `current_Step` the *property* likely
   maps to `current_step` (or possibly `currentstep`) the *attribute*, and I did not verify
   which without a build — worth Task 9 checking directly rather than assuming, since it
   affects whether HTML consumers (React/Vue/Angular wrapper users, or raw HTML) can even
   set this prop by its documented name.

### `dda-credit-card` — not targeted by a specific question, brief note

No dedicated question in the brief for this component. Light-touch check: purely
presentational (`dda-credit-card.tsx:17-45`), no interactive elements of its own, so none
of this group's keyboard/ARIA questions apply. One thing worth a one-line flag:
`dda-credit-card.tsx:38`: `{this.name}` and `:38` `**** {this.card_number.slice(-4)}` will
throw if `card_number` is ever left unset (`undefined.slice` is a runtime error, no
guard) — a robustness issue, not an accessibility one, noted in passing since it would
crash the component rather than degrade gracefully.

### Group 4 summary

New findings beyond the baseline:

1. Full resolution of the 15 needs-manual-contrast cases — see the detailed section
   above. 11 are confirmed WCAG 2.4.7 failures with computed contrast ratios (1.45:1 to
   2.24:1, all below the 3:1 bar), all tracing to one malformed-`outline`-shorthand root
   cause in `global/dda-button.css`. 1 (`dda-footer`) has no authored CSS to even measure.
   3 (`dda-number-field` x2, `dda-phonefield` x1) trace to a real but different, weaker
   mechanism (a 1px partial-edge border) that I could not confidently call pass or fail
   from source alone.
2. `dda-button.css`'s entire `.light-mode.btn-color-*` rule set (dozens of rules) is dead
   code — the `.light-mode` class is never applied anywhere in the codebase; the real
   theme switch is `data-theme`, handled correctly only by the base (non-`.light-mode`)
   rules via CSS custom properties.
3. `dda-chip.tsx:25` and `dda-avatar.tsx:45` both have `onClick` on non-focusable elements
   (`<span>`/`<div>`) with no alternate keyboard path — confirmed defects, same automated-
   checker blind spot as `dda-accordion` in Group 3.
4. `dda-avatar.tsx:59` is a fourth independent instance of the duplicate-static-`id`-in-a-
   `.map()` bug already found at `dda-tabs.tsx:59`, `dda-phonefield.tsx:82`, and
   `dda-search-input.tsx:42`.
5. `dda-range-slider` correctly implements native keyboard/ARIA slider semantics via two
   real `<input type="range">` elements — a clean pass, worth noting as the exception.
6. `dda-progressbar` has zero ARIA (`role="progressbar"`, `aria-valuenow/min/max` all
   absent) — confirmed, plain gap.
7. `dda-ui-card` has a dead `linkClick` event that's declared but never emitted
   (`dda-ui-card.tsx:17`) — flagged so a future story doesn't document it as working.
8. Neither stepper sets `aria-current="step"`; `dda-horizontal-stepper` additionally has
   an off-by-one between its default `current_step` and its 0-based index comparison
   (`:10,24`), and `dda-vertical-stepper`'s `current_Step` prop breaks the codebase's
   snake_case convention (`:10`) in a way that may affect whether it's settable as an HTML
   attribute at all.

Not determined without a browser: whether the 1px `border-inline-start` focus indicator
on `dda-number-field`/`dda-phonefield` (input.css:341-342) is actually perceivable at
normal zoom — the mechanism and color are confirmed from source, the real-world
legibility is not. Also not fully verified: which HTML attribute name
`dda-vertical-stepper`'s `current_Step` prop maps to (item 8 above) — would need a
build/inspection of the compiled output to confirm rather than infer from the source
`@Prop()` declaration alone.
