import createGamesController from '../../src/games/controller';

describe('games/controller', () => {
  const randomGameId = generateRandomString('game-id');

  let controller;
  let gameService;
  let req;
  let res;

  beforeEach(() => {
    gameService = {};
    req = {
      params: {
        id: randomGameId,
      },
    };
    res = {
      json: sinon.spy(),
    };

    controller = createGamesController({ gameService });
  });

  describe('#getGame', () => {
    it('responds with a 400 if an invalid game ID is provided', () => {
      req.params.id = null;
      res.status = sinon.stub().withArgs(400).returns(res);

      controller.getGame(req, res);

      expect(res.status).to.be.calledOnce;
      expect(res.json).to.be.calledOnce.and.deep.calledWith({
        message: 'Must provide a valid game ID.',
        statusCode: 400,
      });
    });

    it('responds with a 404 if no game exists for a given ID', () => {
      gameService.getGameById = sinon.stub().withArgs({
        id: randomGameId,
      }).returns(Promise.resolve(null));
      res.status = sinon.stub().withArgs(404).returns(res);

      const response = controller.getGame(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(res.status).to.be.calledOnce;
        expect(res.json).to.be.calledOnce.and.deep.calledWith({
          message: `No game with ID ${randomGameId} exists.`,
          statusCode: 404,
        });
      });
    });

    it('responds with a 200 if a valid game ID is provided', () => {
      const game = {};
      gameService.getGameById = sinon.stub().withArgs({
        id: randomGameId,
      }).returns(Promise.resolve(game));
      res.status = sinon.stub().withArgs(200).returns(res);

      const response = controller.getGame(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(res.status).to.be.calledOnce;
        expect(res.json).to.be.calledOnce.and.deep.calledWith(game);
      });
    });
  });

  describe('#listGames', () => {
    it('responds with a 200 and a list of all available games', () => {
      const games = [];
      gameService.listGames = sinon.stub().withArgs().returns(Promise.resolve(games));
      res.status = sinon.stub().withArgs(200).returns(res);

      const response = controller.listGames(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(res.status).to.be.calledOnce;
        expect(res.json).to.be.calledOnce.and.deep.calledWith(games);
      });
    });
  });
});
