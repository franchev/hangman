export default function createGameService({ knex }) {
  return {
    getGameById({ id }) {
      return knex('games').where({ id })
        .then(([game]) => game);
    },
  };
}
