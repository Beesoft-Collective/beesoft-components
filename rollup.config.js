/* eslint @typescript-eslint/no-var-requires: "off" */
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'build/index.es.js',
        sourcemap: true,
      },
      {
        file: 'build/index.es.min.js',
        sourcemap: false,
        plugins: [terser()],
      },
    ],
    external: ['react', 'react-dom'],
    plugins: [peerDepsExternal(), resolve(), commonjs(), typescript({ useTsconfigDeclarationDir: true }), postcss()],
  },
];

export default config;
