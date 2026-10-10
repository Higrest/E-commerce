import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, User, Mail, Lock, ShoppingBag } from 'lucide-react';

export const Register = ({ onNavigateToLogin }) => {
  // Локальные состояния полей формы
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // По умолчанию строго customer
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');

  // Состояния уведомлений и загрузки
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);
    // Минимальная валидация длины пароля
    if (password.length < 6) {
      setApiError('Пароль должен быть не менее 6 символов');
      return;
    }

    if (role === 'seller' && !storeName.trim()) {
      setApiError('Для продавца необходимо указать название магазина');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        store_name: role === 'seller' ? storeName : undefined,
        description: role === 'seller' ? description : undefined
      };

      const response = await axios.post('http://localhost:5000/api/auth/register', payload);
      
      if (response.data.status === 'success') {
        localStorage.setItem('token', response.data.token);
        setSuccessMessage('Регистрация прошла успешно!');
        if (onNavigateToLogin) {
          setTimeout(onNavigateToLogin, 1500);
        }
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white border rounded-2xl shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-xl">
            <UserPlus size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Создать аккаунт</h2>
          <p className="text-sm text-gray-500">Заполните данные для регистрации</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Выбор роли */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Ваша роль</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex items-center justify-center gap-2 p-3 border rounded-xl text-sm font-medium transition-all cursor-pointer
                  ${role === 'customer' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                <User size={16} /> Покупатель
              </button>
              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`flex items-center justify-center gap-2 p-3 border rounded-xl text-sm font-medium transition-all cursor-pointer
                  ${role === 'seller' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                <ShoppingBag size={16} /> Продавец
              </button>
            </div>
          </div>

          {/* Поле Имя */}
          <div className="space-y-1">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Имя пользователя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Поле Email */}
          <div className="space-y-1">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                placeholder="Электронная почта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Поле Пароль */}
          <div className="space-y-1">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Дополнительные поля для продавца */}
          {role === 'seller' && (
            <div className="space-y-3 pt-2 border-t">
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Название вашего магазина"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Краткое описание магазина"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          {apiError && <p className="text-sm text-red-500 text-center font-medium bg-red-50 py-2 rounded-xl border border-red-100">{apiError}</p>}
          {successMessage && <p className="text-sm text-green-500 text-center font-medium bg-green-50 py-2 rounded-xl border border-green-100">{successMessage}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm disabled:bg-blue-400 cursor-pointer"
          >
            {loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Уже есть аккаунт?{' '}
            <button onClick={onNavigateToLogin} className="text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer">
              Войти
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
