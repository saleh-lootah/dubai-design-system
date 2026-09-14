# Upgrading to 5.1

This guide takes you from any earlier release of the Dubai Design System packages to
**5.1.0**. It ships inside `@dubai-design-system/components-js` as `MIGRATION.md`, next to
`CHANGELOG.md`.

All four packages share one version and must be upgraded together:
`@dubai-design-system/components-js`, `components-react`, `components-vue` and
`components-angular`.

---

## 1. Find your starting point

Check the version you have now:

```bash
npm ls @dubai-design-system/components-js
```

Then read the sections for your version, in this order:

| You are on | Read |
| --- | --- |
| **5.0.x** (5.0.0 – 5.0.3) | [Every upgrade](#2-every-upgrade-checklist) → [5.0.x to 5.1.0](#3-from-50x-to-510) |
| **4.1.0** | [Every upgrade](#2-every-upgrade-checklist) → [From 4.1.0](#5-from-410) → [From 3.x](#6-from-3x-to-50) → [5.0.x to 5.1.0](#3-from-50x-to-510) |
| **3.x** (3.12.16 or earlier) | [Every upgrade](#2-every-upgrade-checklist) → [From 3.x](#6-from-3x-to-50) → [Notes from 5.0.1](#4-notes-from-501-fonts-and-the-stylesheet) → [5.0.x to 5.1.0](#3-from-50x-to-510) |

Most pages need only a few attribute changes. The changes that can break something
**silently**, with no error in the console, are marked **Silent**. Search for those first.

---

## 2. Every upgrade: checklist

Do these whatever version you start from.

- [ ] **Install the same exact version of every DDA package.**

  ```bash
  npm install @dubai-design-system/components-js@5.1.0
  # and, if you use a wrapper:
  npm install @dubai-design-system/components-react@5.1.0   # or -vue / -angular
  ```

- [ ] **Load `dda.css`.** It carries the global styles and the Dubai typeface. From npm:
  `import '@dubai-design-system/components-js/dist/dda/dda.css';`. From the CDN, see
  [CDN users](#7-cdn-users).
- [ ] **Load the icon fonts.** `dda.css` ships no icon font. Without these links, icons render
  as words such as `chevron_right`.

  ```html
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
  ```

- [ ] **If you bundle with Vite or Rollup, do not use the lazy loader.**
  `defineCustomElements()` from `components-js/loader` (and the Vue plugin, which calls it)
  loads component chunks with dynamic imports these bundlers cannot follow, so the
  components never render. Import each component you use instead:

  ```js
  import '@dubai-design-system/components-js/dist/components/dda-header.js';
  import '@dubai-design-system/components-js/dist/components/dda-button.js';
  ```

  The CDN loader and the React wrapper are not affected.

- [ ] **If you self-host `dda.css`,** copy `dist/assets/fonts/` next to it and keep the
  relative path `../assets/fonts/dubai/`, or the Dubai typeface does not load.
- [ ] **Clear any cached copy of the old package** (CDN edge cache, service worker, build
  cache) and load every page type once: home page, a content page, a form, and a page on a
  phone-width screen.

---

## 3. From 5.0.x to 5.1.0

### Triage: run these first

```bash
# header: the old fixed search id is gone
grep -rn "ddaSearch" src/

# header: pages that relied on the automatic transparent style at "/"
grep -rln "<dda-header" src/

# vertical stepper: the prop that used to work
grep -rn "current_-step\|current_Step" src/

# components that showed placeholder text you may have relied on
grep -rn "<dda-toggle\|<dda-footer" src/

# manual offsets you may have added around the home-page quick links
grep -rn "quick-links-wrap" src/
```

### Changes that need action

**`dda-header` no longer turns transparent by itself at `/`.** **Silent.**
Before 5.1.0 the header added a `transparent` class to itself on the site root. That made the
menu links white while the header stayed white, so the top menu was invisible on every home
page. The header now never guesses from the URL.

- To keep a transparent header over a dark hero image, add the class to an ancestor:

  ```html
  <body class="transparent">
  ```

- The header now renders both logos and CSS shows the right one. If you set only
  `first-logo-src`, it is also used on the transparent header; set `first-logo-white-src`
  (and `second-logo-white-src`) for a white version.

**`dda-header` search is now a real search.** **Silent** if you scripted the old field.
The old field was not in a form and did nothing. It is now a `<form role="search">`:

- `id="ddaSearch"` is gone. Every header gets its own ids, so two headers on a page no
  longer clash. Replace `document.getElementById('ddaSearch')` with the new event.
- Pressing Enter emits a cancelable `searchSubmit` event with `detail.query`.
- Set `search_action` to a results page and the browser goes there with the query, no
  JavaScript needed. The parameter name is `search_input_name`, default `q`.
- On phone-width screens the search button now opens a search field under the header.

```html
<!-- static site: results page reads ?q= -->
<dda-header search_action="/search.html"></dda-header>
```

```js
// app with its own router
header.addEventListener('searchSubmit', (event) => {
  event.preventDefault();
  router.push(`/search?q=${encodeURIComponent(event.detail.query)}`);
});
```

In React the event is `onSearchSubmit`.

**`dda-toggle` shows no label unless you set one.**
It used to show the fixed text "Radio Button Title" and "Supporting Text". Set the new props:

```html
<dda-toggle input_id="news" title_text="Newsletter" supporting="One email a month"></dda-toggle>
```

Keep `aria_label` when there is no visible label.

**`dda-footer` shows no text under the logo unless you set it.**
It used to show the fixed sentence "Design outstanding interfaces with advanced Figma
features in a matter of minutes." Set `logo-description` (`logoDescription` in JavaScript and
the wrappers) to show your own text.

**`dda-vertical-stepper` reads `current_step`.**
The old prop was `current_Step`, and its HTML attribute was `current_-step`, so the documented
`current_step` attribute did nothing. `current_step` now works. It counts from 0: `1` is the
second step. `current_Step` and `current_-step` still work but are deprecated; move to
`current_step`.

**Side-menu links below the first level now navigate.**
Before 5.1.0 every nested `side-menu-items` link cancelled its click. Links without a
`subMenu` now go to their `href`. Check that nested items have real URLs; `"#"` now jumps to
the top of the page.

**Accessibility fixes that change markup.** **Silent** if your CSS or scripts target the old markup.

- `dda-sticky-footer` renders `<aside aria-label="Quick actions">`, not `<footer>`. Replace
  selectors such as `dda-sticky-footer footer` with `dda-sticky-footer .dda-footer`.
- `dda-ui-card` renders its title as `h3`, not `h1`. Set `heading_level` (1–6) to match your
  page outline, and target `.dda-card-title`, not `h1`.
- `dda-header` logo links go to `/` instead of `#`. Set `first-logo-href` and
  `second-logo-href`, especially if your site is served under a subpath, where `/` leaves it. The ReadSpeaker item shows only when `read-speaker-link` is set.
- Icon-only buttons now have English default names ("Close", "Remove", "Clear search",
  "Previous page", "Next page", "Menu"). On an Arabic page, set the matching `*_label` props.

### Changes to check, no code change expected

- **Headings are larger.** Before 5.1.0 an undefined token made every heading, `.dda-h1`–`.dda-h6`
  and component title render at body size (16px). Headings now follow the type scale (`h1`
  57px, `h2` 48px, `h3` 40px at a 16px base) and component titles use their own sizes. If a page
  looks too large, set a smaller heading level or class rather than restyling the tokens; to
  change the scale itself, override `--dda-h1`…`--dda-h6`.

- **The page no longer scrolls behind the open hamburger menu.** While the menu is open, the
  header adds `dda-scroll-lock` to `<html>`, which sets `overflow: hidden` on `html` and
  `body`. If your own CSS sets `overflow` on `html` or `body`, check the open menu on a phone.
- **`dda-sticky-footer` sets `--dda-sticky-footer-height` on `:root`,** and the home-page
  `.quick-links-wrap` adds it to its bottom offset, so the cards sit above the fixed bar.
  Remove any offset you added yourself.
- **`dda-radiobutton` shows its circle without `size`.** It defaults to the `md` size (21px).
  Radios without `size` were invisible before.
- **`dda-number-field` and `dda-phonefield` fit narrow containers.** The input now shrinks, so
  the currency button stays inside the field.
- **`dda-horizontal-stepper`** no longer draws a line past its right edge on the last step,
  which widened the page.
- **`dda-banner`** lays out its slides as a horizontal row that scrolls and snaps, instead of
  stacked images. A missing `slides` attribute no longer throws.
- **`dda-home-banner`** logs a console warning when it has no `<slide>` children. Only
  `<slide>` elements are shown.
- **Material icons in `.quick-links .link-item`** get the same size as SVG icons.
- **Placeholder text is darker** (4.5:1 contrast or better), **links inside paragraphs and table
  cells are underlined**, and **home-banner slides have a dark scrim behind the text.** If you
  restyled any of these, check that your override still meets contrast.
- **`dda-checkbox` and `dda-toggle` show a focus ring** under keyboard focus, and the
  `dda-banner` slide row is a keyboard tab stop.

### New, optional

| Component | Addition | Use it to |
| --- | --- | --- |
| `dda-header` | `search_action` prop, `searchSubmit` event | Send searches to a results page or your router |
| `dda-breadcrumb` | `breadcrumbs` prop (array or JSON string) | Set items from JavaScript or a framework; `data-breadcrumbs` still works |
| `dda-toggle` | `title_text`, `supporting` | Show a visible label |
| `dda-footer` | `logo-description` | Show text under the footer logo |
| `dda-vertical-stepper` | `current_step` | Set the active step |
| `dda-alert`, `dda-footer`, `dda-ui-card` | `heading_level` | Match the heading level to your page |
| `dda-alert`, `dda-chip`, `dda-search-input`, `dda-pagination`, `dda-dropdown`, `dda-number-field`, `dda-phonefield`, `dda-header` | `*_label` props | Name icon-only buttons, e.g. in Arabic |
| `dda-segmented-tabs` | `icon_labels` | Name icon-only segments |
| `dda-header` | `first-logo-href`, `second-logo-href`, `language_lang` | Logo link targets, language of the language button |
| `dda-banner`, `dda-sticky-footer` | `aria_label` | Name the slide region / quick actions |
| `dda-pagination` | `pageChange` event | React when the user changes page |
| `dda-select` | `selectionChange` event | React when the selected value changes |
| `dda-dropdown`, `dda-avatar` | `optionSelect` event | React to a menu pick |
| `dda-creditcard-field` | `valueChange` event | Read the value as the user types |
| `dda-ui-card` | `linkClick` event (now fired) | Track or intercept card link clicks |

---

## 4. Notes from 5.0.1: fonts and the stylesheet

Read this if you start from 5.0.0 or earlier.

- The Dubai typeface is declared only in `dist/dda/dda.css`. A page that loads the components
  but not `dda.css` falls back to a sans-serif font. Load `dda.css`.
- The font files ship in `dist/assets/fonts/dubai/` as `woff2`, `woff` and `ttf`. The old `eot`
  and `svg` formats are gone; they served only Internet Explorer and very old Safari.
- The React and Vue wrappers published with 5.0.0 missed some props and events
  (`autocomplete`, `input_id`, `selected_index`, `segmentChange`). 5.0.1 and later have them.

---

## 5. From 4.1.0

`4.1.0` was published in February 2025 and was never tagged `latest`; most sites never used it.
It is a separate build and is not documented component by component. Known differences:

- It has no `dda-banner`, `dda-home-banner` or `dda-ui-card`.
- It publishes no `dist/dda/dda.css`. Add it (see the checklist).
- Its `dda-header` is an older implementation. Re-check the header on desktop and on a phone.

Treat a 4.1.0 site like a 3.x site: follow [From 3.x](#6-from-3x-to-50), then
[5.0.x to 5.1.0](#3-from-50x-to-510), and check every page visually.

---

## 6. From 3.x to 5.0

**Why there is no 4.x to upgrade through:** `4.1.0` already existed on npm, so the next major
skipped to 5 to keep `^4` ranges from resolving to that older build.

Most consumers need to change nothing here. These changes affect you only if you wrote CSS or
JavaScript that reaches inside a component's rendered markup, or used one of the fixed ids the
components used to emit.

### Triage

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

Then load a page in dark theme and look at the footers. If they looked unstyled before, they
are now fully styled; that is the intended fix.

### Breaking changes

#### `dda-footer` and `dda-sticky-footer` no longer use shadow DOM

They rendered as **unstyled raw HTML** in 3.x: their shadow stylesheet was empty and global
CSS could not reach inside. They now render fully styled.

| | 3.x | 5.0 and later |
|---|---|---|
| `element.shadowRoot` | a `ShadowRoot` | `null` |
| `::part(...)` | targetable | nothing to target |
| Appearance | unstyled | fully styled |

**Migrate:** delete any `shadowRoot` traversal or `::part()` rules for these two and style them
with ordinary selectors. **Re-check your footer layout visually**; this is a total visual
change.

#### Hardcoded ids removed: `#search` and `#editor` — **Silent**

`dda-search-input` emitted `id="search"` and `dda-textarea` emitted `id="editor"` on every
instance, which gave duplicate ids as soon as a page used two.

```html
<!-- 3.x: the id was implicit -->
<dda-search-input label="Find"></dda-search-input>
<script>document.getElementById('search').focus()</script>

<!-- 5.0 and later: you supply the id -->
<dda-search-input label="Find" input_id="site-search"></dda-search-input>
<script>document.getElementById('site-search').focus()</script>
```

**Migrate:** set `input_id` (both components) to the id your code expects.
`getElementById` just returns `null`, so search for these rather than waiting for an error.

#### `dda-search-input`'s label now points at the input

In 3.x the visible `<label for>` targeted the clear button. It now targets the text field.
**Migrate:** set `input_id`; without it the label has nothing to point at.

#### `dda-avatar` wraps its content in `.avatar-trigger`

```html
<!-- 3.x -->
<dda-avatar><div class="dda-avatar"><img …></div></dda-avatar>

<!-- 5.0 and later: a wrapper always sits between -->
<dda-avatar><div class="dda-avatar">
  <button class="avatar-trigger"><img …></button>   <!-- when `options` is set -->
  <div class="avatar-trigger"><img …></div>          <!-- when it is not -->
</div></dda-avatar>
```

**Migrate:** replace direct-child selectors (`.dda-avatar > img`) with descendant selectors
(`.dda-avatar img`).

#### Element types changed on three controls

These were `div`/`span` elements with a click handler and no keyboard access.

| Component | 3.x | 5.0 and later | Class |
|---|---|---|---|
| `dda-accordion` | `div.accordion-header` | `button.accordion-header` | unchanged |
| `dda-chip` | `span.chip-close` | `button.chip-close` | unchanged |
| `dda-home-banner` | `div.dots` (direct `ul` child) | `li > button.dots` | unchanged |

**Migrate:** drop the element type from your selectors (`.accordion-header`, not
`div.accordion-header`). For the banner dots, also drop any direct-child combinator: there is
now an `<li>` in between.

### Behaviour changes to check

- **`dda-header` sets `scroll-padding-top` on `:root`** (170px; 100px below 767px), so keyboard
  focus cannot land behind the fixed header. Every anchor jump and `scrollIntoView()` on the
  page is offset. Remove any manual compensation or you will double-offset.
- **`dda-home-banner` writes `inert` and `aria-hidden` onto your `<slide>` elements.** Slides
  that are not showing cannot be focused or clicked. It also became a working carousel, with
  autoplay, previous/next/pause controls and a live region.
- **`dda-segmented-tabs` selects its first segment on load.** In 3.x it had no interactivity.
- **`dda-sticky-footer` marks itself `inert` while scroll-hidden.**
- **`dda-tabs`:** `aria_label` names the tab group; each tab is named by its own text.
- **`dda-pagination`:** dot spacing 8px → 15px, so the control is wider.
- **`dda-tooltip`:** `Escape` dismisses an open tooltip.
- **Dark theme:** `--dda-primary-variant-95` and `--dda-color-warning-40` changed value. Info
  alerts get a deeper fill; warning alerts a brighter amber.
- **Muted and disabled text is darker in light theme,** for readable contrast. Disabled
  controls look more present than before; that is deliberate.
- **`dda-header`'s accessibility icon** changed from `accessible_forward` to `accessibility`.

### New props from 5.0

| Component | Prop | Why |
|---|---|---|
| `dda-search-input`, `dda-textarea` | `input_id` | Restores a removed hardcoded id |
| `dda-creditcard-field`, `dda-phonefield` | `autocomplete` | Browser autofill |
| `dda-progressbar` | `aria_label` | Names the progress bar for screen readers |
| `dda-home-banner` | `autoplay`, `interval`, label props | The carousel is real now |
| `dda-segmented-tabs` | `selected_index` | Choose the initially selected segment |

### `dda.css` if you used `@latest` on the CDN

`dist/dda/dda.css` was **missing from 3.12.16**, and the CDN served a stale cached copy from an
older release. 5.0.0 and later ship the file again, as a superset of that copy: every class in
it is still present. Those legacy rules are kept for compatibility and will be removed only in
a future major release, with notice.

---

## 7. CDN users

jsDelivr syncs from npm automatically. Always use an **exact version**: replace `X.X.X` with
the version you are upgrading to.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dubai-design-system/components-js@X.X.X/dist/dda/dda.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
<script type="module">
  import { defineCustomElements } from 'https://cdn.jsdelivr.net/npm/@dubai-design-system/components-js@X.X.X/loader/index.es2017.js';
  defineCustomElements();
</script>
```

Do **not** use `@latest` or leave the version out. jsDelivr caches version aliases, and an
unversioned loader URL loads chunks from mixed versions, which stops components rendering.

---

## If something breaks that is not listed here

Note the component, the version you came from, the browser, and what you expected to see, and
report it to the Dubai Design System team. An undocumented change is a gap in this guide, not
your mistake.
