import { readFileSync } from 'node:fs';
import { APPROVED_BUILD, gitBlobSha } from './approved-release.mjs';

// Immutable Git blob for the human-approved and publicly deployed Build 1.
const EXPECTED = APPROVED_BUILD.gitBlob;
const actual = gitBlobSha(readFileSync(APPROVED_BUILD.file));
if (actual !== EXPECTED) {
  console.error(`STOP: approved HTML changed: ${actual} != ${EXPECTED}`);
  process.exitCode = 1;
} else {
  console.log('APPROVED_BASELINE=PASS (byte-for-byte)');
}
