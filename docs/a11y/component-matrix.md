# Component Review Matrix

Key: **PASS**, **FAIL**, or **N/A**. `N/A` means the automated tooling never exercised
this cell -- not that it was measured and clean. `dda-banner` and `dda-ui-card` have no
Storybook story, so their `axe`, `Keyboard`, and `Target size` columns are `N/A` (see
`docs/a11y/findings.md` F-039); a `0`-instance count in the underlying baseline table
for these two components means "not measured," not "measured and clean." The same
principle applies to shallow *manual* review, not just absent *tooling*: `dda-breadcrumb`,
`dda-pagination`, and `dda-credit-card` (marked³¹) read as mostly PASS below because they
were lightly checked, not because they were thoroughly checked and came back clean --
see footnote 31.

## Reconciliation note (Task 12, 2026-08-20)

This matrix was written midway through the review (Task 7). Ten repair tasks since have
closed all 6 open CRITICAL findings and most HIGH findings; every `Keyboard` and most
`axe`/`API correct` cells below are updated to match, each re-verified against source in
this task rather than copied from a task report. See `docs/a11y/findings.md` for the
finding-by-finding evidence and commit citations this table draws from, and the same
document's "Current measured state" table for the branch-wide numbers.

**The `Has tests` column is corrected in full.** The original said 3 of 34 (`dda-button`,
`dda-home-banner`, `dda-ui-card`). That was accurate on 2026-08-20 but is now stale: the
repair tasks test-drove nearly every fix, and Task 11 filled in the last 6 components
that had no coverage yet. **All 34 components now have a real `test/` directory** --
verified in this task by directly counting them (`find src/components -maxdepth 3 -type
d -name test` -> 34 directories, matched 1:1 against the 34 `dda-*.tsx` component files;
every directory confirmed non-empty), not by trusting the earlier "3" or Task 10's
observation that the matrix was already out of date. The full suite was also re-run in
this task: `npx stencil test --spec --e2e --ci` -> `38 suites / 284 tests`, all passing.

**A caveat that must survive this update**: `dda-banner` now has a test (Task 11's is
deliberately its deepest, since it has no story and the test is its only coverage) but
still has no `.stories.tsx`/`-docs.mdx` (F-039, still open). Its `axe`/`Keyboard`/`Target
size` cells stay `N/A` for the same reason they always were -- a test suite exercises the
compiled component directly; it is not the story-driven tooling those columns measure.
Do not read the new "YES" in `Has tests` as closing the `N/A`s in the same row.

Column definitions and how each was derived:

- **axe** -- axe-core violations against that component's Storybook stories (union of
  light+dark themes), from `docs/a11y/baseline-2026-08-20.md`. `FAIL` if the union count
  is greater than 0. Footnotes mark the 3 stories confirmed flaky run-to-run (see
  findings F-037) -- their PASS/FAIL identity is not yet fully stable. **Task 12 update**:
  after F-023's colour-token fix, only `dda-header`, `dda-tabs`, `dda-textarea`, and
  `dda-progressbar` still have a real axe failure in the current sweep (6 stable
  failures total, see `.github/quality-baseline.env`); every other component's axe `FAIL`
  below was a colour-contrast failure now closed and is left as `PASS` where the fix
  closed it, with a footnote citing F-023.
- **Keyboard** -- combined evidence from the automated WCAG 2.1.1 sweep *and* the manual
  review's hand-check of `onClick`-bearing non-interactive elements, Escape/focus-return
  behavior, and WAI pattern conformance. The automated sweep alone reported 0 failures
  project-wide; this column corrects that where manual review found a real, confirmed
  keyboard gap the tool structurally cannot see (see findings F-001, F-002, F-003, F-046).
  **Task 12 update**: F-001/F-002/F-003 (`dda-accordion`/`dda-avatar`/`dda-chip`) are
  closed -- all three now PASS.
- **Target size** -- WCAG 2.5.8, from the baseline (4 failing stories total). **Task 12
  update**: F-022 closed this to 0 -- `dda-pagination` and `dda-range-slider` now PASS.
