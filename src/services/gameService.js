import Promise, { OperationalError } from 'bluebird';
import { noop } from 'noop';
import uuid from 'uuid';

export const GAME_STATE = {
  STARTED: 'started',
  WON: 'won',
  LOST: 'lost',
};

export class NoSuchGameError extends OperationalError {}

export default function createGameService({ knex }) {
  const service = {
    GAME_STATE,

    getGameById({ id }) {
      return Promise.try(() =>
        knex('games').where({ id })
          .then(([game]) => game));
    },

    listGames() {
      return Promise.try(() => knex('games'));
    },

    createGame({ word }) {
      return Promise.try(() => {
        const id = uuid.v4();
        const wordLength = word.length;

        return knex('games').insert({
          id,
          word,
          wordLength,
          lettersGuessed: '',
          lettersMatched: Array(wordLength).fill('_').join(''),
          remainingGuesses: 6,
          state: GAME_STATE.STARTED,
        })
        .then(() => service.getGameById({ id }));
      });
    },

    deleteGame({ id }) {
      return Promise.try(() =>
        knex('games').where({ id }).del()
          .then(noop));
    },

    updateGame({ id, ...game }) {
      return Promise.try(() => knex.transaction((trx) =>
        trx.select().from('games').where({ id })
          .then(([existingGame]) => {
            if (!existingGame) {
              throw new NoSuchGameError();
            }
          })
          .then(() => trx.update({ ...game }).into('games').where({ id })
          .then(noop),
      )));
    },
  };

  return service;
}
