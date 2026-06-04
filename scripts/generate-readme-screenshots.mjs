/**
 * Generates README screenshots (English UI).
 * Run: npm run build && npm run preview -- --port 4173 & node scripts/generate-readme-screenshots.mjs
 */
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, '..', 'docs', 'images');
const base = process.env.MCC_SCREENSHOT_URL ?? 'http://127.0.0.1:4173';

async function setupTenParticipants(page) {
  await page.goto(`${base}/?nopip=1`);
  await page
    .getByTestId('app-toolbar')
    .getByRole('button', { name: /einstellungen öffnen|open settings/i })
    .click();
  await page.getByRole('button', { name: 'EN', exact: true }).click();

  const standard = [
    [/increase collective agreement staff/i, 3],
    [/increase non-tariff staff/i, 2],
    [/increase executives/i, 2],
    [/increase board members/i, 1],
  ];
  for (const [pattern, count] of standard) {
    const btn = page.getByRole('button', { name: pattern });
    for (let i = 0; i < count; i++) await btn.click();
  }

  await page.getByRole('button', { name: /\+ persona/i }).click();
  await page.getByRole('button', { name: /\+ persona/i }).click();
  const cards = page.locator('[data-testid^="custom-persona-"]');
  await cards.nth(0).getByPlaceholder(/e\.g\. devops/i).fill('DevOps');
  await cards.nth(1).getByPlaceholder(/e\.g\. devops/i).fill('Product Owner');
  await cards.nth(0).locator('input[type="number"]').fill('72000');
  await cards.nth(1).locator('input[type="number"]').fill('95000');
  await cards.nth(0).getByRole('button', { name: /increase devops/i }).click();
  await cards.nth(1).getByRole('button', { name: /increase product owner/i }).click();
  await page.getByRole('button', { name: /^€10$/ }).click();
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 420, height: 720 } });

  await setupTenParticipants(page);
  await page.screenshot({
    path: path.join(outDir, 'settings-en.png'),
    fullPage: true,
  });

  await page.getByRole('button', { name: /zurück zum timer|back to timer/i }).click();
  await page.getByRole('button', { name: /^start$/i }).click();
  await page.waitForSelector('[data-testid="focus-overlay"]');

  await page.evaluate(() => {
    const time = document.querySelector('[data-testid="time-display"]');
    const cost = document.querySelector('[data-testid="cost-display"]');
    if (time) time.textContent = '00:32:15';
    if (cost) cost.textContent = '€1,290.00';
  });

  const overlay = page.getByTestId('focus-overlay');
  await overlay.screenshot({ path: path.join(outDir, 'timer-focus-32min-en.png') });

  await browser.close();
  console.log('Wrote docs/images/settings-en.png and docs/images/timer-focus-32min-en.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
