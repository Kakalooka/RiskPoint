# RiskPoint — deferred UI and accessibility issues

**Status:** every item below is **DEFERRED**. The issues were confirmed or raised in the independent audit of `main` at `8be19c5` (2026-10-16). Fixing any of them changes UI, layout, tokens, copy or interaction behavior, so each needs an explicit human decision and a separate change. Do not fix them as a side effect of other work. Do not treat them as defects of the frozen Build 1 artifact either (see `FINAL.md`).

This file records evidence and acceptance criteria only. Product, UX and design decisions remain in `PRODUCT.md`, `UX_RESEARCH.md`, `DESIGN.md` and `SPEC.md`.

Expected-failure browser tests in `tests/browser/known-ui-issues.spec.mjs` mark the items that can be measured. When an item is fixed, its expected-failure test starts passing, Playwright reports it, and the marker must be removed together with the fix.

| ID | Priority | Area | Type |
|---|---|---|---|
| N-01 | P2 | Responsive layout | Confirmed defect |
| N-02 | P2 | Accessibility (non-text contrast) | Probable WCAG issue, needs human judgement |
| N-03 | P3 | Accessibility (landmarks) | Confirmed best-practice violation |
| N-06 | P3 | TypeScript type safety | Confirmed type hole, no runtime effect |
| RP-02 | P3 | Keyboard interaction | Open decision, not a defect |

## N-01 — Open Q1 list overlaps the progress footer on short viewports
- **Evidence:** `src/styles/app.css` (`.selector__list { max-height: min(52vh, 420px) }`) does not account for the footer. Measured in Chromium against the production build:
  - 320×568: list bottom 545 px, progress text top 528 px. "Other" visually collides with "1 of 3".
  - 375×560: list bottom 521 px, progress top 520 px.
  - 667×375 (phone landscape): 4 of 7 options visible. The rest sit in a scroll container with no visual cue that more options exist.
- **Requirement affected:** `SPEC.md` → Responsive Behavior ("Q1 with seven options must remain usable on a small-height phone").
- **Impact:** the selection still works (scroll, keyboard). The problems are visual overlap and discoverability of hidden options.
- **Acceptance criteria:** at 320×568, 375×560 and 667×375 the open list never overlaps footer text. Options beyond the visible area are discoverable in a way consistent with `DESIGN.md`. There is no horizontal overflow, and 375×667, 768 and 1440 widths do not regress.

## N-02 — Lead-form field underline below 3:1 non-text contrast
- **Evidence:** `.field__input` is identified visually only by a 1 px bottom border in `--line-strong` (`#b4b0a7`) on `--bg` (`#f5f4f0`): **1.97:1**. WCAG 2.2 SC 1.4.11 expects 3:1 for visual information needed to identify a UI component. Text labels ("Work email", "Company name") partly mitigate this, so compliance is a judgement call.
- **Related:** the same token is the selector trigger underline on dark (2.0:1). That trigger is also identified by its text and chevron.
- **Acceptance criteria:** a documented a11y decision. If changed, the field boundary measures ≥ 3:1 against its background, through a token change approved under `DESIGN.md`.

## N-03 — No `main` landmark on the assessment screens
- **Evidence:** `src/components/Assessment.tsx` renders a `<form>` with no `<main>`, while the result screen uses `<main>`. axe reports `landmark-one-main` and `region` (best-practice, moderate) on Q1–Q3.
- **Acceptance criteria:** axe reports no `landmark-one-main` or `region` violations on Q1 (closed and open), Q2, Q3, the result, and the result with both panels open. The visual output is unchanged.

## N-06 — Selector answer ids are not type-checked
- **Evidence:** `Selector.onChange(id: string)` is written into `Partial<Answers>` via `{ ...draft, [question.key]: id }` (`src/components/Assessment.tsx`). The computed key widens the type, so `tsc` accepts an arbitrary string (for example `'bogus-id'`) as an answer. At runtime ids always come from `src/model/config.ts`, so behavior is currently correct.
- **Acceptance criteria:** `tsc` rejects an answer id that is not a member of the corresponding union. Rendered output and behavior are unchanged.

## RP-02 — Tab / Shift+Tab inside the open selector list (open decision)
- **Current behavior (`main`, intentional fix from PR #2):** Tab or Shift+Tab in the open list closes it **without selecting**, returns focus to the selector trigger and prevents default. The next Tab or Shift+Tab then moves on. This is not a keyboard trap.
- **Reference:** the WAI-ARIA APG select-only combobox pattern describes Tab as: select the focused option, close the list, and move focus to the next focusable element.
- **Related minor observations:**
  - Typeahead only works while the list is open.
  - Typing a digit does not match revenue labels, which start with "€" or "Under".
  - Moving the mouse over an option moves DOM focus to it.
- **Decision needed:** keep the current behavior or adopt the APG behavior in both directions. Hidden controls must never receive focus in either case.
- **Acceptance criteria (if changed):** E2E tests for Tab and Shift+Tab focus order in both directions, with the open-list and closed-list states covered.

## Other minor observations (no action planned)
- Closing "See protection options" unmounts the lead panel and discards typed values and the confirmation state.
- There is no browser-history integration: Back on the result leaves the app, and reload loses answers. This is consistent with `SPEC.md` ("No router required").
- `aria-controls` on the two result disclosures points to ids that exist only while the panels are open.
