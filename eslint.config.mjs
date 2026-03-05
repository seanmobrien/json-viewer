import workspaceConfig from '../../../eslint.config.mjs'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'

const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  URL: 'readonly',
  Element: 'readonly',
  HTMLElement: 'readonly',
  HTMLSpanElement: 'readonly',
  HTMLInputElement: 'readonly',
  HTMLTextAreaElement: 'readonly',
  MediaQueryListEvent: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  prompt: 'readonly',
  console: 'readonly'
}

const nodeGlobals = {
  module: 'readonly',
  require: 'readonly',
  process: 'readonly',
  __dirname: 'readonly'
}

const jestGlobals = {
  describe: 'readonly',
  it: 'readonly',
  test: 'readonly',
  expect: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  jest: 'readonly',
  vi: 'readonly'
}

export default [
  ...workspaceConfig,
  {
    ignores: ['**/.eslintrc.js']
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...browserGlobals,
        ...nodeGlobals
      }
    },
    plugins: {
      'react-hooks': reactHooksPlugin,
      'unused-imports': unusedImportsPlugin
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'unused-imports/no-unused-imports': 'off',
      'unused-imports/no-unused-vars': 'off',
      'no-constant-condition': 'off',
      'enforce-yarn/version': 'off'
    }
  },
  {
    files: ['**/*.test.{ts,tsx,js,jsx}', '**/tests/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...browserGlobals,
        ...nodeGlobals,
        ...jestGlobals
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
]
