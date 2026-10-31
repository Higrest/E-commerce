import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '../../core/store/cartStore';
import { useFavoritesStore } from '../../core/store/favoritesStore';
import { useAuthStore } from '../../core/store/authStore';
import { useUiStore } from '../../core/store/uiStore';
import { ShoppingCart, Star, ArrowLeft, ShieldCheck, MessageSquare, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';

const mockProductDataByLanguage = {
  ru: {
    product: {
      id: '1',
      name: 'Беспроводные наушники Pro',
      price: 450000,
      category: 'Электроника',
      rating: 4.8,
      stock_quantity: 25,
      description: 'Полноразмерные беспроводные наушники с активным шумоподавлением (ANC), кристально чистым звуком и автономностью до 40 часов. Мягкие амбушюры обеспечивают комфорт при длительном ношении.',
      image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
      seller: { store_name: 'TechWave Uzbekistan' },
      reviews: [
        { id: 'rev_1', user_name: 'Асадбек', rating: 5, comment: 'Звук просто бомба, шумодав работает отлично за эти деньги!', date: '2026-09-28' },
        { id: 'rev_2', user_name: 'Елена К.', rating: 4, comment: 'Наушники хорошие, но на маленькую голову могут слегка давить.', date: '2026-10-02' }
      ]
    }
  },
  en: {
    product: {
      id: '1',
      name: 'Wireless Headphones Pro',
      price: 450000,
      category: 'Electronics',
      rating: 4.8,
      stock_quantity: 25,
      description: 'Over-ear wireless headphones with active noise cancellation, clear sound, and up to 40 hours of battery life. Soft ear cushions provide comfort during long listening sessions.',
      image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
      seller: { store_name: 'TechWave Uzbekistan' },
      reviews: [
        { id: 'rev_1', user_name: 'Asadbek', rating: 5, comment: 'The sound is amazing and the noise cancellation works great for the price!', date: '2026-09-28' },
        { id: 'rev_2', user_name: 'Elena K.', rating: 4, comment: 'Good headphones, but they may press a little on a small head.', date: '2026-10-02' }
      ]
    }
  },
  kk: {
    product: {
      id: '1',
      name: 'Сымсыз құлаққап Pro',
      price: 450000,
      category: 'Электроника',
      rating: 4.8,
      stock_quantity: 25,
      description: 'Толық көлемді, белсенді шуды басатын құралдары бар сымсыз құлаққаптар, таза дыбыс және 40 сағатқа дейін батарея ұзақтығы. Ыңғайлы амбушюралар ұзақ тыңдауға жақсы мүмкіндік береді.',
      image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
      seller: { store_name: 'TechWave Uzbekistan' },
      reviews: [
        { id: 'rev_1', user_name: 'Асадбек', rating: 5, comment: 'Дыбыс керемет, шуды басатын жүйе өте жақсы жұмыс істейді!', date: '2026-09-28' },
        { id: 'rev_2', user_name: 'Елена К.', rating: 4, comment: 'Кіші басқа аздап басуы мүмкін, бірақ жалпы жақсы.', date: '2026-10-02' }
      ]
    }
  },
  uz: {
    product: {
      id: '1',
      name: 'Simsiz quloqchin Pro',
      price: 450000,
      category: 'Elektronika',
      rating: 4.8,
      stock_quantity: 25,
      description: 'To‘liq o‘lchamli simsiz quloqchinlar, faol shovqinni bostirish (ANC), aniq ovoz va 40 soatgacha batareya quvvati. Yumshoq ambushyuralar uzoq tinglashda qulaylik beradi.',
      image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
      seller: { store_name: 'TechWave Uzbekistan' },
      reviews: [
        { id: 'rev_1', user_name: 'Asadbek', rating: 5, comment: 'Ovozi ajoyib, shovqinni bostirish tizimi haqiqatan ham yaxshi ishlaydi!', date: '2026-09-28' },
        { id: 'rev_2', user_name: 'Elena K.', rating: 4, comment: 'Yaxshi quloqchin, lekin kichik boshga biroz bosim qiladi.', date: '2026-10-02' }
      ]
    }
  }
};

const translations = {
  ru: {
    back: 'Назад к каталогу',
    seller: 'Продавец',
    amount: 'Доступный остаток',
    pieces: 'шт.',
    addToCart: 'Добавить в корзину',
    addToCartSuccess: 'Добавлено в корзину',
    outOfStock: 'Недостаточно товара на складе!',
    leaveReview: 'Оставить отзыв',
    rating: 'Оценка',
    comment: 'Ваш комментарий',
    commentPlaceholder: 'Поделитесь впечатлениями о товаре...',
    sendReview: 'Отправить отзыв',
    reviewsTitle: 'Отзывы покупателей',
    anonymous: 'Анонимный покупатель',
    reviewAdded: 'Отзыв успешно добавлен!',
    emptyReview: 'Введите текст отзыва',
  },
  en: {
    back: 'Back to catalog',
    seller: 'Seller',
    amount: 'Available stock',
    pieces: 'pcs.',
    addToCart: 'Add to cart',
    addToCartSuccess: 'Added to cart',
    outOfStock: 'Not enough stock available!',
    leaveReview: 'Leave a review',
    rating: 'Rating',
    comment: 'Your comment',
    commentPlaceholder: 'Share your impressions about the product...',
    sendReview: 'Send review',
    reviewsTitle: 'Customer reviews',
    anonymous: 'Anonymous buyer',
    reviewAdded: 'Review added successfully!',
    emptyReview: 'Enter review text',
  },
  kk: {
    back: 'Каталогқа қайта оралу',
    seller: 'Сатушы',
    amount: 'Қолжетімді қалдық',
    pieces: 'дана',
    addToCart: 'Кошикке қосу',
    addToCartSuccess: 'Кошикке қосылды',
    outOfStock: 'Тауар жеткілікті емес!',
    leaveReview: 'Пікір қалдыру',
    rating: 'Баға',
    comment: 'Сіздің пікіріңіз',
    commentPlaceholder: 'Тауар туралы пікіріңізді бөлісіңіз...',
    sendReview: 'Пікір жіберу',
    reviewsTitle: 'Тұтынушы пікірлері',
    anonymous: 'Анонимды сатып алушы',
    reviewAdded: 'Пікір сәтті қосылды!',
    emptyReview: 'Пікір мәтінін енгізіңіз',
  },
  uz: {
    back: 'Katalogga qaytish',
    seller: 'Sotuvchi',
    amount: 'Mavjud zaxira',
    pieces: 'dona',
    addToCart: 'Savatga qo‘shish',
    addToCartSuccess: 'Savatga qo‘shildi',
    outOfStock: 'Mahsulot yetarli emas!',
    leaveReview: 'Sharh qoldirish',
    rating: 'Baholash',
    comment: 'Sizning sharhingiz',
    commentPlaceholder: 'Mahsulot haqida taassurotlaringizni yozing...',
    sendReview: 'Sharh yuborish',
    reviewsTitle: 'Mijozlar sharhlari',
    anonymous: 'Anonim xaridor',
    reviewAdded: 'Sharh muvaffaqiyatli qo‘shildi!',
    emptyReview: 'Sharh matnini kiriting',
  },
};

export const ProductDetail = () => {
  const { id } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.cartItems);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite);
  const { user } = useAuthStore();
  const { language } = useUiStore();
  const t = translations[language] || translations.ru;

  const [product, setProduct] = useState(mockProductDataByLanguage[language]?.product || mockProductDataByLanguage.ru.product);
  const [quantity, setQuantity] = useState(1);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const currentProduct = mockProductDataByLanguage[language]?.product || mockProductDataByLanguage.ru.product;
    setProduct(currentProduct);
  }, [language]);

  const productInCart = cartItems.find((item) => item.product_id === product.id);
  const cartQuantity = productInCart ? productInCart.quantity : 0;
  const liked = isFavorite(product.id);

  const handleAddToCart = () => {
    const success = addToCart(product, quantity);
    if (success) {
      toast.success(`${t.addToCartSuccess}: ${quantity} ${t.pieces}`);
    } else {
      toast.error(t.outOfStock);
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return toast.error(t.emptyReview);

    const newReview = {
      id: Math.random().toString(),
      user_name: user?.name || t.anonymous,
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0]
    };

    setProduct({
      ...product,
      reviews: [newReview, ...product.reviews]
    });

    setNewComment('');
    toast.success(t.reviewAdded);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen space-y-8">
      <Link to="/" className="inline-flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
        <ArrowLeft size={16} />
        <span>{t.back}</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border rounded-2xl p-6 shadow-sm">
        <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        </div>

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
              <span className="text-gray-500 font-medium">{t.seller}: <span className="text-gray-800 font-semibold">{product.seller.store_name}</span></span>
            </div>

            <p className="text-2xl font-black text-gray-900 pt-2">{product.price.toLocaleString()} сум</p>
            <div className="border-t border-b py-4 my-2 text-sm text-gray-600 leading-relaxed">
              {product.description}
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 p-4 rounded-xl border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">{t.amount}:</span>
              <span className="font-bold text-gray-800">{product.stock_quantity} {t.pieces}</span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => toggleFavorite(product)}
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  liked ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:text-pink-500'
                }`}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                <span>{liked ? 'В избранном' : 'В избранное'}</span>
              </button>

              <div className="flex items-center border rounded-xl bg-white p-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 font-bold text-gray-500 hover:text-gray-800">-</button>
                <span className="w-8 text-center text-sm font-bold text-gray-800">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))} className="px-3 py-1 font-bold text-gray-500 hover:text-gray-800">+</button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-sm ${
                  cartQuantity > 0
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100'
                }`}
              >
                <ShoppingCart size={18} />
                <span>{cartQuantity > 0 ? `В корзине (${cartQuantity})` : t.addToCart}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-600" />
            <span>{t.leaveReview}</span>
          </h3>
          <form onSubmit={handleAddReview} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t.rating}</label>
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
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t.comment}</label>
              <textarea
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t.commentPlaceholder}
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 focus:bg-white transition-all"
              />
            </div>
            <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
              {t.sendReview}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-800">{t.reviewsTitle} ({product.reviews.length})</h3>
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
