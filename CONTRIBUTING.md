# Contributing to the Dubai Design System

This document is built from a full code review of the codebase completed on this branch
(2026-08-20). Every rule below traces to a real fault the review found — see
`docs/a11y/findings.md` for the full list (`F-###`) and `docs/a11y/component-matrix.md`
for per-component status. It is not a general style guide; if something isn't here, it's
because the review didn't find a repeated mistake to justify it.

**Before publishing this branch**, read `docs/a11y/consumer-impact.md`. It catalogues
every rendered-DOM, id, and selector change this branch made to existing components
(`dda-footer`, `dda-sticky-footer`, `dda-search-input`, `dda-textarea`, `dda-avatar`,
`dda-accordion`, `dda-chip`, `dda-home-banner`, and others) and states the semver bump
those changes require. Most of the fixes in this review are correctness/accessibility
repairs, not new features — but several of them are not backward-compatible, and
`npx lerna publish` has no way to know that on its own.

## Before you open a pull request

Run these from `packages/stencil`:

```bash
export PUPPETEER_EXECUTABLE_PATH=$(node -e "console.log(require('puppeteer').executablePath())")
npx stencil build
npx stencil test --spec --e2e --ci
npm run lint
npm run format:check
npm run check:api
```

Notes on each, verified against this branch on 2026-08-20:

- **`PUPPETEER_EXECUTABLE_PATH` is not optional.** Stencil tells Puppeteer to launch the
  `"chrome"` channel, which hunts for a system install at `/opt/google/chrome` and ignores
  the browser `npm install` already downloaded. Without the export, e2e tests fail to
  launch a browser at all — not a test failure, a tooling failure.
- **`--ci` is not optional either.** It adds `--no-sandbox` and related Puppeteer flags.
  Without it, Chrome refuses to start as root, which is how CI (and most containers) run.
  Do not "fix" this by adding `browserArgs` to `stencil.config.ts` instead — that weakens
  the sandbox for every developer, not just CI.
