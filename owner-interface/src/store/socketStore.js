import { create } from "zustand";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../lib/config";

let socket = null;

export const useSocketStore = create((set) => ({
  socket: null,
  isConnected: false,

  connect: (token = "") => {
    if (socket?.connected) return;

    socket = io(SOCKET_URL, {
      auth: token ? { token } : {},
      withCredentials: true,
    });

    socket.on("connect", () => {
      set({ socket, isConnected: true });
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
    });

    set({ socket });
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
      socket = null;
    }
  },

  getSocket: () => socket,
}));