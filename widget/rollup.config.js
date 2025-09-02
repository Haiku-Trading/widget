import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
      entryFileNames: 'index.esm.js',
      chunkFileNames: '[name]-[hash].js',
      assetFileNames: '[name].[ext]',
    },
    external: ['react', 'react-dom'],
    inlineDynamicImports: true,
    plugins: [
      resolve(),
      commonjs(),
      json(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss({
        extract: 'styles.css',
        minimize: true,
        plugins: [
          tailwindcss,
          autoprefixer,
        ],
        include: '**/*.css',
      }),
      terser(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    external: ['react', 'react-dom'],
    plugins: [dts()],
  },
];
