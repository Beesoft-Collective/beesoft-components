module.exports = {
  content: ['./src/**/*.html', './src/**/*.jsx', './src/**/*.js', './src/**/*.ts', './src/**/*.tsx'],
  prefix: 'bsc-',
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: {
        1: 'var(--theme-bsc-primary-1)',
        2: 'var(--theme-bsc-primary-2)',
        3: 'var(--theme-bsc-primary-3)',
        4: 'var(--theme-bsc-primary-4)',
        5: 'var(--theme-bsc-primary-5)',
      },
      secondary: {
        1: 'var(--theme-bsc-secondary-1)',
        2: 'var(--theme-bsc-secondary-2)',
        3: 'var(--theme-bsc-secondary-3)',
        4: 'var(--theme-bsc-secondary-4)',
        5: 'var(--theme-bsc-secondary-5)',
      },
      gray: {
        1: 'var(--theme-bsc-gray-1)',
        2: 'var(--theme-bsc-gray-2)',
        3: 'var(--theme-bsc-gray-3)',
        4: 'var(--theme-bsc-gray-4)',
        5: 'var(--theme-bsc-gray-5)',
      },
      mono: {
        dark: {
          1: 'var(--theme-bsc-mono-dark-1)',
          2: 'var(--theme-bsc-mono-dark-2)',
          3: 'var(--theme-bsc-mono-dark-3)',
        },
        light: {
          1: 'var(--theme-bsc-mono-light-1)',
          2: 'var(--theme-bsc-mono-light-2)',
          3: 'var(--theme-bsc-mono-light-3)',
        },
      },
      info: 'var(--theme-bsc-info)',
      success: 'var(--theme-bsc-success)',
      warning: 'var(--theme-bsc-warning)',
      error: 'var(--theme-bsc-error)',
    },
    extend: {},
  },
  plugins: [require('tailwind-children')],
};
