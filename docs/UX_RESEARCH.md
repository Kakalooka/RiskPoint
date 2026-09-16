# RiskPoint UX Research

## Research Questions
Current discovery focuses on:
- Should the assessment show all questions at once or use a staged flow?
- Should selecting an answer automatically advance the user?
- How should progress be communicated in a three-step assessment?
- Which three inputs create a useful balance between simplicity, business relevance and defensible cyber-risk reasoning?
- How should LOW / MID / HIGH risk be presented without false precision?
- How should potential financial loss be framed without pretending the prototype is an actuarial model?
- What should the result hierarchy, CTA proposition and post-CTA flow be?
- What visual language can feel premium and credible without falling into generic "hacker / neon cyber" clichés?

## Evidence and Findings

### Staged assessment
**SOURCE:** Established form/question-pattern guidance, including GOV.UK's one-question-per-page pattern.

**FINDING:** Breaking a short assessment into focused steps can reduce cognitive load and make the current task clear. This does not establish a universal conversion uplift.

**HYPOTHESIS:** A three-question lead-generation calculator benefits from one focused question per screen.

**HUMAN DECISION:** Use one question per screen.

### Selection versus commitment
**FINDING:** An answer selection can be accidental or may need correction. Auto-advance removes the distinction between choosing an option and confirming it.

**HYPOTHESIS:** Explicit confirmation will make the interaction feel more controlled without adding meaningful friction to a three-step flow.

**HUMAN DECISION:** Selecting an answer does **not** auto-advance. The user selects or changes an option and then presses **Continue**. The final step uses **See my risk**.

### Progress
**FINDING:** Progress feedback helps users understand where they are in a multi-step flow, but research does not justify claiming a guaranteed conversion increase.

**HUMAN DECISION:** Show three horizontal progress segments at the bottom of the assessment. The current step is visually highlighted. Final color treatment belongs in DESIGN.md.

### Input choice: business type, scale and security posture
**SOURCE:** Cyber-insurance underwriting/risk-assessment materials reviewed during discovery, including insurer guidance indicating that business activity, company scale/exposure and security controls are relevant to cyber-risk evaluation. Claims-study research was also used to examine loss severity by company size and sector.

**FINDING:** The brief's example questions are not necessarily the strongest possible three-input model. Remote-work status is a weaker security signal than a concrete control such as MFA. Employee count is an understandable scale proxy, but annual revenue maps more directly to business scale and potential financial exposure.

**HYPOTHESIS:** **Industry + Annual revenue + MFA coverage** creates a stronger three-question prototype than **Industry + Employees + Remote work** while preserving the brief's simplicity.

**HUMAN DECISION:** Use:
1. Industry
2. Annual revenue
3. MFA coverage

### MFA
**FINDING:** MFA is a concrete security control and provides a clearer security-posture signal than merely asking whether employees work remotely.

**HUMAN DECISION:** MFA replaces remote work as the third input.

Proposed selectable answers:
- Yes, across the company
- Only for some accounts
- No
- I'm not sure

**HYPOTHESIS:** "I'm not sure" should not be treated as equivalent to either a confirmed Yes or a confirmed No. It can receive an intermediate prototype risk modifier.

### Annual revenue
**FINDING:** Claims data show that financial impact varies substantially with company scale. Scale is more directly useful for potential-loss framing than for asserting cyber-incident probability.

**HUMAN DECISION:** Annual revenue replaces employee count.

Current candidate bands:
- Under €5M
- €5M–€25M
- €25M–€50M
- €50M–€300M
- €300M+

**HYPOTHESIS / CAUTION:** These bands are prototype UX segmentation. They must not be presented as an exact translation of source datasets or an insurer's underwriting bands.

### Industry
**HYPOTHESIS:** The prototype represents a broad-market B2B insurer rather than a sector-specific insurer. This makes industry a meaningful first question.

Current candidate options:
- Technology
- Financial services
- Healthcare
- Retail & e-commerce
- Manufacturing
- Professional services
- Other

**HUMAN DECISION:** `Other` must not automatically mean low risk; missing specificity is not evidence of low exposure.

### Risk result
**SOURCE:** Recruitment brief explicitly requires a dynamic LOW / MID / HIGH result.

**HUMAN DECISION:** Preserve **LOW / MID / HIGH** exactly as the user-facing classification.

**HUMAN DECISION:** Do not expose a numeric percentage or `x/100` risk score. A hidden deterministic score may drive logic and the position of a marker on a visual scale, but the UI should not imply actuarial precision that the prototype cannot support.

### Risk versus financial loss
**FINDING:** Likelihood/risk profile and financial severity/exposure are related but not the same concept. Claims data also show wide variance and skew in incident costs.

**HUMAN DECISION:** Model and communicate these separately:
- **Risk level**: LOW / MID / HIGH
- **Potential financial impact**: illustrative range

**HYPOTHESIS:** Revenue should influence potential loss more strongly than risk level. Industry can influence both. MFA should influence risk more strongly and may have a limited effect on potential-loss severity.

### Claims research and false precision
**SOURCE:** NetDiligence cyber-claims research reviewed during discovery, including the 2026 study covering real cyber-insurance claims. The research shows substantial variation in incident costs by company size/sector and a highly skewed distribution.

**FINDING:** A single highly specific predicted loss number would imply unsupported precision.

**HUMAN DECISION:** Show an **illustrative range**, not an exact expected-loss figure. Include language making clear that the output is not an insurance quote.

**IMPORTANT:** Exact loss-range values and modifiers remain prototype assumptions until finalized. Production use would require validation by cyber/underwriting/actuarial experts.

### Calculation feedback
**FINDING:** A fake multi-second "AI is calculating" delay would create artificial latency and falsely imply complexity.

**HUMAN DECISION:** Use a short result/calculation microinteraction if it improves perceived polish, but do not intentionally delay the result.

## Current UX Hypotheses Still To Validate
- Exact industry options and their internal risk baselines
- Exact revenue bands
- Risk-score weights and LOW/MID/HIGH thresholds
- Loss-range baselines and modifiers
- Result-screen information hierarchy
- Explanation copy and primary-driver selection
- CTA proposition and commitment level
- Post-CTA flow
- Visual direction and motion language

## Rejected Ideas
- **All questions on one screen** — staged flow better supports focus for this prototype.
- **Auto-advance immediately after selecting an answer** — rejected in favor of explicit confirmation/correction.
- **Remote work as the security input** — replaced by MFA as a more concrete security-control signal.
- **Employee count as the scale input** — replaced by annual revenue because scale is especially relevant to financial exposure.
- **Visible numeric risk percentage / x out of 100** — rejected because it would create false precision.
- **One exact predicted financial-loss number** — rejected in favor of an illustrative range.
- **Runtime LLM risk calculation** — rejected; scoring should be deterministic, testable and explainable.
- **Artificial multi-second calculation delay** — rejected; motion should provide feedback, not fake computational effort.

## Research Discipline
Use the following structure when adding new research:

**SOURCE → FINDING → HYPOTHESIS → HUMAN DECISION**

Do not convert a research finding directly into a product fact when a human decision or prototype assumption is still required. Keep evidence, interpretation and implementation choices distinguishable.

---

**Status:** Assessment UX and high-level result principles are approved. Scoring/loss weights, result hierarchy, CTA and visual direction remain open.
