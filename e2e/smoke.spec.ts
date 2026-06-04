import { test, expect } from '@playwright/test';

test('loads placeholder home page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Meeting Cost Timer' })).toBeVisible();
  await expect(page.getByText('Meeting starten')).toBeVisible();
});
