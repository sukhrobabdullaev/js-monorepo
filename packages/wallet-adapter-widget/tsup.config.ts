import { defineConfig } from 'tsup'

const globalName = 'NearWalletAdapterWidget'
const friendlyPackageName = 'Wallet Adapter Widget'

// Any packages that are difficult to bundle can be excluded.
// They won't be included in the final output, and you'll have
// to ensure they're provided at runtime (Node or browser).
const externalDeps = [
  // '@fastnear/meteorwallet-sdk',
  // '@here-wallet/core',
  // 'base58-js',
  // 'base64-js',
  // 'borsh',
  // 'bn.js',
  'near-api-js',
]

export default defineConfig([
  // 1) CJS
  {
    entry: ['src/index.ts'],
    outDir: 'dist/cjs',
    format: ['cjs'],
    bundle: false, // no bundling => direct output
    splitting: false,
    external: externalDeps,
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
  // 2) ESM
  {
    entry: ['src/index.ts'],
    outDir: 'dist/esm',
    format: ['esm'],
    bundle: false,
    splitting: false,
    external: externalDeps,
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
  // 3) IIFE/UMD
  {
    entry: {
      browser: 'src/index.ts',
    },
    outDir: 'dist/umd',
    format: ['iife'],
    globalName,
    bundle: true,
    splitting: false,
    // If you remove external here, the libraries above *will* be bundled
    external: externalDeps,
    dts: false,
    sourcemap: true,
    minify: false,
    clean: true,
    keepNames: true,
    banner: {
      js: `/* ⋈ 🏃🏻💨 FastNEAR ${friendlyPackageName} - IIFE/UMD */`,
    },
  },
])
