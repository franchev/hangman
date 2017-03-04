import bunyan from 'bunyan';

import config from 'config';

const level = config.get('logger.level');

export default bunyan.createLogger({
  level,
  name: 'hangman',
});

export const serializers = bunyan.stdSerializers;
