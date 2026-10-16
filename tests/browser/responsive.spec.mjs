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

const listBox = (page) => page.locator('.selector__list').boundingBox();

for (const viewport of [
  { width: 320, height: 568 },
  { width: 375, height: 560 },
  { width: 667, height: 375 },
]) {
  test(`${viewport.width}×${viewport.height}: open Q1 list stays above the footer and signals that it scrolls (N-01)`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await openApp(page, testInfo);
    await page.getByRole('button', { name: /Choose industry/ }).click();
    // Park the pointer outside the list: hovering an option makes it the active one.
    await page.mouse.move(0, 0);
    await settle(page);

    const list = page.locator('.selector__list');
    const box = await listBox(page);
    const footerTop = (await page.locator('.assessment__footer').boundingBox()).y;
    expect(box.y + box.height).toBeLessThanOrEqual(footerTop);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);

    // More options below: only the bottom edge fades.
    await expect(list).toHaveAttribute('data-more-below', 'true');
    await expect(list).toHaveAttribute('data-more-above', 'false');
    await expect(list).toHaveCSS('mask-image', /linear-gradient/);

    // Keyboard reaches the last option; it scrolls fully into view, clear of the fade.
    await page.keyboard.press('End');
    const last = page.getByRole('option', { name: 'Other' });
    await expect(last).toBeFocused();
    await expect(list).toHaveAttribute('data-more-below', 'false');
    await expect(list).toHaveAttribute('data-more-above', 'true');
    const lastBox = await last.boundingBox();
    const scrolledBox = await listBox(page);
    expect(lastBox.y + lastBox.height).toBeLessThanOrEqual(scrolledBox.y + scrolledBox.height + 1);

    // Every option can still be chosen by pointer.
    await page.keyboard.press('Home');
    await expect(list).toHaveAttribute('data-more-above', 'false');
    await last.scrollIntoViewIfNeeded();
    await last.click();
    await expect(page.getByRole('button', { name: /Other/ })).toBeVisible();
  });
}

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
]) {
  test(`${viewport.width}×${viewport.height}: the open list shows every option without scrolling or fade`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await openApp(page, testInfo);
    await page.getByRole('button', { name: /Choose industry/ }).click();
    await settle(page);
    const list = page.locator('.selector__list');
    expect(await list.evaluate((el) => el.scrollHeight - el.clientHeight)).toBe(0);
    await expect(list).toHaveAttribute('data-more-below', 'false');
    await expect(list).toHaveAttribute('data-more-above', 'false');
    await expect(list).toHaveCSS('mask-image', 'none');
  });
}
