import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: ['src/easycharts.mts'],
    output: {
      dir: 'dist',
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
