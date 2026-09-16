# RiskPoint Product Definition

## Project
**RiskPoint** — an interactive B2B cyber-risk calculator prototype for a business insurance lead-generation experience.

The prototype asks a business user three simple questions, returns a **LOW / MID / HIGH** cyber-risk result, presents an illustrative potential financial-loss range, and leads toward a protection-oriented conversion action.

## Business Goal
Demonstrate a credible, low-friction interactive experience that turns cyber risk from an abstract concern into a personally relevant business outcome and creates a natural path toward an insurance lead/conversion action.

This is a recruitment prototype, not a production underwriting or actuarial system.

## Target User
A business decision-maker evaluating cyber exposure for their company. The current product hypothesis assumes a broad SME / mid-market B2B insurance audience across multiple industries rather than a single-industry insurer.

## Conversion Goal
Move a user from completing the assessment and understanding their result toward a protection-related CTA.

**TBD:** Final CTA proposition, copy, commitment level, and post-CTA flow.

## Scope
The prototype should demonstrate the complete assessment-to-result journey in a browser with deterministic runtime logic and polished interaction quality.

### In Scope
- Three-question guided cyber-risk assessment
- Inputs: **Industry → Annual revenue → MFA coverage**
- One question per screen
- Deterministic risk calculation
- User-facing **LOW / MID / HIGH** result
- Visual position on a risk scale without exposing a pseudo-precise numeric score
- Illustrative potential financial-loss range
- Short deterministic explanation of the main risk driver
- Protection-oriented CTA
- Microinteraction around calculation/result reveal
- Back navigation with preserved answers
- Responsive browser experience

### Out of Scope
- Production underwriting
- Actuarial pricing or an insurance quote
- Runtime LLM risk assessment
- Backend/API requirements unless later justified by the prototype
- Authentication, accounts, dashboards, or unrelated platform features
- Claims that the prototype's scoring weights constitute an insurer-approved model

## Success Criteria
For the prototype/recruitment exercise:
- A user can complete the three-question flow without ambiguity or dead ends.
- Every valid answer combination produces a deterministic result.
- The result clearly distinguishes risk level from potential financial impact.
- The experience avoids false precision and clearly frames financial-loss output as illustrative rather than an insurance quote.
- The final browser prototype is visually polished enough to demonstrate creative-technology / prototype-building craft.
- The implementation remains small, explainable, and reviewable.

For a real lead-generation deployment, success metrics would need to include assessment completion, step drop-off, CTA conversion and downstream lead quality/conversion. Exact KPI targets are **TBD**.

---

**Status:** Product direction partially approved. CTA/post-CTA behavior and final loss model remain TBD.

**Note**: This is a living document. Distinguish approved product decisions from prototype hypotheses and production assumptions.