- **API correct** -- whether the component's real `@Prop()`/`@Event()` surface matches
  what its `.stories.tsx` claims (the baseline's "ghost attribute" count, `check:api`) and
  whether manual review found the declared API doesn't actually work (e.g. a dead event,
  a documented-but-absent `disabled` prop). `FAIL` if either is true.
- **Docs correct** -- whether the `.mdx` narrative doc's example code accurately reflects
  real props. For the 11 form components (Group 1 of the manual review) this was hand
  read against source. For the other 23, no independent `.mdx` hand-check was done this
  round; the value shown uses the same-component's ghost-attribute count from `check:api`
  as a proxy (marked †) since `.stories.tsx` args and `.mdx` example code typically mirror
  each other, but this is a weaker basis than the 11 hand-checked components and should
  be treated as lower-confidence.
- **Has tests** -- component has a real `test/*.spec.tsx`/`*.e2e.ts` suite. **Task 12
  update**: re-derived by directly counting `test/` directories in the tree (see above),
  not given directly by a task brief template as the original said.

| Component | axe | Keyboard | Target size | API correct | Docs correct | Has tests |
| --- | --- | --- | --- | --- | --- | --- |
| dda-accordion | PASS | PASS³² | PASS | PASS | PASS† | YES |
| dda-alert | PASS³³ | PASS | PASS | PASS | PASS† | YES |
| dda-attach-file | PASS³³ | PASS | PASS | PASS | PASS | YES |
| dda-avatar | PASS³³ | PASS³² | PASS | FAIL² | FAIL† | YES |
| dda-banner | N/A³ | N/A³ | N/A³ | PASS | FAIL⁴ | **YES**³⁴ |
| dda-breadcrumb³¹ | PASS | PASS | PASS | PASS⁵ | PASS† | YES |
| dda-button | PASS³³ | PASS⁶ | PASS | FAIL⁷ | PASS† | YES |
| dda-checkbox | PASS | PASS | PASS | FAIL⁸ | FAIL⁹ | YES |
| dda-chip | PASS³³ | PASS³² | PASS | FAIL² | FAIL† | YES |
| dda-credit-card³¹ | PASS³³ | PASS | PASS | PASS | PASS† | YES |
| dda-creditcard-field | PASS³³ | PASS⁶ | PASS | PASS | PASS | YES |
| dda-dropdown | PASS | FAIL¹⁰ | PASS | FAIL² | FAIL† | YES |
| dda-footer | PASS¹¹ | PASS¹¹ | PASS¹¹ | FAIL³⁵ | PASS† | YES |
| dda-header | FAIL¹² | PASS¹³ | PASS | FAIL² | FAIL† | YES |
| dda-home-banner | PASS | PASS | PASS | PASS | PASS† | YES |
| dda-horizontal-stepper | PASS³³ | PASS¹⁵ | PASS | FAIL¹⁶ | FAIL† | YES |
| dda-input | PASS³³ | PASS⁶ | PASS | PASS | PASS | YES |
| dda-link-button | PASS³³ | PASS⁶ | PASS | FAIL² | FAIL† | YES |
| dda-number-field | PASS³³ | PASS | PASS | FAIL¹⁷ | PASS | YES |
| dda-pagination³¹ | PASS³³ | PASS | PASS | PASS | PASS† | YES |
| dda-phonefield | PASS³³ | PASS | PASS | FAIL¹⁸ | PASS | YES |
| dda-progressbar | FAIL³⁶ | PASS¹⁹ | PASS | PASS | PASS† | YES |
| dda-radiobutton | PASS | PASS | PASS | FAIL² | PASS† | YES |
| dda-range-slider | PASS³³ | PASS²⁰ | PASS | PASS | PASS† | YES |
| dda-search-input | PASS³³ | PASS⁶ | PASS | FAIL²¹ | PASS | YES |
| dda-segmented-tabs | PASS | PASS²² | PASS | FAIL²² | PASS† | YES |
| dda-select | PASS³³ | PASS⁶ | PASS | FAIL² | PASS† | YES |
| dda-sticky-footer | PASS¹¹ | PASS¹¹ | PASS¹¹ | FAIL³⁵ | FAIL† | YES |
| dda-tabs | FAIL³⁷ | PASS²³ | PASS | FAIL²⁴ | PASS† | YES |
| dda-textarea | FAIL³⁸ | PASS²⁵ | PASS | PASS²⁶ | PASS | YES |
| dda-toggle | PASS | PASS²⁷ | PASS | FAIL² | FAIL⁹ | YES |
| dda-tooltip | PASS | PASS³² | PASS | PASS | PASS† | YES |
| dda-ui-card | N/A³ | N/A³ | N/A³ | FAIL²⁹ | FAIL⁴ | YES |
| dda-vertical-stepper | PASS | PASS³⁰ | PASS | FAIL² | FAIL† | YES |

