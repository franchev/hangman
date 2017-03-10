import createGamesController from '../../src/games/controller';

describe('games/controller', () => {
  const randomGameId = generateRandomString('game-id');
  const randomWord = generateRandomString('word');

  let controller;
  let gameService;
  let wordService;
  let req;
  let res;

  beforeEach(() => {
    gameService = {};
    wordService = {
      getRandomWord: sinon.stub().withArgs().returns(Promise.resolve(randomWord)),
    };
    req = {
      params: {
        id: randomGameId,
      },
      log: {
        error: sinon.spy(),
      },
    };
    res = {
      json: sinon.spy(),
      end: sinon.spy(),
    };

    controller = createGamesController({ gameService, wordService });
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

    it('responds with a 500 if a database error occurs', () => {
      const error = new Error('error!');
      gameService.getGameById = sinon.stub().returns(Promise.reject(error));
      res.status = sinon.stub().withArgs(500).returns(res);

      const response = controller.getGame(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(req.log.error).to.be.calledOnce.and.calledWith(error);
        expect(res.status).to.be.calledOnce;
        expect(res.end).to.be.calledOnce;
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

    it('responds with a 500 if a database error occurs', () => {
      const error = new Error('error!');
      gameService.listGames = sinon.stub().returns(Promise.reject(error));
      res.status = sinon.stub().withArgs(500).returns(res);

      const response = controller.listGames(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(req.log.error).to.be.calledOnce.and.calledWith(error);
        expect(res.status).to.be.calledOnce;
        expect(res.end).to.be.calledOnce;
      });
    });
  });

  describe('#createGame', () => {
    it('responds with a 201 and a new game', () => {
      const game = {};
      gameService.createGame = sinon.stub().withArgs({
        word: randomWord,
      }).returns(Promise.resolve(game));
      res.status = sinon.stub().withArgs(201).returns(res);

      const response = controller.createGame(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(res.status).to.be.calledOnce;
        expect(res.json).to.be.calledOnce.and.deep.calledWith(game);
      });
    });

    it('responds with a 500 if a word service error occurs', () => {
      const error = new Error('error!');
      wordService.getRandomWord = sinon.stub().returns(Promise.reject(error));
      res.status = sinon.stub().withArgs(500).returns(res);

      const response = controller.createGame(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(req.log.error).to.be.calledOnce.and.calledWith(error);
        expect(res.status).to.be.calledOnce;
        expect(res.end).to.be.calledOnce;
      });
    });

    it('responds with a 500 if a database error occurs', () => {
      const error = new Error('error!');
      gameService.createGame = sinon.stub().returns(Promise.reject(error));
      res.status = sinon.stub().withArgs(500).returns(res);

      const response = controller.createGame(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(req.log.error).to.be.calledOnce.and.calledWith(error);
        expect(res.status).to.be.calledOnce;
        expect(res.end).to.be.calledOnce;
      });
    });
  });

  describe('#deleteGame', () => {
    it('responds with a 204 if a game was successfully removed', () => {
      gameService.deleteGame = sinon.stub().withArgs({
        id: randomGameId,
      }).returns(Promise.resolve());
      res.status = sinon.stub().withArgs(204).returns(res);

      const response = controller.deleteGame(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(res.status).to.be.calledOnce;
        expect(res.end).to.be.calledOnce.and.calledWith();
      });
    });

    it('responds with a 500 if a database error occurs', () => {
      const error = new Error('error!');
      gameService.deleteGame = sinon.stub().returns(Promise.reject(error));
      res.status = sinon.stub().withArgs(500).returns(res);

      const response = controller.deleteGame(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(req.log.error).to.be.calledOnce.and.calledWith(error);
        expect(res.status).to.be.calledOnce;
        expect(res.end).to.be.calledOnce;
      });
    });
  });
});
