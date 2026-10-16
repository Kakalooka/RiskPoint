import { test, expect } from '@playwright/test';
import { LEVEL_CASES, completeAssessment, openApp } from './helpers.mjs';

/**
 * Smoke test for single-file HTML artifacts opened from disk (file://):
 * - project "standalone": dist/RiskPoint.html built from the current sources;
 * - project "frozen-build-1": the approved, published Build 1 (read-only).
 * Only behavior shared by both is asserted. Build 1 intentionally lacks later
 * accessibility changes on main; those differences are not checked here.
 */

test('runs offline from disk and shows the correct LOW / MID / HIGH result', async ({ page }, testInfo) => {
  const external = [];
  page.on('request', (request) => {
    const url = request.url();
    if (!url.startsWith('file:') && !url.startsWith('data:')) external.push(url);
  });

  for (const { answers, level, range } of LEVEL_CASES) {
    await openApp(page, testInfo);
    await completeAssessment(page, answers);
    await expect(page.locator('.risk-level')).toHaveText(level);
    await expect(page.locator('.impact-range')).toHaveText(range);
  }

  await page.getByRole('button', { name: 'See protection options' }).click();
  await page.getByLabel('Work email').fill('person@example.com');
  await page.getByLabel('Company name').fill('Acme');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('status')).toHaveText('Prototype — nothing was submitted.');

  // Everything, including the Sora font, is inlined: no network access at all.
  expect(await page.evaluate(() => document.fonts.check('16px "Sora Variable"'))).toBe(true);
  expect(external).toEqual([]);
});
