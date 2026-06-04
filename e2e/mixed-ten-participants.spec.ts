import { test, expect } from '@playwright/test';
import {
  closeSettings,
  finishMeetingWithDoubleStop,
  gotoApp,
  openSettings,
  startMeetingFromTimer,
} from './helpers';

test('10 mixed participants: focus view, ticking cost, pause, end', async ({ page }) => {
  await gotoApp(page);
  await openSettings(page);

  const standard: { pattern: RegExp; count: number }[] = [
    { pattern: /mehr tarifmitarbeiter/i, count: 3 },
    { pattern: /mehr außertarifliche mitarbeiter/i, count: 2 },
    { pattern: /mehr leitende angestellte/i, count: 2 },
    { pattern: /mehr vorstände/i, count: 1 },
  ];

  for (const { pattern, count } of standard) {
    const btn = page.getByRole('button', { name: pattern });
    for (let i = 0; i < count; i++) {
      await btn.click();
    }
  }

  await page.getByRole('button', { name: /\+ persona/i }).click();
  await page.getByRole('button', { name: /\+ persona/i }).click();

  const customCards = page.locator('[data-testid^="custom-persona-"]');
  await customCards.nth(0).getByPlaceholder(/devops|z\. b\./i).fill('DevOps');
  await customCards.nth(1).getByPlaceholder(/devops|z\. b\./i).fill('Product Owner');
  await customCards.nth(0).locator('input[type="number"]').fill('72000');
  await customCards.nth(1).locator('input[type="number"]').fill('95000');

  await customCards
    .nth(0)
    .getByRole('button', { name: /mehr devops/i })
    .click();
  await customCards
    .nth(1)
    .getByRole('button', { name: /mehr product owner/i })
    .click();

  await page.getByRole('button', { name: /^1\s*€$/i }).click();

  await closeSettings(page);

  const chips = page.getByTestId('active-participant');
  await expect(chips).toHaveCount(6);
  await expect(chips.filter({ hasText: /tarifmitarbeiter/i })).toHaveText(/3×/);
  await expect(chips.filter({ hasText: /devops/i })).toHaveText(/1×/);

  await startMeetingFromTimer(page);
  await expect(page.getByTestId('focus-overlay')).toBeVisible();

  const timeBefore = await page.getByTestId('time-display').textContent();
  await page.waitForTimeout(3000);
  const timeAfter = await page.getByTestId('time-display').textContent();
  expect(timeBefore).not.toBe(timeAfter);

  const cost = await page.getByTestId('cost-display').textContent();
  expect(cost).not.toMatch(/^0,00\s*€$/);

  await page.getByRole('button', { name: /^pause$/i }).click();
  await expect(page.getByText(/pausiert/i)).toBeVisible();
  await page.getByRole('button', { name: /fortsetzen/i }).click();
  await page.waitForTimeout(1200);

  await finishMeetingWithDoubleStop(page);
  const total = await page.getByTestId('ended-total-cost').textContent();
  expect(total).toMatch(/€/);
  expect(total).not.toMatch(/^0,00\s*€$/);
});
