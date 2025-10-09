/* eslint-env node */
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const tanstackQuery = require('@tanstack/eslint-plugin-query');

module.exports = defineConfig([
  expoConfig,

  // TanStack Query plugin config
  {
    plugins: {
      '@tanstack/query': tanstackQuery,
    },
    rules: {
      ...tanstackQuery.configs.recommended.rules,
    },
  },

  // Custom project-level settings
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      'react/display-name': 'off',
    },
  },
]);
