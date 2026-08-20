# F-023 Contrast Analysis — 2026-08-20

Diagnostic only. No colour value was changed anywhere in this codebase to produce this
document — see the constraints in the task brief. This document exists so the design
system's owners can make an informed colour decision; it does not make one for them.

Source data: `docs/a11y/raw-a11y.txt` (the brief-designated `npm run test:a11y:ci` run,
already committed) plus the two reruns `docs/a11y/raw-a11y-rerun1.txt` /
`raw-a11y-rerun2.txt` (already committed by an earlier task) for the light-theme flake
noted in `docs/a11y/baseline-2026-08-20.md`. No new sweep was run for this task — the
existing raw files already contain everything needed to name every failing selector, and
re-running would not change which CSS rules are load-bearing. Every ratio below was
computed independently from the real cascade in `packages/stencil/src/global/color.css`
and the relevant component `.css`/`.tsx` files, using the WCAG relative-luminance
formula, to 3 significant figures. Axe's own numbers are not the source of truth here —
axe was used only to name which selectors to go and look at.

## 1. The real scope

`docs/a11y/findings.md` (F-023) reports "29 distinct stories fail axe checks... overwhelmingly
color-contrast." That headline number is correct but imprecise once you split it by rule.
Re-parsing `raw-a11y.txt` selector-by-selector:

**29 distinct stories fail at least one axe rule, union of light ∪ dark, in the
brief-designated run** — this matches the baseline exactly. Of those 29:

| | Count | Stories |
| --- | --- | --- |
| Genuinely `color-contrast` | 26 | see §2 |
| `color-contrast` in some runs, a different rule in others (flaky) | 1 | `Components/Header Default` — see below |
| Not `color-contrast` at all | 2 | `Components/Pagination Full` (axe's `target-size` rule only — already tracked separately as F-022/WCAG 2.5.8, not a colour fault), `Components/Textarea RichEditorEnabled` (`aria-command-name` — Quill's picker buttons have no accessible name; nothing to do with colour) |

`Components/Header Default` (dark theme) is the one story that changes which *rule* it
fails between runs, not just how many instances: the brief-designated run
(`raw-a11y.txt`) shows only `link-name` (2 nodes — the header's govt-logo/entt-logo
anchors have no discernible text, unrelated to colour); both reruns
(`raw-a11y-rerun{1,2}.txt`) show `link-name` **plus** `color-contrast` (1 node,
`#ddaSearch` — an unstyled native `<input>` sitting inside a coloured circular
`.dda-btn` search-toggle button). I did not chase `#ddaSearch`'s exact ratio down — it is
one story, already flagged as unstable in F-037, and is not one of the recurring
pairings below. Recorded here for completeness, not analysed further.

**Reconciling against the baseline's range:** the baseline reports light 14–16
instances/stories and dark 28–29 instances, 25 stories, both described as ranges with
two named flake stories (`components-range-slider--default`,
`components-stepper-horizontal-stepper--default`) driving the light-side instability.
Re-deriving the light-theme count directly from `raw-a11y.txt`'s `[theme=light]` lines
gives exactly **14** stories, matching the brief-designated run; re-deriving the same
count from `raw-a11y-rerun1.txt` gives exactly **16**, with the two extra stories being
precisely the ones the baseline names. My reading agrees with the baseline's range and
adds the mechanism: see §2's row 7 and the note under it — one of those two "flake"
stories is not a flake at all, it is a real, computable 3.18:1 failure that the
brief-designated run's scan simply didn't register that time; the other genuinely
doesn't reproduce by computation and is a harness question, not a colour one (see the
note under §2's Tabs row, which has the same character).

Dark-theme distinct-story count reproduces at exactly 25 in every run, as the baseline
says. Of those 25: 23 involve `color-contrast` (including the 3 range-slider stories,
which also separately fail `target-size`, and the 1 flaky Header story), 2 do not
(`Pagination Full` = `target-size`, `Textarea RichEditorEnabled` = `aria-command-name`).

