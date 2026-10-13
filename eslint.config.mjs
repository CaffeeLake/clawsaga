import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-config-prettier/flat';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';

export default defineConfig([
  globalIgnores(['node_modules/**', 'bin/**']),
  js.configs.recommended,
  {
    plugins: { '@eslint-community/eslint-comments': eslintComments },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    rules: {
      'no-nested-ternary': 'error',
      '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
      '@eslint-community/eslint-comments/require-description': [
        'error',
        { ignore: ['eslint-enable'] },
      ],
    },
  },
  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
      ],
    },
    languageOptions: {
      parserOptions: { project: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'max-lines': [
        'error',
        { max: 500, skipBlankLines: true, skipComments: true },
      ],
      complexity: ['error', { max: 15 }],
      'max-depth': ['error', 4],
      'max-statements': ['error', 30],
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      'max-lines': 'off',
      'max-statements': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      // Vitest types asymmetric matchers such as expect.any() as any.
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
  prettier,
  {
    // eslint-config-prettier turns curly off, so this comes after it. A body
    // that Prettier wraps onto its own line needs braces, and every branch of
    // one if/else chain uses them or none does.
    rules: { curly: ['error', 'multi-line', 'consistent'] },
  },
  {
    // Blank lines that follow from syntax alone. Where the purpose changes
    // between other statements stays a judgment call.
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
        {
          blankLine: 'always',
          prev: [
            'multiline-const',
            'multiline-let',
            'multiline-export',
            'multiline-type',
          ],
          next: '*',
        },
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  },
]);
