import { test, expect } from '@playwright/test';
import { openApp, settle } from './helpers.mjs';

/**
 * Expected failures for confirmed UI issues that are DEFERRED (docs/UI_BACKLOG.md).
 * Each test states the desired behavior and is marked test.fail(), so it passes while
 * the issue exists. When the UI is fixed in a separate, human-approved change, the test
 * starts passing, Playwright reports it as an unexpected pass, and the marker must be
 * removed together with the fix. Do not change the UI to make these pass.
 */

function contrast(a, b) {
  const lum = (rgb) => {
    const [r, g, bl] = rgb.match(/\d+(\.\d+)?/g).slice(0, 3).map((v) => {
      const c = Number(v) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

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

test('N-02: lead-form field boundary has at least 3:1 non-text contrast', async ({ page }, testInfo) => {
  test.fail(true, 'Deferred UI issue N-02 (docs/UI_BACKLOG.md)');
  await openApp(page, testInfo);
  for (const [placeholder, option, action] of [
    ['Choose industry', 'Technology', 'Continue'],
    ['Choose revenue', 'Under €5M', 'Continue'],
    ['Choose coverage', 'No', 'See my risk'],
  ]) {
    await page.getByRole('button', { name: new RegExp(placeholder) }).click();
    await page.getByRole('option', { name: option, exact: true }).click();
    await page.getByRole('button', { name: action }).click();
  }
  await page.getByRole('button', { name: 'See protection options' }).click();
  // Measure the idle field: focus styles intentionally strengthen the underline.
  await page.evaluate(() => document.activeElement?.blur());
  await settle(page);
  const [border, background] = await page.getByLabel('Work email').evaluate((el) => [
    getComputedStyle(el).borderBottomColor,
    getComputedStyle(document.documentElement).backgroundColor,
  ]);
  expect(contrast(border, background)).toBeGreaterThanOrEqual(3);
});
