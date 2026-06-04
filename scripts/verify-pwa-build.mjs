import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const required = ['manifest.webmanifest', 'sw.js', 'index.html', 'icons/icon-192.png', 'icons/icon-512.png'];

for (const file of required) {
  const full = path.join(dist, file);
  await access(full);
  console.log(`OK ${file}`);
}

const manifest = JSON.parse(
  await (await import('node:fs')).promises.readFile(path.join(dist, 'manifest.webmanifest'), 'utf8'),
);

if (!manifest.icons?.length) {
  throw new Error('manifest.webmanifest has no icons');
}

console.log(`Manifest: ${manifest.name} (${manifest.icons.length} icons)`);
