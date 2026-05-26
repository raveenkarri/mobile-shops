import { create } from 'zustand';
import { io } from 'socket.io-client';

let socket = null;

export const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,
  
  connect: (token) => {
    if (socket?.connected) return;
    
    socket = io('http://localhost:5000', {
      auth: { token },
      withCredentials: true,
    });
    
    socket.on('connect', () => {
      set({ socket, isConnected: true });
    });
    
    socket.on('disconnect', () => {
      set({ isConnected: false });
    });
    
    set({ socket });
  },
  
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
  
  getSocket: () => socket,
}));