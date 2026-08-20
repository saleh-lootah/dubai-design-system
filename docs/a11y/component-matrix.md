# Component Review Matrix

Key: **PASS**, **FAIL**, or **N/A**. `N/A` means the automated tooling never exercised
this cell — not that it was measured and clean. `dda-banner` and `dda-ui-card` have no
Storybook story, so their `axe`, `Keyboard`, and `Target size` columns are `N/A` (see
`docs/a11y/findings.md` F-039); a `0`-instance count in the underlying baseline table
for these two components means "not measured," not "measured and clean."

Column definitions and how each was derived:

- **axe** — axe-core violations against that component's Storybook stories (union of
  light+dark themes), from `docs/a11y/baseline-2026-08-20.md`. `FAIL` if the union count
  is greater than 0. Footnotes mark the 3 stories confirmed flaky run-to-run (see
  findings F-037) — their PASS/FAIL identity is not yet fully stable.
- **Keyboard** — combined evidence from the automated WCAG 2.1.1 sweep *and* the manual
  review's hand-check of `onClick`-bearing non-interactive elements, Escape/focus-return
  behavior, and WAI pattern conformance. The automated sweep alone reported 0 failures
  project-wide; this column corrects that where manual review found a real, confirmed
  keyboard gap the tool structurally cannot see (see findings F-001, F-002, F-003, F-046).
- **Target size** — WCAG 2.5.8, from the baseline (4 failing stories total).
- **API correct** — whether the component's real `@Prop()`/`@Event()` surface matches
  what its `.stories.tsx` claims (the baseline's "ghost attribute" count, `check:api`) and
  whether manual review found the declared API doesn't actually work (e.g. a dead event,
  a documented-but-absent `disabled` prop). `FAIL` if either is true.
- **Docs correct** — whether the `.mdx` narrative doc's example code accurately reflects
  real props. For the 11 form components (Group 1 of the manual review) this was hand
  read against source. For the other 23, no independent `.mdx` hand-check was done this
  round; the value shown uses the same-component's ghost-attribute count from `check:api`
  as a proxy (marked †) since `.stories.tsx` args and `.mdx` example code typically mirror
  each other, but this is a weaker basis than the 11 hand-checked components and should
  be treated as lower-confidence.
- **Has tests** — component has a real `test/*.spec.tsx`/`*.e2e.ts` suite. Given directly
  by the task brief's own template; not independently re-derived here.

| Component | axe | Keyboard | Target size | API correct | Docs correct | Has tests |
| --- | --- | --- | --- | --- | --- | --- |
| dda-accordion | PASS | FAIL¹ | PASS | PASS | PASS† | NO |
| dda-alert | FAIL | PASS | PASS | PASS | PASS† | NO |
| dda-attach-file | FAIL | PASS | PASS | PASS | PASS | NO |
| dda-avatar | FAIL | FAIL¹ | PASS | FAIL² | FAIL† | NO |
| dda-banner | N/A³ | N/A³ | N/A³ | PASS | FAIL⁴ | NO |
| dda-breadcrumb | PASS | PASS | PASS | PASS⁵ | PASS† | NO |
| dda-button | FAIL | PASS⁶ | PASS | FAIL⁷ | PASS† | YES |
| dda-checkbox | PASS | PASS | PASS | FAIL⁸ | FAIL⁹ | NO |
| dda-chip | FAIL | FAIL¹ | PASS | FAIL² | FAIL† | NO |
| dda-credit-card | FAIL | PASS | PASS | PASS | PASS† | NO |
| dda-creditcard-field | FAIL | PASS⁶ | PASS | PASS | PASS | NO |
| dda-dropdown | PASS | FAIL¹⁰ | PASS | FAIL² | FAIL† | NO |
| dda-footer | PASS¹¹ | PASS¹¹ | PASS¹¹ | PASS | PASS† | NO |
| dda-header | FAIL¹² | PASS¹³ | PASS | FAIL² | FAIL† | NO |
| dda-home-banner | PASS | PASS | PASS | PASS | PASS† | YES |
| dda-horizontal-stepper | FAIL¹⁴ | PASS¹⁵ | PASS | FAIL¹⁶ | FAIL† | NO |
| dda-input | FAIL | PASS⁶ | PASS | PASS | PASS | NO |
| dda-link-button | FAIL | PASS⁶ | PASS | FAIL² | FAIL† | NO |
| dda-number-field | FAIL | PASS | PASS | FAIL¹⁷ | PASS | NO |
| dda-pagination | FAIL | PASS | FAIL | PASS | PASS† | NO |
| dda-phonefield | FAIL | PASS | PASS | FAIL¹⁸ | PASS | NO |
| dda-progressbar | FAIL | PASS¹⁹ | PASS | PASS | PASS† | NO |
| dda-radiobutton | PASS | PASS | PASS | FAIL² | PASS† | NO |
| dda-range-slider | FAIL¹⁴ | PASS²⁰ | FAIL | PASS | PASS† | NO |
| dda-search-input | FAIL | PASS⁶ | PASS | FAIL²¹ | PASS | NO |
| dda-segmented-tabs | PASS | FAIL²² | PASS | FAIL²² | PASS† | NO |
| dda-select | FAIL | PASS⁶ | PASS | FAIL² | PASS† | NO |
| dda-sticky-footer | PASS¹¹ | PASS¹¹ | PASS¹¹ | FAIL² | FAIL† | NO |
| dda-tabs | FAIL | FAIL²³ | PASS | FAIL²⁴ | PASS† | NO |
| dda-textarea | FAIL | PASS²⁵ | PASS | PASS²⁶ | PASS | NO |
| dda-toggle | PASS | PASS²⁷ | PASS | FAIL² | FAIL⁹ | NO |
| dda-tooltip | PASS | FAIL²⁸ | PASS | PASS | PASS† | NO |
| dda-ui-card | N/A³ | N/A³ | N/A³ | FAIL²⁹ | FAIL⁴ | YES |
| dda-vertical-stepper | PASS | PASS³⁰ | PASS | FAIL² | FAIL† | NO |

