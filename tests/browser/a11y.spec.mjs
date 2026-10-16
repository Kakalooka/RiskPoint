import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { choose, completeAssessment, openApp, settle } from './helpers.mjs';

/**
 * Automated WCAG 2.x A/AA checks with axe-core on every screen and state.
 * Best-practice rules are not part of this gate; the known best-practice finding
 * (missing main landmark, N-03) is tracked in known-ui-issues.spec.mjs.
 */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function expectNoViolations(page, state) {
  await settle(page);
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const summary = violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  expect(summary, state).toEqual([]);
}

test('assessment screens and selector states', async ({ page }, testInfo) => {
  await openApp(page, testInfo);
  await expectNoViolations(page, 'Q1 closed');
  await page.getByRole('button', { name: /Choose industry/ }).click();
  await expectNoViolations(page, 'Q1 open');
  await page.getByRole('option', { name: 'Technology' }).click();
  await expectNoViolations(page, 'Q1 answered');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expectNoViolations(page, 'Q2');
  await choose(page, 'Choose revenue', 'Under €5M');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expectNoViolations(page, 'Q3');
});

test('result screen, disclosures and lead confirmation', async ({ page }, testInfo) => {
  await openApp(page, testInfo);
  await completeAssessment(page, { industry: 'Technology', revenue: 'Under €5M', mfa: 'No' });
  await expectNoViolations(page, 'result');
  await page.getByRole('button', { name: 'See protection options' }).click();
  await page.getByRole('button', { name: 'How is this calculated?' }).click();
  await expectNoViolations(page, 'result with both panels open');
  await page.getByLabel('Work email').fill('person@example.com');
  await page.getByLabel('Company name').fill('Acme');
  await page.getByRole('button', { name: 'Send' }).click();
  await expectNoViolations(page, 'lead confirmation');
});
