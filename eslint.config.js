import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/',
      'public/',
      'node_modules/',
      'src/films.js',
      'playwright-report/',
      'test-results/',
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['src/sw-template.js'],
    languageOptions: { globals: globals.serviceworker },
  },
  {
    files: [
      'vite.config.js',
      'vitest.config.js',
      'playwright.config.js',
      'eslint.config.js',
      'scripts/**/*.mjs',
      'tests/**/*.js',
    ],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];