## Footnotes

1. `dda-accordion`/`dda-avatar`/`dda-chip`: confirmed keyboard lockout the automated
   2.1.1 sweep reports as 0 — see findings F-001/F-002/F-003/F-046.
2. Ghost attributes present per `check:api` (baseline per-component counts:
   `dda-avatar` 4, `dda-chip` 4, `dda-dropdown` 1, `dda-header` 18, `dda-link-button` 3,
   `dda-radiobutton` 1, `dda-select` 3, `dda-sticky-footer` 43, `dda-toggle` 5,
   `dda-vertical-stepper` 4).
3. No `.stories.tsx` exists — never exercised by axe, the 2.1.1 checker, or the 2.5.8
   checker (findings F-039). Not "0 violations," genuinely unmeasured.
4. No `.mdx` file exists for either component (confirmed by directory listing) — a
   documentation gap, not a props-accuracy mismatch.
5. `dda-breadcrumb`'s 1 ghost attribute (`breadcrumbs`) is the known-benign,
   informational false positive — see findings I-001. Not treated as a real API defect.
6. Native `<button>`/`<input>` elements are reachable and operable by keyboard; the
   confirmed defect for this row is a WCAG 2.4.7 *focus-visibility* fault (see findings
   F-019–F-021), not a *reachability* fault — hence PASS here, FAIL in the `axe` column
   and in `docs/a11y/findings.md`.
7. Ghost attributes present (baseline count: 6).
8. Ghost attributes present (baseline count: 1) plus a confirmed `.mdx`-only ghost
   (`on_checked`, findings F-029) that `check:api` cannot see since it scans
   `.stories.tsx`, not `.mdx` prose.
9. `.mdx`-documented attribute does not exist on the component — `dda-checkbox`'s
   `on_checked` (F-029) and `dda-toggle`'s `label_on`/`label_off` (F-030), both
   independently hand-confirmed against source, not proxy-derived.
10. No `Escape`, outside-click, or focus-return handling (findings F-024) — a workaround
    exists (re-click the trigger), so this is a WAI-pattern gap rather than a lockout;
    still marked FAIL because the expected interaction does not work as designed.
11. `dda-footer`/`dda-sticky-footer`: native elements inside are structurally reachable,
    so `Keyboard`/axe/target-size read PASS/clean on the narrow question those tools ask —
    but both components are **critically broken** in a way none of these columns
    captures: `shadow: true` plus a confirmed 0-byte local stylesheet means no CSS of any
    kind (local or global) reaches either component, and `dda-sticky-footer`
    additionally never activates its designed fixed/hide-on-scroll behavior at all. See
    findings F-005/F-006 (CRITICAL) — do not read this row's PASS cells as "these
    components are fine."
