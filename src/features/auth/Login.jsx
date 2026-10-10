import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { LogIn, Mail, Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});

export const Login = ({ onNavigateToRegister, onLoginSuccess }) => {
  const [apiError, setApiError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      // Делаем реальный запрос к бэкенду вместо старой моковой проверки
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: data.email,
        password: data.password
      });

      if (response.data.status === 'success') {
        // Сохраняем реальный токен в localStorage
        localStorage.setItem('token', response.data.token);
        
        // Передаем данные пользователя наверх (в App.jsx или Zustand стор)
        if (onLoginSuccess) {
          onLoginSuccess(response.data.data.user);
        }
        
        alert(`С возвращением, ${response.data.data.user.name}!`);
      }
    } catch (err) {
      // Выводим реальную ошибку бэкенда ("Неверный email или пароль")
      setApiError(err.response?.data?.message || 'Ошибка подключения к серверу');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white border rounded-2xl shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-xl">
            <LogIn size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Войти в аккаунт</h2>
          <p className="text-sm text-gray-500">Введите свои данные для доступа к маркетплейсу</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                placeholder="EMAIL"
                {...register('email')}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 px-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                placeholder="ПАРОЛЬ"
                {...register('password')}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 px-1">{errors.password.message}</p>}
          </div>

          {apiError && (
            <p className="text-sm text-red-500 text-center font-medium bg-red-50 py-2 rounded-xl border border-red-100">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm disabled:bg-blue-400 cursor-pointer"
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Нет аккаунта?{' '}
            <button
              onClick={onNavigateToRegister}
              className="text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer"
            >
              Зарегистрироваться
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
