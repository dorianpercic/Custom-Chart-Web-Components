import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: ['src/easycharts.ts'],
    output: {
      dir: 'dist/linechart/esm',
      format: 'esm',
    },
    plugins: [resolve(), typescript()],
  },
  {
    input: ['src/easycharts.ts'],
    output: {
      dir: 'dist/barchart/esm',
      format: 'esm',
    },
    plugins: [
      resolve(), // Resolves node_modules dependencies
      typescript(), // Transpile TypeScript to JavaScript
    ],
  },
];
