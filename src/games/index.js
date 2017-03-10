import { Router } from 'express';

import createGamesController from './controller';

import guessLetterValidator from './validator';
import { gameService, wordService } from '../services';
import { indexReplace } from '../lib';

const controller = createGamesController({ indexReplace, gameService, wordService });

const router = Router();

router.get('/', controller.listGames);
router.get('/:id', controller.getGame);
router.post('/', controller.createGame);
router.delete('/:id', controller.deleteGame);
router.put('/:id', guessLetterValidator, controller.guessLetter);

export default router;
