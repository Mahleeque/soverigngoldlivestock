const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        Buffer: 'readonly',
        console: 'readonly',
        describe: 'readonly',
        expect: 'readonly',
        fetch: 'readonly',
        it: 'readonly',
        jest: 'readonly',
        module: 'readonly',
        process: 'readonly',
        require: 'readonly',
        URL: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  }
];
