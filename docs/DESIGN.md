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
- **Result:** clarity, resolution, relief. A disc centred on the bottom-right corner, so a quarter of
  it is visible and its straight edges are the edges of the screen, in the risk hue as a 9% tint.
  It enters the composition gently: the arc passes behind the end of the links row and the edge of
  the CTA, while the € range and the level word stay clear.
- **Content is exactly centred** on every screen.

*(Variant v01, on branch `claude/visual-exploration-v01`, also places a tonal plane in the
bottom-left of each question screen, stepping up 3% per question. The result screen is identical in
both variants — verified pixel-identical at 611×922, 1280×720, 1440×900 and 1920×1080.)*

### Sizing rule — measured to the content
The radius is the distance from the bottom-right corner to a point just right of the financial range
(180px right of and 80px below the viewport centre), less 30px, computed in CSS with `hypot()`:
`clamp(160px, hypot(50vw − 180px, 50vh − 80px) − 30px, 660px)`. The arc therefore meets the content
in the same place at any aspect ratio. Sizing in viewport units alone does not hold the relationship:
the text stops growing at its `clamp` maximum, and the corner moves relative to centred content as the
aspect ratio changes. The cap stops the plane growing on large monitors where the text no longer
grows; there, the distance to the content opens up instead.

**Calibration.** The human-approved reference was captured at about 611×922. At that viewport the
rule gives a 371px radius against 401px in the reference, with the same arrangement — behind the CTA's
end and the links, the range clear by 64px against 60px. It is deliberately a little smaller so the
range keeps at least 30px of air on desktop.

**Measured** (gap from the arc to the nearest glyph or button; negative means the arc passes behind it):

| Viewport | Links | CTA | Range | Level |
|---|---|---|---|---|
| 1024×768 | −28 | −8 | +61 | +118 |
| 1280×720 | +4 | +15 | +37 | +67 |
| 1366×768 | −1 | +12 | +34 | +70 |
| 1440×900 | −23 | −4 | +30 | +82 |
| 1536×864 | −9 | +7 | +34 | +76 |
| 1920×1080 | about +200 (cap) | | | |

Rules:
- One form, on the result only. No second shape, gradient, texture or image asset; nothing on the
  question screens.
- Its only motion is the opacity fade as the result appears, which `prefers-reduced-motion` shortens.
- Presentation only: behind all content, never interactive, hidden from assistive tech.
- `<html>` reserves no scrollbar gutter. On Windows a reserved gutter keeps fixed content 15px off the
  right edge, which cut the plane short of the screen edge it is anchored to.
- Browsers without CSS `hypot()` (older than about 2023) render no plane; the content is unaffected.

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
**Human approved:** Sora only; dark Q1–Q3; light result; dark → light as the semantic assessment → answer transition; almost monochromatic assessment with semantic color first on the result; centered editorial layout; the typographic selector; three-segment progress; the result showing only the user's own level; motion sequence and reduced-motion behavior; the avoid-list above; Revolut as inspiration rather than a UI to copy; the curved plane as the result's reveal — no motif on the question screens, a bottom-right plane in the risk hue on the result, sized by distance to the content so the balance holds across aspect ratios (variant v02; v01 keeps a tonal plane on the questions) — with content exactly centred.

*(Superseded by the simplification pass: the left-aligned two-column layout, the answer-row treatment and the three-segment risk indicator.)*

**First-build interpretation (Claude, pending human review):** exact palette values, risk hues, radius, spacing scale, type scale, motion timings, responsive proportions, and the plane's exact radii, tone steps and tint percentage.

**Note:** Design decisions must be grounded in research and product goals, not arbitrary preference.
