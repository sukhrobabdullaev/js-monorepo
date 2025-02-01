import { defineConfig } from 'tsup'
/* @ts-ignore */
// we'll get this package's name and version for the banner
import pkg from './package.json'

const globalName = 'near'

// Aids in certain guards on the global's mutability
const footerRedefiningGlobal = `
Object.defineProperty(globalThis, '${globalName}', {
  value: ${globalName},
  writable: false,
  enumerable: true,
  configurable: false,
});
`

export default defineConfig([
  // 1) CommonJS (CJS) build (unbundled)
  {
    entry: ['src/index.ts'],
    outDir: 'dist/cjs',
    format: ['cjs'],
    bundle: false,
    splitting: false,
    clean: true,
    keepNames: true,
    dts: {
      resolve: true,
      entry: 'src/index.ts',
    },
    sourcemap: true,
    minify: false,
    banner: {
      js: `/* ⋈ 🏃🏻💨 FastNEAR API - CJS (${pkg.name} version ${pkg.version}) */\n` +
        `/* https://www.npmjs.com/package/${pkg.name}/v/${pkg.version} */`,
    },
  },

  // 2) ESM build (unbundled)
  {
    entry: ['src/index.ts'],
    outDir: 'dist/esm',
    format: ['esm'],
    bundle: false,
    splitting: false,
    clean: true,
    keepNames: true,
    dts: {
      resolve: true,
      entry: 'src/index.ts',
    },
    sourcemap: true,
    minify: false,
    banner: {
      js: `/* ⋈ 🏃🏻💨 FastNEAR API - ESM (${pkg.name} version ${pkg.version}) */\n` +
        `/* https://www.npmjs.com/package/${pkg.name}/v/${pkg.version} */`,
    },
  },

  // 3) IIFE/UMD build with minimal SES lockdown & hardened globalThis.near
  {
    entry: {
      browser: 'src/index.ts',
    },
    outDir: 'dist/umd',
    format: ['iife'],
    globalName,
    bundle: true,
    splitting: false,
    clean: true,
    keepNames: true,
    dts: false,
    sourcemap: true,
    minify: false,
    platform: 'browser',
    banner: {
      js: `/* ⋈ 🏃🏻💨 FastNEAR API - IIFE/UMD (${pkg.name} version ${pkg.version}) */\n` +
        `/* https://www.npmjs.com/package/${pkg.name}/v/${pkg.version} */`,
    },
    footer: {
      js: footerRedefiningGlobal,
    }
  },
])
