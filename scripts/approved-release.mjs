import { createHash } from 'node:crypto';

/** The human-approved, publicly deployed Build 1 (see docs/FINAL.md). Changing this requires an approved release. */
export const APPROVED_BUILD = Object.freeze({
  name: 'Build 1',
  file: 'final/RiskPoint-final.html',
  gitBlob: '53aa58d34fff62b7c5017650ac2ec71710f300d9',
  deployBranch: 'gh-pages',
  deployPath: 'index.html',
  liveUrl: 'https://kakalooka.github.io/RiskPoint/',
});

/** Git blob SHA-1 of a buffer, identical to `git hash-object`. */
export function gitBlobSha(bytes) {
  return createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
}
