import { defineConfig } from 'tsup'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import pkg from './package.json'

const globalName = 'NearWalletAdapterWidget'
const friendlyPackageName = 'Wallet Adapter Widget'

// CJS build: keep these external
const nodeExternals = [
  'near-api-js',
  '@here-wallet/core',
  '@fastnear/utils'
]

// Reusable banners
const bannerCJS = `/* ⋈ 🏃🏻💨 FastNEAR ${friendlyPackageName} - CJS (${pkg.name} v${pkg.version}) */\n`
  + `/* https://www.npmjs.com/package/${pkg.name}/v/${pkg.version} */`
const bannerESM = `/* ⋈ 🏃🏻💨 FastNEAR ${friendlyPackageName} - ESM (${pkg.name} v${pkg.version}) */\n`
  + `/* https://www.npmjs.com/package/${pkg.name}/v/${pkg.version} */`
const bannerIIFE = `/* ⋈ 🏃🏻💨 FastNEAR ${friendlyPackageName} - IIFE (${pkg.name} v${pkg.version}) */\n`
  + `/* https://www.npmjs.com/package/${pkg.name}/v/${pkg.version} */`

// Lock down the globalName in IIFE
const footerRedefiningGlobal = `
Object.defineProperty(globalThis, '${globalName}', {
  value: ${globalName},
  enumerable: true,
  configurable: false,
});
`

// for esm and iife
const noExternal = [
  'near-api-js',
  '@here-wallet/core',
  '@fastnear/utils',
  'base58-js',
  'borsh',
  '@fastnear/meteorwallet-sdk',
  'bn.js'
];

export default defineConfig([
  // 1) CJS build for Node usage
  {
    entry: ['src/**/*.ts'],
    outDir: 'dist/cjs',
    format: ['cjs'],
    bundle: false,
    splitting: false,
    external: nodeExternals,
    dts: {
      resolve: true,
      entry: 'src/index.ts',
    },
    sourcemap: true,
    clean: true,
    keepNames: true,
    banner: { js: bannerCJS },
  },

  // 2) ESM build (fully bundled for browser)
  {
    entry: ['src/**/*.ts'],
    outDir: 'dist/esm',
    format: ['esm'],
    shims: true,
    bundle: true,
    splitting: false,
    platform: 'browser',
    noExternal,
    esbuildPlugins: [
      NodeModulesPolyfillPlugin(),
      NodeGlobalsPolyfillPlugin({ process: true, buffer: true }),
    ],
    dts: { entry: 'src/index.ts' },
    sourcemap: true,
    clean: true,
    keepNames: true,
    banner: { js: bannerESM },
  },

  // 3) IIFE/UMD build (fully bundled for browser)
  {
    entry: { browser: 'src/index.ts' },
    outDir: 'dist/umd',
    format: ['iife'],
    globalName,
    bundle: true,
    splitting: false,
    platform: 'browser',
    noExternal,
    esbuildPlugins: [
      NodeModulesPolyfillPlugin(),
      NodeGlobalsPolyfillPlugin({ process: true, buffer: true }),
    ],
    dts: false,
    sourcemap: true,
    clean: true,
    keepNames: true,
    banner: { js: bannerIIFE },
    footer: { js: footerRedefiningGlobal },
  },
])
