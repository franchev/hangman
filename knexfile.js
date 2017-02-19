const config = require('config');

const env = config.get('env');

module.exports = {
  [env]: config.get('knex'),
};
