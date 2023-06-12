import typescript from "rollup-plugin-typescript2";

export default [
  {
    input: ["src/linechart.ts"],
    output: {
      dir: "dist/linechart/esm",
      format: "esm",
    },

    plugins: [
      typescript(), // Add the resolve plugin
    ],
  },
  {
    input: ["src/barchart.ts"],
    output: {
      dir: "dist/barchart/esm",
      format: "esm",
    },

    plugins: [
      typescript(), // Add the resolve plugin
    ],
  },
];
