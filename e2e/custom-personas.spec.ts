import { test, expect } from '@playwright/test';
import {
  closeSettings,
  finishMeetingWithDoubleStop,
  openSettings,
  gotoApp,
  startMeetingFromTimer,
} from './helpers';

test('custom persona only: DevOps team runs through to ended view', async ({ page }) => {
  await gotoApp(page);

  await openSettings(page);
  await page.getByRole('button', { name: /\+ persona/i }).click();
  await page.getByRole('textbox', { name: /bezeichnung|label/i }).fill('DevOps');
  await page.getByRole('button', { name: /mehr devops/i }).click();
  await page.getByRole('button', { name: /mehr devops/i }).click();
  await page.getByRole('button', { name: /mehr devops/i }).click();
  await closeSettings(page);

  await startMeetingFromTimer(page);

  await expect(
    page.locator('[data-testid="active-participant"][data-participant-label="DevOps"]'),
  ).toHaveText(/3/);

  await page.waitForTimeout(1500);
  await finishMeetingWithDoubleStop(page);
  await expect(page.getByTestId('ended-total-cost')).toHaveText(/€/);
});

test('settings shows alert for custom persona without label', async ({ page }) => {
  await gotoApp(page);
  await openSettings(page);

  await page.getByRole('button', { name: /\+ persona/i }).click();
  await page.getByRole('button', { name: /mehr eigene persona|more custom persona/i }).click();

  await expect(page.getByRole('alert')).toContainText(/bezeichnung|label/i);
  await closeSettings(page);

  await expect(page.getByRole('button', { name: /^start$|^start meeting/i })).toBeDisabled();
});
