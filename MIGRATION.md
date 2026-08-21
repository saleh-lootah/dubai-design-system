# Migrating to v5

**Who needs to read this:** anyone upgrading `@dubai-design-system/*` from `3.x` to `5.0.0`.

Most consumers need to change **nothing in their own code**. The changes below affect you
only if you wrote CSS or JavaScript that reaches *inside* a component's rendered markup, or
if you relied on one of the hardcoded ids these components used to emit.

**Why 5.0.0 and not 4.0.0** — a `4.1.0` was published in February 2025 and never tagged
`latest`. Releasing a `4.x` now would let anyone on a `^4` range resolve to that older build
instead of this one. Skipping to 5 avoids the collision. There is no 4.x you should be on.

---

## Do this first: a five-minute triage

Search your own codebase for these. If none of them hit, you can upgrade without changes.

```bash
# hardcoded ids these components used to emit
grep -rn "getElementById('search')\|getElementById(\"search\")\|#search\b" src/
grep -rn "getElementById('editor')\|getElementById(\"editor\")\|#editor\b" src/

# reaching into a shadow root that no longer exists
grep -rn "shadowRoot" src/ | grep -i "footer"
grep -rn "::part(" src/

# selectors keyed on an element type that changed
grep -rn "div\.accordion-header\|span\.chip-close\|div\.dots" src/
grep -rn "\.dda-avatar\s*>\|\.dda-avatar >" src/
```

Then load a page in dark theme and look at the footers — if they previously appeared
unstyled, they will now be fully styled, and that is the intended fix.

---

## Breaking changes, and what to do

### 1. `dda-footer` and `dda-sticky-footer` no longer use shadow DOM

They rendered as **unstyled raw HTML** in 3.x: their shadow stylesheet was 0 bytes and
global CSS could never reach inside. They now render fully styled.

| | 3.x | 5.0 |
|---|---|---|
| `element.shadowRoot` | a `ShadowRoot` | `null` |
| `::part(...)` | targetable | nothing to target |
| Appearance | unstyled | fully styled |

**Migrate:** delete any `shadowRoot` traversal or `::part()` rules for these two. Style them
with ordinary selectors — their markup is now in the light DOM. **Re-check your footer
layout visually**; this is a total visual change, not a tweak.

### 2. Hardcoded ids removed: `#search` and `#editor`

`dda-search-input` emitted `id="search"` and `dda-textarea` emitted `id="editor"` on every
instance — which meant duplicate ids the moment you used two on a page.

```html
<!-- 3.x — id was implicit -->
<dda-search-input label="Find"></dda-search-input>
<script>document.getElementById('search').focus()</script>

<!-- 5.0 — you supply the id -->
<dda-search-input label="Find" input_id="site-search"></dda-search-input>
<script>document.getElementById('site-search').focus()</script>
```

**Migrate:** set `input_id` (both components) to whatever id your code expects. This fails
*silently* — `getElementById` just returns `null` — so grep rather than waiting for an error.

### 3. `dda-search-input`'s label now points at the input

In 3.x the visible `<label for>` targeted the clear button, so screen readers announced your
label as the button's name. It now targets the text field.

**Migrate:** set `input_id`. Without it the label has nothing to associate with.

### 4. `dda-avatar` wraps its content in `.avatar-trigger`

```html
<!-- 3.x -->
<dda-avatar><div class="dda-avatar"><img …></div></dda-avatar>

<!-- 5.0 — a wrapper always sits between -->
<dda-avatar><div class="dda-avatar">
  <button class="avatar-trigger"><img …></button>   <!-- when `options` is set -->
  <div class="avatar-trigger"><img …></div>          <!-- when it is not -->
</div></dda-avatar>
```

**Migrate:** replace direct-child selectors (`.dda-avatar > img`) with descendant selectors
(`.dda-avatar img`).

### 5. Element types changed on three controls

These were `div`/`span` with a click handler and **no keyboard access at all** — a keyboard
user could not open an accordion, dismiss a chip, or change a banner slide.

| Component | 3.x | 5.0 | Class |
|---|---|---|---|
| `dda-accordion` | `div.accordion-header` | `button.accordion-header` | unchanged |
| `dda-chip` | `span.chip-close` | `button.chip-close` | unchanged |
| `dda-home-banner` | `div.dots` (direct `ul` child) | `li > button.dots` | unchanged |

