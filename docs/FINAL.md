# RiskPoint — approved releases

## Current release: Build 2 (published)
**Approved by the owner on 2026-10-16** as the new public demo, after PRs #4–#9 were merged.
**Contents:** the approved Build 1 presentation (Sora only, dark Q1–Q3, light result, U+200A spacing in revenue ranges) plus the accessibility pass from PR #2 and the UI quality pass from PR #9 (N-01, N-02, N-03, N-06, RP-02; see `UI_BACKLOG.md`). No scoring, copy or flow changes.

| | |
|---|---|
| Archived HTML | `final/RiskPoint-build-2.html` |
| Git blob | `d2501a5c4becea628954456a00d79b76d78ecf9f` |
| SHA256 | `e53df367df5d10f3a228bd97c1158c52af78c19e950f64db9418b8b55e349a07` |
| Built from | `main` at `b9ead95` (`npm ci && npm run build:all`, Node 22); `npm run verify:release` reproduces it byte for byte |
| Deployment | `gh-pages:index.html`, the same bytes, published by a normal commit |
| Live | https://kakalooka.github.io/RiskPoint/ |

QA on this exact file before approval:
- the full Playwright and axe suite against `file://…/final/RiskPoint-build-2.html` (project `build-2`): flow, LOW / MID / HIGH, keyboard, reduced motion, responsive layout from 320 px to 1440 px and landscape, and the lead form with no network traffic;
- screenshots at 1440, 768, 375×667, 320×568 and 667×375 are pixel-identical to the reviewed PR #9 "after" screenshots.

## Archive: Build 1 (previous public release)
**Approved presentation:** Build 1, Sora only, with U+200A optical spacing around the Q2 revenue-range en dashes.

| | |
|---|---|
| Archived HTML | `final/RiskPoint-final.html` (immutable; kept for history and rollback) |
| Git blob | `53aa58d34fff62b7c5017650ac2ec71710f300d9` |
| Initial approved-build commit | `0c9bf8659282ba6b531ee69ca9b9a78dd47689f7` (`claude/final-build-clean-v01`) |

## Rules
- `main` is the canonical development source branch. Every approved archive in `final/` is immutable; `npm run verify:baseline` checks all of them against the Git blobs recorded in `scripts/approved-release.mjs`.
- `claude/final-build-clean-v01` is the preserved Build 1 approval baseline. `claude/final-build-v01` contains visual experiments and must not be used to rebuild a release.
- `gh-pages` is an orphan deployment branch; do not merge it with application sources.
- The *RiskPoint release guard* workflow runs `npm run verify:deployment`. This read-only check confirms that `gh-pages:index.html` is the current approved blob; on scheduled and manual runs it also checks the live page.
- Any further release follows [`RELEASE.md`](RELEASE.md), including rollback.

The scoring is a prototype heuristic, not actuarial underwriting. Lead capture remains demo-only.