12. `dda-header` axe result includes the known dark-theme flake (`Components/Header
    Default` reading 0/1/2 violations across sessions — see findings F-037); FAIL is the
    majority/most-recent-consensus outcome, not a stable single number.
13. Both `onClick`-on-`div` cases in `dda-header` are confirmed *not* keyboard traps —
    one works via event bubbling from a real nested button, the other is redundant but
    not the only path to the same action (see findings F-044, LOW).
14. `dda-range-slider` (light theme) and `dda-horizontal-stepper` (light theme) are two
    of the three axe results confirmed flaky run-to-run — they read PASS in this task's
    designated run (`raw-a11y.txt`) and FAIL in two immediate reruns
    (`raw-a11y-rerun{1,2}.txt`). Shown as FAIL here per the higher (2-of-3-runs) count;
    see findings F-037 for the full instability picture — do not treat this as a stable
    number.
15. No keyboard-reachability defect found for `dda-horizontal-stepper`'s own controls;
    it does carry a separate, non-keyboard off-by-one state bug (findings F-036).
16. Off-by-one default-state bug (findings F-036): the default `current_step` value
    doesn't match the 0-based index it's compared against, so the wrong step shows
    active out of the box.
17. `dda-number-field` has no `disabled` `@Prop()` at all, so its "Disabled" story does
    not disable anything (findings F-031) — a real API-correctness gap despite 0 ghost
    attributes in `check:api`'s narrower sense.
18. Ghost attributes present (baseline count: 2) plus the duplicate-`id`-in-`.map()` bug
    affecting every rendered country option (findings F-025).
19. No interactive elements in `dda-progressbar` — nothing to fail on keyboard reach; its
    confirmed defect (no ARIA role/values, findings F-013) is a semantic gap, not a
    keyboard one.
20. Confirmed correct: two real `<input type="range">` elements give native
    keyboard/ARIA slider behavior for free (findings I-004) — the one clean exemplar
    among this codebase's custom interactive widgets.
21. Ghost attributes present (baseline count: 8) plus two confirmed defects beyond
    ghost-attribute scope: the visible `<label>` targets the clear button instead of the
    search field (findings F-017), and the search `<input>` has a hardcoded,
    non-prop-driven, duplicate-prone `id='search'` (findings F-025).
22. `dda-segmented-tabs` has no click handler, no state, and no selection tracking at
    all (findings F-004) — every rendered `<button>` is natively focusable, so this is
    not strictly a *reachability* failure, but activating any segment (by keyboard or
    mouse) accomplishes nothing. Marked FAIL in both columns to reflect that the
    component has no working interaction for any input method, not a keyboard-specific
    gap.
23. Every tab button is reachable by `Tab`, but there is no arrow-key roving-tabindex
    (the WAI tabs pattern's expected keyboard model), so `Tab` moves through every tab in
    sequence rather than skipping to the panel — the opposite of the intended pattern
    (findings F-010).
24. Every generated tab shares one literal `id` (findings F-010, F-025) and the ARIA
    tablist/tab/aria-selected/aria-controls pattern is entirely absent — a structural API
    gap distinct from `check:api`'s ghost-attribute count (0 for this component).
25. Native `<textarea>`/Quill editable surface are both keyboard-reachable; the confirmed
    defect (findings F-015) is that the rich-editor mode's label *association* breaks,
    which is a naming/semantics gap, not a reachability one.
26. 0 ghost attributes, but the rich-editor mode (`enable_rich_editor`) silently drops
    the label association present in plain mode (findings F-015) — a real, if narrower,
    API-behavior defect; kept PASS here since it is specifically a labeling gap tracked
    under `docs/a11y/findings.md` F-015 rather than a props-mismatch.
27. Native `<input>` inside a `<label>` is keyboard-reachable and operable; the confirmed
    defect (findings F-028) is that its visible label text is hardcoded and wrong for
    every real use — a content-accuracy gap, not a reachability one.
28. `dda-tooltip` is `:hover`-only with no `:focus`/`:focus-within` trigger at all — a
    keyboard user gets zero access to the tooltip's content (findings F-011).
29. `dda-ui-card` has 0 ghost attributes from `check:api`, but declares an `@Event()
    linkClick` that is never emitted anywhere in the component (findings F-035) — a real
    API-correctness defect `check:api`'s ghost-attribute scan cannot see.
30. No keyboard-reachability defect found for `dda-vertical-stepper`'s own controls
    (it has none — display-only); it carries a separate naming-convention risk on its
    `current_Step` prop (findings F-034, open item O-006).
