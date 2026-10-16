# Repository state and outstanding work — 2026-10-16

## Canonical organization
- `main`: canonical development sources; approved release archives in `final/` (Build 1, Build 2) are immutable.
- `claude/final-build-clean-v01`: preserved audit/approved baseline.
- `claude/final-build-v01`: archived line of visual experiments, including the result plane; do not deploy as Build 1.
- `gh-pages`: frozen standalone deployment, independent Git history.

## Non-destructive cleanup
No branches, history, original source material or deployed pages are deleted. The approved HTML blob remains `53aa58d34fff62b7c5017650ac2ec71710f300d9`.

## Open issues (separate changes, not part of structural cleanup)
- Candidate a11y fixes: controls obscured by the expanded listbox are inert; listbox Tab/Escape restores trigger focus; reduced-motion also suppresses the exit animation. Changes are **not** deployed.
- Chromium E2E (`npm run test:e2e`, Playwright locked in `package-lock.json`) runs against the production build, the standalone file and, read-only, the frozen Build 1. Coverage: flow, exact results, keyboard, reduced motion, responsive layout, lead form without network traffic, axe WCAG A/AA. The fixed UI issues are guarded by regular tests.
- Real-world validation of illustrative loss ranges before any production use.
- `source/Mail.txt`: the third party's personal contact details (name, email, phone, office address) are redacted in the current tree; task content and deadlines are unchanged. Git history and older public branches still contain the original. Rewriting history is a separate owner decision (Issue #3) and has not been done.
- Configure main branch protection via GitHub settings if needed.

## UI quality pass
The UI and accessibility issues found in the 2026-10-16 audit are fixed and **published in Build 2** (2026-10-16): open-list overlap on short viewports, field contrast, the missing `main` landmark, selector typing, and Tab behavior. Details and regression tests are in [`UI_BACKLOG.md`](UI_BACKLOG.md).

## Release invariants
Never update `gh-pages` automatically. `verify:baseline` guards every immutable archive in `final/`, and `verify:deployment` (read-only, *RiskPoint release guard* workflow) checks that `gh-pages:index.html`, and on scheduled/manual runs the live page, are the current approved blob (Build 2). Candidate sources may differ. Procedure and rollback: [`RELEASE.md`](RELEASE.md).