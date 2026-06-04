import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(cmd, args) {
  const result = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', shell: false });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('node', ['scripts/verify-pwa-build.mjs']);
run('node', ['scripts/verify-bundle-size.mjs']);
console.log('Production verification passed.');
