import config from 'config';
import knex from 'knex';

import knexConfig from '../../knexfile';

const env = config.get('env');

export default knex(knexConfig[env]);
