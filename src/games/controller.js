import HttpError from 'standard-http-error';

import { GAME_STATE } from '../services/gameService';

const handleError = (req, res) => (err) => {
  req.log.error(err);
  res.status(500).end();
};

export default function createGamesController({ indexReplace, gameService, wordService }) {
  return {
    getGame(req, res) {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message: 'Must provide a valid game ID.',
          statusCode: 400,
        });
      }

      return gameService.getGameById({ id })
        .then((game) => {
          if (!game) {
            return res.status(404).json({
              message: `No game with ID ${id} exists.`,
              statusCode: 404,
            });
          }

          return res.status(200).json(game);
        })
        .catch(handleError(req, res));
    },

    listGames(req, res) {
      return gameService.listGames()
        .then((games) => {
          res.status(200).json(games);
        })
        .catch(handleError(req, res));
    },

    createGame(req, res) {
      return wordService.getRandomWord()
        .then((word) => gameService.createGame({ word }))
        .then((game) => {
          res.status(201).json(game);
        })
        .catch(handleError(req, res));
    },

    deleteGame(req, res) {
      const { id } = req.params;

      return gameService.deleteGame({ id })
        .then(() => {
          res.status(204).end();
        })
        .catch(handleError(req, res));
    },

    guessLetter(req, res) {
      const { id } = req.params;
      const { letter } = req.body;

      return gameService.getGameById({ id })
        .then((game) => {
          if (!game) {
            return res.status(404).json({
              message: `No game with ID ${id} exists.`,
              statusCode: 404,
            });
          }

          if (game.state !== GAME_STATE.STARTED) {
            return res.status(200).json(game);
          }

          const { lettersGuessed } = game;
          if (lettersGuessed.indexOf(letter) > -1) {
            return res.status(200).json(game);
          }
          game.lettersGuessed = `${lettersGuessed}${letter}`;

          const { word } = game;
          if (word.indexOf(letter) === -1) {
            game.remainingGuesses -= 1;
            if (game.remainingGuesses === 0) {
              game.state = GAME_STATE.LOST;
            }
          } else {
            game.lettersMatched = indexReplace(game.lettersMatched, word, letter);
            if (game.lettersMatched === word) {
              game.state = GAME_STATE.WON;
            }
          }

          return gameService.updateGame(game)
            .then(() => res.status(200).json(game));
        })
        .catch(HttpError, (err) => {
          res.status(err.code).json({
            message: err.message,
            statusCode: err.code,
          });
        })
        .catch(handleError(req, res));
    },
  };
}
