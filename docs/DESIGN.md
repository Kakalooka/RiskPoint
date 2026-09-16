# RiskPoint Design System

## Visual Direction
RiskPoint should feel like a contemporary premium product interface rather than a stereotypical "cybersecurity" experience. The working reference is the clarity and restraint associated with modern fintech/product UI, including Revolut as a user-selected inspiration.

### Human-approved direction
- The three assessment screens use a **dark** visual environment.
- The result screen switches to a **light / white** visual environment.
- The dark → light transition is semantic: **assessment → answer / clarity**. It should not be treated as arbitrary decoration.
- Keep the interface visually restrained: one dominant task per screen, strong typography, generous spacing, and limited chrome.
- Avoid alternating dark/light on every question screen.

## Design References
- **Revolut app** — user-selected inspiration for clean, contemporary product UI, strong hierarchy, restraint, and focus on the primary action.
- This is a reference, not a skin to copy. RiskPoint should retain its own identity and insurance/cyber-risk context.

## Typography
Use a single type family and create hierarchy primarily through size, weight, spacing, and layout rather than mixing multiple font families.

### Typefaces
- **Heading**: Sora
- **Body**: Sora
- **Monospace**: TBD; do not introduce one unless the interface genuinely needs it.

### Typography direction
- Large, confident question headings.
- Highly legible answer labels and supporting copy.
- Result values such as `HIGH` and financial ranges may use significantly larger/heavier Sora styles.
- Exact sizes, weights, line heights, and responsive type scale remain TBD pending visual exploration.

## Color Logic
### Human-approved structural logic
- **Question 1:** dark
- **Question 2:** dark
- **Question 3:** dark
- **Result:** light / white

The result transition should create a clear change of mode after `See my risk`, while remaining comfortable and accessible rather than using a harsh flash.

### Color Palette
- **Assessment background:** TBD dark neutral
- **Assessment foreground:** TBD high-contrast light neutral
- **Result background:** white / near-white, exact value TBD
- **Result foreground:** TBD dark neutral
- **Accent:** TBD
- **Risk status colors:** TBD. LOW / MID / HIGH must not rely on color alone for meaning.

## Spacing
TBD after visual exploration. Direction: generous whitespace, low visual density, and enough separation that each screen feels focused on one decision.

## Motion
Motion should communicate progression and state change, not add artificial waiting time.

Current direction:
- subtle transitions between assessment questions;
- a purposeful dark → light transition after `See my risk` to mark assessment → result;
- result content may use progressive reveal and a moving risk-scale marker if this survives visual testing;
- no fake multi-second `Calculating…` delay;
- reduced-motion behavior must be considered before implementation is accepted.

Exact easing, duration, sequencing, and result reveal remain TBD.

## Tone of Voice
Professional, concise, calm, and clear. Avoid alarmist cyber language or fear-marketing claims that the model cannot support.

## Do / Don't
### Do
- Keep one dominant action per assessment screen.
- Use typography, spacing, contrast, and motion as the main design tools.
- Give visual changes a product/semantic purpose.
- Maintain clear contrast and visible state changes.

### Don't
- Do not use stereotypical hacker / Matrix / neon-cyber aesthetics by default.
- Do not alternate dark and light backgrounds merely to create stimulation.
- Do not add decorative complexity that competes with the three-question funnel.
- Do not introduce a second type family without a clear functional reason.
- Do not use motion as a fake calculation delay.

---

## Decision Status
**Human approved:** Sora as the single primary type family; dark Q1–Q3; light/white result; dark → light as the semantic assessment → answer transition; Revolut as a design inspiration rather than a UI to copy.

**Still open:** exact palette, accent color, answer-component treatment, border radius, spacing scale, type scale, detailed motion, result hierarchy details, CTA styling, responsive refinements.

**Note:** Design decisions must be grounded in research and product goals, not arbitrary preference.
