import js from '@eslint/js'
import eslintReact from '@eslint-react/eslint-plugin'
import { fixupPluginRules } from '@eslint/compat'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  // Global ignores (replaces .eslintignore)
  {
    ignores: ['node_modules/**', 'src-tauri/**', 'dist/**', 'src/generated/**'],
  },

  // Base recommended config
  js.configs.recommended,

  // TypeScript files
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2023,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@eslint-react': eslintReact,
      'react-hooks': reactHooks,
      import: fixupPluginRules(importPlugin),
    },
    rules: {
      // TypeScript recommended (manual since we're not using the wrapper)
      ...tsPlugin.configs.recommended.rules,

      // TypeScript custom
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'warn',

      // React
      ...eslintReact.configs.jsx.rules,
      '@eslint-react/no-direct-mutation-state': 'error',
      '@eslint-react/no-missing-key': 'error',
      '@eslint-react/no-unsafe-component-will-mount': 'warn',
      '@eslint-react/no-unsafe-component-will-receive-props': 'warn',
      '@eslint-react/no-unsafe-component-will-update': 'warn',

      // React Hooks
      ...reactHooks.configs.recommended.rules,
      // Downgrade new react-hooks v7 rules to warnings (pre-existing patterns)
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/set-state-in-effect': 'warn',

      // Import
      'import/order': [
        'warn',
        {
          alphabetize: {
            caseInsensitive: true,
            order: 'asc',
          },
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],

      // General
      'no-console': 'off',
      'prefer-const': 'warn',

      // Disable base rules that conflict with TS
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
    settings: {
      'react-x': {
        version: 'detect',
        importSource: 'react',
        polymorphicPropName: 'as',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },

  // Prettier (must be last to override formatting rules)
  prettierPlugin,
]
