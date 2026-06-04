import { test, expect } from '@playwright/test';

test('full meeting flow shows final cost and worth-it question', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /mehr tarifmitarbeiter/i }).click();
  await page.getByRole('button', { name: /meeting starten/i }).click();

  await expect(page.getByTestId('time-display')).toBeVisible();
  await expect(page.getByTestId('cost-display')).toBeVisible();

  await page.waitForTimeout(2000);

  const stopButton = page.getByRole('button', { name: /^stop$/i });
  await stopButton.click();
  await expect(page.getByText(/erneut stop zum beenden/i)).toBeVisible();
  await stopButton.click();

  await expect(page.getByTestId('ended-worth-it')).toBeVisible();
  await expect(page.getByText(/war es das wert/i)).toBeVisible();
  await expect(page.getByTestId('ended-total-cost')).toBeVisible();

  const costText = await page.getByTestId('ended-total-cost').textContent();
  expect(costText).toMatch(/€/);
});
