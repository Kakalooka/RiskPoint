# Repository state and outstanding work — 2026-10-16

## Canonical organization
- `main`: canonical development sources; the approved Build 1 HTML is frozen independently.
- `claude/final-build-clean-v01`: preserved audit/approved baseline.
- `claude/final-build-v01`: archived line of visual experiments, including the result plane; do not deploy as Build 1.
- `gh-pages`: frozen standalone deployment, independent Git history.

## Non-destructive cleanup
No branches, history, original source material or deployed pages are deleted. The approved HTML blob remains `53aa58d34fff62b7c5017650ac2ec71710f300d9`.

## Open issues (separate changes, not part of structural cleanup)
- Candidate a11y fixes: controls obscured by the expanded listbox are inert; listbox Tab/Escape restores trigger focus; reduced-motion also suppresses the exit animation. Changes are **not** deployed.
- Chromium E2E (`npm run test:e2e`, Playwright locked in `package-lock.json`) runs against the production build, the standalone file and, read-only, the frozen Build 1. Coverage: flow, exact results, keyboard, reduced motion, responsive layout, lead form without network traffic, axe WCAG A/AA. The fixed UI issues are guarded by regular tests.
- Real-world validation of illustrative loss ranges before any production use.
- Public `source/Mail.txt` includes a third party's recruitment contact details; review public exposure. Removing it from HEAD will not remove Git history.
- Configure main branch protection via GitHub settings if needed.

## UI quality pass
The UI and accessibility issues found in the 2026-10-16 audit are fixed in the sources: open-list overlap on short viewports, field contrast, the missing `main` landmark, selector typing, and Tab behavior. Details and regression tests are in [`UI_BACKLOG.md`](UI_BACKLOG.md). The published Build 1 is unchanged until a new release is approved.

## Release invariants
Never update `gh-pages` automatically in this cleanup. `verify:baseline` guards the immutable Build 1 artifact; candidate sources may differ. New public releases require explicit human approval, review of browser tests and deliberate publication.