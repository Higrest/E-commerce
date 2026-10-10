import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '../../core/store/cartStore';
import { useAuthStore } from '../../core/store/authStore';
import { ShoppingCart, Star, ArrowLeft, ShieldCheck, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Моковые данные одного товара (для имитации запроса /api/products/:id)
const mockProductData = {
  id: '1',
  name: 'Беспроводные наушники Pro',
  price: 450000,
  category: 'Электроника',
  rating: 4.8,
  stock_quantity: 25,
  description: 'Полноразмерные беспроводные наушники с активным шумоподавлением (ANC), кристально чистым звуком и автономностью до 40 часов. Мягкие амбушюры обеспечивают комфорт при длительном ношении.',
  image_url: 'https://unsplash.com',
  seller: { store_name: 'TechWave Uzbekistan' },
  reviews: [
    { id: 'rev_1', user_name: 'Асадбек', rating: 5, comment: 'Звук просто бомба, шумодав работает отлично за эти деньги!', date: '2026-09-28' },
    { id: 'rev_2', user_name: 'Елена К.', rating: 4, comment: 'Наушники хорошие, но на маленькую голову могут слегка давить.', date: '2026-10-02' }
  ]
};

export const ProductDetail = () => {
  const { id } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const { user } = useAuthStore();
  
  const [product, setProduct] = useState(mockProductData);
  const [quantity, setQuantity] = useState(1);
  
  // Состояния для формы нового отзыва
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const handleAddToCart = () => {
    const success = addToCart(product, quantity);
    if (success) {
      toast.success(`Добавлено в корзину: ${quantity} шт.`);
    } else {
      toast.error('Недостаточно товара на складе!');
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return toast.error('Введите текст отзыва');

    const newReview = {
      id: Math.random().toString(),
      user_name: user?.name || 'Анонимный покупатель',
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0]
    };

    setProduct({
      ...product,
      reviews: [newReview, ...product.reviews]
    });
    
    setNewComment('');
    toast.success('Отзыв успешно добавлен!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen space-y-8">
      {/* Кнопка назад */}
      <Link to="/" className="inline-flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
        <ArrowLeft size={16} />
        <span>Назад к каталогу</span>
      </Link>

      {/* Сетка: Картинка и Описание */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border rounded-2xl p-6 shadow-sm">
        {/* Левая колонка: Изображение */}
        <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Правая колонка: Инфо и Кнопки */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-2xl font-black text-gray-800 leading-tight">{product.name}</h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1 text-amber-500 font-bold">
                <Star size={16} fill="currentColor" />
                <span>{product.rating}</span>
              </div>
              <span>•</span>
              <span className="text-gray-500 font-medium">Продавец: <span className="text-gray-800 font-semibold">{product.seller.store_name}</span></span>
            </div>

            <p className="text-2xl font-black text-gray-900 pt-2">{product.price.toLocaleString()} сум</p>
            <div className="border-t border-b py-4 my-2 text-sm text-gray-600 leading-relaxed">
              {product.description}
            </div>
          </div>

          {/* Блок покупки */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-xl border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">Доступный остаток:</span>
              <span className="font-bold text-gray-800">{product.stock_quantity} шт.</span>
            </div>

            <div className="flex gap-4">
              {/* Выбор количества */}
              <div className="flex items-center border rounded-xl bg-white p-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 font-bold text-gray-500 hover:text-gray-800">-</button>
                <span className="w-8 text-center text-sm font-bold text-gray-800">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))} className="px-3 py-1 font-bold text-gray-500 hover:text-gray-800">+</button>
              </div>

              {/* Кнопка добавления */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-100 flex items-center justify-center space-x-2 text-sm"
              >
                <ShoppingCart size={18} />
                <span>Добавить в корзину</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Блок отзывов */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Форма добавления отзыва */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-600" />
            <span>Оставить отзыв</span>
          </h3>
          <form onSubmit={handleAddReview} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Оценка</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star size={24} fill={star <= newRating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Ваш комментарий</label>
              <textarea
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Поделитесь впечатлениями о товаре..."
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 focus:bg-white transition-all"
              />
            </div>
            <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
              Отправить отзыв
            </button>
          </form>
        </div>

        {/* Список отзывов */}
        <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-800">Отзывы покупателей ({product.reviews.length})</h3>
          <div className="divide-y space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="pt-4 first:pt-0 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-800 flex items-center gap-1">
                    <ShieldCheck size={14} className="text-green-600" />
                    {review.user_name}
                  </span>
                  <span className="text-gray-400">{review.date}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < review.rating ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 pt-1 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
