import { Router } from 'express';

import games from './games';
import home from './home';
import status from './status';

const router = Router();

router.use('/', home);
router.use('/status', status);

router.use('/api/v1/games', games);

export default router;
