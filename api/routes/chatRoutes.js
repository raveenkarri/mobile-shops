import express from 'express';
import { getChats, getMessages, createChat } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getChats);
router.post('/', protect, createChat);
router.get('/:chatId/messages', protect, getMessages);

export default router;