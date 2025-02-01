import { defineConfig } from 'tsup'

const globalName = 'NearBorshSchema'
const friendlyPackageName = 'Borsh Schema'

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
  {
    entry: ['src/index.ts'],
    outDir: 'dist/cjs',
    format: ['cjs'],
    splitting: false,
    bundle: false,
    dts: {
      resolve: true,
      entry: 'src/index.ts',
    },
    sourcemap: true,
    minify: false,
    clean: true,
    keepNames: true,
    banner: {
      js: `/* ⋈ 🏃🏻💨 FastNEAR ${friendlyPackageName} - CJS */`,
    },
  },
  {
    entry: ['src/index.ts'],
    outDir: 'dist/esm',
    format: ['esm'],
    splitting: false,
    bundle: false,
    dts: {
      resolve: true,
      entry: 'src/index.ts',
    },
    sourcemap: true,
    minify: false,
    clean: true,
    keepNames: true,
    banner: {
      js: `/* ⋈ 🏃🏻💨 FastNEAR ${friendlyPackageName} - ESM */`,
    },
  },
  {
    entry: {
      browser: 'src/index.ts',
    },
    outDir: 'dist/umd',
    format: ['iife'],
    globalName,
    sourcemap: true,
    minify: false,
    splitting: false,
    bundle: true,
    dts: false,
    clean: true,
    keepNames: true,
    banner: {
      js: `/* ⋈ 🏃🏻💨 FastNEAR ${friendlyPackageName} - IIFE/UMD */`,
    },
    footer: {
      js: footerRedefiningGlobal
    }
  },
])
