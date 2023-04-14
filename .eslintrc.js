module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    // allows for use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },

  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },

  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
  ],
  rules: {
    // eslint specific rule changes.
    'prettier/prettier': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.tsx'],
      },
    ],
    'import/prefer-default-export': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
