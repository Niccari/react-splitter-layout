import js from '@eslint/js';
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const sharedRules = {
  // ESLint v9 continued rules
  'class-methods-use-this': 'off',
  'no-plusplus': 'off',
  // jsx-a11y overrides
  'jsx-a11y/no-noninteractive-element-interactions': 'off',
  // @stylistic rules (from old core)
  '@stylistic/comma-dangle': ['error', 'never'],
  '@stylistic/function-paren-newline': ['error', 'consistent'],
  '@stylistic/max-len': ['error', 120, 2, { ignoreUrls: true }],
  '@stylistic/no-confusing-arrow': ['error', { allowParens: true }],
  '@stylistic/no-multiple-empty-lines': ['warn', { max: 1 }],
  '@stylistic/object-curly-newline': 'off',
  '@stylistic/operator-linebreak': ['error', 'after'],
  '@stylistic/space-before-function-paren': ['error', 'never']
};

export default [
  js.configs.recommended,
  react.configs.flat.recommended,
  importPlugin.flatConfigs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ['src/**/*.{js,jsx}', 'test/**/*.{js,jsx}', 'example/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    plugins: { '@stylistic': stylistic },
    settings: {
      react: { version: 'detect' },
      'import/resolver': { node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] } }
    },
    rules: sharedRules
  },
  {
    files: ['src/**/*.{ts,tsx}', 'index.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    plugins: {
      '@stylistic': stylistic,
      '@typescript-eslint': tseslint.plugin
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': { node: { extensions: ['.ts', '.tsx', '.js', '.jsx'] } }
    },
    rules: {
      ...sharedRules,
      'react/prop-types': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  {
    files: ['test/**/*.{js,jsx}'],
    languageOptions: { globals: { ...globals.jest, ...globals.node } }
  },
  {
    files: ['test/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly'
      }
    },
    plugins: { '@typescript-eslint': tseslint.plugin },
    settings: {
      'import/resolver': { node: { extensions: ['.ts', '.tsx', '.js', '.jsx'] } }
    },
    rules: {
      'react/prop-types': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off'
    }
  },
  {
    files: ['example/webpack.config.js'],
    languageOptions: { globals: { ...globals.node }, sourceType: 'commonjs' }
  },
  {
    ignores: ['lib/**', 'node_modules/**', 'eslint.config.mjs']
  }
];
