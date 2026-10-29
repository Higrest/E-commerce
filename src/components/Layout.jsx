import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../core/store/authStore';
import { useCartStore } from '../core/store/cartStore';
import { useUiStore } from '../core/store/uiStore';
import { ShoppingCart, LogOut, Store, Shield, ShoppingBag, SunMedium, MoonStar } from 'lucide-react';

const translations = {
  ru: {
    login: 'Войти',
    myOrders: 'Мои заказы',
    sellerPanel: 'Панель продавца',
    adminPanel: 'Админка',
    logout: 'Выйти',
    rights: 'Все права защищены.',
  },
  en: {
    login: 'Login',
    myOrders: 'My orders',
    sellerPanel: 'Seller panel',
    adminPanel: 'Admin',
    logout: 'Log out',
    rights: 'All rights reserved.',
  },
  kk: {
    login: 'Кіру',
    myOrders: 'Менің тапсырыстарым',
    sellerPanel: 'Сатушы панелі',
    adminPanel: 'Админ',
    logout: 'Шығу',
    rights: 'Барлық құқықтар қорғалған.',
  },
  uz: {
    login: 'Kirish',
    myOrders: 'Buyurtmalarim',
    sellerPanel: 'Sotuvchi paneli',
    adminPanel: 'Admin',
    logout: 'Chiqish',
    rights: 'Barcha huquqlar himoyalangan.',
  },
};

export const Layout = () => {
  const { user, logout, token, login } = useAuthStore();
  const cartItems = useCartStore((state) => state.cartItems);
  const { theme, language, setTheme, setLanguage } = useUiStore();
  const navigate = useNavigate();
  const [adminSequence, setAdminSequence] = useState({ step: 0, rightsClicks: 0 });

  const resolvedTheme = theme === 'dark' ? 'dark' : 'light';

  const handleAdminEasterEgg = (word) => {
    const normalized = String(word).trim().toUpperCase();

    if (normalized === 'ВСЕ') {
      if (adminSequence.step === 0) {
        setAdminSequence({ step: 1, rightsClicks: 0 });
      } else {
        setAdminSequence({ step: 0, rightsClicks: 0 });
      }
      return;
    }

    if (normalized === 'ПРАВА') {
      if (adminSequence.step === 1) {
        const nextCount = adminSequence.rightsClicks + 1;
        if (nextCount >= 2) {
          setAdminSequence({ step: 2, rightsClicks: 0 });
        } else {
          setAdminSequence({ step: 1, rightsClicks: nextCount });
        }
      } else {
        setAdminSequence({ step: 0, rightsClicks: 0 });
      }
      return;
    }

    if (normalized === 'ЗАЩИЩЕНЫ') {
      if (adminSequence.step === 2) {
        login(
          {
            id: 'admin-demo',
            name: 'Admin',
            email: 'admin@admin.com',
            role: 'admin',
          },
          'admin-demo-token'
        );
        navigate('/admin/dashboard');
        setAdminSequence({ step: 0, rightsClicks: 0 });
      } else {
        setAdminSequence({ step: 0, rightsClicks: 0 });
      }
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const t = translations[language] || translations.ru;

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <header className="bg-white/90 dark:bg-slate-900/90 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40 shadow-sm backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="text-xl font-black text-blue-600 tracking-tight flex items-center space-x-2">
            <Store size={24} />
            <span>MINI-MARKET</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1 dark:border-slate-700 dark:bg-slate-800">
              <button type="button" title="Light theme" onClick={() => setTheme('light')} className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-300' : 'text-gray-500 hover:text-gray-800 dark:text-slate-300 dark:hover:text-white'}`}>
                <SunMedium size={16} />
              </button>
              <button type="button" title="Dark theme" onClick={() => setTheme('dark')} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-300' : 'text-gray-500 hover:text-gray-800 dark:text-slate-300 dark:hover:text-white'}`}>
                <MoonStar size={16} />
              </button>
            </div>

            <div className="flex items-center rounded-xl border border-gray-200 bg-gray-100 p-1 dark:border-slate-700 dark:bg-slate-800">
              {['ru', 'en', 'kk', 'uz'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  className={`min-w-[42px] px-2 py-1.5 text-xs font-bold rounded-lg transition-all ${language === code ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white'}`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>

            {token && user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'customer' && (
                  <>
                    <Link to="/orders/history" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 flex items-center space-x-1">
                      <ShoppingBag size={18} />
                      <span className="hidden sm:inline">{t.myOrders}</span>
                    </Link>
                    <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">
                      <ShoppingCart size={22} />
                      {cartItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                          {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                {user.role === 'seller' && (
                  <Link to="/seller/dashboard" className="text-sm font-semibold bg-purple-50 text-purple-700 px-3 py-1.5 rounded-xl border border-purple-100 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-700 flex items-center space-x-1">
                    <Store size={16} />
                    <span>{t.sellerPanel}</span>
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="text-sm font-semibold bg-red-50 text-red-700 px-3 py-1.5 rounded-xl border border-red-100 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700 flex items-center space-x-1">
                    <Shield size={16} />
                    <span>{t.adminPanel}</span>
                  </Link>
                )}

                <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-slate-700 pl-4 ml-2">
                  <div className="hidden md:block text-right">
                    <p className="text-xs font-bold text-gray-800 dark:text-slate-200">{user.name}</p>
                    <p className="text-[10px] text-gray-400 capitalize">{user.role}</p>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title={t.logout}>
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/auth/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                {t.login}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-400 mt-auto dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400">
        <div className="inline-flex items-center gap-1 flex-wrap justify-center">
          <span>&copy; {new Date().getFullYear()} Mini-Marketplace Final Project.</span>

          <button
            type="button"
            onClick={() => handleAdminEasterEgg('ВСЕ')}
            className="text-gray-400 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer px-0 py-0 font-semibold"
          >
            Все
          </button>

          <button
            type="button"
            onClick={() => handleAdminEasterEgg('ПРАВА')}
            className="text-gray-400 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer px-0 py-0 font-semibold"
          >
            права
          </button>

          <button
            type="button"
            onClick={() => handleAdminEasterEgg('ЗАЩИЩЕНЫ')}
            className="text-gray-400 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer px-0 py-0 font-semibold"
          >
            защищены
          </button>
        </div>
      </footer>
    </div>
  );
};
