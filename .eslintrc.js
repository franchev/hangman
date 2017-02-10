module.exports = {
  extends: 'airbnb-base',
  plugins: [
    'import',
  ],
  env: {
    es6: true,
    node: true,
  },
  rules: {
    'arrow-parens': ['error', 'always'],
    'curly': ['error', 'all'],
    'max-len': ['error', 100, 2],
    'no-param-reassign': ['error', { 'props': false }],
  }
};
