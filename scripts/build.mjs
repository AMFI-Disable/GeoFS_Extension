import { build as viteBuild } from 'vite';
import { build as esbuild } from 'esbuild';
import { cpSync, mkdirSync, rmSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(resolve(dist, 'content'), { recursive: true });

// 1. Build Preact popup UI via Vite
await viteBuild({ configFile: resolve(root, 'vite.config.ts') });

// 2. Bundle self-contained MV3 content scripts (ISOLATED + MAIN)
await Promise.all([
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

// 3. Copy manifest & static assets
cpSync(resolve(root, 'public/manifest.json'), resolve(dist, 'manifest.json'));
console.log('[build] GeoFS Extension dist/ built successfully.');
