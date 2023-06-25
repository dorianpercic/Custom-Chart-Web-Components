import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: ['src/easycharts.mts'],
    output: {
      dir: 'dist/linechart/esm',
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
      dir: 'dist/barchart/esm',
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
