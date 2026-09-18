# RiskPoint Design System

## Visual Direction
RiskPoint should feel like a contemporary premium product interface rather than a stereotypical "cybersecurity" experience. The working reference is the clarity and restraint associated with modern fintech/product UI, including Revolut as a user-selected inspiration.

### Human-approved direction
- The three assessment screens use a **dark** visual environment.
- The result screen switches to a **light / white** visual environment.
- The dark → light transition is semantic: **assessment / investigation → answer / clarity**. It happens once and should not be treated as arbitrary decoration.
- Keep the interface visually restrained: one dominant task per screen, strong typography, generous spacing, and limited chrome.
- Avoid alternating dark/light on every question screen.
- Layout is **centered, editorial and restrained**, with large negative space and very little chrome. Screens should feel almost empty and confident enough to leave large areas blank.
- The assessment is almost monochromatic. Meaningful semantic color appears for the first time on the result, mainly in the risk level itself.
- Solve uncertainty through hierarchy, spacing and interaction rather than explanatory copy. Do not add copy to fill space.

*(The first build used a left-aligned two-column layout with answer rows. The simplification pass replaced it with the centered single-column composition described here.)*

## Design References
- **Revolut app** — user-selected inspiration for clean, contemporary product UI, strong hierarchy, restraint, and focus on the primary action.
- This is a reference, not a skin to copy. RiskPoint should retain its own identity and insurance/cyber-risk context.

## Typography
Use a single type family and create hierarchy through size, weight, spacing, and contrast rather than mixing multiple font families.

### Typefaces
- **All text**: Sora (human-approved; Sora only)
- **Monospace**: none. Do not add a second font.