**Migrate:** drop the element type from your selectors — use `.accordion-header`, not
`div.accordion-header`. For the banner dots, also drop any direct-child combinator: there is
now an `<li>` in between, so `ul > .dots` no longer matches.

---

## Behaviour changes — no code change required, but check these

**`dda-header` sets `scroll-padding-top` on `:root`** (170px; 100px below 767px) so keyboard
focus cannot land behind the fixed header. This is document-wide: **every** anchor jump and
`scrollIntoView()` on your page is now offset. If you already compensated for the header
manually, remove your workaround or you will double-offset.

**`dda-home-banner` writes `inert` and `aria-hidden` onto your own `<slide>` elements.**
Offscreen slides become unfocusable and unclickable. If your JavaScript listens for events
inside a non-current slide, it will silently stop firing. The component also gained a full
carousel surface — autoplay, prev/next/pause controls, a live region — where in 3.x it did
nothing at all.

**`dda-segmented-tabs` now selects its first segment on load.** In 3.x the component had no
interactivity whatsoever: clicking did nothing and no segment was ever marked active.

**`dda-sticky-footer` marks itself `inert` while scroll-hidden.** Previously it was moved
offscreen but stayed focusable — keyboard users could tab into an invisible footer.

**`dda-tabs`:** `aria_label` now names the tab *group*; each tab is named by its own text.

**`dda-pagination`:** dot spacing 8px → 15px, so the control is wider.

**`dda-tooltip`:** `Escape` now dismisses an open tooltip.

**Dark theme:** `--dda-primary-variant-95` and `--dda-color-warning-40` changed value. Info
alerts get a deeper fill; warning alerts a brighter amber. Both are existing palette steps —
no new colour was invented. See `docs/a11y/contrast-decision.md`, including how to overturn
it: the constraint to preserve is the contrast ratio, not the hex.

**Muted and disabled text is darker in light theme.** At its 3.x value it measured 2.60:1
against the disabled field background — unreadable for many users. Disabled controls will
read as more present than you may expect; that is deliberate.

**`dda-header`'s accessibility icon glyph changed** from `accessible_forward` to
`accessibility`.

---

## New props you may want

Additive — nothing breaks if you ignore them.

| Component | Prop | Why |
|---|---|---|
| `dda-search-input`, `dda-textarea` | `input_id` | Required to restore a removed hardcoded id |
| `dda-creditcard-field`, `dda-phonefield` | `autocomplete` | Browser autofill (WCAG 1.3.5) |
| `dda-progressbar` | `aria_label` | Names the progress bar for screen readers |
| `dda-home-banner` | `autoplay`, `interval`, and label props | The carousel is real now |
| `dda-segmented-tabs` | `selected_index` | Choose the initially selected segment |

---

## CDN users

Nothing to configure — jsDelivr syncs from npm automatically. Use a **pinned version**:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dubai-design-system/components-js@5.0.0/dist/dda/dda.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
<script type="module">
  import { defineCustomElements } from 'https://cdn.jsdelivr.net/npm/@dubai-design-system/components-js@5.0.0/loader/index.js';
  defineCustomElements();
</script>
```

Do **not** use `@latest` — jsDelivr caches version aliases at the edge, and an unversioned
loader URL does not resolve the loader's relative chunks reliably.

### A note if you are on `@latest` today

`dist/dda/dda.css` was **missing from 3.12.16 entirely** — the build stopped generating it,
and jsDelivr has been serving a stale cached copy from an older release. That cache would
have expired on its own eventually, taking your stylesheet with it.

5.0.0 restores the file, and it is a verified **superset** of the stale copy jsDelivr has
been serving: every one of the 518 classes in that file is still present, including utility
and typography classes that had been dropped from the source. Nothing that renders on your
page today stops rendering.

Those legacy rules live in `src/global/legacy-compat.css` and are shipped for compatibility
only. They will be deprecated deliberately in a future major, with notice — not removed by
silent omission.

Note that `dda.css` ships **no icon font**. The Material Icons link above is required, or
icons render as words like `chevron_right`.

---

## If something breaks that isn't listed here

`docs/a11y/consumer-impact.md` has the full itemised list with file and line citations for
every change, and `docs/a11y/findings.md` records the defect behind each one.

Be aware that list is **thorough but not guaranteed exhaustive** — two items were found after
it was first considered complete. If you hit something undocumented, it is a gap in our
disclosure, not your mistake. Please open an issue.
