# Consumer Impact — `chore/codebase-review-harness`

This branch fixed real, confirmed accessibility and correctness defects across 34
components (see `docs/a11y/findings.md`). Several of those fixes change what an existing
consumer's page renders, or what selectors/ids/labels their own CSS and JavaScript can
rely on. None of that is wrong to have fixed — every item below traces to a real defect —
but a maintainer running `npx lerna publish` needs to know this is not a patch release.

Every item below was verified directly against `git diff 9342a9c..HEAD` (the full branch
diff), not copied from a prior list on trust; sources are cited by file and line.

---

## Breaking

These change the published DOM shape, a documented attribute's presence, or a CSS
selector's match — an existing consumer's own CSS or JS can silently stop working.

- **`dda-footer` / `dda-sticky-footer`: `shadow: true` → `shadow: false`.**
  `dda-footer.tsx:5-6`, `dda-sticky-footer.tsx:5-6`. The shadow root is gone —
  `element.shadowRoot` now returns `null`, and any consumer CSS written against `::part()`
  no longer has anything to target. Both components previously rendered as **unstyled raw
  HTML** (the shadow root's own stylesheet was 0 bytes and never reached `global.css`); now
  both render fully styled. This is a total visual change on every existing page that uses
  either component — not a subtle shift, the footer will look completely different.

- **`dda-search-input`: hardcoded `id='search'` removed.**
  `dda-search-input.tsx:70` (pre-fix) is now driven by the new `input_id` prop, which is
  `undefined` unless a consumer sets it. Any existing consumer using `#search` in CSS or
  `document.getElementById('search')` in JS breaks silently — no error, the query just
  returns nothing. (This was also a real defect: `id='search'` collided across every
  instance of the component on one page — see F-025.)

- **`dda-search-input`: `<label htmlFor>` retargeted from `button_id` to `input_id`.**
  `dda-search-input.tsx:64`. Previously the visible label was (mis-)associated with the
  clear/close button, not the text field (F-017, a real defect: a screen reader announced
  the label as the button's name). A consumer who set `label` and relied on that
  association now needs to also set `input_id` for the label to reach the actual field.

- **`dda-textarea`: hardcoded `id="editor"` removed** the same way, in rich-editor mode.
  `dda-textarea.tsx:169` (pre-fix) → now targets `.dda-richeditor-field` internally, and
  externally, the editable surface's id is only set when a consumer supplies `input_id`.
  `#editor` / `getElementById('editor')` breaks silently for existing consumers using
  `enable_rich_editor`.

- **`dda-avatar`: content nested inside a trigger element.**
  `dda-avatar.tsx` (F-002, then re-scoped by this fix wave's Fix 1). **Final state, not the
  intermediate one**: when the `options` prop parses to a non-empty list, the avatar's
  photo/icon/text content is nested inside `<button class="avatar-trigger">`; when there
  are no options (the common case — most avatars are decorative), it is nested inside
  `<div class="avatar-trigger">` instead. Either way, `.dda-avatar > img` (or `> i`, `>
  span.avatar-main-text`) no longer matches — there is always now an intermediate
  `.avatar-trigger` wrapper that did not exist before this branch. A consumer selecting the
  avatar's inner content by direct-child selector breaks regardless of which branch they
  hit.

- **`dda-accordion`: `div.accordion-header` → `button`.** `dda-accordion.tsx:26`. The
  `accordion-header` class survives (styling is unaffected), but any consumer selector
  keyed on the element type (`div.accordion-header`, or a `div >` combinator expecting a
  `div`) breaks. The header is now a real, keyboard-reachable `<button>` (F-001 — it was a
  total keyboard lockout before).

- **`dda-chip`: `span.chip-close` → `button`.** `dda-chip.tsx:25`. Same shape of change:
  class survives, element type doesn't. Previously a keyboard user could not dismiss a chip
  at all (F-003); now it is a real `<button>` with `aria-label="Remove"`.

- **`dda-home-banner`: slide-dot navigation restructured — `<div class="dots">` →
  `<li><button class="dots">`.** Pre-fix: `<ul>{slides.map(() => <div class="dots"
  onClick={...}></div>)}</ul>` — bare `<div>`s as direct children of a `<ul>` (invalid HTML
  to begin with), mouse-only, no keyboard access. Post-fix
  (`dda-home-banner.tsx`, the slider-nav block): each dot is now a real
  `<button class="dots">` **wrapped in its own `<li>`**. Two independent breaks for an
  existing consumer: (1) `div.dots` no longer matches anything — the element type changed;
  (2) a direct-child selector (`ul > .dots`, `.slider-nav > .dots`) no longer matches
  either, because there is now an intervening `<li>`. This is the same
  div-with-onClick-and-no-keyboard-access pattern already named for `dda-accordion` /
  `dda-avatar` / `dda-chip` in `CONTRIBUTING.md`'s rule 3, occurring a fourth time in this
  same component and not previously called out anywhere in the branch's own documentation.

---

## Behavioural / rendering changes a consumer will notice

Not a broken selector, but a visible or functional difference on a page that already
exists and was not touched by whoever owns it.

- **`dda-header.css:28-35` sets `:root { scroll-padding-top: 170px }`** (100px at
  `≤767px`), unconditionally, document-wide, the moment a page includes `dda-header`. This
  is a component reaching outside its own subtree: every anchor jump and every
  `scrollIntoView()` call anywhere on a consumer's page is now offset by that amount, not
  just scrolling that happens to interact with the header. The mitigation is correct and
  necessary (F-009 — without it, a fixed header could permanently obscure a keyboard focus
  target), but it is a page-wide side effect, not a local one, and should be stated as such
  rather than discovered.

- **`dda-tabs.tsx:65`: `aria-label` moved from each tab button to the group container.**
  Each individual tab button's accessible name is now its own visible text (previously it
  inherited the shared group label). A screen reader user navigating tab-by-tab hears
  different names than before.

- **`dda-pagination.css:154`: dot `gap` `8px` → `15px`.** The control is measurably wider on
  screen — not a re-theme, a layout change. (Driven by target-size fix F-022: hit-area
  padding grew, and this dot variant's gap grew with it.)

- **`dda-home-banner.tsx:179-182` writes `inert`, `aria-hidden`, `role`, and
  `aria-roledescription` directly onto the *consumer's own* `<slide>` elements** — markup
  the component does not own, slotted in by the consumer. Non-current slides become `inert`
  (unfocusable, unclickable, hidden from the accessibility tree) the moment autoplay or
  manual navigation moves past them. A consumer with their own JS reading or listening on
  those slide elements (e.g. a script that toggles a class or reacts to a click inside a
  non-current slide) will see it silently stop responding once the slide is marked `inert`.

- **`dda-segmented-tabs`: segment 0 renders `.active` by default.**
  `dda-segmented-tabs.tsx` (new `active_index` state, defaulted via `selected_index = 0`,
  `componentWillLoad`). Before this branch the component had **no interactivity at all** —
  clicking did nothing and no segment ever carried `.active` (F-004: it was not a
  keyboard-vs-mouse gap, the component simply did not respond to any input). Every existing
  page using this component will now show its first segment visually selected on load,
  where previously none was.

- **`global/color.css:69,292`: dark-theme values of `--dda-primary-variant-95` and
  `--dda-color-warning-40` changed** (F-023's colour-token decision — see
  `docs/a11y/contrast-decision.md`). Any UI using either token in dark theme renders a
  different colour.

### Additional items found while verifying this list against the diff (not in the original report)

- **`dda-home-banner` gained substantially more surface than the `inert`/`aria-hidden`
  bullet above covers.** The component went from a static, non-interactive slide stack
  (per F-026, no autoplay, no navigation, no interactivity of any kind before this branch)
  to a full carousel: new `autoplay`, `interval`, `aria_label`,
  `previous_button_label`/`next_button_label`, `pause_button_label`/`play_button_label`,
  and `slide_button_label` props; new prev/next/pause buttons; `role="region"
  aria-roledescription="carousel"` on the host element; and a live region announcing slide
  changes. None of this was previously present to conflict with, so it is additive rather
  than breaking, but it is a far larger behavioural surface than the `inert` bullet alone
  suggests, and a consumer who was silently relying on "this component does nothing" (per
  F-026's own description of the pre-branch state) will now see it move.

- **`dda-header.tsx:315,518`: the accessibility button's icon glyph changed** from
  `accessible_forward` to `accessibility` (Material icon ligature). Small, but visible on
  every page using the header — the icon a sighted consumer sees is different. Unrelated to
  any accessibility defect; a separate icon-correctness fix (commit `82819a8`).

- **`dda-tooltip.tsx`: `Escape` now dismisses an open tooltip** (F-011, WCAG 1.4.13). A
  consumer whose own script listens for `Escape` at the document level while a tooltip is
  open will now also see the tooltip's own handler run first on the same keypress.

- **Ten-plus components gained a visible focus ring where none rendered before**
  (`dda-button`, `dda-link-button`, `dda-input`, `dda-select`, `dda-textarea`,
  `dda-search-input`, `dda-creditcard-field`, `dda-dropdown`, `dda-avatar`,
  `dda-phonefield`, `dda-number-field`, and this fix wave's `dda-select` option list — see
  `global/dda-button.css` and `global/input.css` diffs, F-019/F-020/F-021 and this wave's
  Fix 2). Every one of these controls now shows a white+dark double ring on keyboard focus
  where before there was none (`outline: 0` with no working override). This is the
  intended, necessary repair for a WCAG 2.4.7 failure, not a defect — but it is a visible
  change on every page using any of these components, every time a keyboard user tabs
  through it, and is worth stating plainly alongside the rest of this list rather than
  discovered one component at a time.

---

## Intended semver bump

**Major.** The package is at `3.12.16`; the next publish should be **`4.0.0`**, not a
minor or patch bump.

Reasoning: semver's contract is about the *public interface*, and for a web component
library shipped as raw custom elements with no build step required of the consumer, the
public interface is not just the documented props — it is also the rendered DOM shape,
because that is what consumer CSS and JS are written against. This branch changed that
surface in ways a consumer cannot work around without touching their own code:

- Two components (`dda-footer`, `dda-sticky-footer`) changed from an inert shadow boundary
  to none at all, with a **total visual rendering change** as a direct consequence (raw
  unstyled HTML → fully styled). There is no smaller-than-major classification for "this
  component now looks entirely different by default."
- Three hardcoded, consumer-reachable ids were removed (`dda-search-input`'s `id='search'`,
  its label's `for` target, `dda-textarea`'s `id="editor"`), each capable of silently
  breaking existing `getElementById`/`#id` usage with no error and no deprecation path.
- Four components changed an element's tag name while keeping its class
  (`dda-accordion`, `dda-avatar`, `dda-chip`, `dda-home-banner`'s slide dots) — a `div`- or
  `span`-keyed selector stops matching with no warning.

None of these are optional or deferrable — every one traces to a genuine, cited defect
(most of them total keyboard lockouts or a 0-byte stylesheet), and the correct engineering
call was to fix them, not to preserve a broken DOM shape for compatibility. But "the fix
was correct" and "the fix is backward-compatible" are different questions, and the answer
to the second one is no. A minor/patch bump implies a consumer can upgrade without
auditing their own code; that is false here for anyone who styled or scripted against the
elements named above.

---

## What this document does not cover

Every other prop addition and ARIA attribute this branch added (`aria-describedby`,
`aria-invalid`, `autocomplete`, `role="listbox"`, etc. — see `docs/a11y/findings.md` for
the full list) is purely additive: new attributes on existing elements, new optional props
with safe defaults, nothing removed or retargeted. Those do not appear above because they
cannot break an existing consumer — they were deliberately left out to keep this document
focused on the subset that can.
