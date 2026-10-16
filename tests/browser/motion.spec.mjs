import { test, expect } from '@playwright/test';
import { choose, completeAssessment, openApp } from './helpers.mjs';

/**
 * Captures computed styles at the moment the assessment enters its "leaving" state.
 * A MutationObserver callback runs before the exit timer can fire (even a 0 ms one),
 * so the transient state is observed without depending on exact timings.
 */
async function captureLeavingState(page) {
  await page.evaluate(() => {
    window.__leaving = null;
    const observer = new MutationObserver(() => {
      const form = document.querySelector('.assessment[data-leaving="true"]');
      if (!form || window.__leaving) return;
      const css = (el) => getComputedStyle(el);
      window.__leaving = {
        stage: css(form.querySelector('.stage')).animationName,
        footer: css(form.querySelector('.assessment__footer')).animationName,
        htmlTransition: css(document.documentElement).transitionDuration,
        inert: form.inert,
      };
      observer.disconnect();
    });
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['data-leaving'] });
  });
}

async function answerAll(page) {
  await choose(page, 'Choose industry', 'Technology');
  await page.getByRole('button', { name: 'Continue' }).click();
  await choose(page, 'Choose revenue', 'Under €5M');
  await page.getByRole('button', { name: 'Continue' }).click();
  await choose(page, 'Choose coverage', 'No');
}

test.describe('reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('removes stage, exit, theme and reveal motion; controls still work', async ({ page }, testInfo) => {
    await openApp(page, testInfo);
    await expect(page.locator('.assessment .stage')).toHaveCSS('animation-name', 'none');
    await expect(page.locator('html')).toHaveCSS('transition-duration', '0s');

    await page.getByRole('button', { name: /Choose industry/ }).click();
    await expect(page.locator('.selector__list')).toHaveCSS('animation-name', 'none');
    await page.keyboard.press('Escape');

    await answerAll(page);
    await captureLeavingState(page);
    await page.getByRole('button', { name: 'See my risk' }).click();
    await expect(page.getByRole('heading', { name: 'Your cyber risk' })).toBeVisible();

    const leaving = await page.evaluate(() => window.__leaving);
    expect(leaving).toEqual({ stage: 'none', footer: 'none', htmlTransition: '0s', inert: true });

    for (const el of await page.locator('.reveal').all()) {
      await expect(el).toHaveCSS('animation-name', 'none');
      await expect(el).toHaveCSS('transform', 'none');
    }
    await page.getByRole('button', { name: 'How is this calculated?' }).click();
    await expect(page.locator('#method')).toHaveCSS('animation-name', 'none');
    await page.getByRole('button', { name: 'See protection options' }).click();
    await expect(page.getByLabel('Work email')).toBeFocused();
  });
});

test('default motion plays the exit animation (guards the observer above against a vacuous pass)', async ({ page }, testInfo) => {
  await openApp(page, testInfo);
  await answerAll(page);
  await captureLeavingState(page);
  await page.getByRole('button', { name: 'See my risk' }).click();
  await expect(page.getByRole('heading', { name: 'Your cyber risk' })).toBeVisible();
  const leaving = await page.evaluate(() => window.__leaving);
  expect(leaving.stage).toBe('leave');
  expect(leaving.inert).toBe(true);
});

test('there is no calculating state: the result follows the short exit transition', async ({ page }, testInfo) => {
  await openApp(page, testInfo);
  await completeAssessment(page, { industry: 'Technology', revenue: 'Under €5M', mfa: 'No' });
  await expect(page.locator('body')).not.toContainText(/calculating|analy[sz]ing/i);
});
