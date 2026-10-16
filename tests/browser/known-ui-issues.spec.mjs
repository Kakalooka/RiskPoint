import { test, expect } from '@playwright/test';
import { openApp, settle } from './helpers.mjs';

/**
 * Expected failures for confirmed UI issues that are DEFERRED (docs/UI_BACKLOG.md).
 * Each test states the desired behavior and is marked test.fail(), so it passes while
 * the issue exists. When the UI is fixed in a separate, human-approved change, the test
 * starts passing, Playwright reports it as an unexpected pass, and the marker must be
 * removed together with the fix. Do not change the UI to make these pass.
 */

for (const viewport of [
  { width: 320, height: 568 },
  { width: 375, height: 560 },
]) {
  test(`N-01: open Q1 list stays clear of the progress footer at ${viewport.width}×${viewport.height}`, async ({ page }, testInfo) => {
    test.fail(true, 'Deferred UI issue N-01 (docs/UI_BACKLOG.md)');
    await page.setViewportSize(viewport);
    await openApp(page, testInfo);
    await page.getByRole('button', { name: /Choose industry/ }).click();
    await settle(page);
    const listBottom = (await page.locator('.selector__list').boundingBox()).y + (await page.locator('.selector__list').boundingBox()).height;
    const progressTop = (await page.locator('.progress').boundingBox()).y;
    expect(listBottom).toBeLessThan(progressTop);
  });
}
