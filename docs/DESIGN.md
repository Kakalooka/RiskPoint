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
screen. It is a **restrained compositional accent**, never an object competing with the content,
and it stays out of the reading area on every screen. The screens read as a website hero, not a
poster.

- **Questions:** bottom-left on all three. Only the radius changes, in steps of about 5%, with a
  matching small step of tone. The progression reads in comparison, not at first glance. The plane
  stays mounted across the questions, so between steps it only changes size — it does not fade out
  and back in.
- **Result:** bottom-right, in the risk hue as a 9% tint.
- **Content is exactly centred** on every screen. There is no content offset, so nothing in the
  reading area moves between screens.

| Screen | Corner | Radius | Fill |
|---|---|---|---|
| Q1 Industry | bottom-left | `clamp(150px, 30vmin, 300px)` | tone 1 |
| Q2 Revenue | bottom-left | `clamp(158px, 31.5vmin, 315px)` | tone 2 |
| Q3 MFA | bottom-left | `clamp(165px, 33vmin, 330px)` | tone 3 |
| Result | bottom-right | `clamp(140px, hero × 1.4 + 8vmin, 420px)` | risk hue as a tint |

### Sizing rule
Text in this interface stops growing at its `clamp` maximum (the level word caps at 190px from about
1267px wide), so a plane sized purely in viewport units outgrows the text on large monitors. Measured
before this rule, the result plane ran from 2.5× to 5.0× the level word across desktop sizes, and at
1024×768 it slid behind the CTA.

- **Result:** the radius is sized in units of the level word (`--hero-size`, shared with
  `.risk-level`), plus a small `vmin` term so it does not shrink into the corner on large screens.
  Measured ratio of radius to level word: 1.81 (1024×768), 1.70 (1280×720), 1.72 (1366×768), 1.78
  (1440×900), 1.76 (1536×864), 1.85 (1920×1080), 2.01 (2560×1440). No intrusion at any size. Because
  the plane is anchored to the corner and the content is centred, the distance between them grows on
  larger screens: more air, never more competition.
- **Questions:** radii are capped so the plane cannot keep growing on large monitors while the
  question does not.

Rules:
- One form, one corner per mode. No second shape, gradient, texture or image asset.
- No positional change between question screens; variation is limited to a small step of scale and
  tone.
- The form never animates between positions. Its only motion is an opacity fade when a mode first
  appears, which `prefers-reduced-motion` shortens.
- Presentation only: behind all content, never interactive, hidden from assistive tech.
- Only the footer can sit over the plane (`Back`, and the progress row on narrow screens). The muted
  text keeps at least 6.42:1 on the brightest tone.
- `<html>` reserves no scrollbar gutter. On Windows a reserved gutter keeps fixed content 15px off the
  right edge, which cut the result plane short of the screen edge it is anchored to.

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
**Human approved:** Sora only; dark Q1–Q3; light result; dark → light as the semantic assessment → answer transition; almost monochromatic assessment with semantic color first on the result; centered editorial layout; the typographic selector; three-segment progress; the result showing only the user's own level; motion sequence and reduced-motion behavior; the avoid-list above; Revolut as inspiration rather than a UI to copy; the curved plane as a restrained compositional accent — bottom-left on all three question screens, varying only by a small step of scale and tone, bottom-right on the result in the risk hue and sized from the level word — with content exactly centred.

*(Superseded by the simplification pass: the left-aligned two-column layout, the answer-row treatment and the three-segment risk indicator.)*

**First-build interpretation (Claude, pending human review):** exact palette values, risk hues, radius, spacing scale, type scale, motion timings, responsive proportions, and the plane's exact radii, tone steps and tint percentage.

**Note:** Design decisions must be grounded in research and product goals, not arbitrary preference.
