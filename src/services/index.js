/* eslint-disable import/prefer-default-export */
import createGameService from './gameService';
import { knex } from '../lib';

const gameService = createGameService({ knex });

export {
  gameService,
};
