import { defineConfig } from 'tsup'

const globalName = 'near'

// Aids in certain guards on the global's mutability
const footerRedefiningGlobal = `
if (typeof globalThis.${globalName} === 'undefined') {
  console.warn('No globalThis.${globalName}');
} else {
  Object.defineProperty(globalThis, '${globalName}', {
    value: globalThis.${globalName},
    writable: false,
    enumerable: true,
    configurable: false,
  });
}
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
      js: `/* ⋈ 🏃🏻💨 FastNEAR API - CJS */`,
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
      js: `/* ⋈ 🏃🏻💨 FastNEAR API - ESM */`,
    },
  },

  // 3) IIFE/UMD build with minimal SES lockdown & hardened globalThis.near
  {
    entry: {
      browser: 'src/index.ts',
    },
    outDir: 'dist/umd',
    format: ['iife'],
    globalName,    // This assigns your library to globalThis.near
    bundle: true,  // We typically bundle the IIFE for the browser
    splitting: false,
    clean: true,
    keepNames: true,
    dts: false,
    sourcemap: true,
    minify: false,
    platform: 'browser',
    banner: {
      js: `/* ⋈ 🏃🏻💨 FastNEAR API - IIFE/UMD */`,
    },
    footer: {
      js: footerRedefiningGlobal,
    }
  },
])
