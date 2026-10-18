import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  { ignores: ['dist/'] },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    // `no-console` is only an error in production, so its disable comments look unused in dev
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-unused-vars': 'off'
    }
  }
];
