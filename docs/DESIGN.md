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
The interface is ultra-minimal but no longer floats in undifferentiated space. One geometric form
gives the flow a composition: an oversized disc whose centre sits on a viewport corner, so exactly
a quarter of it is visible and its two straight edges are the edges of the screen.

**Every question screen holds the same corner — bottom-left — and the same content position.** The
only progression across Q1, Q2 and Q3 is a small step of scale, with a matching step of tone. No
question screen restates the composition, so the question and the selector stay dominant and the
flow reads as one idea gaining presence rather than a new composition per step.

**The result resolves the system.** The plane takes the last step of the same scale sequence, sits
in the bottom-right, and carries the risk hue. That is the only change of position in the flow, and
the hue is the event rather than the scale.

| Screen | Corner | Radius | Fill | Content offset |
|---|---|---|---|---|
| Q1 Industry | bottom-left | `max(44vmin, 22vh)` | tone 1 | right / up |
| Q2 Revenue | bottom-left | `max(49vmin, 25vh)` | tone 2 | right / up |
| Q3 MFA | bottom-left | `max(54vmin, 27vh)` | tone 3 | right / up |
| Result | bottom-right | `max(66vmin, 40vh)` | risk hue as a tint | left / up |

The question radii are sized by **clearance from the content**, not by a formula: the form reads as
atmosphere in the corner and never competes with the question. Measured at 1440×900, the gap from
the plane's edge to the nearest content element is 322px on Q1, 236px on Q2 and 197px on Q3 — a
gentle closing-in, with Q3 the closest approach and no intrusion at any step. At 375×812 the
closest element is 326px away on Q1 and 69px on Q3, again with no overlap.

The result's radius is larger by design and is the size the approved result screen was reviewed
with: a 9% tint on the light ground reads far softer than a dark tonal plane of the same size, so
the form stays a background accent while the level word carries the screen.

Rules:
- Exactly one form, one corner per mode. No second shape, no gradient, no texture, no image asset.
- No positional change between question screens. Variation is limited to scale and one tonal step
  — no per-screen crop, rotation or decoration.
- Tonal only on the dark screens, so presence builds without introducing colour before the result.
- The form never animates between positions; the change is read across screens, not performed. Its
  only motion is the shared opacity fade, which `prefers-reduced-motion` already shortens.
- Presentation only: behind all content, never interactive, hidden from assistive tech.
- Content leans away from the form by a small offset (`--offset`), identical across all three
  questions and zeroed below 600px. This is a slight offset from the optical centre, not a change
  to the centred layout.
- The reading area is never intruded on. Only the footer sits over the plane — `Back` on every
  question screen, and the progress row on narrow screens — and both are measured: the muted text
  keeps 6.07:1 on the largest, brightest tone.

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
**Human approved:** Sora only; dark Q1–Q3; light result; dark → light as the semantic assessment → answer transition; almost monochromatic assessment with semantic color first on the result; centered editorial layout; the typographic selector; three-segment progress; the result showing only the user's own level; motion sequence and reduced-motion behavior; the avoid-list above; Revolut as inspiration rather than a UI to copy; the curved plane as the composition system — bottom-left on all three question screens, clear of the content and varying only by a small step of scale and tone, resolving in the bottom-right on the result where it takes the risk hue — and content allowed a slight offset from the exact optical centre.

*(Superseded by the simplification pass: the left-aligned two-column layout, the answer-row treatment and the three-segment risk indicator.)*

**First-build interpretation (Claude, pending human review):** exact palette values, risk hues, radius, spacing scale, type scale, motion timings, responsive proportions, and the plane's exact radii, tone steps, tint percentage and offset magnitude.

**Note:** Design decisions must be grounded in research and product goals, not arbitrary preference.
