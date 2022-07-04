import typescript from "rollup-plugin-typescript2";

const name = require("./package.json").main.replace(/\.js$/, "");

const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
  external: (id) => !/^[./]/.test(id)
});

export default [
  bundle({
    plugins: [
      typescript({
        tsconfig: "tsconfig.build.json"
      })
    ],
    output: [
      {
        file: `${name}.js`,
        format: "cjs",
        sourcemap: true
      },
      {
        file: `${name}.mjs`,
        format: "es",
        sourcemap: true
      }
    ]
  })
];
