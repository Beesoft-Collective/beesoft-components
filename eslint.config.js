import storybook from "eslint-plugin-storybook";
import js from "@eslint/js";
import globals from "globals";
import tsEslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import wrap from '@seahax/eslint-plugin-wrap';

export default defineConfig([
  wrap.config({
    maxLen: 120,
    tabWidth: 2,
    autoFix: true,
    severity: 'warn',
  }),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      js,
      '@stylistic': stylistic,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      storybook,
    },
    extends: ["js/recommended"],
    rules: {
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/array-bracket-spacing': ['warn', 'never'],
      '@stylistic/max-len': ['warn', { code: 120, tabWidth: 2, ignoreComments: true }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/jsx-filename-extension': [
        1,
        {
          extensions: ['.tsx'],
        },
      ],
    },
  },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
  tsEslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      'react/react-in-jsx-scope': 'off',
    }
  },
]);
