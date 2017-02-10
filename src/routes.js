import { Router } from 'express';

import home from './home';
import status from './status';

const router = Router();

router.use('/', home);
router.use('/status', status);

export default router;
