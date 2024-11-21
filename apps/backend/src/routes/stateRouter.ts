import { Router } from 'express';
import { getState } from '../controllers/queueController';

const router = Router();

router.get('/', getState);

export default router;
