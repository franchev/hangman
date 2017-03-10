import Promise from 'bluebird';
import HttpError from 'standard-http-error';

import createGamesController from '../../src/games/controller';
import { GAME_STATE } from '../../src/services/gameService';
import { indexReplace } from '../../src/lib';

describe('games/controller', () => {
  const randomGameId = generateRandomString('game-id');
  const randomWord = generateRandomString('word');
  const letter = 'a';

  let controller;
  let gameService;
  let wordService;
  let req;
  let res;

  beforeEach(() => {
    gameService = {
      GAME_STATE,
    };
    wordService = {
      getRandomWord: sinon.stub().withArgs().returns(Promise.resolve(randomWord)),
    };
    req = {
      body: {
        letter,
      },
      params: {
        id: randomGameId,
      },
      log: {
        error: sinon.spy(),
      },
    };
    res = {
      json: sinon.spy(),
      status: sinon.stub(),
      end: sinon.spy(),
    };
    res.status.returns(res);

    controller = createGamesController({ indexReplace, gameService, wordService });
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

  describe('#guessLetter', () => {
    const word = 'apple';
    let game;

    beforeEach(() => {
      game = {
        word,
        id: randomGameId,
        state: GAME_STATE.STARTED,
        lettersGuessed: '',
        lettersMatched: '_____',
        remainingGuesses: 6,
      };

      gameService.getGameById = sinon.stub().withArgs({
        id: randomGameId,
      }).returns(Promise.resolve(game));
      gameService.updateGame = sinon.stub().withArgs(game).returns(Promise.resolve());
    });

    it('responds with a 404 if no game exists for a given ID', () => {
      gameService.getGameById.withArgs({
        id: randomGameId,
      }).returns(Promise.resolve(null));

      const response = controller.guessLetter(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(res.status).to.be.calledOnce.and.calledWith(404);
        expect(res.json).to.be.calledOnce.and.deep.calledWith({
          message: `No game with ID ${randomGameId} exists.`,
          statusCode: 404,
        });
      });
    });

    it('responds with a 200 and no changes if the game is already over', () => {
      game.state = GAME_STATE.WON;

      const response = controller.guessLetter(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(res.status).to.be.calledOnce.and.calledWith(200);
        expect(res.json).to.be.calledOnce.and.deep.calledWith(game);
      });
    });

    it('responds with a 200 and no changes if a client guesses the same letter repeatedly', () => {
      game.lettersGuessed = letter;

      const response = controller.guessLetter(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(res.status).to.be.calledOnce.and.calledWith(200);
        expect(res.json).to.be.calledOnce.and.deep.calledWith(game);
      });
    });

    it('responds with a 404 if attempting to update a game that does not exist', () => {
      const message = `No game with ID ${randomGameId} exists.`;
      gameService.updateGame.returns(Promise.reject(new HttpError(404, message)));

      const response = controller.guessLetter(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(res.status).to.be.calledOnce.and.calledWith(404);
        expect(res.json).to.be.calledOnce.and.deep.calledWith({
          message,
          statusCode: 404,
        });
      });
    });

    it('responds with a 200 if a client guesses wrong and still has remainingGuesses', () => {
      req.body.letter = 'x';

      const response = controller.guessLetter(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(res.status).to.be.calledOnce.and.calledWith(200);
        expect(res.json).to.be.calledOnce.and.calledWith(game);

        expect(game.remainingGuesses).to.equal(5);
        expect(game.lettersGuessed).to.equal(req.body.letter);
        expect(game.lettersMatched).to.equal('_____');
        expect(game.state).to.equal(GAME_STATE.STARTED);
      });
    });

    it('responds with a 200 if a client guesses wrong and the game is over', () => {
      req.body.letter = 'x';
      game.remainingGuesses = 1;

      const response = controller.guessLetter(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(res.status).to.be.calledOnce.and.calledWith(200);
        expect(res.json).to.be.calledOnce.and.calledWith(game);

        expect(game.remainingGuesses).to.equal(0);
        expect(game.lettersGuessed).to.equal(req.body.letter);
        expect(game.lettersMatched).to.equal('_____');
        expect(game.state).to.equal(GAME_STATE.LOST);
      });
    });

    it('responds with a 200 if a client guesses correctly and still has guesses to make', () => {
      const response = controller.guessLetter(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(res.status).to.be.calledOnce.and.calledWith(200);
        expect(res.json).to.be.calledOnce.and.calledWith(game);

        expect(game.remainingGuesses).to.equal(6);
        expect(game.lettersGuessed).to.equal(req.body.letter);
        expect(game.lettersMatched).to.equal('a____');
        expect(game.state).to.equal(GAME_STATE.STARTED);
      });
    });

    it('responds with a 200 if a client guesses correctly and wins the game', () => {
      game.lettersGuessed = 'ple';
      game.lettersMatched = '_pple';

      const response = controller.guessLetter(req, res);

      return expect(response).to.be.eventually.fulfilled.then(() => {
        expect(res.status).to.be.calledOnce.and.calledWith(200);
        expect(res.json).to.be.calledOnce.and.calledWith(game);

        expect(game.remainingGuesses).to.equal(6);
        expect(game.lettersGuessed).to.equal('plea');
        expect(game.lettersMatched).to.equal(word);
        expect(game.state).to.equal(GAME_STATE.WON);
      });
    });
  });
});
