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

**Human decision (first build):** Primary CTA "See protection options" opens a minimal prototype lead panel. The result is never gated behind it. Details: `SPEC.md` → Result.

**TBD:** Production CTA proposition, commitment level, and post-CTA flow.

## Scope
The prototype should demonstrate the complete assessment-to-result journey in a browser with deterministic runtime logic and polished interaction quality.

### In Scope
- Three-question guided cyber-risk assessment
- Inputs: **Industry → Annual revenue → MFA coverage**
- One question per screen
- Deterministic risk calculation
- User-facing **LOW / MID / HIGH** result
- Coarse three-segment risk indicator without exposing a pseudo-precise numeric score
- Illustrative potential financial-loss range
- Short deterministic explanation of the main risk drivers
- MFA counterfactual showing what full MFA coverage would change
- Answer recap with Edit
- Protection-oriented CTA with a prototype lead panel (no backend)
- Result transition motion (no fake calculating state)
- Back navigation with preserved answers
- Result visible without email capture
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

## Deviations from the Original Brief
The original brief is in `source/Zadanie_180hb.txt`. These deliberate deviations are human-approved; rationale is recorded in `UX_RESEARCH.md`.

| Brief | Project decision | Rationale |
|---|---|---|
| Example questions: industry, number of employees, remote work | Industry, annual revenue, MFA coverage | Revenue maps more directly to financial exposure; MFA is a concrete security control. The brief's questions were given as examples ("np."). |
| "Estimated amount of potential losses" | Illustrative range, labelled as not an insurance quote | A single number would imply unsupported precision. |
| Button "Zabezpiecz się" ("Protect yourself") | "See protection options" | Lower-commitment, protection-oriented wording that avoids fear framing. |
| "Microanimations while calculating the result" | Result transition (dark → light, restrained reveal) with no calculating state | A fake calculation delay would misrepresent a deterministic lookup. |
| UI example stack "Tailwind, shadcn/ui" | Vite + React + TypeScript with plain CSS | The brief lists these as examples ("np."); plain CSS keeps the prototype small and avoids generic component-kit styling. |

---

**Status:** Product direction approved for the first build, including scoring v0.2, financial-impact v0.1 ranges and first-build CTA behavior. Production CTA/post-CTA flow and any validated loss model remain TBD.

**Note**: This is a living document. Distinguish approved product decisions from prototype hypotheses and production assumptions.
