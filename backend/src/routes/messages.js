import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getDirectMessages, getRoomMessages } from '../controllers/messageController.js';

const router = Router();
router.get('/room/:roomId', protect, getRoomMessages);
router.get('/direct/:userId', protect, getDirectMessages);

export default router;
