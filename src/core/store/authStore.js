import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),

  login: (user, token) => {
    const safeToken = token && token !== 'undefined' ? token : null;

    if (safeToken) {
      localStorage.setItem('token', safeToken);
    } else if (!localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }

    set({ user, token: safeToken });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));
