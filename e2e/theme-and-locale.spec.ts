import { test, expect } from '@playwright/test';
import { gotoApp, openSettings, startMeetingFromTimer } from './helpers';

test('theme toggle switches light and dark on document', async ({ page }) => {
  await gotoApp(page);

  const themeSwitch = page.getByRole('switch');
  const html = page.locator('html');
  const initiallyDark = await html.evaluate((el) => el.classList.contains('dark'));

  if (initiallyDark) {
    await themeSwitch.click();
    await expect(html).not.toHaveClass('dark');
    await themeSwitch.click();
    await expect(html).toHaveClass('dark');
  } else {
    await themeSwitch.click();
    await expect(html).toHaveClass('dark');
    await themeSwitch.click();
    await expect(html).not.toHaveClass('dark');
  }
});

test('english locale updates timer and settings labels', async ({ page }) => {
  await gotoApp(page);

  await openSettings(page);
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.getByText('Standard personas')).toBeVisible();

  await page
    .getByRole('button', { name: /increase collective agreement staff/i })
    .click();
  await page.getByRole('button', { name: /back to timer/i }).click();

  await startMeetingFromTimer(page);
  await expect(page.getByText('Elapsed time')).toBeVisible();
  await expect(page.getByRole('button', { name: /^pause$/i })).toBeVisible();
});
