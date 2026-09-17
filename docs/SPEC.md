# RiskPoint Implementation Specification

This file is the canonical location for question copy, answer values, model weights, loss ranges and result behavior. Other docs reference it rather than repeating these values.

## User Flow
Primary flow: **Q1 → Q2 → Q3 → Result**. No intro screen, welcome modal or "Start assessment" step. *(Human decision)*

1. **Question 1 — Industry**
   - Framing shown above the question: product name **RiskPoint**, "See your business's cyber risk in 3 questions.", "No sign-up to see your result."
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
   - **See my risk** calculates the result (instantly) and starts the result transition.
4. **Result** — see [Result](#result). Visible without email capture or registration. *(Human decision)*

## Assessment Inputs
*(Human decision — first build)*

### Q1 — Industry
Question: "What's your industry?"
- Technology
- Financial services
- Healthcare
- Retail & e-commerce
- Manufacturing
- Professional services
- Other

Each question is presented as one centered question plus one typographic selector that reveals its options in place. Helper lines below the questions were removed in the simplification pass; the question copy itself is unchanged.

### Q2 — Annual revenue
Question: "What's your annual revenue?"
- Under €5M
- €5M–€25M
- €25M–€50M
- €50M–€300M
- €300M+

### Q3 — MFA coverage
Question: "How widely is multi-factor authentication (MFA) used across your company?"
- Yes, across the company
- Only for some accounts
- No
- I'm not sure

## States
Required states, for each of the three questions:
- Selector closed, nothing chosen (options are not visible before interaction)
- Selector expanded (options revealed in place; the forward action is hidden while open)
- Selector closed, showing the chosen answer

Plus:
- Result transition (presentation only; no "calculating" state, the result is already computed)
- Result LOW
- Result MID
- Result HIGH
- Result / lead panel open
- Result / lead panel confirmation (prototype, nothing submitted)
- Edit: returns to the assessment with answers preserved

Navigation must preserve previously selected answers.

## Progress
- Show a three-segment horizontal progress indicator at the bottom of the assessment.
- Current step is visually highlighted.
- Include a textual equivalent (e.g. "1 of 3").
- Exact colors/styling are defined in `DESIGN.md`, not here.

## Scoring Logic
### Architecture
Runtime scoring must be **deterministic**. Do not call an LLM to calculate risk.

```text
risk score = industry baseline + MFA modifier + revenue modifier
risk level = threshold(risk score) → LOW / MID / HIGH
```

Model configuration lives in one typed configuration file, separate from UI code, with `MODEL_VERSION = "0.2"`.

### User-facing precision
- Do not display the numeric score, `x/100`, a percentage probability, a percentile or another pseudo-precise score.
- The user-facing classification is exactly **LOW / MID / HIGH**.
- Show only the user's own level. Do not show the other levels, a full scale or a three-segment indicator. A minimal accent rule in the level's colour replaces the earlier indicator.

### Scoring model v0.2 — HUMAN-APPROVED PROTOTYPE HEURISTIC
Not underwriting, not a probability model, not derived from actuarial loss statistics.

Industry baseline:
| Industry | Baseline |
|---|---|
| Technology | 2 |
| Financial services | 3 |
| Healthcare | 3 |
| Retail & e-commerce | 2 |
| Manufacturing | 3 |
| Professional services | 2 |
| Other | 2 |

MFA modifier:
| MFA | Modifier |
|---|---|
| Yes, across the company | 0 |
| Only for some accounts | +1 |
| I'm not sure | +2 |
| No | +3 |

Revenue risk modifier:
| Revenue | Modifier |
|---|---|
| Under €5M | 0 |
| €5M–€25M | 0 |
| €25M–€50M | 0 |
| €50M–€300M | +1 |
| €300M+ | +1 |

Thresholds: **2–3 → LOW**, **4–5 → MID**, **6–7 → HIGH**.

Resulting distribution across all 140 combinations (verified by tests): LOW 41, MID 70, HIGH 29. Weights must not be changed merely to rebalance this distribution.

*(Superseded: v0.1 candidate weights with 1–9 score range.)*

## Loss Estimation Logic
Risk level and financial impact are separate concepts and are presented separately.

### Financial impact v0.1 — HUMAN-APPROVED PROTOTYPE ILLUSTRATIVE RANGES
The range is determined by **revenue band only**. MFA and industry do not modify the range in v0.1.

| Revenue | Illustrative range |
|---|---|
| Under €5M | €20k–€120k |
| €5M–€25M | €50k–€200k |
| €25M–€50M | €80k–€300k |
| €50M–€300M | €150k–€600k |
| €300M+ | €300k–€1.5M |

User-facing scope: "Illustrative cost of a significant cyber incident for businesses like yours."
Disclaimer: "Illustrative estimate, not an insurance quote."

These ranges are not underwriting outputs or actuarial estimates. Whether industry or controls should adjust severity in a later version remains an open hypothesis (see `UX_RESEARCH.md`).

## Result
Hierarchy *(human decision, simplified)*. The result is one centered column:
1. "Your cyber risk"
2. The user's own level — LOW, MID or HIGH — as the visual hero
3. A minimal accent rule in the level's colour
4. "Potential financial impact"
5. Illustrative € range
6. "Illustrative estimate."
7. One primary CTA: "See protection options"
8. Two subtle links: "How is this calculated?" and "Edit answers"

The € range must not be visually larger than the risk level.

Not shown in the main result view: the answer recap, the explanation sentence, the MFA counterfactual, the methodology text and long disclaimers. The explanation logic and the counterfactual remain part of the model; the counterfactual and a short method summary appear inside the "How is this calculated?" disclosure.

### Explanation Logic
- Deterministic copy; no runtime LLM.
- Generated from the drivers that actually raise the score above the model minimum: MFA modifier, elevated industry baseline, revenue modifier. Strongest driver first; ties resolved MFA → industry → revenue.
- Must not claim "historical loss profile" or otherwise imply the weights are derived from actuarial industry-loss statistics.
- Exact sentence templates are first-build copy (Claude's implementation, pending human review) and live in the model code.

### Agency — MFA counterfactual
Computed with the **same** scoring function: current answers vs. the same answers with MFA = "Yes, across the company".
- Level changes: "Full MFA coverage would move this assessment from {CURRENT} to {COUNTERFACTUAL}." using the actual calculated levels.
- Score improves within the same level: "Full MFA coverage would still reduce your assessed exposure."
- Full MFA already selected: "Full MFA coverage is already helping keep your assessed risk lower."
- Never claim a level change the model did not calculate.

### Editing answers
A subtle **Edit answers** link returns to the assessment with answers preserved. No router required. The earlier inline answer recap was removed in the simplification pass.

### CTA — first build
- "See protection options" opens a simple inline lead panel. It does not gate the result.
- Fields: Work email, Company name. Industry, revenue and MFA are not re-asked.
- No backend, network submission or CRM. The confirmation state states clearly that this is a prototype and nothing was submitted.
- Production CTA proposition and post-CTA flow remain **TBD** (see `PRODUCT.md`).

## Interactions
- One question is visible at a time.
- Selecting an option does not auto-advance.
- User may change the selected option before continuing.
- Primary forward action is unavailable until an option is selected.
- `Continue` advances Questions 1 and 2.
- `See my risk` submits Question 3 and calculates the result.
- `Back` is available on Questions 2 and 3.
- Back navigation preserves answers.
- The result transition is presentation only and must not introduce an artificial delay.

## Validation and Test Strategy
The input model produces 7 × 5 × 4 = **140 valid answer combinations**. Model tests run independently of the UI and verify:
- Every combination returns a valid LOW / MID / HIGH result.
- Every score falls inside the defined thresholds.
- The UI-facing result does not require a numeric score.
- Financial ranges are valid (min < max) and increase monotonically by revenue band.
- The MFA counterfactual matches the same scoring function.
- "I'm not sure" never produces LOW under v0.2.
- `Other` is not implicitly treated as low risk.
- A small human-readable golden set of representative LOW / MID / HIGH combinations.

## Responsive Behavior
Targets: approximately **375px**, **768px** and **1440px** widths. Q1 with seven options must remain usable on a small-height phone; the action area may be sticky.

Minimum requirement: the complete assessment and result must remain usable on common desktop and mobile viewport widths without horizontal scrolling or inaccessible controls.

## Accessibility
Target sensible **WCAG 2.2 AA** behavior for the prototype:
- the selector implements the listbox pattern: it opens with Enter, Space or the arrow keys, moves with arrows, Home and End, selects with Enter or Space, closes with Escape, supports character typeahead, and returns focus to the selector when it closes;
- keyboard operability;
- visible focus state;
- sufficient contrast;
- selection and risk level not communicated by color alone;
- `prefers-reduced-motion` support.

## Acceptance Criteria
- Exactly one assessment question is presented per step.
- The flow contains three assessment steps: Industry → Annual revenue → MFA coverage.
- A user cannot advance without selecting an answer.
- Selecting an answer alone does not advance the flow.
- Back navigation on Questions 2 and 3 preserves prior answers.
- Progress communicates three steps and the current position.
- Question 3 uses **See my risk** as the completion action.
- Every valid combination produces a deterministic result.
- User-facing result is LOW, MID or HIGH.
- No visible numeric score, percentage, percentile or x/100 is presented.
- Potential financial impact is shown as an illustrative range, not an exact predicted loss.
- Runtime risk calculation does not depend on an LLM.
- No calculating state or artificial delay before the result.
- The result is visible without email capture.
- The MFA agency message reflects the actually calculated counterfactual.
- Edit returns to the assessment with answers preserved.

---

**Status:** Assessment flow, scoring v0.2, financial-impact v0.1 ranges, result hierarchy, agency logic and first-build CTA behavior are human-approved for the first build. Production CTA/post-CTA flow and any model validation remain TBD.

**Note**: Reference `PRODUCT.md` for product context, `UX_RESEARCH.md` for evidence/decision rationale, and `DESIGN.md` for visual implementation details.
