import { Router } from 'express';
import { index } from '../Controller/Pratt_Drain_Care.js';
const router = new Router();
router.get('/', index);
export default router;