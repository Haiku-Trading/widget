import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';
import url from '@rollup/plugin-url';
import replace from '@rollup/plugin-replace';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';

// Load environment configuration
const envFile = isDev ? 'env.development.json' : 'env.production.json';
const envPath = join(__dirname, envFile);
const envConfig = JSON.parse(readFileSync(envPath, 'utf8'));

export default [
  {
    input: 'src/styles.css',
    output: {
      file: 'dist/styles.css',
    },
    plugins: [
      postcss({
        extract: true,
        minimize: !isDev,
        plugins: [
          tailwindcss,
          autoprefixer,
        ],
      }),
    ],
  },
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
    external: [
      'react', 
      'react-dom', 
      'wagmi',
      'viem',
      '@tanstack/react-query',
      '@wagmi/core',
      '@ark-ui/react',
      'match-sorter',
      '@radix-ui/react-use-controllable-state',
      'react-text-mask',
      'text-mask-addons/dist/createNumberMask',
      'ethers5'
    ],
    onwarn(warning, warn) {
      // Suppress "use client" directive warnings
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
        return;
      }
      
      // Suppress warnings from node_modules
      if (warning.id && warning.id.includes('node_modules')) {
        return;
      }
      
      // Suppress circular dependency warnings
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return;
      }
      
      // Suppress node-resolve plugin warnings about preferring built-ins
      if (warning.plugin === 'node-resolve' && warning.message.includes('preferring built-in module')) {
        return;
      }
      
      // Use default warning for everything else
      warn(warning);
    },
    plugins: [
      replace({
        preventAssignment: true,
        values: Object.fromEntries(
          Object.entries(envConfig).map(([key, value]) => [
            `process.env.${key}`,
            JSON.stringify(value)
          ])
        ),
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs({
        include: /node_modules/,
        transformMixedEsModules: true,
      }),
      json(),
      url({
        include: ['**/*.svg'],
        limit: 0, // Inline all SVGs
        fileName: '[name][extname]',
      }),
      typescript({ 
        tsconfig: './tsconfig.json',
        sourceMap: true,
        inlineSources: true,
      }),
      // Only use terser in production
      ...(isDev ? [] : [terser({ sourceMap: true })]),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    external: [
      'react', 
      'react-dom', 
      'wagmi',
      'viem',
      '@tanstack/react-query',
      '@wagmi/core',
      '@ark-ui/react',
      'match-sorter',
      '@radix-ui/react-use-controllable-state',
      'react-text-mask',
      'text-mask-addons/dist/createNumberMask',
      'ethers5'
    ],
    plugins: [dts()],
  },
];
