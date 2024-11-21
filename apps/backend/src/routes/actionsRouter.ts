import { Router } from 'express';
import { addAction } from '../controllers/queueController';

const router = Router();

router.post('/', addAction);

export default router;
