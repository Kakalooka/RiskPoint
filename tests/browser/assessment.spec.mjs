import { test, expect } from '@playwright/test';
import { LEVEL_CASES, choose, completeAssessment, openApp, revenue, revenueName } from './helpers.mjs';

test.beforeEach(async ({ page }, testInfo) => {
  await openApp(page, testInfo);
});

test('assessment, result, methodology, prototype lead, and edit', async ({ page }) => {
  await completeAssessment(page, { industry: 'Technology', revenue: 'Under €5M', mfa: 'No' });
  await expect(page.locator('.risk-level')).toHaveText('MID');
  await page.getByRole('button', { name: 'How is this calculated?' }).click();
  await expect(page.locator('#method')).toContainText('prototype heuristic');
  await expect(page.locator('#method')).toContainText('Full MFA coverage would move this assessment from MID to LOW.');
  await page.getByRole('button', { name: 'See protection options' }).click();
  await expect(page.getByLabel('Work email')).toBeVisible();
  await expect(page.getByLabel('Company name')).toBeVisible();
  await page.getByRole('button', { name: 'Edit answers' }).click();
  await expect(page.getByRole('button', { name: /Technology/ })).toBeVisible();
});

for (const { answers, level, range } of LEVEL_CASES) {
  test(`result shows ${level} and ${range} for ${answers.industry} / ${answers.revenue} / ${answers.mfa}`, async ({ page }) => {
    await completeAssessment(page, answers);
    await expect(page.locator('.risk-level')).toHaveText(level);
    await expect(page.locator('.impact-range')).toHaveText(range);
    await expect(page.locator('.result')).toHaveAttribute('data-level', level);
    // No numeric score, percentage or x/100 next to the level.
    await expect(page.locator('.result')).not.toContainText(/%|\/100|score/i);
  });
}

test('forward action needs a selection and selecting does not advance', async ({ page }) => {
  const forward = page.getByRole('button', { name: 'Continue' });
  await expect(forward).toBeDisabled();
  await choose(page, 'Choose industry', 'Healthcare');
  await expect(page.getByRole('heading', { name: 'What’s your industry?' })).toBeVisible();
  await expect(forward).toBeEnabled();
  // The answer can be changed before confirming.
  await choose(page, 'Healthcare', 'Manufacturing');
  await expect(page.getByRole('button', { name: /Manufacturing/ })).toBeVisible();
  await expect(page.getByText('1 of 3')).toBeVisible();
  await forward.click();
  await expect(page.getByRole('heading', { name: 'What’s your annual revenue?' })).toBeVisible();
  await expect(page.getByText('2 of 3')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
});

test('Back on Q2 and Q3 and Edit answers preserve every answer', async ({ page }) => {
  const band = revenue('€25M – €50M');
  await choose(page, 'Choose industry', 'Retail & e-commerce');
  await page.getByRole('button', { name: 'Continue' }).click();
  await choose(page, 'Choose revenue', band);
  await page.getByRole('button', { name: 'Continue' }).click();
  await choose(page, 'Choose coverage', 'I’m not sure');

  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('button', { name: revenueName('€25M – €50M') })).toBeVisible();
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('button', { name: /Retail & e-commerce/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Back' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('button', { name: /I’m not sure/ })).toBeVisible();
  await page.getByRole('button', { name: 'See my risk' }).click();
  await expect(page.locator('.risk-level')).toHaveText('MID');

  await page.getByRole('button', { name: 'Edit answers' }).click();
  await expect(page.getByRole('button', { name: /Retail & e-commerce/ })).toBeVisible();
  await expect(page.getByText('1 of 3')).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('button', { name: revenueName('€25M – €50M') })).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('button', { name: /I’m not sure/ })).toBeVisible();
});

test('theme switches dark → light on the result and back on edit', async ({ page }) => {
  const theme = () => page.evaluate(() => document.documentElement.dataset.theme);
  expect(await theme()).toBe('dark');
  await completeAssessment(page, LEVEL_CASES[0].answers);
  expect(await theme()).toBe('light');
  await page.getByRole('button', { name: 'Edit answers' }).click();
  expect(await theme()).toBe('dark');
});
