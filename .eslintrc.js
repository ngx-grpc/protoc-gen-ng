module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  plugins: [
    'deprecate',
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    'deprecate/function': 2,
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-parameter-properties': 0,
    '@typescript-eslint/type-annotation-spacing': 2,
    '@typescript-eslint/no-explicit-any': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single'],
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
  },
};
