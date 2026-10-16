# Repository state and outstanding work — 2026-10-16

## Canonical organization
- `main`: approved Build 1 sources once consolidation is merged.
- `claude/final-build-clean-v01`: preserved audit/approved baseline.
- `claude/final-build-v01`: archived line of visual experiments, including the result plane; do not deploy as Build 1.
- `gh-pages`: frozen standalone deployment, independent Git history.

## Non-destructive cleanup
No branches, history, original source material or deployed pages are deleted. The approved HTML blob remains `53aa58d34fff62b7c5017650ac2ec71710f300d9`.

## Open issues (separate changes, not part of structural cleanup)
- UI accessibility: keyboard focus when option list is open; reduced-motion exit transition.
- Automated browser tests for full user journey, keyboard, and small viewport.
- Real-world validation of illustrative loss ranges before any production use.
- Public `source/Mail.txt` includes a third party's recruitment contact details; review public exposure. Removing it from HEAD will not remove Git history.
- Configure main branch protection via GitHub settings if needed.

## Release invariants
Never update `gh-pages` automatically in this cleanup. Production publishing should require successful testing and artifact-parity validation.