## Footnotes

1. (Retired in this pass — see footnote 32. `dda-accordion`/`dda-avatar`/`dda-chip`'s
   keyboard lockout, originally documented here, is now closed; footnote 32 records the
   closure in the same place the original claim lived.)
2. Ghost attributes present per `check:api` (baseline per-component counts:
   `dda-avatar` 4, `dda-chip` 4, `dda-dropdown` 1, `dda-header` 18, `dda-link-button` 3,
   `dda-radiobutton` 1, `dda-select` 3, `dda-sticky-footer` 43, `dda-toggle` 5,
   `dda-vertical-stepper` 4). **Not re-measured component-by-component in Task 12** — the
   codebase-wide `check:api` ratchet baseline is unchanged at 106 (see
   `.github/quality-baseline.env`), consistent with no net drift, but this footnote's
   original per-component breakdown was not individually re-run.
3. No `.stories.tsx` exists -- never exercised by axe, the 2.1.1 checker, or the 2.5.8
   checker (findings F-039, still open for both components). Not "0 violations,"
   genuinely unmeasured. **Task 12**: both components gained a `test/` suite (see the
   `Has tests` column and footnote 34) — that is real coverage, but it is coverage of a
   different kind and does not turn these cells into PASS.
4. No `.mdx` file exists for either component (confirmed by directory listing, re-checked
   in Task 12) -- a documentation gap, not a props-accuracy mismatch.
5. `dda-breadcrumb`'s 1 ghost attribute (`breadcrumbs`) is the known-benign,
   informational false positive -- see findings I-001. Not treated as a real API defect.
6. Native `<button>`/`<input>` elements are reachable and operable by keyboard; the
   confirmed defect for this row was a WCAG 2.4.7 *focus-visibility* fault (F-019--F-021)
   -- **now closed** (Task 9d, `791ecf1`/`1373bb2`/`089138c`) -- hence PASS here and now
   also PASS in the `axe` column (see footnote 33).
7. Ghost attributes present (baseline count: 6, not re-measured individually in Task 12;
   codebase-wide total unchanged).
8. Ghost attributes present (baseline count: 1) plus a confirmed `.mdx`-only ghost
   (`on_checked`, findings F-029, still open) that `check:api` cannot see since it scans
   `.stories.tsx`, not `.mdx` prose.
9. `.mdx`-documented attribute does not exist on the component -- `dda-checkbox`'s
   `on_checked` (F-029) and `dda-toggle`'s `label_on`/`label_off` (F-030), both
   independently hand-confirmed against source, not proxy-derived. **Both still open,
   reconfirmed in Task 12** by grepping the live `.mdx` files.
10. No `Escape`, outside-click, or focus-return handling (findings F-024, still open --
    reconfirmed in Task 12, zero matches for `Escape`/`keydown`/`.focus(` in
    `dda-dropdown.tsx` today) -- a workaround exists (re-click the trigger), so this is a
    WAI-pattern gap rather than a lockout; still marked FAIL because the expected
    interaction does not work as designed.
