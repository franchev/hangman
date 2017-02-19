module.exports = {
  env: {
    mocha: true,
  },
  globals: {
    app: true,
    cheerio: true,
    expect: true,
    request: true,
    sinon: true,
    generateRandomString: true,
    knex: true,
  },
  rules: {
    'func-names': 'off',
    'no-shadow': 'off',
    'no-unused-expressions': 'off',
  }
};