### Typography direction
- Large, confident question headings.
- Highly legible answer labels and supporting copy.
- The risk level (`LOW` / `MID` / `HIGH`) is the largest element on the result. The financial range is clearly smaller.
- Exact sizes, weights and line heights: first-build values in `src/styles/tokens.css` (Claude's interpretation, pending human review).

## Components
### Selector *(human-approved direction, simplification pass)*
The same component is used for all three questions: one centered line of text that opens its options in place.
- Closed: the placeholder ("Choose industry") or the chosen answer, with a chevron and a thin underline. It reads as interactive without looking like a form control.
- Options are not visible before interaction.
- Expanded: a minimal typographic list, unselected options dimmed, the active one at full contrast. The forward action is hidden while the list is open, and the list is positioned so the question does not move.
- Selected is marked by weight and contrast, not colour alone, and carries no second accent. Visible focus state.
- Not: radio buttons, cards, chips, pills, bordered rows, native select styling, icons or two-column layouts.

### Progress *(human-approved direction)*
Three small horizontal segments plus a textual equivalent ("1 of 3"), centered at the bottom. Short and finite; no urgency.

### Risk level *(human-approved direction, simplification pass)*
The result shows only the user's own level as the hero, with a minimal accent rule in the level's colour. No scale, no three-segment indicator, no gauge, speedometer, ticks or numbers, and nothing that reveals the hidden score.

## Composition — the curved plane as the result's reveal *(variant v02, for comparison with v01)*
One geometric form, used once. The three question screens carry **no motif at all**: dark, quiet,
almost empty, concentrated on the question. The curved plane appears for the first time on the
result, as part of the change from dark to light:

- **Questions (Q1–Q3):** dark and empty. Tension, uncertainty, night.
- **Result:** clarity, resolution, relief. A **true circle** in the bottom-right, in the risk hue as a 9%
  tint, cropped by the right and bottom edges of the screen. It enters the composition gently: the arc
  passes behind the right part of the CTA and the end of "How is this calculated?", while the € range
  and the level word stay clear. At 9:16 it is exactly a quarter disc centred on the bottom-right corner.
- **Content is exactly centred** on every screen.

*(Variant v01, on branch `claude/visual-exploration-v01`, also places a tonal plane in the
bottom-left of each question screen, stepping up 3% per question. The result screen is identical in
both variants — verified pixel-identical at 611×922, 1280×720, 1440×900 and 1920×1080.)*

### Sizing rule — the 9:16 reference circle, scaled about its CTA crossing *(human decision)*
**Reference.** The human-approved composition is the 9:16 result at 566×915. There the circle is
centred on the bottom-right corner, **283px right of and 293px below the CTA's centre**, with a
**361px radius**. Its arc crosses the CTA's centre line at a point P, 72px right of the CTA's centre.

**Requirements** *(human decision)*: always a perfect 1:1 circle, never stretched; approximately the
reference's relationship to the content; still partly cropped beyond the right edge on wide screens;
only a small shift or a modest scale where necessary.

**Why it must scale.** A circle of fixed size, fixed to centred content, reaches the right edge at only
one width. As the screen widens the edge moves away, so the circle has to move or grow to stay cropped
by it. Moving it right is a weak lever: about 55px of shift takes the arc off the CTA entirely. Scaling
preserves the relationship.

**Rule.** Every viewport uses the reference circle, scaled uniformly by `s` about P:
`centre = P + s·(211, 293)`, `r = 361·s`. Every such circle passes through P at the same angle, so
the CTA overlap is identical at every size; the links and the range move only a few pixels as the arc
flattens. `s` is the smallest scale, never below 1, that keeps:
- at least **15% of the radius beyond the right edge** (`CROP` in `Plane.tsx`);
- the centre at or below the **viewport** bottom, so the circle rises from the bottom edge as in the
  reference. The viewport is used rather than the page, so opening the lead form never enlarges it.

The reference, phones, 1024×768 and most portrait tablets need no scaling. The solver lives in
`Plane.tsx`, which measures the CTA from layout offsets (so the reveal transforms do not move it) and
re-solves on resize, lead form, method disclosure and font loading. The CSS only draws the circle it is
given: a square with `border-radius: 50%`, clipped by the result.

**Honest limit.** Up to about 1536px wide the growth is modest (up to +34%). At 1920×1080, holding both
the CTA overlap and a right-edge crop needs about +71%. Because the screen is larger too, the circle's
share of the screen stays near the reference's (17% against 20%). The crop amount was compared at
0.10 / 0.15 / 0.25 on 1920×1080 (radius 598 / 619 / 666px); 0.15 was chosen.

*(Superseded: (1) centred on the viewport corner with
`clamp(160px, hypot(50vw − 180px, 50vh − 80px) − 30px, 660px)`, which drifted as the screen widened;
(2) the reference circle pinned to the CTA with the rest of the plane filled flat to the edges, which
kept the overlap but stopped being a circle on wide screens.)*

**Measured** (CTA/links: arc position at their centre lines relative to their centres, in CTA heights
of 52px, positive = right; gaps from the arc to the end of the range and of the level word; crop =
part of the radius beyond the right edge; share = part of the screen covered):

| Viewport | Scale | Radius | CTA | Links | Range gap | Level gap | Crop | Share |
|---|---|---|---|---|---|---|---|---|
| **566×915 reference** | **1.00** | **361** | **1.39** | **−0.21** | **1.66** | **4.31** | **1.00** | **0.20** |
| 375×667 | 1.00 | 361 | 1.38 | −0.07 | 1.40 | 3.59 | 1.26 | 0.16 |
| 390×844 | 1.00 | 361 | 1.38 | −0.19 | 1.59 | 4.11 | 1.25 | 0.19 |
| 768×1024 | 1.10 | 395 | 1.41 | −0.24 | 1.75 | 4.37 | 0.80 | 0.20 |
| 1024×768 | 1.00 | 361 | 1.40 | −0.13 | 1.39 | 3.59 | 0.37 | 0.15 |
| 1280×720 | 1.10 | 396 | 1.41 | −0.12 | 1.13 | 3.42 | 0.15 | 0.12 |
| 1366×768 | 1.18 | 426 | 1.40 | −0.19 | 1.14 | 3.51 | 0.15 | 0.13 |
| 1440×900 | 1.25 | 451 | 1.38 | −0.31 | 1.25 | 3.84 | 0.15 | 0.15 |
| 1536×864 | 1.34 | 485 | 1.40 | −0.32 | 1.21 | 3.67 | 0.15 | 0.15 |
| 1920×1080 | 1.71 | 619 | 1.38 | −0.43 | 1.30 | 3.92 | 0.15 | 0.17 |
| 2560×1080 | 2.33 | 842 | 1.38 | −0.52 | 1.25 | 3.67 | 0.15 | 0.18 |
| 2560×1440 | 2.33 | 842 | 1.38 | −0.52 | 1.25 | 3.67 | 0.15 | 0.21 |

Most of the variation in the range and level gaps comes from the text itself: the level word and the
range grow with the viewport (`clamp`), and vertical spacing uses `vh`.

Rules:
- One form, on the result only. No second shape, gradient, texture or image asset; nothing on the
  question screens.
- Its only motion is the opacity fade as the result appears, which `prefers-reduced-motion` shortens.
- Presentation only: behind all content, never interactive, hidden from assistive tech.
- `<html>` reserves no scrollbar gutter, so the plane reaches the right screen edge.
- Always a true circle: a square element with `border-radius: 50%`, never stretched, cropped only by
  the screen edges.
- The plane stays hidden until its anchor has been measured, so it never renders unpositioned.

### Consequences kept from the plane work
- The expanded selector list carries **no background** (introduced in v01, where an opaque box cut a
  rectangle out of the plane behind it). Kept here because nothing needs masking: the trigger is
  hidden while the list is open.
- While the list is open the **footer recedes** (progress and `Back` fade out), exactly as the
  forward action already does, so a long list can scroll without colliding with the progress row.
- The result tint is **capped at 9%** of the risk hue: measured so even the faintest 12px text
  clears 4.5:1 anywhere on the plane, for every risk hue.

## Color Logic
### Human-approved structural logic
- **Question 1:** dark
- **Question 2:** dark
- **Question 3:** dark
- **Result:** light / white

The result transition should create a clear change of mode after `See my risk`, while remaining comfortable and accessible rather than using a harsh flash.

### Color Palette
Human-approved constraints:
- Assessment: dark neutral, high-contrast light foreground, almost monochromatic.
- Result: light neutral background, dark foreground.
- Risk hues are restrained, not saturated traffic-light colors. LOW / MID / HIGH must never rely on color alone.

Exact values (neutrals, surfaces, risk hues): first-build values in `src/styles/tokens.css` (Claude's interpretation, pending human review).

## Spacing
Direction: generous whitespace, low visual density, and enough separation that each screen feels focused on one decision. First-build values in `src/styles/tokens.css`.

## Motion
Motion communicates real state change, not artificial waiting time. *(Human-approved direction)*

- Subtle transitions between assessment questions.
- After `See my risk`: assessment content exits → dark background transitions to light → risk result appears → supporting information follows with a restrained stagger.
- The result is already calculated; animation is presentation only. The CTA stays usable.
- No `Calculating…`, "Analyzing with AI…", typing dots, spinner, fake progress or count-up loss animation.
- `prefers-reduced-motion`: no translation-heavy sequence, no indicator travel; short opacity/theme transition only.

Exact durations and easing: first-build values in code (pending human review).

## Tone of Voice
Professional, concise, calm, and clear. Avoid alarmist cyber language or fear-marketing claims that the model cannot support.

## Do / Don't
### Do
- Keep one dominant action per assessment screen.
- Use typography, spacing, contrast, and motion as the main design tools.
- Give visual changes a product/semantic purpose.
- Maintain clear contrast and visible state changes.

### Don't
- Do not use stereotypical hacker / Matrix / neon-cyber aesthetics (neon, glowing cyan/green, hoodies, padlocks, shields as hero imagery, network particles, futuristic grids).
- Do not use glassmorphism, gradient mesh backgrounds, dashboard chrome, gauge dials or speedometers.
- Do not use huge icon cards, generic card stacks, badge pills for LOW / MID / HIGH, or wrap every result section in a card.
- Do not use decorative charts, fear statistics, countdowns or urgency banners.
- Do not alternate dark and light backgrounds merely to create stimulation.
- Do not add decorative complexity that competes with the three-question funnel.
- Do not introduce a second type family.
- Do not use motion as a fake calculation delay.

---

## Decision Status
**Human approved:** Sora only; dark Q1–Q3; light result; dark → light as the semantic assessment → answer transition; almost monochromatic assessment with semantic color first on the result; centered editorial layout; the typographic selector; three-segment progress; the result showing only the user's own level; motion sequence and reduced-motion behavior; the avoid-list above; Revolut as inspiration rather than a UI to copy; the curved plane as the result's reveal — no motif on the question screens, a bottom-right true circle in the risk hue on the result, the 9:16 reference circle scaled about its CTA crossing so its relationship to the content holds at every aspect ratio (variant v02; v01 keeps a tonal plane on the questions) — with content exactly centred.

*(Superseded by the simplification pass: the left-aligned two-column layout, the answer-row treatment and the three-segment risk indicator.)*

**First-build interpretation (Claude, pending human review):** exact palette values, risk hues, radius, spacing scale, type scale, motion timings, responsive proportions, and the plane's exact radii, tone steps and tint percentage.

**Note:** Design decisions must be grounded in research and product goals, not arbitrary preference.
