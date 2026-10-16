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
- Public `source/Mail.txt` includes a third party's recruitment contact details; review public exposure. Removing it from HEAD will not remove Git history.
- Configure main branch protection via GitHub settings if needed.

## Release invariants
Never update `gh-pages` automatically. `verify:baseline` guards the immutable Build 1 file on `main`, and `verify:deployment` (read-only, *RiskPoint release guard* workflow) checks that `gh-pages:index.html`, and on scheduled/manual runs the live page, are still that blob. Candidate sources may differ. Procedure: [`RELEASE.md`](RELEASE.md). New public releases require explicit human approval, review of browser tests and deliberate publication.