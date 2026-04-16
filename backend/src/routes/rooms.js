import { Router } from 'express';
import { createRoom, getRoom, joinRoom, kickParticipant, listRooms, updateRoom } from '../controllers/roomController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/', protect, listRooms);
router.post('/', protect, createRoom);
router.get('/:id', protect, getRoom);
router.post('/join', protect, joinRoom);
router.patch('/:id', protect, updateRoom);
router.delete('/:id/participants/:userId', protect, kickParticipant);

export default router;
