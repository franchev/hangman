export const GAME_STATE = {
  STARTED: 'started',
  WON: 'won',
  LOST: 'lost',
};

export default function createGameService({ knex }) {
  return {
    getGameById({ id }) {
      return knex('games').where({ id })
        .then(([game]) => game);
    },

    listGames() {
      return knex('games');
    },
  };
}
