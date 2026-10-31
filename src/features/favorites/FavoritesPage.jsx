import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useFavoritesStore } from '../../core/store/favoritesStore';

export const FavoritesPage = () => {
  const favoriteItems = useFavoritesStore((state) => state.favoriteItems);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  if (favoriteItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-50 text-pink-500">
          <Heart size={36} fill="currentColor" />
        </div>
        <h1 className="text-2xl font-black text-gray-800">Избранные товары</h1>
        <p className="mt-2 text-sm text-gray-500">Пока ничего не добавлено в избранное.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold shadow-sm hover:bg-blue-700"
        >
          <ArrowLeft size={16} />
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-800">Избранные товары</h1>
        <span className="text-sm bg-pink-50 text-pink-600 px-3 py-1 rounded-full font-semibold">
          {favoriteItems.length} товаров
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteItems.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <img src={product.image_url} alt={product.name} className="w-full h-52 object-cover" />
            <div className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600">{product.category}</p>
              <h3 className="mt-2 font-bold text-gray-800">{product.name}</h3>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-black text-gray-900">{product.price.toLocaleString()} сум</span>
                <button
                  type="button"
                  onClick={() => toggleFavorite(product)}
                  className="bg-pink-50 text-pink-600 p-2 rounded-xl"
                  title="Убрать из избранного"
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>
              <Link
                to="/"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
              >
                <ShoppingCart size={15} />
                Перейти к товарам
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
