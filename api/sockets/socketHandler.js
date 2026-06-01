import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

const getTokenFromCookie = (cookieHeader) => {
  if (!cookieHeader) return null;
  const tokenCookie = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('token='));
  return tokenCookie ? decodeURIComponent(tokenCookie.split('=')[1]) : null;
};

export const setupSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || getTokenFromCookie(socket.handshake.headers.cookie);
      if (!token) return next(new Error('Authentication error'));
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));
      
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user._id} connected`);
    
    // Join rooms based on user's chats
    socket.on('join_chat', async ({ chatId }) => {
      const chat = await Chat.findById(chatId);
      if (!chat) return;
      
      if (chat.userId.toString() === socket.user._id.toString() || 
          chat.ownerId.toString() === socket.user._id.toString()) {
        socket.join(`chat_${chatId}`);
        socket.emit('joined_chat', { chatId });
      }
    });
    
    // Send message
    socket.on('send_message', async ({ chatId, message }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) return;
        
        const isParticipant = chat.userId.toString() === socket.user._id.toString() ||
                              chat.ownerId.toString() === socket.user._id.toString();
        if (!isParticipant) return;
        
        const newMessage = await Message.create({
          chatId,
          senderId: socket.user._id,
          message,
        });
        
        await Chat.findByIdAndUpdate(chatId, { 
          lastMessage: message,
          lastUpdated: new Date() 
        });
        
        io.to(`chat_${chatId}`).emit('receive_message', {
          _id: newMessage._id,
          chatId,
          senderId: socket.user._id,
          message,
          createdAt: newMessage.createdAt,
        });
      } catch (err) {
        console.error(err);
      }
    });
    
    // Typing indicator
    socket.on('typing', ({ chatId, isTyping }) => {
      socket.to(`chat_${chatId}`).emit('user_typing', { 
        userId: socket.user._id, 
        isTyping 
      });
    });
    
    socket.on('disconnect', () => {
      console.log(`User ${socket.user._id} disconnected`);
    });
  });
};