11. `dda-footer`/`dda-sticky-footer`: native elements inside are structurally reachable,
    so `Keyboard`/axe/target-size read PASS/clean on the narrow question those tools ask.
    **Task 12 update**: F-005/F-006, the CRITICAL shadow-DOM defect this footnote
    originally warned readers not to read these PASS cells as clearing, are **now
    closed** (`b45ccb6`/`01cbbbd`/`35053ec`, Task 9c) -- both components are `shadow:
    false` with real global CSS reaching them, and `dda-sticky-footer`'s hide-on-scroll
    behaviour now works, paired with `inert`/`aria-hidden` so its hidden links are not a
    keyboard trap. This row's PASS cells are now honestly clean, not a false-comfort
    reading. **What is not cleared**: both components' `@Prop()` names are camelCase, a
    new finding (F-049) not caught until this pass -- see the `API correct` column,
    footnote 35.
12. `dda-header` axe result includes the known dark-theme flake (`Components/Header
    Default` reading 0/1/2 violations across sessions -- see findings F-037, still the
    documented flaky story in `.github/quality-baseline.env`); FAIL is the
    majority/most-recent-consensus outcome, not a stable single number. Unlike the other
    axe FAILs on this matrix, this one was never a colour-token fault, so F-023's fix
    does not apply here -- it stays FAIL/flaky.
13. Both `onClick`-on-`div` cases in `dda-header` are confirmed *not* keyboard traps --
    one works via event bubbling from a real nested button, the other is redundant but
    not the only path to the same action (see findings F-044, LOW, still open as a code
    smell).
14. `dda-range-slider` (light theme) and `dda-horizontal-stepper` (light theme) were two
    of the three axe results confirmed flaky run-to-run in the original baseline -- see
    findings F-037. **Task 12 update**: both components' axe result is now PASS after
    F-023's colour-token fix (they are not among the 6 stable residual failures in
    `.github/quality-baseline.env`); F-037's flakiness caveat itself is unretired only for
    `dda-header`, which remains on the known-flaky list.
15. No keyboard-reachability defect found for `dda-horizontal-stepper`'s own controls;
    it does carry a separate, non-keyboard off-by-one state bug (findings F-036, still
    open) and the same unguarded-`JSON.parse` defect as three other components (F-047,
    new).
16. Off-by-one default-state bug (findings F-036, still open): the default `current_step`
    value doesn't match the 0-based index it's compared against, so the wrong step shows
    active out of the box. Reconfirmed unchanged in Task 12.
17. `dda-number-field` has no `disabled` `@Prop()` at all, so its "Disabled" story does
    not disable anything (findings F-031, still open, reconfirmed in Task 12) -- a real
    API-correctness gap despite 0 ghost attributes in `check:api`'s narrower sense.
18. Ghost attributes present (baseline count: 2) plus the duplicate-`id`-in-`.map()` bug
    affecting every rendered country option (findings F-025, still open for this
    component -- reconfirmed in Task 12 at `dda-phonefield.tsx:103`) plus the country
    trigger button's missing `aria-label` (F-032, still open).
19. No interactive elements in `dda-progressbar` -- nothing to fail on keyboard reach; its
    confirmed defect (no ARIA role/values, findings F-013) was closed (Task 9e,
    `d46de40`), but a residual accessible-name gap remains -- see the `axe` column,
    footnote 36, and new finding F-050.
20. Confirmed correct: two real `<input type="range">` elements give native
    keyboard/ARIA slider behavior for free (findings I-004) -- the one clean exemplar
    among this codebase's custom interactive widgets. Its separate WCAG 2.5.8
    target-size failure (F-022) is now closed (Task 9g) -- see the `Target size` column.
21. Ghost attributes present (baseline count: 8) plus two confirmed defects beyond
    ghost-attribute scope: the visible `<label>` targeting the clear button instead of the
    search field (findings F-017) and the hardcoded, duplicate-prone `id='search'`
    (findings F-025) are **both now closed** (`97b6628`, Task 9f) -- the ghost-attribute
    count itself was not re-measured individually, so this row stays FAIL on that basis
    alone.
