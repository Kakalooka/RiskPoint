# RiskPoint Implementation Specification

## User Flow
Primary assessment flow:

1. **Question 1 — Industry**
   - User selects one option.
   - Selection can be changed before confirmation.
   - **Continue** advances to Question 2.
2. **Question 2 — Annual revenue**
   - **Back** returns to Question 1 with the previous answer preserved.
   - User selects or changes an option.
   - **Continue** advances to Question 3.
3. **Question 3 — MFA coverage**
   - **Back** returns to Question 2 with answers preserved.
   - User selects or changes an option.
   - **See my risk** triggers deterministic calculation and result transition.
4. **Result**
   - Show user-facing risk classification: **LOW / MID / HIGH**.
   - Show position on a visual risk scale without a visible numeric risk score.
   - Show an illustrative potential financial-loss range.
   - Show a short deterministic explanation of the primary risk driver.
   - Show a protection-oriented CTA.

**TBD:** Final result hierarchy, CTA copy/behavior and post-CTA flow.

## Assessment Inputs

### Industry
Current candidate values:
- Technology
- Financial services
- Healthcare
- Retail & e-commerce
- Manufacturing
- Professional services
- Other

### Annual revenue
Current candidate values:
- Under €5M
- €5M–€25M
- €25M–€50M
- €50M–€300M
- €300M+

### MFA coverage
Current candidate values:
- Yes, across the company
- Only for some accounts
- No
- I'm not sure

Candidate values remain reviewable until scoring/loss calibration is finalized.

## States
Required states:
- Question 1 / no selection
- Question 1 / selected
- Question 2 / no selection
- Question 2 / selected
- Question 3 / no selection
- Question 3 / selected
- Short calculating/result-transition state
- Result LOW
- Result MID
- Result HIGH

Navigation must preserve previously selected answers.

## Progress
- Show a three-segment horizontal progress indicator at the bottom of the assessment.
- Current step is visually highlighted.
- Exact colors/styling are defined in `DESIGN.md`, not here.

## Scoring Logic
### Architecture
Runtime scoring must be **deterministic**. Do not call an LLM to calculate risk.

Conceptually:

```text
risk score = industry baseline + MFA modifier + small revenue/scale modifier
risk level = threshold(risk score) → LOW / MID / HIGH
```

The internal score may also determine the marker position on the visual LOW–MID–HIGH scale.

### User-facing precision
- Do not display `x/100`, a percentage probability, or another pseudo-precise numeric risk score.
- The required user-facing classification is **LOW / MID / HIGH**.

### Prototype scoring hypothesis v0.1 — NOT YET FINAL
Candidate industry baselines:
- Retail & e-commerce = 1
- Financial services = 2
- Professional services = 2
- Technology = 2
- Manufacturing = 3
- Healthcare = 3
- Other = 2

Candidate MFA modifiers:
- Yes, across the company = 0
- Only for some accounts = +2
- I'm not sure = +2
- No = +4

Candidate revenue risk modifiers:
- Under €5M = 0
- €5M–€25M = 0
- €25M–€50M = +1
- €50M–€300M = +1
- €300M+ = +2

Candidate thresholds:
- 1–3 → LOW
- 4–6 → MID
- 7–9 → HIGH

These weights and thresholds are **prototype assumptions**, not insurer-approved underwriting logic. They require review before implementation is considered final.

## Loss Estimation Logic
Risk level and financial loss must be calculated as separate concepts.

Conceptual model:

```text
loss range = revenue-band baseline exposure
             adjusted by industry impact
             adjusted, if justified, by a limited control/risk factor
```

Principles:
- Revenue should be a stronger driver of financial exposure than of risk classification.
- Industry can influence loss severity.
- MFA may apply only a limited adjustment to loss severity; it should not dominate the loss model.
- Output must be a **range**, not a highly specific single number.
- Output must be described as **illustrative** and **not an insurance quote**.

**TBD:** Exact baseline ranges and modifiers. These should be calibrated as prototype assumptions informed by claims research and then reviewed for anomalous outputs.

## Explanation Logic
The result may include a short deterministic explanation selected from known drivers, for example:

> Your cyber risk is elevated primarily by limited MFA coverage and your industry's historical loss profile.

No runtime LLM is required. Exact copy and driver-selection rules are **TBD**.

## Interactions
- One question is visible at a time.
- Selecting an option does not auto-advance.
- User may change the selected option before continuing.
- Primary forward action is unavailable until an option is selected.
- `Continue` advances Questions 1 and 2.
- `See my risk` submits Question 3 and calculates the result.
- `Back` is available on Questions 2 and 3.
- Back navigation preserves answers.
- Calculation/result reveal may use a short microinteraction but must not introduce an artificial multi-second delay.

## Validation and Test Strategy
The current candidate input model produces 7 × 5 × 4 = **140 valid answer combinations**.

Before final implementation sign-off:
- Exhaustively evaluate all valid combinations programmatically.
- Count LOW / MID / HIGH outcomes.
- Inspect boundary transitions and unexpected jumps.
- Confirm that `Other` is not implicitly treated as low risk.
- Confirm that `I'm not sure` is distinct from confirmed Yes and confirmed No.
- Confirm that larger revenue does not automatically masquerade as proof of higher incident probability.
- Confirm that loss ranges are monotonic where expected and do not produce obviously contradictory outputs.
- Maintain a small human-reviewed golden set of representative combinations and expected classifications.

## Responsive Behavior
**TBD:** Exact breakpoints/layout behavior after visual direction is approved.

Minimum requirement: the complete assessment and result must remain usable on common desktop and mobile viewport widths without horizontal scrolling or inaccessible controls.

## Accessibility
Final implementation should use semantic interactive elements, keyboard-operable controls, visible focus states and sufficient contrast. Risk meaning must not depend on color alone.

**TBD:** Final WCAG target and detailed accessibility acceptance criteria.

## Acceptance Criteria
Current approved criteria:
- Exactly one assessment question is presented per step.
- The flow contains three assessment steps: Industry → Annual revenue → MFA coverage.
- A user cannot advance without selecting an answer.
- Selecting an answer alone does not advance the flow.
- Back navigation on Questions 2 and 3 preserves prior answers.
- Progress communicates three steps and the current position.
- Question 3 uses **See my risk** as the completion action.
- Every valid combination produces a deterministic result.
- User-facing result is LOW, MID or HIGH.
- No visible numeric risk percentage or x/100 score is presented.
- Potential financial impact is shown as an illustrative range, not an exact predicted loss.
- Runtime risk calculation does not depend on an LLM.
- Calculation feedback does not intentionally fake a long processing delay.

Additional acceptance criteria will be added after result-screen, CTA, visual and responsive decisions are approved.

---

**Status:** Assessment interaction specification is approved. Scoring weights, loss ranges, result presentation, CTA and final visual implementation remain partially TBD.

**Note**: Reference `PRODUCT.md` for product context, `UX_RESEARCH.md` for evidence/decision rationale, and `DESIGN.md` for visual implementation details.
