import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favoriteItems: [],

      toggleFavorite: (product) => {
        const { favoriteItems } = get();
        const exists = favoriteItems.some((item) => item.id === product.id);

        if (exists) {
          set({
            favoriteItems: favoriteItems.filter((item) => item.id !== product.id),
          });
          return false;
        }

        set({
          favoriteItems: [
            {
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
              category: product.category,
            },
            ...favoriteItems,
          ],
        });

        return true;
      },

      isFavorite: (productId) => {
        const { favoriteItems } = get();
        return favoriteItems.some((item) => item.id === productId);
      },

      clearFavorites: () => set({ favoriteItems: [] }),
    }),
    {
      name: 'mini-market-favorites',
    }
  )
);
