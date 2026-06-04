import { expect, type Page } from '@playwright/test';

/** Opens the app with PiP disabled so E2E can reach the in-page focus overlay. */
export async function gotoApp(page: Page, path = '/') {
  const separator = path.includes('?') ? '&' : '?';
  await page.goto(`${path}${separator}nopip=1`);
}

export function settingsGearButton(page: Page) {
  return page
    .getByTestId('app-toolbar')
    .getByRole('button', { name: /einstellungen öffnen|open settings/i });
}

export async function openSettings(page: Page) {
  await settingsGearButton(page).click();
  await expect(page.getByTestId('settings-view')).toBeVisible();
}

export async function openSettingsViaHintLink(page: Page) {
  await page
    .getByTestId('timer-view')
    .getByRole('button', { name: /^einstellungen$|^settings$/i })
    .click();
  await expect(page.getByTestId('settings-view')).toBeVisible();
}

export async function closeSettings(page: Page) {
  await page.getByRole('button', { name: /zurück zum timer|back to timer/i }).click();
  await expect(page.getByTestId('timer-view')).toBeVisible();
}

export async function addStandardTariffInSettings(page: Page) {
  await openSettings(page);
  await page
    .getByRole('button', {
      name: /mehr tarifmitarbeiter|increase collective agreement staff/i,
    })
    .click();
  await closeSettings(page);
}

export async function startMeetingFromTimer(page: Page) {
  await page.getByRole('button', { name: /^start$|^start meeting/i }).click();
  await expect(page.getByTestId('time-display')).toBeVisible();
}

export async function finishMeetingWithDoubleStop(page: Page) {
  const stopButton = page.getByRole('button', { name: /^stop$/i });
  await stopButton.click();
  await expect(page.getByText(/erneut stop|press stop again/i)).toBeVisible();
  await stopButton.click();
  await expect(page.getByTestId('ended-reflection')).toBeVisible();
}
