/**
 * Generates PWA PNG icons from public/icons/icon-source.svg
 * Run: node scripts/generate-pwa-icons.mjs
 */
import { readFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const iconsDir = path.join(root, 'public', 'icons');
const sourceSvg = readFileSync(path.join(iconsDir, 'icon-source.svg'));

await mkdir(iconsDir, { recursive: true });

const sizes = [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
];

for (const [name, size] of sizes) {
  await sharp(sourceSvg).resize(size, size).png().toFile(path.join(iconsDir, name));
  console.log(`Wrote ${name} (${size}x${size})`);
}

const maskableInner = 410;
const maskableBuffer = await sharp(sourceSvg).resize(maskableInner, maskableInner).png().toBuffer();

await sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: { r: 15, g: 23, b: 42, alpha: 1 },
  },
})
  .composite([{ input: maskableBuffer, gravity: 'center' }])
  .png()
  .toFile(path.join(iconsDir, 'icon-512-maskable.png'));

console.log('Wrote icon-512-maskable.png (512x512, maskable safe zone)');
