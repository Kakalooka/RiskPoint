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
- Chromium browser smoke tests added for assessment flow, keyboard, reduced motion and mobile horizontal overflow.
- Real-world validation of illustrative loss ranges before any production use.
- `source/Mail.txt`: the third party's personal contact details (name, email, phone, office address) are redacted in the current tree; task content and deadlines are unchanged. Git history and older public branches still contain the original. Rewriting history is a separate owner decision (Issue #3) and has not been done.
- Configure main branch protection via GitHub settings if needed.

## Release invariants
Never update `gh-pages` automatically in this cleanup. `verify:baseline` guards the immutable Build 1 artifact; candidate sources may differ. New public releases require explicit human approval, review of browser tests and deliberate publication.