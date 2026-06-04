import { test, expect } from '@playwright/test';

test.describe('compact mode', () => {
  test.use({ viewport: { width: 320, height: 200 } });

  test('shows timer in compact layout without horizontal overflow', async ({ page }) => {
    await page.goto('/?compact=1');

    await page.getByRole('button', { name: /mehr tarifmitarbeiter/i }).click();
    await page.getByRole('button', { name: /meeting starten/i }).click();

    await expect(page.getByTestId('time-display')).toBeVisible();
    await expect(page.getByTestId('cost-display')).toBeVisible();
    await expect(page.locator('[data-compact="true"]')).toBeVisible();

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth;
    });
    expect(overflow).toBe(false);
  });

  test('accepts view=compact alias', async ({ page }) => {
    await page.goto('/?view=compact');
    await expect(page.getByRole('heading', { name: 'Meeting Cost Timer' })).toBeVisible();
  });
});
