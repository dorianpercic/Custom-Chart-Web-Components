import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: ['src/easycharts.ts'],
    output: {
      dir: 'dist/linechart/esm',
      format: 'esm',
    },
    plugins: [typescript()],
  },
  {
    input: ['src/easycharts.ts'],
    output: {
      dir: 'dist/barchart/esm',
      format: 'esm',
    },
    plugins: [typescript()],
  },
];