## 2. Root-cause grouping

29 stories are not 29 independent problems. They trace to **4 root causes, expressed as
8 specific token/selector pairings**, which together account for **24 of the 29**
stories. The remaining 5 are: 2 not contrast at all (§1), 1 flaky-rule (Header), and 2
(`Tabs TextTabs`/`TextIconTabs`) that I could not reproduce by computation at all — see
the note below the table, which is a finding about the harness, not a colour fault.

All ratios computed against real resolved hex values from `color.css`'s cascade
(`:root` base, then `:root[data-theme='dark']` override where one exists — every token
used below is resolved by hand-walking that exact cascade). Font sizes are drawn from
`global/typography.css` (`--dda-fs-body-lg`=16px, `--dda-fs-body-md`=14px,
`--dda-fs-title-sm`=18px) and each component's own literal `font-size`/`font-weight`
declarations; nothing here reaches WCAG's "large text" bar (≥24px, or ≥18.66px **and**
bold/700) except `dda-alert`'s `.alert-title` (24px, explicit), so every other row uses
the 4.5:1 normal-text threshold.

| # | Pairing (foreground token → background token) | Light ratio | Dark ratio | Threshold | Stories (this run) |
| --- | --- | --- | --- | --- | --- |
| A1 | `--dda-neutral-60` (#8E9191, theme-invariant) text vs page body `--dda-surface-100` | **3.18:1 FAIL** | 5.40:1 pass | 4.5:1 | `dda-input`, `dda-textarea`, `dda-search-input`, `dda-select`, `dda-number-field`, `dda-phonefield`, `dda-attach-file`, `dda-creditcard-field` — each `Disabled`/error-adjacent story, light theme only (8 stories) |
| A2 | Same `--dda-neutral-60` text vs the disabled field's own background, `--dda-neutral-92` (raw, **not** the theme-aware `--dda-surface-92` alias) | **2.60:1 FAIL** | **2.60:1 FAIL** (identical — the background never changes with theme) | 4.5:1 | `dda-input`, `dda-search-input`, `dda-number-field`, `dda-phonefield`, `dda-select` — each `Disabled` story's own `<input>`/toggle `<button>`, both themes (5 stories) |
| A3 | Same `--dda-neutral-60` text vs `.btn-color-disabled`'s background, `--dda-surface-92` — this one *is* the theme-aware alias | **2.60:1 FAIL** | 4.51:1 pass (barely — 0.01 above threshold) | 4.5:1 | `dda-button`, `dda-link-button` `Disabled`, light theme only (2 stories) |
| B1 | `--dda-color-primary-40` (dark → `--dda-primary-70` #21BEBA) as **text**, over a hardcoded `--dda-neutral-100` (raw white) background | 6.45:1 pass | **2.30:1 FAIL** | 4.5:1 | `dda-attach-file` `Default`/`Small`/`ErrorState` — `.dda-file-choose`, dark only (3 stories) |
| B2 | Fixed `--dda-neutral-100` (raw white) as **text**, over `--dda-color-primary-40` / `--dda-on-surface-variant-30` used as a **background** | 6.45:1 / 9.30:1 pass | **2.30:1 / 1.70:1 FAIL** | 4.5:1 | `dda-avatar` `StatusText`, `dda-credit-card` `Green`/`Dark`, dark only (3 stories) |
| B3 | `--dda-on-surface-variant-30` text vs a raw, non-aliased light background (`--dda-neutral-variant-94` or `--dda-neutral-100`) | 8.00:1 / 9.30:1 pass | **1.46:1 / 2.30:1 FAIL** | 4.5:1 | `dda-chip` `Grey`, `dda-range-slider` `Default`/`TooltipTop`/`TooltipBottom` (`.min-label`/`.max-label`), dark only (4 stories) |
| C | Raw, theme-invariant near-black text (`--dda-neutral-0` or `--dda-neutral-variant-30`) with **no dark-theme override at all**, vs the theme-aware page background | 21.0:1 / 9.30:1 pass | **1.22:1 / 1.84:1 FAIL** | 4.5:1 (3:1 for the 24px alert title, n/a here) | `dda-progressbar` (`.dda-percentage-text`), `dda-horizontal-stepper` `Default` (completed/active subtitle+description, step-3 title), dark only (2 stories) |
| D | `--dda-color-primary-40`/`--dda-color-warning-40` text vs their **own matching theme-aware** `-variant-95` background alias — both sides are theme-aware, the dark-mode *values* just don't clear the bar | 5.54:1 / 5.73:1 pass | **4.05:1 FAIL** (description only) / **2.08:1 FAIL** (title + description) | 4.5:1 (desc) / 3:1 (24px title) | `dda-alert` `AlertInfo` (description only), `AlertWarning` (title + description), dark only (2 stories) |

**Row A1's light-theme instability, resolved:** `raw-a11y-rerun1.txt`'s extra light-theme
story, `Stepper/Horizontal Stepper Default`, is **not a rendering flake** — it is the
same 3.18:1 A1 failure. `dda-horizontal-stepper.css`'s *default* (not completed, not
active) step uses `color: var(--dda-neutral-60)` for `.h-step-subtitle`/
`.h-step-description` — the identical token as the "disabled form field" family, just in
a different component. It is a real, reproducible failure that the brief-designated
run's single scan happened not to register that time (plausibly related to
F-036's already-documented off-by-one default-step state, which could leave a different
step in the "default" class depending on hydration timing — I did not chase this
further, it's a hypothesis, not a confirmed mechanism). Either way: this is a genuine
colour fault, filed as such, not a testing artefact to wave away.

**Row A1/B's other flaky light-theme story, `Range Slider Default`, does not reproduce by
computation.** Its light-theme extra failure in the reruns is `target-size` (the same
rule already tracked at F-022), not `color-contrast` — my computed ratio for its
`.min-label`/`.max-label` text in light theme is 9.30:1, nowhere near failing. So that
half of the baseline's named light-theme flake is not a colour question at all; it was
already correctly out of scope for F-023.

**`Tabs TextTabs`/`TextIconTabs` — genuinely unreproducible.** Axe flags
`.dda-tab-item:nth-child(2)/(3) > span` (the inactive tabs) in dark theme. Tracing the
cascade: inactive `.dda-tab-item` has `color: var(--dda-on-surface-0)` (dark →
`--dda-neutral-100`, #FFFFFF) on a fully transparent background stack up to the page body
(`--dda-surface-100` dark → `--dda-neutral-10`, #191C1C). That's white text on
near-black — **21.0:1**, nowhere near a failure. I checked for a Storybook decorator or
wrapper background that might interpose a lighter panel (`.storybook/preview.js` has no
such decorator; `dda-tabs.stories.tsx` renders the bare custom element with no wrapper)
and found none. I cannot explain this one from the source. **This is a finding about the
harness or the rendered DOM at test time, not a colour defect** — flagging it rather than
folding it into a token/usage verdict either way, per the brief's instruction.

## 3. Token faults vs usage faults

**Usage faults — a compliant token already exists in the palette; the component just
reached for the wrong one. Repairable without a design decision.**

- **Row A2 vs A3, directly comparable.** `dda-button.css`'s `.btn-color-disabled`
  correctly uses the theme-aware `--dda-surface-92` alias and *passes* in dark (4.51:1).
  `global/input.css`'s `.dda-input-disabled` rule (which every input-family component
  shares) uses the raw, non-aliased `--dda-neutral-92` for the identical visual intent
  and *fails* in dark (2.60:1) — because `--dda-neutral-92` never changes with theme
  while `--dda-surface-92` does (light: same #E6E9E8; dark: #272B2A). Swapping
  `input.css`'s disabled-field background from `--dda-neutral-92` to `--dda-surface-92`
  would recover dark-theme compliance for the 5 stories in row A2, using a token this
  same codebase already proves reads correctly, with no new colour chosen. It would
  **not** fix the light-theme half (A1/A2 both still fail light at the same magnitude —
  see §4, that part needs a real value decision).
- **Row B1/B2/B3, all one shape.** Each pairs a **raw, theme-invariant** base token
  (`--dda-neutral-100`, `--dda-neutral-variant-94`) with a **theme-flipping** semantic
  alias (`--dda-color-primary-40`, `--dda-on-surface-variant-30`) used on the *wrong*
  side of the pairing — as a background where the alias was designed to be readable
  *text*, or as a background left flat white/light while the paired text alias correctly
  brightens for dark mode and consequently stops working against a background that never
  went dark. In every one of these 7 stories (attach-file ×3, avatar, credit-card ×2,
  chip, range-slider ×3 — counted once each in §2, 10 stories total across B1–B3) a
  theme-aware background alias already exists elsewhere in `color.css`
  (`--dda-surface-100`, `--dda-surface-variant-90`/`-87`/`-80`, or simply not overriding
  a container's inherited background) that would make the *existing* foreground token
  read correctly in both themes. This is the single largest class of failure by story
  count (10 of the 24 explained stories) and it is entirely a usage problem, not a
  palette problem.
- **Row C.** `dda-progressbar` and `dda-horizontal-stepper` hardcode `--dda-neutral-0`/
  `--dda-neutral-variant-30` with **no `.light-mode` or dark-theme rule at all** — every
  other component in this codebase that needs a "black-ish" text colour uses
  `--dda-on-surface-0` (which *does* flip to white in dark theme) plus a `.light-mode`
  override to `--dda-neutral-0` for the explicit-light-mode case. These two components
  simply never added the theme-aware version. Same fix shape as `dda-input-label`
  elsewhere in the same codebase (`global/input.css:8-15`) — a token that already exists
  and is already used correctly one file over.

**Token faults — the token pairing is correctly theme-aware on both sides; the chosen
*values* don't clear the bar. This is a design decision, not a bug to patch.**

- **Row A1/A2/A3's light-theme half.** `--dda-neutral-60` fails against every background
  it's paired with in light theme (white, #E6E9E8, and the button's `--dda-surface-92`
  light value, which is the same #E6E9E8). No swap to a different *existing* alias fixes
  this — see §4, it needs an actual lighter/darker value chosen by the palette's owners.
- **Row D (`dda-alert` info/warning, dark theme).** Both `--dda-color-primary-40`/
  `--dda-color-warning-40` (text) and `--dda-primary-variant-95`/`--dda-warning-variant-95`
  (background) are correctly theme-aware aliases, used exactly as their naming pattern
  intends (a "-40" text tone on a "-variant-95" tint fill — the same recipe
  `dda-alert-error`/`dda-alert-success` use successfully, see below). The dark-mode
  *values* the palette assigns to this pairing for primary and warning specifically are
  too close together. Notably, this is **not** systemic across all 5 semantic colours —
  I computed the same pairing for error (5.73:1) and success (6.65:1) in dark theme and
  both pass comfortably. Only primary and warning's dark remaps are under-calibrated;
  the remap formula was not applied uniformly across the 5 palettes.

## 4. Options for the token faults, with trade-offs

Presented as information for a decision. **Nothing below has been applied.**

**A1/A2/A3 — `--dda-neutral-60` "disabled/muted" text.**

No single flat value clears every background this token is paired with in both themes.
I checked the two neighbouring steps already in the palette:
- `--dda-neutral-50` (#747877): 4.47:1 on white (still ~0.03 short of 4.5), 3.66:1 on
  #E6E9E8 (still short), but only 3.84:1 on the dark body background — **worse than
  today** in the one context that currently passes.
- `--dda-neutral-40` (#5B5F5E): 6.48:1 on white, 5.30:1 on #E6E9E8 (both comfortably
  clear light theme) but 2.65:1 on the dark body — **badly worse** in dark theme.

Neither existing step works as a single constant, in either direction. That's because
`--dda-neutral-60` is currently theme-invariant by design (one value serves both
themes), but the backgrounds it sits against are not — the light-theme backgrounds are
light and the dark-theme background is dark, so a single grey cannot sit at a legible
distance from both. The token would need to become genuinely theme-aware (two values,
the way nearly every other alias in `color.css` already is) rather than staying a flat
constant. As a lower bound: on white, the lightest grey that clears 4.5:1 is
approximately `#767676`; against the disabled field's `#E6E9E8`, approximately
`#686868`. A dark-theme value can stay close to the current `#8E9191` (it already passes
at 5.40:1) or even lighten slightly for more headroom. This would be a two-value split
where today there is one — a bigger change than picking a single new hex, and one that
affects every disabled form control in the system plus the horizontal-stepper's default
step state.

**D — `dda-alert` info/warning dark-theme pairing.**

The description text needs to move from 4.05:1 (info) / 2.08:1 (warning) to 4.5:1; the
warning title also needs to clear 3:1 (currently 2.08:1, same pairing). Two independent
directions exist, and they trade off differently:
- **Lighten the text token** (`--dda-color-primary-40`/`--dda-color-warning-40` in dark
  theme) without touching the background. For warning, moving from the current
  `--dda-warning-50` (#A46B00) toward something nearer `--dda-warning-70`/`-80`
  (#EB9A00/#FFB956) would very likely clear both thresholds against the current
  `--dda-warning-30` (#643F00) background — but `--dda-color-warning-40` is also the
  border colour and the button/link colour inside the alert (`.alert-btn-wrap a`,
  `.dda-alert-close`), so lightening it changes those too, not just the paragraph text.
- **Darken the background token** (`--dda-*-variant-95` in dark theme) instead, leaving
  the text alone. This keeps the border/link/icon colour untouched but changes the tint
  fill's depth, which is a more visible brand/mood change to the alert's overall look.
- Either direction is closer for info (4.05:1, needs +0.45) than for warning (2.08:1,
  needs +2.42 to clear even the title's 3:1) — warning needs a substantially larger
  move. I did not compute a specific target hex for either direction: it depends on
  which side (text or background) the owners choose to move, and by how much they're
  willing to shift the alert's overall dark-theme colour identity for a semantic colour
  that's also used as the border/button/icon colour elsewhere in the same component.

**A1/A2's cousin, row D's error/success precedent, is itself useful context:** the
identical recipe (a "-40" text tone on a "-variant-95" background tint) already passes
comfortably for error and success. Whatever the owners choose for primary/warning's dark
remap, matching how error/success's dark values were chosen (rather than picking
independently) would restore consistency across the 5 semantic palettes.

## 5. Recommendation

**This is a recommendation, not a decision already taken; nothing in this repository has
been changed to reflect it.**

Fix the usage faults first (§3's first block — 10+ of the 24 explained stories, plus the
2 no-dark-override cases in row C), since none of them require a design decision: each
either has a compliant, already-proven token sitting one file away, or needs nothing
more than adding the dark-theme override every comparable component already has. Doing
that alone would clear roughly half of this task's explained failures without anyone
choosing a new colour.

That leaves two genuine design decisions for the design system's owners, and I'd put the
`--dda-neutral-60` "disabled/muted text" token (A1/A2/A3) ahead of the alert
recalibration (D): it is reused across at least 9 components (every input-family field,
both buttons, and the stepper) and is the one case in this analysis where no existing
palette value — lighter or darker — works as a drop-in replacement in both themes at
once. It needs to become a real two-value theme-aware token, which is a bigger structural
change than nudging a hex, and it's worth deciding before anyone touches the individual
components that consume it, so each of those 9+ fixes lands once instead of being redone
when the token changes shape later.