22. `dda-segmented-tabs` had no click handler, no state, and no selection tracking at
    all (findings F-004) -- **now closed** (`dbf14b9`, Task 9b): real `@State`,
    `role="group"`/`aria-pressed`, and a `segmentChange` event. Both cells are updated
    to PASS in `Keyboard` for real interactivity; `API correct` stays FAIL because the
    fix's own report explicitly left three defects unfixed and now separately tracked:
    the `startsWith('fo')` icon heuristic (F-048, new), the unguarded `JSON.parse`
    (F-047, new), and every button sharing one literal `name` (folded into F-025).
23. Every tab button is reachable by `Tab`, and F-010's re-scoped fix (`role="group"` +
    `aria-pressed`, not a false tablist pattern) is now closed (`f6dd0ba`, Task 9e) --
    every tab remains an independently focusable, independently Tab-reachable button by
    design (a button-group, not a roving-tabindex tablist). **Still open**: every
    generated tab shares one literal `id={this.button_id}` in the `.map()` (F-025,
    reconfirmed unchanged in Task 12 at `dda-tabs.tsx:68`).
24. Every generated tab shares one literal `id` (findings F-010's closure note, F-025,
    both still tracked) -- a structural API gap distinct from `check:api`'s
    ghost-attribute count (0 for this component).
25. Native `<textarea>`/Quill editable surface are both keyboard-reachable; the confirmed
    defect (findings F-015) -- the rich-editor mode's label *association* breaking -- is
    **now closed** (`2f6dc8f`, corrected in `aeb00f1`, Task 9f), with the ARIA correctly
    moved onto Quill's actual `.ql-editor` focusable descendant, not just the container.
26. 0 ghost attributes, and the rich-editor mode's label association gap (findings
    F-015) is now closed -- see footnote 25. **New, separate defect surfaced by the a11y
    sweep and not caught by `check:api`'s scope**: Quill's own generated toolbar picker
    buttons have no accessible name (`aria-command-name`, new finding F-051) -- tracked
    in the `axe` column, footnote 38, not here, since it's a rendering/ARIA gap rather
    than a props-mismatch.
27. Native `<input>` inside a `<label>` is keyboard-reachable and operable; the confirmed
    defect (findings F-028, still open, reconfirmed verbatim unchanged in Task 12) is
    that its visible label text is hardcoded and wrong for every real use -- a
    content-accuracy gap, not a reachability one.
28. `dda-tooltip` was `:hover`-only with no `:focus`/`:focus-within` trigger at all
    (findings F-011) -- **now closed** (`83d8fcd`, Task 9g): `:focus-within` added
    alongside `:hover`, plus an `Escape` handler that dismisses without moving focus.
    See footnote 32.
29. `dda-ui-card` has 0 ghost attributes from `check:api`, but declares an `@Event()
    linkClick` that is never emitted anywhere in the component (findings F-035, still
    open, reconfirmed unchanged in Task 12) -- a real API-correctness defect
    `check:api`'s ghost-attribute scan cannot see.
30. No keyboard-reachability defect found for `dda-vertical-stepper`'s own controls
    (it has none -- display-only); it carries a separate naming-convention risk on its
    `current_Step` prop, **now definitively confirmed broken** rather than merely
    suspected (findings F-034, open item O-006 resolved in Task 12 -- the compiled
    attribute is `current_-step`, and every documented usage example uses the
    non-functional `current_step`).
