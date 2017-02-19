module.exports = {
  knex: {
    client: 'sqlite3',
    connection: {
      charset: 'utf8',
      database: 'gamesdb',
      filename: ':memory:',
    },
  },
  env: 'test',
};
