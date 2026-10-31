import { create } from 'zustand';

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem('auth-user');
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: getStoredUser(),
  token: localStorage.getItem('token'),

  login: (user, token) => {
    const safeToken = token && token !== 'undefined' ? token : null;
    const safeUser = user && user.email ? user : null;

    if (safeToken) {
      localStorage.setItem('token', safeToken);
    } else {
      localStorage.removeItem('token');
    }

    if (safeUser) {
      localStorage.setItem('auth-user', JSON.stringify(safeUser));
    } else {
      localStorage.removeItem('auth-user');
    }

    set({ user: safeUser, token: safeToken });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth-user');
    set({ user: null, token: null });
  },
}));
