# RiskPoint

A prototype of a three-question B2B cyber-risk calculator for a business-insurance lead-generation page: **Industry → Annual revenue → MFA coverage → LOW / MID / HIGH result**, an illustrative financial-impact range, and a protection-oriented CTA.

This is a recruitment prototype. The scoring model is a deterministic prototype heuristic, not underwriting.

## Run

Requires Node.js 20+.

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # model tests (all 140 answer combinations + golden set)
npm run build     # typecheck + production build → dist/
npm run build:all # production build + standalone file → dist/ and dist/RiskPoint.html
```

## Final output

| Output | Path | How to open |
|---|---|---|
| Production build | `dist/` (`index.html` + `assets/`) | serve the folder, e.g. `npm run preview` |
| Standalone prototype | **`dist/RiskPoint.html`** | double-click it, or open the file directly in a browser — no server needed |

`dist/RiskPoint.html` is the same application in a single file: JavaScript, CSS and both Sora
font files are inlined, it makes no network requests, and it stays fully interactive
(all three questions, keyboard-operable selectors, scoring, result, dark → light transition,
reduced motion, the protection form and mobile layout).

Build it with `npm run build:all`, or with `npm run build:standalone` after a normal build.
`vite.standalone.config.ts` builds it via `vite-plugin-singlefile` into a temporary folder and
copies the result to `dist/RiskPoint.html`, leaving the normal `dist/index.html` untouched.

Stack: Vite, React, TypeScript, plain CSS, Vitest. No backend, no runtime LLM, no analytics.

## Code layout

- `src/model/` — deterministic model, independent of the UI (`config.ts` is the single typed configuration)
- `src/components/` — assessment, result and prototype lead panel
- `src/content.ts` — question copy and display formatting
- `src/styles/` — design tokens and styles

## Project Documentation

This project uses canonical documentation files to organize knowledge:

- **[`CLAUDE.md`](CLAUDE.md)** — Context router and execution principles for Claude Code
- **[`docs/PRODUCT.md`](docs/PRODUCT.md)** — Product goals, scope, success criteria and deviations from the brief
- **[`docs/UX_RESEARCH.md`](docs/UX_RESEARCH.md)** — Research findings and design hypotheses
- **[`docs/DESIGN.md`](docs/DESIGN.md)** — Visual direction and design system
- **[`docs/SPEC.md`](docs/SPEC.md)** — Implementation specification, model values and acceptance criteria
- **[`source/`](source/)** — Original recruitment brief and delivery context

Start with [`docs/PRODUCT.md`](docs/PRODUCT.md) to understand the project, or refer to [`CLAUDE.md`](CLAUDE.md) for task-based routing.

## Status

**Current phase**: First complete working build (v0.1) for human review. Scoring model v0.2, financial-impact ranges v0.1.

---

*Last updated: 2026-09-17*
