import { readFileSync } from 'node:fs';
import { RELEASES, gitBlobSha } from './approved-release.mjs';

// Every approved release archive must stay byte-for-byte identical to its recorded Git blob.
for (const release of RELEASES) {
  const actual = gitBlobSha(readFileSync(release.file));
  if (actual !== release.gitBlob) {
    console.error(`STOP: ${release.name} archive ${release.file} changed: ${actual} != ${release.gitBlob}`);
    process.exitCode = 1;
  } else {
    console.log(`APPROVED_BASELINE=PASS ${release.name} ${release.file} (byte-for-byte)`);
  }
}
