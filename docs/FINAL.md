# RiskPoint — approved release

**Approved presentation:** Build 1, Sora-only, with U+200A optical spacing around the Q2 revenue-range en dashes.

**Published HTML:** `final/RiskPoint-final.html`.
**Immutable approved Git blob:** `53aa58d34fff62b7c5017650ac2ec71710f300d9`.
**Public deployment:** `gh-pages/index.html`, same immutable blob at audit time.
**Initial approved-build commit:** `0c9bf8659282ba6b531ee69ca9b9a78dd47689f7` (`claude/final-build-clean-v01`).

`main` is the canonical development source branch. The independently approved Build 1 HTML remains frozen even when the source receives accessibility or testing changes.
`claude/final-build-clean-v01` is the preserved approval baseline.
`claude/final-build-v01` contains later visual experiments and should **not** be used to rebuild the approved presentation.
`gh-pages` is an orphan deployment branch; do not merge it with application sources.

CI always runs `npm run verify:baseline`, which guards the exact approved HTML blob independently of the evolving sources. For a proposed replacement release, run `npm ci`, `npm test`, `npm run build:all`, browser tests and `npm run verify:release`; the latter demands byte-for-byte identity with this frozen HTML when claiming an identical rebuild. If it differs, do not deploy or replace the approved artifact without explicit human approval of a new release.

The scoring is a prototype heuristic, not actuarial underwriting. Lead capture remains demo-only.