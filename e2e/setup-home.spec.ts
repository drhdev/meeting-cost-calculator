import { test, expect } from '@playwright/test';
import {
  closeSettings,
  openSettings,
  openSettingsViaHintLink,
  gotoApp,
  settingsGearButton,
} from './helpers';

test('settings page shows config without model salaries', async ({ page }) => {
  await gotoApp(page);
  await openSettings(page);

  await expect(page.getByRole('heading', { name: 'Einstellungen' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Standard-Personas' })).toBeVisible();
  await expect(page.getByText(/90\.000|90,000/)).not.toBeVisible();
  await expect(page.getByText(/3\.000\.000|3,000,000/)).not.toBeVisible();

  const footer = page.getByRole('note');
  await expect(footer).toContainText(/arbeitstage \(\d+\)/i);
  await expect(footer).toContainText(/keine daten gespeichert/i);

  await closeSettings(page);
  await expect(page.getByTestId('timer-view')).toBeVisible();
});

test('theme toggle visible on timer and settings', async ({ page }) => {
  await gotoApp(page);

  const themeSwitch = page.getByRole('switch');
  await expect(themeSwitch).toBeVisible();

  await openSettings(page);
  await expect(themeSwitch).toBeVisible();

  await closeSettings(page);
});

test('compact timer home remains usable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await gotoApp(page, '/?compact=1');

  await expect(page.getByTestId('timer-view')).toHaveAttribute('data-compact', 'true');
  await expect(settingsGearButton(page)).toBeVisible();
});

test('settings hint link opens settings from timer', async ({ page }) => {
  await gotoApp(page);

  await openSettingsViaHintLink(page);
  await expect(page.getByRole('heading', { name: 'Einstellungen' })).toBeVisible();

  await closeSettings(page);
  await expect(page.getByTestId('timer-view')).toBeVisible();
});
