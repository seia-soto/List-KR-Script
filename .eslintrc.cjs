module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    /**
     * The following rules prevents us to use ES module structure.
     */
    'import/extensions': 0,
    'import/no-unresolved': 0,
    /**
     * The following rules are personalized.
     */
    'import/prefer-default-export': 0,
    'no-await-in-loop': 0,
    'no-shadow': 0,
    'no-console': 0,
    'arrow-body-style': 0,
  },
  overrides: [
    {
      files: [
        '*.lib.js',
        '*.inject.js',
        '*.lib.ts',
        '*.inject.ts',
      ],
      rules: {
        /**
         * Additional rules for scripts should be go here.
         */
      },
    },
  ],
};
