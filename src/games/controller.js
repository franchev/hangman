export default function createGamesController({ gameService }) {
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
        });
    },
  };
}
