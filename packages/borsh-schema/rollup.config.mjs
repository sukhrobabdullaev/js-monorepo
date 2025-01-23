import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/fastnear-borsh-schema.umd.js',
    format: 'umd',
    name: 'FastNearBorshSchema',
    sourcemap: true,
    banner: `/*!
      * FastNEAR
      * 🏃🏻💨 Borsh Schema
      * MIT license
      */`,
  },
  plugins: [
    typescript({
      tsconfig: false,
      module: 'esnext',
      declaration: true,
      declarationDir: 'dist/types',
    }),
    resolve({
      browser: true,
      preferBuiltins: false,
      mainFields: ['browser', 'module', 'main'],
    }),
    commonjs({
      include: /node_modules/,
      transformMixedEsModules: true,
      requireReturnsDefault: 'auto',
    }),
  ]
};
