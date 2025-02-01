import { defineConfig } from 'tsup'
/* @ts-ignore */
// we'll get this package's name and version for the banner
import pkg from './package.json'

const globalName = 'NearWalletAdapterWidget'
const friendlyPackageName = 'Wallet Adapter Widget'

const externalDeps = [
  'near-api-js',
]

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
      js: `/* ⋈ 🏃🏻💨 FastNEAR ${friendlyPackageName} - CJS (${pkg.name} version ${pkg.version}) */\n` +
        `/* https://www.npmjs.com/package/${pkg.name}/v/${pkg.version} */`,
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
      js: `/* ⋈ 🏃🏻💨 FastNEAR ${friendlyPackageName} - ESM (${pkg.name} version ${pkg.version}) */\n` +
        `/* https://www.npmjs.com/package/${pkg.name}/v/${pkg.version} */`,
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
    external: externalDeps,
    dts: false,
    sourcemap: true,
    minify: false,
    clean: true,
    keepNames: true,
    banner: {
      js: `/* ⋈ 🏃🏻💨 FastNEAR ${friendlyPackageName} - IIFE/UMD (${pkg.name} version ${pkg.version}) */\n` +
        `/* https://www.npmjs.com/package/${pkg.name}/v/${pkg.version} */`,
    },
    footer: {
      js: footerRedefiningGlobal,
    }
  },
])
