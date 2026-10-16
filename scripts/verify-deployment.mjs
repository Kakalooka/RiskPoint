import { execFileSync } from 'node:child_process';
import { APPROVED_BUILD, gitBlobSha } from './approved-release.mjs';

/**
 * Read-only check that the deployment matches the current approved release (APPROVED_BUILD).
 *
 *   node scripts/verify-deployment.mjs [--ref <git ref>] [--live [url]]
 *
 * - Git check (always): the deploy file on the deployment branch must be the approved
 *   blob. Uses `origin/gh-pages` by default; fetch it first, e.g.
 *   `git fetch --depth=1 origin gh-pages`.
 * - Live check (--live): downloads the public page and compares its bytes as well.
 *
 * Nothing is written, pushed or deployed.
 */
const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  const value = args[i + 1];
  return value && !value.startsWith('--') ? value : true;
};

const ref = option('--ref') ?? `origin/${APPROVED_BUILD.deployBranch}`;
const live = option('--live');
const expected = APPROVED_BUILD.gitBlob;
let failed = false;

const git = (...gitArgs) => execFileSync('git', gitArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

try {
  const blob = git('rev-parse', `${ref}:${APPROVED_BUILD.deployPath}`);
  const files = git('ls-tree', '--name-only', ref).split('\n').filter(Boolean);
  if (blob !== expected) {
    console.error(`STOP: ${ref}:${APPROVED_BUILD.deployPath} is ${blob}, expected approved ${APPROVED_BUILD.name} ${expected}.`);
    failed = true;
  } else {
    console.log(`DEPLOYMENT_GIT=PASS ${ref}:${APPROVED_BUILD.deployPath} = ${expected}`);
  }
  const extra = files.filter((f) => f !== APPROVED_BUILD.deployPath);
  if (extra.length) console.warn(`NOTE: ${ref} also contains: ${extra.join(', ')}`);
} catch (error) {
  console.error(`STOP: cannot read ${ref}:${APPROVED_BUILD.deployPath}. Fetch the deployment branch first.`);
  console.error(String(error.stderr || error.message).trim());
  failed = true;
}

if (live) {
  const url = live === true ? APPROVED_BUILD.liveUrl : live;
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = gitBlobSha(Buffer.from(await response.arrayBuffer()));
    if (blob !== expected) {
      console.error(`STOP: live page ${url} is ${blob}, expected approved ${APPROVED_BUILD.name} ${expected}.`);
      failed = true;
    } else {
      console.log(`DEPLOYMENT_LIVE=PASS ${url} = ${expected}`);
    }
  } catch (error) {
    console.error(`STOP: cannot verify live page ${url}: ${error.message}`);
    failed = true;
  }
}

if (failed) process.exitCode = 1;
