# RiskPoint — approved release

**Approved presentation:** Build 1, Sora-only, with U+200A optical spacing around the Q2 revenue-range en dashes.

**Published HTML:** `final/RiskPoint-final.html`.
**Immutable approved Git blob:** `53aa58d34fff62b7c5017650ac2ec71710f300d9`.
**Public deployment:** `gh-pages/index.html`, same immutable blob at audit time.
**Initial approved-build commit:** `0c9bf8659282ba6b531ee69ca9b9a78dd47689f7` (`claude/final-build-clean-v01`).

`main` is intended to be the canonical source branch after the repository cleanup PR merges.
`claude/final-build-clean-v01` is the preserved approval baseline.
`claude/final-build-v01` contains later visual experiments and should **not** be used to rebuild the approved presentation.
`gh-pages` is an orphan deployment branch; do not merge it with application sources.

For any change to the approved build, run `npm ci`, `npm test`, `npm run build:all` and `npm run verify:release`.
`verify:release` demands byte-for-byte identity with the frozen HTML. If it fails, STOP: do not publish, replace the original HTML or declare reproducibility. Investigate the difference separately.

The scoring is a prototype heuristic, not actuarial underwriting. Lead capture remains demo-only.