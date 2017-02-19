import createGameService from '../../src/services/gameService';

describe('services/gameService', () => {
  const id = '827094e8-e38e-47db-b8da-cf167e16d3be';
  const randomGameId = generateRandomString('game-id');

  let gameService;

  beforeEach(() => {
    gameService = createGameService({ knex });

    return knex.migrate.rollback()
      .then(() => knex.migrate.latest()
      .then(() => knex.seed.run()));
  });

  afterEach(() => knex.migrate.rollback());

  describe('#getGameById', () => {
    it('returns a resolved Promise with game for a valid ID', () => {
      const response = gameService.getGameById({ id });

      return expect(response).to.be.eventually.fulfilled.then((game) => {
        expect(game.id).to.equal(id);
      });
    });

    it('returns a resolved Promise with null for an invalid ID', () => {
      const response = gameService.getGameById({ id: randomGameId });

      return expect(response).to.eventually.be.undefined;
    });
  });

  describe('#listGames', () => {
    it('returns a resolved Promise with an array of games', () => {
      const response = gameService.listGames();

      return expect(response).to.eventually.be.fulfilled.then((games) => {
        expect(games).to.have.length(2);
      });
    });
  });
});
