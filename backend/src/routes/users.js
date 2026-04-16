import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getSocialGraph, respondFriendRequest, searchUsers, sendFriendRequest, updateProfile, upload, uploadBackground } from '../controllers/userController.js';

const router = Router();
router.patch('/profile', protect, updateProfile);
router.post('/background', protect, upload.single('background'), uploadBackground);
router.get('/search', protect, searchUsers);
router.post('/friend-request', protect, sendFriendRequest);
router.patch('/friend-request/:id', protect, respondFriendRequest);
router.get('/social', protect, getSocialGraph);

export default router;
