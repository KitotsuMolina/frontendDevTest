import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', 'playwright-report/**', 'test-results/**', 'node_modules/**', '.aws/', '.codex/', '.agents/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['vite.config.ts', 'playwright.config.ts', 'e2e/**/*.{ts,mjs}'], languageOptions: { globals: globals.node } },
  { files: ['src/**/*.{ts,tsx}'], languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: { ...reactHooks.configs.recommended.rules, 'react-refresh/only-export-components': ['warn', { allowConstantExport: true }] } },
)
