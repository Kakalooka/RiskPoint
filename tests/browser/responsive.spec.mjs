import { test, expect } from '@playwright/test';
import { choose, horizontalOverflow, openApp, settle } from './helpers.mjs';

/** Targets from docs/SPEC.md (≈375, 768, 1440) plus a narrow phone and phone landscape. */
const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 667, height: 375 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

async function expectInsideViewport(page, locator) {
  const box = await locator.boundingBox();
  const width = await page.evaluate(() => document.documentElement.clientWidth);
  expect(box, 'element is rendered').not.toBeNull();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(width + 0.5);
}

for (const viewport of VIEWPORTS) {
  test(`${viewport.width}×${viewport.height}: no horizontal overflow on any screen`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await openApp(page, testInfo);

    const steps = [
      ['Choose industry', 'Professional services', 'Continue'],
      ['Choose revenue', '€300M+', 'Continue'],
      ['Choose coverage', 'Only for some accounts', 'See my risk'],
    ];
    for (const [placeholder, option, action] of steps) {
      await page.getByRole('button', { name: new RegExp(placeholder) }).click();
      await settle(page);
      expect(await horizontalOverflow(page), `${placeholder} list open`).toBe(0);
      await page.getByRole('option', { name: option, exact: true }).click();
      await settle(page);
      expect(await horizontalOverflow(page), `${placeholder} answered`).toBe(0);
      await expectInsideViewport(page, page.getByRole('button', { name: action }));
      await page.getByRole('button', { name: action }).click();
    }

    // Measure the settled result screen, not the exit transition.
    await expect(page.getByRole('heading', { name: 'Your cyber risk' })).toBeVisible();
    await expect(page.locator('.risk-level')).toHaveText('MID');
    await settle(page);
    expect(await horizontalOverflow(page), 'result').toBe(0);

    await page.getByRole('button', { name: 'See protection options' }).click();
    await page.getByRole('button', { name: 'How is this calculated?' }).click();
    await settle(page);
    expect(await horizontalOverflow(page), 'result with both panels open').toBe(0);
    for (const control of [
      page.getByRole('button', { name: 'See protection options' }),
      page.getByLabel('Work email'),
      page.getByLabel('Company name'),
      page.getByRole('button', { name: 'Send' }),
      page.getByRole('button', { name: 'How is this calculated?' }),
      page.getByRole('button', { name: 'Edit answers' }),
      page.locator('#method'),
    ]) {
      await expectInsideViewport(page, control);
    }
  });
}

test('375×667: every Q1 option can be reached and chosen in the open list', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await openApp(page, testInfo);
  await choose(page, 'Choose industry', 'Other');
  await expect(page.getByRole('button', { name: /Other/ })).toBeVisible();
});
