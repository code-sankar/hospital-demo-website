import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['node_modules', '.mailbox'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // The logger is the only sanctioned output; the seed script is the one
      // place that deliberately prints to the operator's terminal.
      'no-console': 'error',
    },
  },
  {
    files: ['src/db/seed.js'],
    rules: { 'no-console': 'off' },
  },
]
