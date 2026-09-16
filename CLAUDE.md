# CLAUDE.md: RiskPoint Prototype Workflow

## Purpose
This file routes Claude and other AI assistants to the correct project documents and establishes execution principles for RiskPoint development.

## Context Router

### Task-Based Routing
- **Understanding the product**: Read [`docs/PRODUCT.md`](docs/PRODUCT.md)
- **UX decisions, research, user insights**: Read [`docs/UX_RESEARCH.md`](docs/UX_RESEARCH.md)
- **Design, visual direction, components**: Read [`docs/DESIGN.md`](docs/DESIGN.md)
- **Implementation, specs, interactions**: Read [`docs/SPEC.md`](docs/SPEC.md)

Do not duplicate content across files. Reference the appropriate file instead.

## Execution Principles

### 1. Do Not Invent
- Do **not** invent business goals, scoring logic, or UX decisions
- Do **not** create design direction, color palettes, or typography without explicit guidance
- Mark unknowns as **TBD** in the appropriate docs file
- When a task requires missing information, surface it and wait for direction rather than assuming

### 2. Minimal Implementation
- Build only what is needed for the current task
- Do not add abstractions, refactor, or prepare for hypothetical future work
- No app code, dependencies, CI, tests, or build infrastructure until explicitly needed

### 3. Testing and Verification Required
- **Before claiming work complete:**
  - Run and visually verify the change in the actual app (not just tests)
  - Test the golden path and relevant edge cases
  - Monitor for regressions in related features
  - Report what changed, what was tested, and any remaining uncertainty

### 4. Reporting Standard
After each development task, report:
- **What changed**: concise summary of modifications
- **What was tested**: specific scenarios verified in the running app
- **Uncertainty**: any unknowns, assumptions, or areas needing human review
- **For review**: what a human or peer reviewer should focus on

### 5. Context Discipline
- Start with the task-specific routing above; read the minimal necessary context
- Trust the files as authoritative; do not reference this file as a substitute for PRODUCT.md, DESIGN.md, etc.
- If a file is marked TBD, escalate rather than assume

## When This File Should Not Be Consulted
Do not use CLAUDE.md as a knowledge base for product details, design decisions, or specifications. That information lives in the docs directory and this file merely points to it.

---

Generated for RiskPoint prototype bootstrap. Last updated: 2026-09-16.
