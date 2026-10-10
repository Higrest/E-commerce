import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../core/store/authStore';
import { useCartStore } from '../core/store/cartStore';
import { ShoppingCart, LogOut, Store, Shield, ShoppingBag } from 'lucide-react';

export const Layout = () => {
  const { user, logout, token } = useAuthStore();
  const cartItems = useCartStore((state) => state.cartItems);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Навигационная панель (Header) */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Логотип */}
          <Link to="/" className="text-xl font-black text-blue-600 tracking-tight flex items-center space-x-2">
            <Store size={24} />
            <span>MINI-MARKET</span>
          </Link>

          {/* Правая часть: меню в зависимости от авторизации и роли */}
          <div className="flex items-center space-x-4">
            {token && user ? (
              <div className="flex items-center space-x-4">
                {/* Если зашел Покупатель */}
                {user.role === 'customer' && (
                  <>
                    <Link to="/orders/history" className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center space-x-1">
                      <ShoppingBag size={18} />
                      <span className="hidden sm:inline">Мои заказы</span>
                    </Link>
                    <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <ShoppingCart size={22} />
                      {cartItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                          {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                {/* Если зашел Продавец */}
                {user.role === 'seller' && (
                  <Link to="/seller/dashboard" className="text-sm font-semibold bg-purple-50 text-purple-700 px-3 py-1.5 rounded-xl border border-purple-100 flex items-center space-x-1">
                    <Store size={16} />
                    <span>Панель продавца</span>
                  </Link>
                )}

                {/* Если зашел Админ */}
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="text-sm font-semibold bg-red-50 text-red-700 px-3 py-1.5 rounded-xl border border-red-100 flex items-center space-x-1">
                    <Shield size={16} />
                    <span>Админка</span>
                  </Link>
                )}

                {/* Профиль и кнопка Выхода */}
                <div className="flex items-center space-x-2 border-l pl-4 ml-2">
                  <div className="hidden md:block text-right">
                    <p className="text-xs font-bold text-gray-800">{user.name}</p>
                    <p className="text-[10px] text-gray-400 capitalize">{user.role}</p>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Выйти">
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              // Если гость (не авторизован)
              <Link to="/auth/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                Войти
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Основной контент страниц */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Простой футер */}
      <footer className="bg-white border-t py-6 text-center text-xs text-gray-400 mt-auto">
        &copy; {new Date().getFullYear()} Mini-Marketplace Final Project. Все права защищены.
      </footer>
    </div>
  );
};
