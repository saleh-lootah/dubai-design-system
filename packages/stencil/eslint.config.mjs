import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  {
    // Generated output and build artifacts are never linted.
    ignores: ['dist/**', 'www/**', 'loader/**', 'storybook-static/**', 'src/components.d.ts', '**/readme.md'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.tsx'],
    plugins: { 'jsx-a11y': jsxA11y },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // These four catch the exact faults found in dda-home-banner.
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/alt-text': 'error',
      // The repo uses implicit any in many places. Report it, do not stop the build.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // TypeScript already finds an unknown name. ESLint does not know the
      // browser globals here, and it would report hundreds of false faults.
      'no-undef': 'off',
    },
  },
);
