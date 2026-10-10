import React, { useState } from 'react';
import { ProductList } from './features/catalog/ProductList';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';
import { AdminDashboard } from './features/admin-dash/AdminDashboard';
import { SellerDashboard } from './features/seller-dash/SellerDashboard'; // Импортируем панель продавца 👈
import { LogOut, ShieldAlert, Store } from 'lucide-react';

export default function App() {
  // Экраны: 'catalog', 'login', 'register', 'admin', 'seller'
  const [currentScreen, setCurrentScreen] = useState('catalog');
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentScreen('admin');
    } else if (user.role === 'seller') {
      setCurrentScreen('seller'); // Если зашел продавец — кидаем в панель продавца 👈
    } else {
      setCurrentScreen('catalog');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setCurrentScreen('catalog');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Навигационная панель */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => setCurrentScreen('catalog')}
            className="text-lg font-bold text-blue-600 bg-transparent border-none cursor-pointer tracking-wider uppercase"
          >
            🛍️ Mini-Market
          </button>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-xl border">
                
                {/* Кнопка админки */}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setCurrentScreen('admin')}
                    className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <ShieldAlert size={14} /> Админка
                  </button>
                )}

                {/* Кнопка панели продавца: видна только продавцам */}
                {currentUser.role === 'seller' && (
                  <button
                    onClick={() => setCurrentScreen('seller')}
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Store size={14} /> Мой Магазин
                  </button>
                )}

                <div className="text-right">
                  <p className="text-xs font-bold text-gray-800">{currentUser.name}</p>
                  <p className="text-[10px] text-gray-400 capitalize">{currentUser.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="Выйти"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentScreen('login')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-sm"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="flex-1">
        {currentScreen === 'catalog' && <ProductList />}
        
        {currentScreen === 'login' && (
          <Login 
            onNavigateToRegister={() => setCurrentScreen('register')} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}
        
        {currentScreen === 'register' && (
          <Register 
            onNavigateToLogin={() => setCurrentScreen('login')} 
          />
        )}

        {currentScreen === 'admin' && <AdminDashboard />}
        
        {currentScreen === 'seller' && <SellerDashboard />}
      </main>

      <footer className="bg-white border-t py-4 text-center text-xs text-gray-400 mt-auto">
        &copy; 2026 Mini-Marketplace Final Project. Все права защищены.
      </footer>
    </div>
  );
}
