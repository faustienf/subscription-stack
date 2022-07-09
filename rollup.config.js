import path from 'path';
import glob from 'glob';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const getRollupPluginsConfig = (compilerOptions) => {
  return [
    typescript({
      tsconfig: 'tsconfig.build.json',
      tsconfigOverride: { compilerOptions },
      include: ['./src/**/*']
    }),
    terser({
      ecma: 5,
      module: true,
      toplevel: true,
      compress: { pure_getters: true },
      format: { wrap_func_args: false }
    })
  ];
};

const files = glob
  .sync('./src/*.ts')
  .filter((file) => !file.includes('src/index.ts'));

export default [
  {
    external: ['react'],
    input: 'src/index.ts',
    output: {
      file: 'dist/index.mjs',
      format: 'es'
    },
    plugins: getRollupPluginsConfig({ declaration: true })
  },
  {
    external: ['react'],
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs'
    },
    plugins: getRollupPluginsConfig({ declaration: false })
  },
  ...files.map((input) => ({
    external: ['react'],
    input,
    output: {
      file: `dist/${path.parse(input).name}.mjs`,
      format: 'es'
    },
    plugins: getRollupPluginsConfig({ declaration: false })
  })),
  ...files.map((input) => ({
    external: ['react'],
    input,
    output: {
      file: `dist/${path.parse(input).name}.js`,
      format: 'cjs'
    },
    plugins: getRollupPluginsConfig({ declaration: false })
  }))
];
