import { create } from 'zustand';

const getSavedValue = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  const value = window.localStorage.getItem(key);
  return value ?? fallback;
};

export const useUiStore = create((set) => ({
  theme: getSavedValue('app-theme', 'light'),
  language: getSavedValue('app-language', 'ru'),

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('app-theme', theme);
    }
    set({ theme });
  },

  setLanguage: (language) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('app-language', language);
    }
    set({ language });
  },
}));
