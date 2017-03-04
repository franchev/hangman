export default function createGamesController({ gameService, wordService }) {
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
        .catch((err) => {
          req.log.error(err);
          res.status(500).end();
        });
    },

    listGames(req, res) {
      return gameService.listGames()
        .then((games) => {
          res.status(200).json(games);
        })
        .catch((err) => {
          req.log.error(err);
          res.status(500).end();
        });
    },

    createGame(req, res) {
      return wordService.getRandomWord()
        .then((word) => gameService.createGame({ word }))
        .then((game) => {
          res.status(201).json(game);
        });
    },

    deleteGame(req, res) {
      const { id } = req.params;

      return gameService.deleteGame({ id })
        .then(() => {
          res.status(204).end();
        });
    },
  };
}
