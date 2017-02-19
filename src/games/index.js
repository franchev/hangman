import { Router } from 'express';

import createGamesController from './controller';
import { gameService } from '../services';

const controller = createGamesController({ gameService });

const router = Router();

router.get('/', controller.listGames);
router.get('/:id', controller.getGame);

export default router;
