import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null, // Сюда прилетит объект: { id, name, email, role }
  token: localStorage.getItem('token'),
  
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));
