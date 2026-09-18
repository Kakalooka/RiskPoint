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

## Composition — the curved plane *(human-approved direction, visual exploration v01)*
One geometric form gives the flow a quiet composition: a disc whose centre sits on a viewport
corner, so exactly a quarter of it is visible and its two straight edges are the edges of the
screen. The text and the interaction stay primary on every screen, and the screens read as a
website, not a poster.

- **Questions (Q1–Q3):** bottom-left. The plane keeps a clear distance from the text. Between the
  three questions it changes only by a 3% step of radius and a matching small step of tone — close
  enough that the change is visible side by side, not at first glance. It stays mounted across the
  questions, so between steps it only changes size.
- **Result:** bottom-right, in the risk hue as a 9% tint, and a clearly larger step from Q3. It
  enters the composition more than on the dark screens: the arc passes behind the end of the links
  row and the edge of the CTA, while the € range and the level word stay clear.
- **Content is exactly centred** on every screen; nothing in the reading area moves between screens.

### Sizing rule — measured to the content
The radius is the distance from the plane's corner to a fixed point on the content column, less a
gap, computed in CSS with `hypot()`. The arc therefore meets the content in the same place at any
aspect ratio. Sizing in viewport units alone does not hold the relationship: the text stops growing
at its `clamp` maximum, and the corner moves relative to centred content as the aspect ratio
changes.

| Screen | Corner | Reference point (from viewport centre) | Radius | Fill |
|---|---|---|---|---|
| Q1–Q3 | bottom-left | 72px left, 150px down (lower-left of the forward button) | `clamp(150px, hypot(…) − 210px, 560px)` × 1 / 1.03 / 1.06 | tone 1 / 2 / 3 |
| Result | bottom-right | 180px right, 80px down (just right of the € range) | `clamp(160px, hypot(…) − 30px, 660px)` | risk hue as a tint |

The caps stop the plane growing on large monitors where the text no longer grows; there, the
distance to the content opens up instead.

**Calibration.** The two human-approved reference screenshots were captured at about 1307×1260 (Q1)
and 611×922 (result). At those viewports the rule reproduces them: Q1 radius 544px against 542px in
the reference; result radius 371px against 401px, with the same arrangement — behind the CTA's end
and the links, the range clear by 64px against 60px.

**Measured on desktop viewports** (gap from the arc to the nearest glyph or button; negative means
the arc passes behind it):

| Viewport | Q1 nearest | Q3 nearest | Result: links / CTA / range / level |
|---|---|---|---|
| 1024×768 | 181 | 181 | −28 / −8 / +61 / +118 |
| 1280×720 | 162 | 137 | +4 / +15 / +37 / +67 |
| 1366×768 | 154 | 133 | −1 / +12 / +34 / +70 |
| 1440×900 | 176 | 150 | −23 / −4 / +30 / +82 |
| 1536×864 | 155 | 129 | −9 / +7 / +34 / +76 |
| 1920×1080 | 361 (cap) | 333 (cap) | about +200 (cap) |

Rules:
- One form, one corner per mode. No second shape, gradient, texture or image asset.
- No positional change between question screens; variation is limited to a small step of scale and
  tone.
- The form never animates between positions. Its only motion is an opacity fade when a mode first
  appears, which `prefers-reduced-motion` shortens.
- Presentation only: behind all content, never interactive, hidden from assistive tech.
- On the question screens only the footer can sit over the plane (`Back`, and the progress row on
  narrow screens). The muted text keeps at least 6.42:1 on the brightest tone.
- `<html>` reserves no scrollbar gutter. On Windows a reserved gutter keeps fixed content 15px off the
  right edge, which cut the result plane short of the screen edge it is anchored to.
- Browsers without CSS `hypot()` (older than about 2023) render no plane; the content is unaffected.

### Consequences accepted with the plane
- The expanded selector list carries **no background**. An opaque box cut its own rectangle out of
  the form behind it. Nothing needed masking: the trigger is hidden while the list is open.
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
**Human approved:** Sora only; dark Q1–Q3; light result; dark → light as the semantic assessment → answer transition; almost monochromatic assessment with semantic color first on the result; centered editorial layout; the typographic selector; three-segment progress; the result showing only the user's own level; motion sequence and reduced-motion behavior; the avoid-list above; Revolut as inspiration rather than a UI to copy; the curved plane as a restrained compositional accent — bottom-left on all three question screens, varying only by a small step of scale and tone, bottom-right on the result in the risk hue, entering the composition more — sized by distance to the content so the balance holds across aspect ratios, with content exactly centred.

*(Superseded by the simplification pass: the left-aligned two-column layout, the answer-row treatment and the three-segment risk indicator.)*

**First-build interpretation (Claude, pending human review):** exact palette values, risk hues, radius, spacing scale, type scale, motion timings, responsive proportions, and the plane's exact radii, tone steps and tint percentage.

**Note:** Design decisions must be grounded in research and product goals, not arbitrary preference.