31. `dda-breadcrumb`, `dda-pagination`, and `dda-credit-card` received a lighter-touch
    manual check than the other 31 components -- the manual review's brief had no
    dedicated question for any of the three, so each got a brief, non-exhaustive note
    rather than the full per-component treatment. The mostly-PASS row above reflects
    what was checked, not a clean bill for what wasn't -- see `docs/a11y/findings.md`'s
    "Note on review depth" for the full caveat and each component's specific open
    items (O-003, O-004, O-005). **This still holds after the repair tasks**: none of
    the three received a dedicated repair task. Both `dda-breadcrumb` and
    `dda-pagination` did gain a `test/` suite (Task 11 wrote `dda-breadcrumb`'s;
    `dda-pagination`'s predates this review), but a test suite exercises what someone
    thought to test, not an independent re-audit -- do not read `Has tests: YES` on
    these three rows as closing the "less examined, not cleared" caveat.
32. New footnote (Task 12), replacing the retired footnote 1. `dda-accordion`,
    `dda-avatar`, `dda-chip`, and `dda-tooltip`'s keyboard gaps are **now closed**:
    F-001 (`e3d788e`), F-002 (`23b9d4e`/`9d6d229`), F-003 (`e35d974`) all made the
    onClick element a real `<button>`; F-011 (`83d8fcd`) added `:focus-within` +
    `Escape` to the tooltip. All from Task 9a/9g. Each verified directly against source
    in this task (real `<button>` elements confirmed by reading each `.tsx` file).
33. New footnote (Task 12). This component's axe `FAIL` in the original baseline was a
    colour-contrast failure traced to the shared `.dda-btn`/focus-ring or
    `--dda-neutral-60` root causes documented in `docs/a11y/contrast-analysis.md` and
    `contrast-decision.md`, and closed by F-019/F-020/F-021 (Task 9d, focus rings) and/or
    F-023 (Task 9j, colour tokens). It is not among the 6 stable a11y-sweep failures
    recorded in `.github/quality-baseline.env` after those fixes, so it now reads PASS.
    Not individually re-run story-by-story in Task 12; based on the closed finding plus
    the committed post-fix sweep count (27 -> 6) and the residual-failure list in
    `quality-baseline.env`, which names every story still failing.
34. New footnote (Task 12). `dda-banner` gained its first `test/` suite in Task 11 --
    deliberately its deepest of the six components that task covered, since it is the
    component's *only* automated coverage (no story exists to be swept by axe/2.1.1/2.5.8
    -- see footnote 3). Real shadow-root traversal, per-slide `img[src]`/`img[alt]`, and
    `slider_width`/`height` assertions, not a smoke test.
35. New footnote (Task 12). `dda-footer` and `dda-sticky-footer` both use camelCase
    `@Prop()` names throughout (e.g. `footerTitle`, `hideMiddleSection`), against this
    codebase's near-universal snake_case convention (CLAUDE.md) -- new finding F-049,
    surfaced by the F-005/F-006 shadow-DOM repair's own report (Task 9c) and left
    unfixed there because renaming ~40 attributes is a breaking-change decision, not an
    accessibility/styling repair. Marked FAIL here since it is a real, if low-severity,
    API-consistency defect distinct from the (informational, non-defect) ghost-attribute
    counting `check:api` does.
36. New footnote (Task 12). `dda-progressbar`'s `role="progressbar"` (added by F-013's
    closed repair) has no accessible name -- `axe`'s `aria-progressbar-name` rule fails
    on all three of this component's stories, named explicitly among the current stable
    a11y-sweep failures in `.github/quality-baseline.env`'s comment. New finding F-050; F-013 itself is
    correctly marked closed in `findings.md` since its own, narrower repair text (role +
    `aria-value*`) is genuinely done -- this is a residual gap the original finding
    never asked for.
37. New footnote (Task 12). `dda-tabs`'s two axe failures
    (`Components/Tabs TextTabs`/`TextIconTabs`) are `color-contrast` per axe, but
    independently recomputed by hand from the real `global/color.css` cascade at 21.0:1
    -- nowhere near a failure. `docs/a11y/contrast-decision.md` explicitly scopes this
    out as a harness question, not a colour fault (new informational item I-005 in
    `findings.md`). No token/CSS/component fix applies. F-010's own keyboard/ARIA
    defect on this component is closed -- see footnote 23 -- this FAIL is unrelated.
38. New footnote (Task 12). `dda-textarea`'s one remaining axe failure
    (`components-textarea--rich-editor-enabled`) is `aria-command-name`, not
    `color-contrast` -- Quill's own generated toolbar picker buttons have no accessible
    name. New finding F-051. Distinct from F-015 (the editable region's own labelling),
    which is closed -- see footnote 25.
