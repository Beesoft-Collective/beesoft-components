/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require('path');

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss')('./tailwind.config.js'), require('autoprefixer')],
    },
  },
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    library: 'react-component-library',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: require.resolve('ts-loader'),
          },
        ],
      },
    ],
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
};
