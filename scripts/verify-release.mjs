import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { APPROVED_BUILD } from './approved-release.mjs';

// Compares a fresh standalone build with the currently approved release.
const approved = readFileSync(APPROVED_BUILD.file);
const generated = readFileSync('dist/RiskPoint.html');
const sha = (buffer) => createHash('sha256').update(buffer).digest('hex');
console.log(`Approved ${APPROVED_BUILD.name} SHA256: ${sha(approved)}`);
console.log(`Generated SHA256: ${sha(generated)}`);
if (!approved.equals(generated)) {
  console.error('STOP: generated standalone HTML differs from the approved release.');
  console.error('Do not overwrite the approved artifact or deploy this build.');
  process.exitCode = 1;
} else {
  console.log('RELEASE_PARITY=PASS (byte-for-byte)');
}
