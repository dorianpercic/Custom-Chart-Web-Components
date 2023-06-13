import typescript from 'rollup-plugin-typescript2';
import path from 'path';

export default [
  {
    input: [path.join('src', 'easycharts.ts')],
    output: {
      dir: path.join('dist', 'linechart', 'esm'),
      format: 'esm',
    },
    plugins: [typescript()],
  },
  {
    input: [path.join('src', 'easycharts.ts')],
    output: {
      dir: path.join('dist', 'barchart', 'esm'),
      format: 'esm',
    },
    plugins: [typescript()],
  },
];
