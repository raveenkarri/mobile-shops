import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Shop from '../models/Shop.js';

export const getChats = async (req, res) => {
  let chats;
  if (req.user.role === 'OWNER') {
    const shops = await Shop.find({ ownerId: req.user._id });
    const shopIds = shops.map(s => s._id);
    chats = await Chat.find({ shopId: { $in: shopIds } })
      .populate('userId', 'name email')
      .populate('shopId', 'shopName')
      .sort({ lastUpdated: -1 });
  } else {
    chats = await Chat.find({ userId: req.user._id })
      .populate('ownerId', 'name email')
      .populate('shopId', 'shopName')
      .sort({ lastUpdated: -1 });
  }
  res.json(chats);
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  const chat = await Chat.findById(chatId);
  
  if (!chat) return res.status(404).json({ message: 'Chat not found' });
  
  const isParticipant = chat.userId.toString() === req.user._id.toString() ||
                        chat.ownerId.toString() === req.user._id.toString();
  if (!isParticipant) return res.status(403).json({ message: 'Not authorized' });
  
  const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
  res.json(messages);
};

export const createChat = async (req, res) => {
  const { shopId } = req.body;
  const shop = await Shop.findById(shopId);
  if (!shop) return res.status(404).json({ message: 'Shop not found' });
  
  let chat = await Chat.findOne({
    userId: req.user._id,
    shopId: shopId,
  });
  
  if (!chat) {
    chat = await Chat.create({
      userId: req.user._id,
      ownerId: shop.ownerId,
      shopId: shopId,
    });
  }
  
  res.json(chat);
};