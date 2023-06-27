import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: ['src/easycharts.mts'],
    output: {
      dir: 'dist/linechart',
      format: 'esm',
    },
    plugins: [
      resolve(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
  },
  {
    input: ['src/easycharts.mts'],
    output: {
      dir: 'dist/barchart',
      format: 'esm',
    },
    plugins: [
      resolve(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
  },
  {
    input: ['src/easycharts.mts'],
    output: {
      dir: 'dist/multilinechart',
      format: 'esm',
    },
    plugins: [
      resolve(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
  },
];
