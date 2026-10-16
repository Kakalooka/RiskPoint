import { test, expect } from '@playwright/test';
import { completeAssessment, contrast, openApp, settle } from './helpers.mjs';

test('result needs no sign-up; prototype lead form validates and sends nothing', async ({ page }, testInfo) => {
  const requests = [];
  page.on('request', (request) => requests.push(`${request.method()} ${request.url()}`));

  await openApp(page, testInfo);
  await completeAssessment(page, { industry: 'Financial services', revenue: 'Under €5M', mfa: 'Only for some accounts' });
  // The result is visible before any contact details are asked for.
  await expect(page.locator('.risk-level')).toHaveText('MID');
  await expect(page.getByLabel('Work email')).toHaveCount(0);

  const afterResult = requests.length;
  const cta = page.getByRole('button', { name: 'See protection options' });
  await expect(cta).toHaveAttribute('aria-expanded', 'false');
  await cta.click();
  await expect(cta).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByLabel('Work email')).toBeFocused();
  await expect(page.getByText('Prototype: nothing is sent.')).toBeVisible();

  // Native validation blocks an invalid email and an empty company name.
  await page.getByLabel('Work email').fill('not-an-email');
  await page.getByLabel('Company name').fill('Acme');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('status')).toHaveCount(0);
  expect(await page.getByLabel('Work email').evaluate((el) => el.validity.typeMismatch)).toBe(true);

  await page.getByLabel('Work email').fill('person@example.com');
  await page.getByLabel('Company name').fill('');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('status')).toHaveCount(0);

  await page.getByLabel('Company name').fill('Acme');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('status')).toHaveText('Prototype — nothing was submitted.');
  await expect(page.getByRole('status')).toBeFocused();

  // Nothing at all went over the network for the lead flow.
  expect(requests.slice(afterResult)).toEqual([]);
});

test('lead-form field underlines have at least 3:1 non-text contrast (N-02)', async ({ page }, testInfo) => {
  await openApp(page, testInfo);
  await completeAssessment(page, { industry: 'Technology', revenue: 'Under €5M', mfa: 'No' });
  await page.getByRole('button', { name: 'See protection options' }).click();
  // Measure the idle fields: the focus style intentionally strengthens the underline.
  await page.evaluate(() => document.activeElement?.blur());
  await settle(page);
  const background = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
  for (const label of ['Work email', 'Company name']) {
    const field = page.getByLabel(label);
    const [border, width] = await field.evaluate((el) => [getComputedStyle(el).borderBottomColor, getComputedStyle(el).borderBottomWidth]);
    expect(width, `${label} keeps a 1px underline`).toBe('1px');
    expect(contrast(border, background), label).toBeGreaterThanOrEqual(3);
  }
});
