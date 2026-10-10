import React from 'react';
import { useCartStore } from '../../core/store/cartStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Имитация оформления заказа
    // В реальном проекте здесь будет: await apiClient.post('/orders', { items: cartItems })
    toast.success('Заказ успешно оформлен! Перенаправляем на трекер...');
    
    // Очищаем корзину после успешной покупки
    clearCart();
    
    // Перекидываем пользователя на страницу отслеживания (например, на тестовый ID)
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
        <h2 className="text-xl font-bold text-gray-800">Ваша корзина пуста</h2>
        <p className="text-sm text-gray-400 mt-1 mb-6">
          Вы еще не добавили ни одного товара в корзину маркетплейса.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-blue-100"
        >
          <ArrowLeft size={16} />
          <span>Вернуться в каталог</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
      
      {/* Левая часть: Список добавленных товаров */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-black text-gray-800">Ваша корзина</h1>
          <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-md">
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)} товаров
          </span>
        </div>
        
        {cartItems.map((item) => (
          <div key={item.product_id} className="flex flex-col sm:flex-row sm:items-center bg-white border rounded-2xl p-4 shadow-sm relative gap-4">
            
            {/* Картинка товара */}
            <img 
              src={item.image_url || 'https://unsplash.com'} 
              alt={item.name} 
              className="w-20 h-20 object-cover rounded-xl bg-gray-100 mx-auto sm:mx-0 border"
            />
            
            {/* Описание товара */}
            <div className="flex-1 text-center sm:text-left space-y-0.5">
              <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h3>
              <p className="text-green-600 font-black text-sm">{item.price.toLocaleString()} сум</p>
              <p className="text-[11px] text-gray-400">Доступно на складе: {item.stock_quantity} шт.</p>
            </div>

            {/* Панель изменения количества (+ / -) */}
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

            {/* Кнопка удаления */}
            <button 
              onClick={() => {
                removeFromCart(item.product_id);
                toast.error('Товар удален из корзины');
              }}
              className="text-gray-400 hover:text-red-500 transition-colors self-center p-2 rounded-xl hover:bg-red-50 sm:ml-2"
              title="Удалить товар"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Правая часть: Блок калькуляции стоимости и оформления */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm h-fit space-y-4">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-3">Детали заказа</h2>
        
        <div className="space-y-3 text-xs font-medium text-gray-500">
          <div className="flex justify-between">
            <span>Промежуточный итог:</span>
            <span className="text-gray-800 font-semibold">{totalPrice.toLocaleString()} сум</span>
          </div>
          <div className="flex justify-between">
            <span>Доставка по городу:</span>
            <span className="text-green-600 font-bold">Бесплатно</span>
          </div>
          <div className="flex justify-between text-sm font-black text-gray-900 border-t pt-3 mt-2">
            <span>Итого к оплате:</span>
            <span className="text-lg text-blue-600">{totalPrice.toLocaleString()} сум</span>
          </div>
        </div>

        {/* Кнопка создания заказа по бизнес-логике */}
        <button 
          onClick={handleCheckout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-100 text-sm tracking-wide"
        >
          Подтвердить и оформить
        </button>
        
        <div className="text-[10px] text-gray-400 text-center leading-normal pt-1">
          Нажимая кнопку, вы создаете заказ в статусе <span className="font-semibold text-gray-600">Pending</span>. Сток товаров автоматически зарезервируется.
        </div>
      </div>
    </div>
  );
};
