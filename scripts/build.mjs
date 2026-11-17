import { build as viteBuild } from 'vite';
import { build as esbuild } from 'esbuild';
import preact from '@preact/preset-vite';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { execFileSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');
const shouldZip = process.argv.includes('--zip');

rmSync(dist, { recursive: true, force: true });
mkdirSync(resolve(dist, 'content'), { recursive: true });
mkdirSync(resolve(dist, 'background'), { recursive: true });

// 1. Build Preact UI surfaces (popup, sidepanel, options) via Vite
for (const surface of ['popup', 'sidepanel', 'options']) {
  const entry = resolve(root, 'src', surface, 'index.html');
  if (!existsSync(entry)) continue;
  await viteBuild({
    configFile: false,
    plugins: [preact()],
    root: resolve(root, 'src', surface),
    base: './',
    build: {
      outDir: resolve(dist, surface),
      emptyOutDir: true,
      rollupOptions: { input: entry }
    }
  });
}

// 2. Bundle self-contained MV3 scripts (background + ISOLATED + MAIN)
await Promise.all([
  esbuild({
    entryPoints: [resolve(root, 'src/background/service-worker.ts')],
    bundle: true,
    minify: true,
    format: 'iife',
    target: 'chrome120',
    outfile: resolve(dist, 'background/service-worker.js')
  }),
  esbuild({
    entryPoints: [resolve(root, 'src/content/bridge.ts')],
    bundle: true,
    minify: true,
    format: 'iife',
    target: 'chrome120',
    outfile: resolve(dist, 'content/bridge.js')
  }),
  esbuild({
    entryPoints: [resolve(root, 'src/content/main.ts')],
    bundle: true,
    minify: true,
    format: 'iife',
    target: 'chrome120',
    outfile: resolve(dist, 'content/main.js')
  })
]);

// 3. Copy manifest and static assets
cpSync(resolve(root, 'public/manifest.json'), resolve(dist, 'manifest.json'));
for (const directory of ['icons', 'audio', 'assets']) {
  const srcDir = resolve(root, 'public', directory);
  if (existsSync(srcDir)) {
    cpSync(srcDir, resolve(dist, directory), { recursive: true });
  }
}

if (shouldZip) {
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  const zipName = `geofs-extension-v${pkg.version}.zip`;
  const releaseDir = resolve(root, 'release');
  mkdirSync(releaseDir, { recursive: true });
  const zipPath = resolve(releaseDir, zipName);
  rmSync(zipPath, { force: true });
  execFileSync('zip', ['-r', '-q', zipPath, '.'], { cwd: dist });
  console.log(`[build] Packaged release/${zipName}`);
}

console.log('[build] GeoFS Extension dist/ built successfully.');
