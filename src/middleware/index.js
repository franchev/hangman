/* eslint-disable import/prefer-default-export */
import uuid from 'uuid';

import createLoggingMiddleware from './logging';
import logger, { serializers } from '../lib/logger';

const requestLogger = createLoggingMiddleware({
  logger,
  serializers,
  uuid,
});

export {
  requestLogger,
};
