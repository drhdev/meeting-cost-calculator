import { test, expect } from '@playwright/test';
import {
  addStandardTariffInSettings,
  finishMeetingWithDoubleStop,
  gotoApp,
  startMeetingFromTimer,
} from './helpers';

test('full meeting flow shows final cost and reflection questions', async ({ page }) => {
  await gotoApp(page);

  await addStandardTariffInSettings(page);
  await startMeetingFromTimer(page);

  await expect(page.getByTestId('focus-overlay')).toBeVisible();
  await expect(page.getByTestId('timer-view')).toHaveAttribute('data-focus', 'true');
  await expect(page.getByTestId('cost-display')).toBeVisible();
  await page.waitForTimeout(2000);

  await finishMeetingWithDoubleStop(page);

  await expect(page.getByTestId('focus-overlay')).not.toBeVisible();
  await expect(page.getByText(/ziele des meetings|meeting goals/i)).toBeVisible();
  await expect(page.getByText(/mehrwert|value > cost/i)).toBeVisible();
  await expect(page.getByTestId('ended-total-cost')).toHaveText(/€/);
});
