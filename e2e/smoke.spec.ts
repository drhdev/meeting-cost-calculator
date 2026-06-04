import { test, expect } from '@playwright/test';
import { gotoApp, settingsGearButton } from './helpers';

test('loads timer home with controls and settings entry', async ({ page }) => {
  await gotoApp(page);

  await expect(page.getByTestId('timer-view')).toBeVisible();
  await expect(page.getByTestId('time-display')).toBeVisible();
  await expect(page.getByRole('button', { name: /^start$|^start meeting/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^pause$/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /^stop$/i })).toBeVisible();
  await expect(settingsGearButton(page)).toBeVisible();
  await expect(page.getByRole('switch')).toBeVisible();
});
