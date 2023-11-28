import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import dts from 'vite-plugin-dts';
import gzipPlugin from 'rollup-plugin-gzip';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: 'tsconfig.json',
      rollupTypes: true,
      outDir: 'types',
      insertTypesEntry: true,
    }),
    gzipPlugin(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'BeeSoftComponents',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    minify: 'esbuild',
    sourcemap: false,
  },
});
