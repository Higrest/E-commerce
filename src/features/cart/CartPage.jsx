import React from 'react';
import { useCartStore } from '../../core/store/cartStore';
import { useUiStore } from '../../core/store/uiStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const translations = {
  ru: {
    emptyTitle: 'Ваша корзина пуста',
    emptyText: 'Вы еще не добавили ни одного товара в корзину маркетплейса.',
    back: 'Вернуться в каталог',
    cartTitle: 'Ваша корзина',
    items: 'товаров',
    available: 'Доступно на складе',
    remove: 'Удалить товар',
    details: 'Детали заказа',
    subtotal: 'Промежуточный итог',
    delivery: 'Доставка по городу',
    free: 'Бесплатно',
    total: 'Итого к оплате',
    checkout: 'Подтвердить и оформить',
    checkoutSuccess: 'Заказ успешно оформлен! Перенаправляем на трекер...',
    removeSuccess: 'Товар удален из корзины',
    helper: 'Нажимая кнопку, вы создаете заказ в статусе',
    reserved: 'Сток товаров автоматически зарезервируется.',
    sum: 'сум',
  },
  en: {
    emptyTitle: 'Your cart is empty',
    emptyText: 'You have not added any products to the marketplace cart yet.',
    back: 'Back to catalog',
    cartTitle: 'Your cart',
    items: 'items',
    available: 'Available in stock',
    remove: 'Remove item',
    details: 'Order details',
    subtotal: 'Subtotal',
    delivery: 'City delivery',
    free: 'Free',
    total: 'Total to pay',
    checkout: 'Confirm and place order',
    checkoutSuccess: 'Order placed successfully! Redirecting to tracking...',
    removeSuccess: 'Item removed from cart',
    helper: 'By clicking the button, you create an order in the status',
    reserved: 'Stock is automatically reserved.',
    sum: 'sum',
  },
  kk: {
    emptyTitle: 'Себетіңіз бос',
    emptyText: 'Сіз маркетплейс себетіне әлі бірдеңе қоспадыңыз.',
    back: 'Каталогқа қайту',
    cartTitle: 'Сіздің себетіңіз',
    items: 'тауар',
    available: 'Қоймадан қолжетімді',
    remove: 'Тауарды жою',
    details: 'Тапсырыс мәліметтері',
    subtotal: 'Жалпы сомасы',
    delivery: 'Қала бойынша жеткізу',
    free: 'Тегін',
    total: 'Жалпы төлем',
    checkout: 'Растау және тапсырыс беру',
    checkoutSuccess: 'Тапсырыс сәтті қабылданды! Трекерге бағыттау...',
    removeSuccess: 'Тауар себеттен жойылды',
    helper: 'Кнопканы басу арқылы сіз тапсырысты күйде жасайсыз',
    reserved: 'Тауарлар запасы автоматты түрде брондалды.',
    sum: 'сом',
  },
  uz: {
    emptyTitle: 'Savat bo‘sh',
    emptyText: 'Marketplace savatiga hali hech narsa qo‘shmadingiz.',
    back: 'Katalogga qaytish',
    cartTitle: 'Savat',
    items: 'mahsulot',
    available: 'Skladda mavjud',
    remove: 'Mahsulotni olib tashlash',
    details: 'Buyurtma tafsilotlari',
    subtotal: 'Umumiy summa',
    delivery: 'Shahar bo‘yicha yetkazib berish',
    free: 'Bepul',
    total: 'Umumiy to‘lov',
    checkout: 'Tasdiqlash va buyurtma berish',
    checkoutSuccess: 'Buyurtma muvaffaqiyatli qabul qilindi! Trackerga yo‘naltirilmoqda...',
    removeSuccess: 'Mahsulot savatdan olib tashlandi',
    helper: 'Tugmani bosgan holda siz buyurtmani holatda yaratasiz',
    reserved: 'Mahsulotlar zaxirasi avtomatik bron qilinadi.',
    sum: 'so‘m',
  },
};

export const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCartStore();
  const { language } = useUiStore();
  const totalPrice = getTotalPrice();
  const navigate = useNavigate();
  const t = translations[language] || translations.ru;

  const handleCheckout = () => {
    toast.success(t.checkoutSuccess);
    clearCart();
    setTimeout(() => {
      navigate('/orders/history');
    }, 1500);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 max-w-md mx-auto text-center px-4 animate-in fade-in duration-300">
        <div className="p-4 bg-gray-100 text-gray-400 rounded-full mb-4">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">{t.emptyTitle}</h2>
        <p className="text-sm text-gray-400 mt-1 mb-6">
          {t.emptyText}
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-blue-100"
        >
          <ArrowLeft size={16} />
          <span>{t.back}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-black text-gray-800">{t.cartTitle}</h1>
          <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-md">
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)} {t.items}
          </span>
        </div>
        
        {cartItems.map((item) => (
          <div key={item.product_id} className="flex flex-col sm:flex-row sm:items-center bg-white border rounded-2xl p-4 shadow-sm relative gap-4">
            <img 
              src={item.image_url || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=80'} 
              alt={item.name} 
              className="w-20 h-20 object-cover rounded-xl bg-gray-100 mx-auto sm:mx-0 border"
            />
            
            <div className="flex-1 text-center sm:text-left space-y-0.5">
              <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h3>
              <p className="text-green-600 font-black text-sm">{item.price.toLocaleString()} {t.sum}</p>
              <p className="text-[11px] text-gray-400">{t.available}: {item.stock_quantity} шт.</p>
            </div>

            <div className="flex items-center justify-center space-x-2 border rounded-xl p-1 bg-gray-50 h-fit mx-auto sm:mx-0">
              <button 
                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="p-1.5 rounded-lg hover:bg-white text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                disabled={item.quantity >= item.stock_quantity}
                className="p-1.5 rounded-lg hover:bg-white text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            <button 
              onClick={() => {
                removeFromCart(item.product_id);
                toast.error(t.removeSuccess);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors self-center p-2 rounded-xl hover:bg-red-50 sm:ml-2"
              title={t.remove}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-2xl p-6 shadow-sm h-fit space-y-4">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-3">{t.details}</h2>
        
        <div className="space-y-3 text-xs font-medium text-gray-500">
          <div className="flex justify-between">
            <span>{t.subtotal}:</span>
            <span className="text-gray-800 font-semibold">{totalPrice.toLocaleString()} {t.sum}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.delivery}:</span>
            <span className="text-green-600 font-bold">{t.free}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-gray-900 border-t pt-3 mt-2">
            <span>{t.total}:</span>
            <span className="text-lg text-blue-600">{totalPrice.toLocaleString()} {t.sum}</span>
          </div>
        </div>

        <button 
          onClick={handleCheckout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-100 text-sm tracking-wide"
        >
          {t.checkout}
        </button>
        
        <div className="text-[10px] text-gray-400 text-center leading-normal pt-1">
          {t.helper} <span className="font-semibold text-gray-600">Pending</span>. {t.reserved}
        </div>
      </div>
    </div>
  );
};
