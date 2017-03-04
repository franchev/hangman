module.exports = {
  env: process.env.NODE_ENV,
  knex: {
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
  logger: {
    level: 'info',
  },
};