- **`npx stencil build` must leave the tree clean.** It regenerates the React, Vue and
  Angular wrapper sources and `components.d.ts` from your `.tsx` changes. CI runs the same
  build and then fails if `git status` shows anything (`.github/workflows/ci.yml`, "Check
  that the generated wrappers are current"). If your change touches a component's props or
  events, the wrapper diff is part of your PR — build, then `git add` whatever changed
  before you commit.
- **`npm test` (290 tests, 38 suites at the time of writing) must stay green.** A new test
  that fails, or an existing one you had to touch to make pass, is worth a second look
  before you move on — see "Write tests that can fail" below.
- **`npm run lint`, `npm run format:check`, and `npm run check:api` will exit non-zero on
  a clean checkout.** This codebase is not lint-clean, format-clean, or ghost-attribute-free
  yet — it carries known, catalogued debt (40 lint errors, 4 warnings; 104 unformatted
  files; 106 ghost attributes, all measured 2026-08-20). CI does not require zero; it
  requires you not make the count go **up**. Read "The quality ratchet" below before you
  assume a non-zero exit means your PR is broken.

## Rules from mistakes this codebase actually made

### 1. Never hand-edit a generated file

`stencil-generated/` directories (React, Vue, Angular) and every component's `readme.md`
are overwritten by `npx stencil build`. Edit the `.tsx` in
`packages/stencil/src/components/` and rebuild — CI's dirty-tree check exists specifically
to catch a stale wrapper shipped alongside a changed component (see above).

### 2. A documented prop must exist on the component

The review found **106 ghost attributes**: props and events that `.stories.tsx` or
`-docs.mdx` files document, that no `@Prop()`/`@Event()` in the component actually
declares — `customclass`, `buttoncolor`, `lefticon`, `helpertext`, `label_on`,
`readspeakerlink`, and around a hundred more. This is the single most common mistake in
the codebase: documenting a prop that was never implemented, or renaming/removing one and
leaving the story or doc referring to the old name.

Before you write or touch a story or `.mdx` file, check the real API:

```bash
cat packages/stencil/src/components/<name>/readme.md   # generated; the properties table is ground truth
```

`npm run check:api` catches most of this automatically — but it only scans
`.stories.tsx` `args`/`argTypes`. It does **not** read code fences inside `.mdx` prose,
which is exactly how two real ghosts slipped through clean `check:api` runs: `dda-checkbox`
documented an `on_checked` handler and `dda-toggle` documented `label_on`/`label_off`,
neither of which exist on the component. If you edit an `.mdx` file's example code, check
it against the component by hand — the tool will not catch a mistake there.

Props use `snake_case` (`button_color`, `start_icon`), matching the rest of the codebase.
`dda-vertical-stepper`'s `current_Step` is the one counter-example the review found — don't
repeat it.

### 3. Never put a click handler on a non-interactive element

Five places in this codebase put `onClick` on a `div`, `span`, or `li` with no
`tabindex`, `role`, or `onKeyDown`, and no focusable element nested inside. Three of the
five (`dda-accordion`'s header, `dda-avatar`'s dropdown trigger, `dda-chip`'s dismiss
control) were **total keyboard lockouts** — a keyboard-only user could not open or
dismiss them at all. This is the most repeated accessibility defect in the codebase.

The automated WCAG 2.1.1 checker did **not** catch any of the three (it reported 0
project-wide keyboard failures). That isn't the tool being wrong about what it measured —
its reachability set is built from `a[href], button, input, select, textarea,
[tabindex]:not([tabindex="-1"])`, so a `div` with `onClick` and no `tabindex` was never a
candidate to check in the first place. Do not treat "0 keyboard failures" from that
checker as proof a component is keyboard-operable; it can only be wrong in one direction
(missing real failures, never inventing fake ones), and a human has to check anything with
a click handler.

If it responds to a click, it must be a `<button>` or `<a>`, or explicitly carry
`tabindex="0"`, an appropriate `role`, and an `onKeyDown` for Enter/Space.

### 4. A `role` must be backed by the behaviour it claims

Two shapes of this recurred: a role with no state machine behind it, and a role that
promises a keyboard pattern the component doesn't implement.

- `dda-tabs` originally had no ARIA at all, and — critically — no rendered panel for any
  tab, so `role="tablist"`/`"tab"` would have been a **false claim**: the WAI tabs pattern
  needs `aria-controls` pointing at a real panel and arrow-key roving `tabindex`. The
  actual fix (see `dda-tabs.tsx`) uses `role="group"` with `aria-pressed` — a
  toggle-button group, which is what the component actually does. Reach for a widget role
  only when you're also implementing the interaction pattern it implies; a plain group of
  buttons is not a tablist just because it looks like tabs.
- `dda-segmented-tabs` had no click handler and no selection state whatsoever — clicking a
  segment did nothing, for any input method. Wire the actual behaviour before adding ARIA
  that describes behaviour that isn't there yet.

### 5. Focus indicators: check the computed cascade, not just the rule you wrote

24 confirmed WCAG 2.4.7 failures traced back to one base rule: `.dda-btn{outline:0}` in
`dda-button.css`, left unoverridden or overridden with a broken shorthand. `outline: var(--some-color)`
is syntactically legal CSS but resets `outline-style` to its initial value (`none`) — so
**no outline ever renders, regardless of the color token**. If you add a focus style, use
`outline-color` plus an explicit `outline-style`/`outline-width` (or the single shorthand
`outline: 2px solid var(...)`), and then actually check the *computed* value in a real
browser, not just that a rule with the right selector exists in the stylesheet — a rule
can be present and still be beaten by cascade order or specificity (see "Write tests that
can fail" below for the same lesson applied to tests).

### 6. Text takes a theme-aware token, never a raw ramp step

`--dda-neutral-*` steps are theme-invariant by design — that's what makes them a ramp.
Several components used one directly as *text* colour against a background that flips
with theme (e.g. `--dda-neutral-60` on white in light mode, on `#191C1C` in dark). One
grey cannot sit at a legible distance from both. This was the single largest driver behind
the axe sweep's colour-contrast failures: fixing it (a new theme-aware alias, plus the
related usage-site fixes — see `docs/a11y/contrast-decision.md`) took the sweep's stable
failure count from 27 to 6 (`.github/quality-baseline.env`). If you need themed text/border
colour, use (or add) a semantic alias (`--dda-on-surface-*`, or the new
`--dda-on-surface-muted`) that's redefined per `[data-theme]`, not a bare
`--dda-neutral-N`. Decoration/borders on a raw ramp step are fine; text is where this bit.

### 7. `shadow: false` is the convention for a reason

33 of 34 components use `shadow: false` and rely on the global stylesheets in
`src/global/*.css`. This convention exists because of what happened to the one that used
to be different for the wrong reason: `dda-footer` and `dda-sticky-footer` originally
shipped `shadow: true` with a confirmed **0-byte** local stylesheet and no `global.css`
import — every utility class their markup depended on was unreachable, so both rendered
as unstyled raw HTML, and `dda-sticky-footer`'s fixed/hide-on-scroll behavior never
activated (F-005, F-006). Both were fixed on this branch by dropping `shadow: true`, not
by filling in the stylesheet — that's the repair to reach for if you find the same
pattern again. `dda-banner` is the one remaining `shadow: true` component, and it works,
because it deliberately bundles `global.css` into its own shadow root via `styleUrls`. If
you have a real reason to use `shadow: true`, follow `dda-banner`'s pattern of bundling
your CSS in — don't assume global styles will reach a shadow root, because for two of the
three components that ever tried it in this codebase, they didn't.

### 8. Write tests that can fail

The `dda-button` and `dda-ui-card` spec tests had never meaningfully exercised the
component: they asserted a `<mock:shadow-root>` tree and used `>>>` piercing selectors on
components that use `shadow: false` — a structural mismatch that made the tests brittle
and prone to failing (or trivially passing) for reasons unrelated to the component's real
behaviour, and they compared a whole serialized HTML tree rather than the specific
attribute or class under test. Assert the thing you actually care about — an attribute
value, a class, a text string, a computed style — not "the DOM I currently observe,
exactly."

A test that only checks an element exists, or that a stylesheet contains a rule with the
right selector, does not tell you the rule wins the cascade or that the behaviour actually
fires. Prefer asserting a computed/observed outcome (does `document.activeElement` become
the control on Tab? does the click handler actually fire?) over asserting a static
artifact is present.

A new repair should have a test that fails against the old code and passes against the
fix — that's the only way to know the test would have caught the regression it's there to
prevent.

### 9. e2e/spec environment traps

These cost real time during the review. All verified against `@stencil/core` 4.43.5 on
this branch:

- `E2EElement` has no `hasAttribute` method. Use `.getAttribute('x')` and compare against
  `null` — a boolean attribute that's present reads back as `''`, not `true`.
- Attach a click spy (or any listener) **after** `page.setContent(...)`, not before —
  `setContent` replaces the document and discards anything wired up earlier.
- `page.setContent()` does not load local stylesheets — a component rendered this way can
  silently fall back to bare user-agent styling, which reads as a false failure (or false
  pass) for any CSS-dependent check. If you need to verify computed CSS/visual state,
  navigate with `page.goto('file://...')` instead.
- Components use `shadow: false`; a `>>>` piercing selector finds nothing. Use a plain
  descendant selector (`dda-chip button`).

## The quality ratchet

`.github/quality-baseline.env` holds the maximum fault count each CI gate (ESLint errors
and warnings, Prettier unformatted-file count, `check:api` ghost attributes, the
accessibility sweep's stable failure count) currently accepts, measured 2026-08-20. CI
fails a gate only when a run's count **exceeds** its baseline — this is a ratchet against
regression, not a claim the current count is fine, and every run prints the real number
whether it passes or fails.

- **If your change makes a count go down, lower the baseline in the same PR**, on its own
  line in the diff. That's how the ratchet tightens instead of quietly carrying slack
  forever — see `.github/scripts/ratchet.sh`, which prints exactly this instruction when a
  run improves on baseline.
- **Never raise a baseline to make your own PR pass.** If you're deliberately accepting
  new debt (rare, and it should be rare), raise the number in its own commit with a
  message explaining why — never bundled into an unrelated change. Raising a number to
  cover new lint errors or ghost attributes your PR introduced defeats the entire
  mechanism: the next person can no longer trust that a passing gate means nothing got
  worse.
- The accessibility sweep additionally carries `A11Y_KNOWN_FLAKY_STORIES` — three stories
  whose axe pass/fail flips between runs of identical code (a harness/timing issue, not a
  content change). Their outcome is reported every run but excluded from the ratchet. If
  one starts failing for a real, reproducible reason, fix it and remove it from the list —
  don't leave it permanently exempt.

## What is deliberately not fixed — don't "fix" these in ignorance

- **`dda-breadcrumb`'s `breadcrumbs` ghost attribute.** Counted in the 106, but benign by
  design: the story destructures it out of `args` and re-encodes it as `data-breadcrumbs`.
  See `docs/a11y/findings.md` I-001.
- **The two `dda-tabs` axe failures** (`components-tabs--text-tabs`,
  `components-tabs--text-icon-tabs`). Axe flags a colour-contrast violation; hand
  computation from the real cascade gives 21.0:1. Unexplained from source — a harness or
  test-time DOM question, not a colour fault. Left open in
  `docs/a11y/contrast-decision.md`'s "What is NOT decided here."
- **The camelCase props on `dda-footer` and `dda-sticky-footer`** (`footerTitle`,
  `happinessIconHref`, and dozens more). They break the snake_case convention, but every
  existing consumer sets them by their current name — renaming is a breaking change, not a
  style fix. Leave them as-is.
- **The three known-flaky stories** in `A11Y_KNOWN_FLAKY_STORIES` (see above). Their
  intermittent failures are a known, tracked property of the harness, not a component
  regression to chase.

Before assuming a component is clean, check `docs/a11y/component-matrix.md` — its `N/A`
cells mean *not measured* (no story exists to test against), not *measured and passing*,
and `dda-breadcrumb`/`dda-pagination`/`dda-credit-card` got a lighter-touch manual review
than the other 31 components (see that file's footnote 31). Note also that the matrix's
"Has tests" column reflects a snapshot from earlier in this review; several components
gained a `test/` folder afterward as fixes landed — check the directory directly rather
than trusting that column's current state.

## How to overturn the colour decision

`docs/a11y/contrast-decision.md` records the two token changes made to close the
colour-contrast findings (a new `--dda-on-surface-muted` alias, and two dark-theme
semantic-palette remaps for `dda-alert`). Every value it chose was already in the
palette — the decision record's own principle is "Do not invent colours." If you want to use
a different value: the constraint to preserve is **the ratio, not the hex** — 4.5:1 for
body text, 3:1 for the 24px alert title and for non-text UI. Read that document's "How to
overturn this" section before changing a value it set; changing a hex without checking
the ratio it was chosen to hit is how this class of bug got here in the first place.

## Pull request review checklist

A reviewer should confirm each of these; every line traces to a section above.

**API**
- [ ] Every prop/event a story or `.mdx` uses exists on the component — check
      `readme.md`, and hand-check `.mdx` code fences (`check:api` doesn't scan them).
- [ ] New props are `snake_case`.
- [ ] If `.tsx` props/events changed, `npx stencil build` was run and its wrapper diff is
      part of this PR.

**Accessibility**
- [ ] No click handler on a `div`/`span`/`li` without `tabindex`, `role`, and `onKeyDown`
      — it's a `<button>`/`<a>`, or it earns all three.
- [ ] Any new `role` is backed by the interaction pattern it implies (panels for tabs,
      arrow keys for a listbox) — not added for its own sake.
- [ ] Any `aria-describedby`/`aria-controls`/`aria-labelledby` points at an element that
      is present in every state where the reference exists, and at the element that
      actually receives focus (not a non-focusable wrapper around it).
- [ ] A new/changed focus style's *computed* outline or box-shadow was checked in a real
      browser, not just the rule as written.
- [ ] Text colour uses a theme-aware alias, not a raw `--dda-neutral-*` step.
- [ ] Interactive targets are at least 24×24px, or 24px apart centre-to-centre.

**Style**
- [ ] Uses `shadow: false` unless there's a specific reason not to — and if `shadow: true`,
      the component's own stylesheet actually reaches it (bundled, not just `styleUrls`
      pointing at `global.css`).

**Tests**
- [ ] A new/changed component has a `test/` folder with an e2e spec.
- [ ] A repair has a test that fails against the pre-fix code.
- [ ] Assertions check a real outcome (computed style, focused element, emitted event) —
      not just that an element or a CSS rule exists.
- [ ] `npx stencil test --spec --e2e --ci` passes, with `PUPPETEER_EXECUTABLE_PATH` set.

**The ratchet**
- [ ] `npm run lint` / `format:check` / `check:api` were run; if a count went down, the
      corresponding baseline in `.github/quality-baseline.env` was lowered in this PR. If
      a count went up, that's a regression to fix, not a baseline to raise.
