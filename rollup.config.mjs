import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';
import gzipPlugin from 'rollup-plugin-gzip';

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'build/index.js',
        sourcemap: false,
      },
      {
        file: 'build/index.min.js',
        sourcemap: false,
        plugins: [terser(), gzipPlugin()],
      },
      {
        file: 'build/index.cjs.js',
        sourcemap: false,
        format: 'cjs',
      },
    ],
    external: ['react', 'react-dom'],
    plugins: [peerDepsExternal(), resolve(), commonjs(), typescript(), postcss()],
  },
];

export default config;
