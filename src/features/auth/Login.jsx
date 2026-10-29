import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../../core/store/authStore';
import { useUiStore } from '../../core/store/uiStore';

const texts = {
  ru: {
    title: 'Войти в аккаунт',
    subtitle: 'Введите свои данные для доступа к маркетплейсу',
    emailPlaceholder: 'EMAIL',
    passwordPlaceholder: 'ПАРОЛЬ',
    loginButton: 'Войти',
    loginLoading: 'Вход...',
    noAccount: 'Нет аккаунта?',
    register: 'Зарегистрироваться',
    emailError: 'Введите корректный email',
    passwordError: 'Пароль должен быть не менее 6 символов',
  },
  en: {
    title: 'Login to your account',
    subtitle: 'Enter your details to access the marketplace',
    emailPlaceholder: 'EMAIL',
    passwordPlaceholder: 'PASSWORD',
    loginButton: 'Login',
    loginLoading: 'Logging in...',
    noAccount: 'No account?',
    register: 'Register',
    emailError: 'Enter a valid email',
    passwordError: 'Password must be at least 6 characters',
  },
  kk: {
    title: 'Аккаунтқа кіру',
    subtitle: 'Маркетплейсқа кіру үшін деректеріңізді енгізіңіз',
    emailPlaceholder: 'EMAIL',
    passwordPlaceholder: 'ҚҰПИЯ СӨЗ',
    loginButton: 'Кіру',
    loginLoading: 'Кіру...',
    noAccount: 'Аккаунт жоқ?',
    register: 'Тіркелу',
    emailError: 'Дұрыс email енгізіңіз',
    passwordError: 'Құпия сөз кемінде 6 таңбадан болуы керек',
  },
  uz: {
    title: 'Hisobga kirish',
    subtitle: 'Marketplacega kirish uchun ma’lumotlaringizni kiriting',
    emailPlaceholder: 'EMAIL',
    passwordPlaceholder: 'PAROL',
    loginButton: 'Kirish',
    loginLoading: 'Kirish...',
    noAccount: 'Hisob yo‘qmi?',
    register: 'Ro‘yxatdan o‘tish',
    emailError: 'To‘g‘ri email kiriting',
    passwordError: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak',
  },
};

const loginSchema = (t) => z.object({
  email: z.string().email(t.emailError),
  password: z.string().min(6, t.passwordError),
});

export const Login = ({ onNavigateToRegister, onLoginSuccess }) => {
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { language } = useUiStore();
  const t = texts[language] || texts.ru;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema(t)),
  });

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: data.email,
        password: data.password,
      });

      const payload = response.data || {};
      const isSuccess =
        payload.status === 'success' ||
        payload.status === 'SUCCESS' ||
        payload.success === true ||
        response.status === 200 ||
        response.status === 201;

      if (isSuccess) {
        const user = payload.data?.user || payload.user || {
          name: data.email.split('@')[0],
          email: data.email,
          role: 'customer',
        };
        const token = payload.token || payload.data?.token || payload.accessToken || null;

        if (user) {
          login(user, token);
        }

        if (onLoginSuccess) {
          onLoginSuccess(user);
        }

        navigate('/');
        return;
      }

      setApiError(payload.message || 'Ошибка входа');
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || 'Ошибка подключения к серверу');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white border rounded-2xl shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-xl">
            <LogIn size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
          <p className="text-sm text-gray-500">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                placeholder={t.emailPlaceholder}
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
                placeholder={t.passwordPlaceholder}
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
            {isSubmitting ? t.loginLoading : t.loginButton}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            {t.noAccount}{' '}
            <button
              type="button"
              onClick={() => {
                if (onNavigateToRegister) {
                  onNavigateToRegister();
                  return;
                }
                navigate('/auth/register');
              }}
              className="text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer"
            >
              {t.register}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
