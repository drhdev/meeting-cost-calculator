import { test, expect } from '@playwright/test';
import { addStandardTariffInSettings, gotoApp, startMeetingFromTimer } from './helpers';

test('pause freezes elapsed time until resume', async ({ page }) => {
  await gotoApp(page);
  await addStandardTariffInSettings(page);
  await startMeetingFromTimer(page);

  await page.waitForTimeout(1200);

  await page.getByRole('button', { name: /^pause$/i }).click();
  await expect(page.getByRole('button', { name: /^pause$/i })).toBeDisabled();
  await expect(page.getByRole('button', { name: /fortsetzen|resume/i })).toBeEnabled();

  const frozen = await page.getByTestId('time-display').textContent();
  await page.waitForTimeout(800);
  await expect(page.getByTestId('time-display')).toHaveText(frozen ?? '');

  await page.getByRole('button', { name: /fortsetzen|resume/i }).click();
  await expect(page.getByRole('button', { name: /^pause$/i })).toBeEnabled();
  await page.waitForTimeout(1500);

  const afterResume = await page.getByTestId('time-display').textContent();
  const toSeconds = (value: string | null) => {
    const parts = (value ?? '00:00:00').split(':').map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  };
  expect(toSeconds(afterResume)).toBeGreaterThan(toSeconds(frozen));
});
