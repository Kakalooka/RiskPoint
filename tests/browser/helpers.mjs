import { expect } from '@playwright/test';

/** Opens the app under test for the current Playwright project (preview URL or a file on disk). */
export async function openApp(page, testInfo) {
  await page.goto(testInfo.project.metadata.entry);
  await expect(page.getByRole('heading', { name: 'What’s your industry?' })).toBeVisible();
}

/** Revenue display labels carry U+200A hair spaces around the en dash (approved Build 1 typography). */
export const revenue = (label) => label.replace(' – ', '\u200A–\u200A');

/** Matches a revenue label in an accessible name, where whitespace (including U+200A) is normalized. */
export const revenueName = (label) => new RegExp(label.replace(' – ', '\\s*–\\s*'));

export async function choose(page, placeholder, option) {
  await page.getByRole('button', { name: new RegExp(placeholder) }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

export async function completeAssessment(page, { industry, revenue: rev, mfa }) {
  await choose(page, 'Choose industry', industry);
  await page.getByRole('button', { name: 'Continue' }).click();
  await choose(page, 'Choose revenue', rev);
  await page.getByRole('button', { name: 'Continue' }).click();
  await choose(page, 'Choose coverage', mfa);
  await page.getByRole('button', { name: 'See my risk' }).click();
  await expect(page.getByRole('heading', { name: 'Your cyber risk' })).toBeVisible();
}

/** Waits until no CSS animation or transition is running, so measurements see the settled layout. */
export async function settle(page) {
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'));
}

/** Horizontal page overflow in CSS pixels (0 = none). */
export function horizontalOverflow(page) {
  return page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
}

/** Representative LOW / MID / HIGH cases; expected values follow docs/SPEC.md (scoring v0.2, ranges v0.1). */
export const LEVEL_CASES = [
  { answers: { industry: 'Technology', revenue: 'Under €5M', mfa: 'Yes, across the company' }, level: 'LOW', range: '€20k–€120k' },
  { answers: { industry: 'Technology', revenue: 'Under €5M', mfa: 'No' }, level: 'MID', range: '€20k–€120k' },
  { answers: { industry: 'Healthcare', revenue: '€300M+', mfa: 'No' }, level: 'HIGH', range: '€300k–€1.5M' },
];
