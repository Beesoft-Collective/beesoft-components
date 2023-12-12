/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  prefix: 'bsc-',
  darkMode: 'class', // or 'media' or 'class'
  corePlugins: {
    // due to https://github.com/tailwindlabs/tailwindcss/issues/6602 - buttons disappear
    preflight: false,
  },
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: 'white',
      black: 'black',
      primary: {
        1: 'var(--theme-bsc-primary-1)',
        2: 'var(--theme-bsc-primary-2)',
        3: 'var(--theme-bsc-primary-3)',
        4: 'var(--theme-bsc-primary-4)',
        5: 'var(--theme-bsc-primary-5)',
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
  plugins: [],
};
