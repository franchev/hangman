import Promise from 'bluebird';
import uuid from 'uuid';

export const GAME_STATE = {
  STARTED: 'started',
  WON: 'won',
  LOST: 'lost',
};

export default function createGameService({ knex }) {
  const service = {
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

        return knex('games').insert({
          id,
          word,
          lettersGuessed: '',
          remainingGuesses: 6,
          state: GAME_STATE.STARTED,
          wordLength: word.length,
        })
        .then(() => service.getGameById({ id }));
      });
    },

    deleteGame({ id }) {
      return Promise.try(() =>
        knex('games').where({ id }).del()
          .then(() => {}));
    },
  };

  return service;
}
