# RiskPoint — Cyber Risk in 3 Questions

**An interactive B2B cyber-risk assessment prototype for a business-insurance lead-generation experience.**

**[Try the browser demo](https://kakalooka.github.io/RiskPoint/)** · [View application source](https://github.com/Kakalooka/RiskPoint/tree/claude/final-build-v01) · [View the approved standalone build](https://github.com/Kakalooka/RiskPoint/blob/claude/final-build-v01/final/RiskPoint-final.html)

## The product idea

Cyber risk can be abstract for business decision-makers. RiskPoint explores a more approachable entry point: **three simple questions** that lead to an understandable risk category, an illustrative financial-impact range, and a natural next step toward protection.

The goal is to demonstrate an assessment-to-result journey with low friction, clear explanations and no registration required to see the result.

**Flow:** Industry → Annual revenue → MFA coverage → Result

## What the prototype does

- Guides the user through one question at a time, with progress feedback, Back navigation and preserved answers.
- Calculates a deterministic **LOW / MID / HIGH** cyber-risk classification using industry, revenue band and multi-factor authentication (MFA) coverage.
- Shows a **separate illustrative financial-impact range** based on the selected annual-revenue band.
- Offers a **“How is this calculated?”** disclosure with the assessment rationale and an MFA counterfactual.
- Lets users **edit their answers** and explore a different outcome.
- Presents a **“See protection options”** CTA that opens a prototype lead panel. There is **no backend or live lead submission**.

## Product and UX decisions

| Decision | Why it matters |
| --- | --- |
| Three questions, no introductory step | Reduces friction before the user sees value |
| Risk level and financial impact shown separately | Avoids conflating likelihood or relative exposure with monetary severity |
| Deterministic scoring instead of runtime AI | Keeps identical inputs reproducible and reviewable |
| No invented calculation delay | The result is computed immediately; the transition is visual, not simulated processing |
| Dark assessment → light result | Creates a deliberate visual shift at the moment of feedback |
| Optional methodology, editable answers and MFA comparison | Supports transparency and user agency without overcrowding the result |

The experience is responsive, includes keyboard-operable selectors and respects reduced-motion preferences.

## Model boundaries

The assessment uses a **human-approved prototype heuristic (scoring v0.2)**, not an actuarial model, a measured incident probability or insurance underwriting. Financial-impact ranges are **illustrative (v0.1)**, not quotes or forecasts. The interface does not present a pseudo-precise numerical risk score.

No runtime LLM, production customer data, analytics integration or authentication is used.

## Implementation and verification

**Stack:** React 19 · TypeScript · Vite 8 · CSS · Sora · Vitest 5

The scoring logic is isolated from the UI in `src/model/`. Automated model tests cover **all 140 valid combinations** of assessment answers, alongside golden test cases. The application can be built as a conventional web app or a self-contained HTML file.

### Where the code lives

This repository deliberately has separate branches:

- **[`main`](https://github.com/Kakalooka/RiskPoint/tree/main)** — project overview and earlier planning documentation.
- **[`claude/final-build-v01`](https://github.com/Kakalooka/RiskPoint/tree/claude/final-build-v01)** — approved application source, automated tests, final specifications and standalone build.
- **[`gh-pages`](https://github.com/Kakalooka/RiskPoint/tree/gh-pages)** — browser-demo deployment artifact.

The runnable source is **not on `main`**. To run the application locally, check out the final-build branch:

```bash
git clone https://github.com/Kakalooka/RiskPoint.git
cd RiskPoint
git checkout claude/final-build-v01
npm install
npm run dev
```

Other useful commands on that branch: `npm test` (model tests), `npm run build` (typecheck and web build), and `npm run build:all` (web build plus standalone HTML).

## Product documentation

For the final build, start with the branch-specific [product definition](https://github.com/Kakalooka/RiskPoint/blob/claude/final-build-v01/docs/PRODUCT.md), [UX research and decisions](https://github.com/Kakalooka/RiskPoint/blob/claude/final-build-v01/docs/UX_RESEARCH.md), [design direction](https://github.com/Kakalooka/RiskPoint/blob/claude/final-build-v01/docs/DESIGN.md), [implementation specification](https://github.com/Kakalooka/RiskPoint/blob/claude/final-build-v01/docs/SPEC.md) and [approved final-build note](https://github.com/Kakalooka/RiskPoint/blob/claude/final-build-v01/docs/FINAL.md).

---

*RiskPoint is a recruitment / product-design prototype demonstrating product reasoning, specification-led AI-assisted implementation and human-reviewed iteration. It is not a production cyber-insurance service.*
