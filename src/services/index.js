/* eslint-disable import/prefer-default-export */
import createGameService from './gameService';
import createWordService from './wordService';
import { knex, wordList } from '../lib';

const gameService = createGameService({ knex });
const wordService = createWordService({ wordList });

export {
  gameService,
  wordService,
};
