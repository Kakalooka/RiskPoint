# RiskPoint — release procedure

This document says how a future release replaces the published page and how to verify what is deployed. It does **not** authorize a release. The approved, published artifact is **Build 2** (`docs/FINAL.md`); Build 1 is archived. The published artifact stays fixed until a human explicitly approves a successor.

## Two kinds of checks
| What | Command | Where | Meaning |
|---|---|---|---|
| Approved archives on `main` | `npm run verify:baseline` | CI (`ci.yml`) | Every file in `final/` listed in `scripts/approved-release.mjs` (Build 1 `53aa58d…`, Build 2 `d2501a5…`) is unchanged. |
| Published deployment (Git) | `npm run verify:deployment` | CI (`release-guard.yml`) on every push/PR to `main` and weekly | `gh-pages:index.html` is still the approved blob. Read-only; requires `git fetch --depth=1 origin gh-pages`. |
| Published deployment (live) | `npm run verify:deployment -- --live` | `release-guard.yml` on schedule and manual dispatch | The page served at `https://kakalooka.github.io/RiskPoint/` is byte-identical to the approved blob. |
| Candidate sources | `npm test`, `npm run build:all`, `npm run test:e2e` | CI (`ci.yml`, `e2e.yml`) | The **current sources** work. This says nothing about what is deployed. |
| Identical rebuild of the approved file | `npm run verify:release` | Manual | A fresh `dist/RiskPoint.html` is byte-identical to the current approved release. Fails by design once the sources move on. Never "fix" it by replacing an approved file. |

A green CI run on `main` therefore means "the candidate sources pass" and "the approved archives and the published page are untouched". It never means the live demo contains the latest source changes.

## Releasing a successor (e.g. Build 3)
Every step needs a human. No workflow deploys anything.

1. **Candidate.** Merge the intended source changes into `main` through reviewed PRs. CI and E2E must be green, and so must `verify:baseline` and `verify:deployment`, because Build 1 is still the published artifact at this point.
2. **Build.**
   ```bash
   npm ci
   npm run build:all
   ```
   This produces `dist/RiskPoint.html`. Record its Git blob with `git hash-object dist/RiskPoint.html`.
3. **QA on the exact file.**
   - Open `dist/RiskPoint.html` from disk and check visually and with the keyboard: Q1–Q3, LOW / MID / HIGH, both result panels, the lead confirmation, Edit answers.
   - Viewports: 320, 375×667, 768, 1440 and phone landscape.
   - Also check reduced motion.
   - Review `npm run test:e2e`, including any expected failures in `tests/browser/known-ui-issues.spec.mjs`, and the deferred items in `docs/UI_BACKLOG.md`.
4. **Human approval.** The owner explicitly approves the new artifact by its blob SHA (for example in the release PR), including every visual or behavioral difference from the previous build.
5. **Versioned artifact.** In one release PR to `main`:
   - add the approved file under a new name (for example `final/RiskPoint-build-2.html`);
   - keep `final/RiskPoint-final.html` as the Build 1 record, unless the owner decides otherwise;
   - update `APPROVED_BUILD` in `scripts/approved-release.mjs`;
   - add a new section to `docs/FINAL.md` naming the blob, the approval and the date.
   - After this PR, `verify:deployment` fails until step 6 is done. That signals an approved but not yet deployed release.
6. **Deployment (owner, manual).** Copy the approved bytes to `index.html` on the `gh-pages` branch in a normal commit. Do not merge `gh-pages` with application sources and do not force-push. GitHub Pages publishes the branch.
7. **Post-deployment verification.**
   - Run `git fetch --depth=1 origin gh-pages && npm run verify:deployment -- --live`, or dispatch the *RiskPoint release guard* workflow.
   - Both checks must report the newly approved blob.

## Rollback
Restore the previous approved bytes on `gh-pages` in a new commit, with no history rewrite. For Build 2 → Build 1: `git show origin/main:final/RiskPoint-final.html > index.html` on a `gh-pages` checkout, commit and push. Then point `APPROVED_BUILD` in `scripts/approved-release.mjs` back to the Build 1 entry in a PR to `main`, and rerun step 7. The archives in `final/` are never deleted, so every approved build stays restorable.

## Repository settings (owner decision)
These cannot be set from the repository files:
- **Branch protection or rulesets for `main`:** require a PR, plus the *RiskPoint CI*, *RiskPoint browser E2E* and *RiskPoint release guard* checks.
- **Rules for `gh-pages`:** restrict who can push, and block force pushes and deletion.
