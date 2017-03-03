import { Router } from 'express';

import createGamesController from './controller';
import { gameService, wordService } from '../services';

const controller = createGamesController({ gameService, wordService });

const router = Router();

router.get('/', controller.listGames);
router.get('/:id', controller.getGame);
router.post('/', controller.createGame);
router.delete('/:id', controller.deleteGame);

export default router;
