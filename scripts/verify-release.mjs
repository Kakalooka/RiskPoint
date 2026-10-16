import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const approved = readFileSync('final/RiskPoint-final.html');
const generated = readFileSync('dist/RiskPoint.html');
const sha = (buffer) => createHash('sha256').update(buffer).digest('hex');
console.log(`Approved SHA256: ${sha(approved)}`);
console.log(`Generated SHA256: ${sha(generated)}`);
if (!approved.equals(generated)) {
  console.error('STOP: generated standalone HTML differs from the approved release.');
  console.error('Do not overwrite the approved artifact or deploy this build.');
  process.exitCode = 1;
} else {
  console.log('RELEASE_PARITY=PASS (byte-for-byte)');
}