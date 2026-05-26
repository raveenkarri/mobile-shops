import { create } from 'zustand';
import axios from 'axios';

axios.defaults.withCredentials = true;
const API_URL = 'http://localhost:5000/api';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  
  login: async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      set({ user: data });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
  
  register: async (userData) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, userData);
      set({ user: data });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
  
  logout: async () => {
    await axios.post(`${API_URL}/auth/logout`);
    set({ user: null });
  },
  
  checkAuth: async () => {
    try {
      const { data } = await axios.get(`${API_URL}/auth/me`);
      set({ user: data, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },
}));

useAuthStore.getState().checkAuth();