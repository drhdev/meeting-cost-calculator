import { readFile, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_JS_GZIP_KB = 150;
const distAssets = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'assets');

async function gzipSize(filePath) {
  const raw = await readFile(filePath);
  return gzipSync(raw).length;
}

const files = await readdir(distAssets);
const jsFiles = files.filter((f) => f.startsWith('index-') && f.endsWith('.js') && !f.includes('workbox'));

if (jsFiles.length === 0) {
  throw new Error('No main JS bundle found in dist/assets');
}

let totalGzip = 0;
for (const file of jsFiles) {
  const full = path.join(distAssets, file);
  const gz = await gzipSize(full);
  totalGzip += gz;
  console.log(`${file}: ${(gz / 1024).toFixed(1)} KB gzip`);
}

const totalKb = totalGzip / 1024;
console.log(`Total main JS gzip: ${totalKb.toFixed(1)} KB (limit ${MAX_JS_GZIP_KB} KB)`);

if (totalKb > MAX_JS_GZIP_KB) {
  throw new Error(`Bundle exceeds ${MAX_JS_GZIP_KB} KB gzip limit`);
}
