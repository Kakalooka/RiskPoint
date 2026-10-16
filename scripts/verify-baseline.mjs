import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// Immutable Git blob for the human-approved and publicly deployed Build 1.
const EXPECTED = '53aa58d34fff62b7c5017650ac2ec71710f300d9';
const bytes = readFileSync('final/RiskPoint-final.html');
const gitHeader = Buffer.from(`blob ${bytes.length}\0`);
const actual = createHash('sha1').update(gitHeader).update(bytes).digest('hex');
if (actual !== EXPECTED) {
  console.error(`STOP: approved HTML changed: ${actual} != ${EXPECTED}`);
  process.exitCode = 1;
} else {
  console.log('APPROVED_BASELINE=PASS (byte-for-byte)');
}
