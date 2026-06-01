import { create } from "zustand";
import apiClient from "../lib/apiClient";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,

  login: async (email, password) => {
    try {
      const { data } = await apiClient.post("/auth/login", { email, password });
      set({ user: data });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Unable to login",
      };
    }
  },

  register: async (userData) => {
    try {
      const { data } = await apiClient.post("/auth/register", userData);
      set({ user: data });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Unable to register",
      };
    }
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
    set({ user: null });
  },

  checkAuth: async () => {
    try {
      const { data } = await apiClient.get("/auth/me");
      set({ user: data, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },
}));