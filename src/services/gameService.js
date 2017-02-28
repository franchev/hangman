import Promise from 'bluebird';

export const GAME_STATE = {
  STARTED: 'started',
  WON: 'won',
  LOST: 'lost',
};

export default function createGameService({ knex }) {
  return {
    getGameById({ id }) {
      return Promise.try(() =>
        knex('games').where({ id })
          .then(([game]) => game));
    },

    listGames() {
      return Promise.try(() => knex('games'));
    },
  };
}
