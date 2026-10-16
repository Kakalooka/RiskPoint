import { test, expect } from '@playwright/test';
import { choose, openApp } from './helpers.mjs';

/**
 * Keyboard behavior of the typographic listbox.
 * Tab / Shift+Tab inside the open list close it WITHOUT changing the answer and move
 * focus to the next / previous control, as if the list were not open (RP-02).
 * Choosing (Enter / Space / click) and confirming (Continue) stay separate steps.
 */

test.beforeEach(async ({ page }, testInfo) => {
  await openApp(page, testInfo);
});

const activeText = (page) => page.evaluate(() => document.activeElement?.textContent?.trim());

test('listbox excludes visually hidden controls from tab order and restores focus', async ({ page }) => {
  const trigger = page.getByRole('button', { name: /Choose industry/ });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.stage__action')).toHaveAttribute('inert', '');
  await expect(page.locator('.assessment__footer')).toHaveAttribute('inert', '');
  await expect(page.getByRole('listbox')).toBeVisible();
  // Q1 without an answer: Continue is disabled and there is no Back, so focus stays on the trigger.
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

test('Shift+Tab in the open list closes it without selecting; with nothing before it, focus stays on the trigger', async ({ page }) => {
  const trigger = page.getByRole('button', { name: /Choose industry/ });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).toContainText('Choose industry');
});

test('hidden controls never receive focus while the list is open', async ({ page }) => {
  // With an answer chosen, Continue is enabled but hidden behind the open list.
  const trigger = page.locator('.selector__trigger');
  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('listbox')).toBeVisible();
  for (const key of ['ArrowDown', 'ArrowDown', 'End', 'Home', 'ArrowUp']) {
    await page.keyboard.press(key);
    const inList = await page.evaluate(() => document.activeElement?.getAttribute('role'));
    expect(inList).toBe('option');
  }
  // Tab leaves the list straight to the next control, now visible again; the answer is unchanged.
  await page.keyboard.press('Tab');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Continue' })).toBeFocused();
  await expect(trigger).toContainText('Technology');
});

test('Tab from the open list moves on in one step and never changes the answer (RP-02)', async ({ page }) => {
  await choose(page, 'Choose industry', 'Healthcare');
  await page.getByRole('button', { name: 'Continue' }).click();
  // Keyboard-only from here: park the pointer, since hovering an option makes it active.
  await page.mouse.move(0, 0);
  const trigger = page.locator('.selector__trigger');

  // Q2 without an answer: Continue is disabled, so Tab goes to Back.
  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Back' })).toBeFocused();
  await expect(trigger).toContainText('Choose revenue');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();

  // With an answer: moving the active option and tabbing away keeps the chosen answer.
  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await expect(trigger).toContainText('Under €5M');
  await page.keyboard.press('Enter');
  await page.keyboard.press('End');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeFocused();
  await expect(trigger).toContainText('Under €5M');
  await expect(page.getByRole('heading', { name: 'What’s your annual revenue?' })).toBeVisible();

  // Shift+Tab from the open list: no earlier control on the page, so focus returns to the trigger.
  await trigger.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).toContainText('Under €5M');

  // Normal tab order around the closed selector is unchanged.
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(trigger).toBeFocused();
});

test('arrows, Home, End, typeahead, Enter, Space and Escape', async ({ page }) => {
  const trigger = page.getByRole('button', { name: /Choose industry/ });
  await trigger.focus();

  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('listbox')).toBeVisible();
  expect(await activeText(page)).toBe('Technology');
  await page.keyboard.press('ArrowUp');
  expect(await activeText(page)).toBe('Other');
  await page.keyboard.press('Home');
  expect(await activeText(page)).toBe('Technology');
  await page.keyboard.press('End');
  expect(await activeText(page)).toBe('Other');
  await page.keyboard.press('ArrowDown');
  expect(await activeText(page)).toBe('Technology');
  await page.keyboard.type('ma');
  expect(await activeText(page)).toBe('Manufacturing');

  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).toContainText('Choose industry');

  await page.keyboard.press('Space');
  expect(await activeText(page)).toBe('Technology');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { name: /Financial services/ })).toBeFocused();

  // Reopening starts on the selected option, which is marked aria-selected.
  await page.keyboard.press('Enter');
  expect(await activeText(page)).toBe('Financial services');
  await expect(page.getByRole('option', { name: 'Financial services' })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Escape');
});

test('the whole assessment can be completed with the keyboard', async ({ page }) => {
  for (const [placeholder, steps] of [
    ['Choose industry', ['ArrowDown', 'Enter']],
    ['Choose revenue', ['ArrowDown', 'End', 'Enter']],
    ['Choose coverage', ['ArrowDown', 'End', 'ArrowUp', 'Enter']],
  ]) {
    await page.getByRole('button', { name: new RegExp(placeholder) }).focus();
    for (const key of steps) await page.keyboard.press(key);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
  }
  await expect(page.getByRole('heading', { name: 'Your cyber risk' })).toBeFocused();
  // Technology / €300M+ / No → 2 + 1 + 3 = 6 → HIGH.
  await expect(page.locator('.risk-level')).toHaveText('HIGH');
});
