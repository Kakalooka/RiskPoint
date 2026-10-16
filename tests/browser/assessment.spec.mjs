import { test, expect } from '@playwright/test';

async function choose(page, placeholder, option) {
  await page.getByRole('button', { name: new RegExp(placeholder) }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

test('assessment, result, methodology, prototype lead, and edit', async ({ page }) => {
  await page.goto('/');
  await choose(page, 'Choose industry', 'Technology');
  await page.getByRole('button', { name: 'Continue' }).click();
  await choose(page, 'Choose revenue', 'Under €5M');
  await page.getByRole('button', { name: 'Continue' }).click();
  await choose(page, 'Choose coverage', 'No');
  await page.getByRole('button', { name: 'See my risk' }).click();
  await expect(page.getByRole('heading', { name: 'Your cyber risk' })).toBeVisible();
  await expect(page.locator('.risk-level')).toContainText(/LOW|MID|HIGH/);
  await page.getByRole('button', { name: 'How is this calculated?' }).click();
  await expect(page.locator('#method')).toContainText('prototype heuristic');
  await page.getByRole('button', { name: 'See protection options' }).click();
  await expect(page.getByLabel('Work email')).toBeVisible();
  await expect(page.getByLabel('Company name')).toBeVisible();
  await page.getByRole('button', { name: 'Edit answers' }).click();
  await expect(page.getByRole('button', { name: /Technology/ })).toBeVisible();
});

test('listbox excludes visually hidden controls from tab order and restores focus', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: /Choose industry/ });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.stage__action')).toHaveAttribute('inert', '');
  await expect(page.locator('.assessment__footer')).toHaveAttribute('inert', '');
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(trigger).toBeFocused();
  await expect(page.locator('.stage__action')).not.toHaveAttribute('inert');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');
  await page.getByRole('option', { name: 'Technology' }).click();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeFocused();
});

test('reduced motion removes stage, exit, and theme transitions', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await page.goto('/');
    await expect(page.locator('.assessment .stage')).toHaveCSS('animation-name', 'none');
    await expect(page.locator('html')).toHaveCSS('transition-duration', '0s');
    await choose(page, 'Choose industry', 'Technology');
    await page.getByRole('button', { name: 'Continue' }).click();
    await choose(page, 'Choose revenue', 'Under €5M');
    await page.getByRole('button', { name: 'Continue' }).click();
    await choose(page, 'Choose coverage', 'No');
    await page.getByRole('button', { name: 'See my risk' }).click();
    await expect(page.getByRole('heading', { name: 'Your cyber risk' })).toBeVisible();
  } finally {
    await context.close();
  }
});

test('375px view has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  const flows = [['Choose industry','Technology'],['Choose revenue','Under €5M'],['Choose coverage','No']];
  for (const [placeholder, option] of flows) {
    await choose(page, placeholder, option);
    await page.getByRole('button', { name: placeholder === 'Choose coverage' ? 'See my risk' : 'Continue' }).click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
});
