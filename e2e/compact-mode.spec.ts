import { test, expect } from '@playwright/test';
import { addStandardTariffInSettings, gotoApp, startMeetingFromTimer } from './helpers';

test.describe('compact mode', () => {
  test.use({ viewport: { width: 320, height: 200 } });

  test('shows timer in compact layout without horizontal overflow', async ({ page }) => {
    await gotoApp(page, '/?compact=1');

    await addStandardTariffInSettings(page);
    await startMeetingFromTimer(page);

    await expect(page.getByTestId('focus-overlay')).toBeVisible();
    await expect(page.getByTestId('time-display')).toBeVisible();
    await expect(page.getByTestId('cost-display')).toBeVisible();
    await expect(page.getByTestId('timer-view')).toHaveAttribute('data-focus', 'true');

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth;
    });
    expect(overflow).toBe(false);
  });

  test('accepts view=compact alias on timer home', async ({ page }) => {
    await gotoApp(page, '/?view=compact');
    await expect(page.getByTestId('timer-view')).toBeVisible();
  });
});
