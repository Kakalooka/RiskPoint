import { createHash } from 'node:crypto';

/**
 * Human-approved release archives (see docs/FINAL.md). Every archived file is
 * immutable and checked by `npm run verify:baseline`. Adding an entry or changing
 * APPROVED_BUILD requires an approved release (docs/RELEASE.md).
 */
export const RELEASES = Object.freeze([
  Object.freeze({
    name: 'Build 1',
    file: 'final/RiskPoint-final.html',
    gitBlob: '53aa58d34fff62b7c5017650ac2ec71710f300d9',
  }),
  Object.freeze({
    name: 'Build 2',
    file: 'final/RiskPoint-build-2.html',
    gitBlob: 'd2501a5c4becea628954456a00d79b76d78ecf9f',
    sha256: 'e53df367df5d10f3a228bd97c1158c52af78c19e950f64db9418b8b55e349a07',
  }),
]);

/** The release that is (or is about to be) published on gh-pages. */
export const APPROVED_BUILD = Object.freeze({
  ...RELEASES[RELEASES.length - 1],
  deployBranch: 'gh-pages',
  deployPath: 'index.html',
  liveUrl: 'https://kakalooka.github.io/RiskPoint/',
});

/** Git blob SHA-1 of a buffer, identical to `git hash-object`. */
export function gitBlobSha(bytes) {
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}
