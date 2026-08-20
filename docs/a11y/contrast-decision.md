# F-023 Contrast — Decision Record

**Status:** Decided, 2026-08-20. Authority delegated by the repository owner to Claude,
acting as the design decision-maker for this change.

This resolves the two token faults left open by `docs/a11y/contrast-analysis.md`. That
document deliberately made no decision; this one does, and states the reasoning so the
design system's owners can overturn any part of it with the evidence in front of them.

Every ratio below was computed from the real cascade in `packages/stencil/src/global/color.css`
using the WCAG relative-luminance formula.

---

## Principle applied

**Do not invent colours.** Every value chosen below already exists in the palette. Nothing
here introduces a hex value the design system did not already ship. Where a pairing failed,
the fix is either a different *existing* step, or a structural change to how an existing
value is applied per theme — never a new brand colour picked to satisfy a formula.

That constraint is deliberate. Choosing a genuinely new colour for a government design
system is a brand decision. Re-using a value the palette already contains is a correctness
decision, and correctness is what was delegated.

---

## Decision 1 — muted/disabled text (rows A1, A2, A3)

**The fault.** `--dda-neutral-60` (#8E9191) is a raw ramp step, theme-invariant by design.
It is used as muted and disabled *text* against backgrounds that DO flip with theme. One
grey cannot sit at a legible distance from both a white page and a near-black one:

| Context | Ratio | Verdict |
| --- | --- | --- |
| #8E9191 on white | 3.18:1 | fails 4.5:1 |
| #8E9191 on #E6E9E8 (disabled field) | 2.60:1 | fails 4.5:1 |
| #8E9191 on #191C1C (dark body) | 5.40:1 | passes |

**Rejected: changing `--dda-neutral-60` itself.** It is a base ramp step. Base steps are
supposed to be theme-invariant — that is what makes them a ramp. The theme-aware layer in
this system is the alias layer (`--dda-surface-*`, `--dda-on-surface-*`), and the analysis
already noted the same distinction: `--dda-on-surface-0` flips with theme while
`--dda-neutral-0` does not. Making a ramp step theme-aware would break that contract for
every future consumer, not just these.

**Rejected: a different flat step.** Neither neighbour works, in either direction:

| Candidate | on white | on #E6E9E8 | on dark body |
| --- | --- | --- | --- |
| `--dda-neutral-50` #747877 | 4.47:1 | 3.66:1 | 3.84:1 — worse than today |
| `--dda-neutral-40` #5B5F5E | 6.47:1 | 5.30:1 | 2.65:1 — far worse |

**DECIDED.** Add a theme-aware semantic alias and point the muted-text usages at it. The raw
ramp is untouched.

```
:root                    { --dda-on-surface-muted: var(--dda-neutral-40); }  /* #5B5F5E */
:root[data-theme='dark'] { --dda-on-surface-muted: var(--dda-neutral-70); }  /* #A9ACAB */
```

| Context | Ratio | Verdict |
| --- | --- | --- |
| #5B5F5E on white (light) | 6.47:1 | passes |
| #5B5F5E on #E6E9E8 (light, disabled field) | 5.30:1 | passes |
| #A9ACAB on #191C1C (dark body) | 7.50:1 | passes |
| #A9ACAB on #272B2A (dark disabled field, after Decision 3) | 6.26:1 | passes |

**Why `--dda-neutral-70` for dark rather than keeping #8E9191.** Keeping the current value
would give 4.51:1 against the dark disabled-field background — 0.01 above the threshold.
A margin that thin is not a pass, it is a coincidence; any future nudge to either value
breaks it silently. `--dda-neutral-70` gives 6.26:1 and real headroom.

**Blast radius: 8 call sites**, in `global/input.css`, `global/dda-button.css` and
`components/stepper/dda-horizontal-stepper/dda-horizontal-stepper.css`. Only uses where the
token is *text* change. Any use as a border or decoration stays on the raw ramp.

**Visual consequence, stated plainly.** Muted and disabled text becomes noticeably darker in
light theme (#8E9191 → #5B5F5E) and slightly lighter in dark. Disabled controls will read as
more present than they do today. That is the intended trade: at 2.60:1 the current treatment
is not "subtle", it is unreadable for a substantial number of users, and disabled text still
carries meaning — it says what the field would have been for.

---

## Decision 2 — `dda-alert` info and warning, dark theme (row D)

**The fault.** The dark remap was not applied uniformly across the five semantic palettes.
Each alert pairs a "-40" text tone on a "-variant-95" tint fill. In dark theme:

| Semantic | Text tone | Fill | Ratio | Verdict |
| --- | --- | --- | --- | --- |
| error | `error-70` #FF8A7B | `error-20` #690003 | 5.73:1 | passes |
| success | `success-87` #95EE9E | `success-30` #00531F | 6.65:1 | passes |
| primary (info) | `primary-70` #21BEBA | `primary-30` #00504E | 4.05:1 | **fails** |
| warning | `warning-50` #A46B00 | `warning-30` #643F00 | 2.08:1 | **fails** |

The two that pass put a lighter text tone on a darker fill. Warning is the clear outlier —
a `-50` text tone where the others use `-70` or `-87`.

**DECIDED. Bring the two failing pairs onto the shape the two passing pairs already use.**

```
:root[data-theme='dark'] {
  --dda-primary-variant-95: var(--dda-primary-20);   /* was --dda-primary-30 */
  --dda-color-warning-40:   var(--dda-warning-80);   /* was --dda-warning-50 */
}
```

| Change | Result | Verdict |
| --- | --- | --- |
| info: #21BEBA on `primary-20` #003735 | 5.72:1 | passes |
| warning: `warning-80` #FFB956 on #643F00 | 5.47:1 | passes |

**Why these two directions and not the same one for both.**

For **info**, darkening the fill is the smaller change and makes primary structurally
identical to error — a `-70` text tone on a `-20` fill. It leaves the text token alone, and
that token is also the alert's border, link and icon colour, so not touching it keeps the
change confined to the tint.

For **warning**, darkening the fill cannot work: the text at #A46B00 is itself dark, so the
fill would have to go almost black to clear 4.5:1, which would no longer read as a warning
tint. The text tone must move, and `-70` is not enough — #EB9A00 gives only 4.06:1, which
clears the 24px title's 3:1 but fails the description's 4.5:1. `-80` gives 5.47:1 and brings
warning into the same tonal family as the other three.

**Visual consequence, stated plainly.** Info alerts get a deeper teal fill in dark theme.
Warning alerts get a noticeably brighter amber for their text, border, link and icon.
Warning changes more than info, because warning was further out.

---

## Decision 3 — the usage faults ship in the same change

The analysis separated **token faults** (needing this decision) from **usage faults**
(a compliant token already exists; the component reached for the wrong one). The usage faults
were always repairable without a decision. They ship together, because several interact with
Decision 1 — the dark-theme figures above assume the disabled field background is theme-aware.

- **A2** — `global/input.css`'s shared disabled rule uses raw `--dda-neutral-92`; swap to the
  theme-aware `--dda-surface-92`. `dda-button.css` already proves this alias reads correctly.
- **A4** — `.dda-input-disabled .dda-file-choose` overrides separately to raw
  `--dda-neutral-95`. It needs its own swap; a find-and-replace on `--dda-neutral-92` misses
  it entirely.
- **B1/B2/B3** — 10 stories pairing a raw theme-invariant token with a theme-flipping alias
  on the wrong side. A theme-aware background alias already exists for each.
- **C** — `dda-progressbar` and `dda-horizontal-stepper` hardcode near-black text with no
  dark override. Every comparable component uses `--dda-on-surface-0`, which flips.

---

## What is NOT decided here

- **The `Tabs TextTabs`/`TextIconTabs` failures.** Axe flags them; computation gives 21.0:1.
  Unexplained from source. That is a question about the harness or the rendered DOM at test
  time, not a colour fault, and it stays open.
- **`dda-header`'s `#ddaSearch`** — appears only in some runs, never traced.
- **Any change to the five semantic palettes' light-theme values.** All pass today.
- **Rolling `--dda-on-surface-muted` out beyond the 8 named call sites.** The token is
  introduced, not adopted system-wide.

## How to overturn this

Every value above is an existing palette step, so reverting is a token-level edit, not a
re-design. If the design owners prefer a different treatment, the constraint to preserve is
the ratio, not the hex: 4.5:1 for body text, 3:1 for the 24px alert title and for non-text.
