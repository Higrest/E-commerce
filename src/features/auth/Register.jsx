import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../../core/store/authStore';
import { useUiStore } from '../../core/store/uiStore';

const texts = {
  ru: {
    title: 'Создать аккаунт',
    subtitle: 'Заполните данные для регистрации',
    customer: 'Покупатель',
    seller: 'Продавец',
    namePlaceholder: 'Имя пользователя',
    emailPlaceholder: 'Электронная почта',
    passwordPlaceholder: 'Пароль',
    storePlaceholder: 'Название вашего магазина',
    descriptionPlaceholder: 'Краткое описание магазина',
    registerButton: 'Зарегистрироваться',
    registerLoading: 'Создание аккаунта...',
    loginText: 'Уже есть аккаунт?',
    loginLink: 'Войти',
    passwordError: 'Пароль должен быть не менее 6 символов',
    sellerError: 'Для продавца необходимо указать название магазина',
    success: 'Регистрация прошла успешно!',
  },
  en: {
    title: 'Create account',
    subtitle: 'Fill in your registration details',
    customer: 'Customer',
    seller: 'Seller',
    namePlaceholder: 'Username',
    emailPlaceholder: 'Email address',
    passwordPlaceholder: 'Password',
    storePlaceholder: 'Your store name',
    descriptionPlaceholder: 'Short store description',
    registerButton: 'Register',
    registerLoading: 'Creating account...',
    loginText: 'Already have an account?',
    loginLink: 'Login',
    passwordError: 'Password must be at least 6 characters',
    sellerError: 'Seller must provide a store name',
    success: 'Registration successful!',
  },
  kk: {
    title: 'Аккаунт құру',
    subtitle: 'Тіркеу үшін мәліметтерді толтырыңыз',
    customer: 'Сатып алу',
    seller: 'Сатушы',
    namePlaceholder: 'Пайдаланушы аты',
    emailPlaceholder: 'Электрондық пошта',
    passwordPlaceholder: 'Құпия сөз',
    storePlaceholder: 'Сіздің дүкеніңіздің атауы',
    descriptionPlaceholder: 'Дүкен туралы қысқаша сипаттама',
    registerButton: 'Тіркелу',
    registerLoading: 'Аккаунт жасалуда...',
    loginText: 'Аккаунт бар ма?',
    loginLink: 'Кіру',
    passwordError: 'Құпия сөз кемінде 6 таңбадан болуы керек',
    sellerError: 'Сатушы үшін дүкен атауын көрсету қажет',
    success: 'Тіркеу сәтті өтті!',
  },
  uz: {
    title: 'Hisob yaratish',
    subtitle: 'Ro‘yxatdan o‘tish uchun ma’lumotlarni to‘ldiring',
    customer: 'Xaridor',
    seller: 'Sotuvchi',
    namePlaceholder: 'Foydalanuvchi ismi',
    emailPlaceholder: 'Elektron pochta',
    passwordPlaceholder: 'Parol',
    storePlaceholder: 'Do‘koningiz nomi',
    descriptionPlaceholder: 'Do‘kon haqida qisqacha tavsif',
    registerButton: 'Ro‘yxatdan o‘tish',
    registerLoading: 'Hisob yaratilmoqda...',
    loginText: 'Hisobingiz bormi?',
    loginLink: 'Kirish',
    passwordError: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak',
    sellerError: 'Sotuvchi uchun do‘kon nomi kerak',
    success: 'Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi!',
  },
};

export const Register = ({ onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { language } = useUiStore();
  const t = texts[language] || texts.ru;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setApiError(t.passwordError);
      return;
    }

    if (role === 'seller' && !storeName.trim()) {
      setApiError(t.sellerError);
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
        description: role === 'seller' ? description : undefined,
      };

      const response = await axios.post('http://localhost:5000/api/auth/register', payload);
      const responseData = response.data || {};
      const isSuccess =
        responseData.status === 'success' ||
        responseData.status === 'SUCCESS' ||
        responseData.success === true ||
        response.status === 200 ||
        response.status === 201;

      if (isSuccess) {
        const user = responseData.data?.user || responseData.user || {
          name,
          email,
          role,
        };
        const token = responseData.token || responseData.data?.token || responseData.accessToken || null;

        if (user) {
          login(user, token);
        }

        setSuccessMessage(t.success);

        const redirect = () => {
          if (onNavigateToLogin) {
            onNavigateToLogin();
            return;
          }

          navigate('/auth/login');
        };

        setTimeout(redirect, 1500);
        return;
      }

      setApiError(responseData.message || 'Ошибка регистрации');
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || 'Ошибка подключения к серверу');
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
          <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
          <p className="text-sm text-gray-500">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Ваша роль</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex items-center justify-center gap-2 p-3 border rounded-xl text-sm font-medium transition-all cursor-pointer
                  ${role === 'customer' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                <User size={16} /> {t.customer}
              </button>
              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`flex items-center justify-center gap-2 p-3 border rounded-xl text-sm font-medium transition-all cursor-pointer
                  ${role === 'seller' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                <ShoppingBag size={16} /> {t.seller}
              </button>
            </div>
          </div>

          {/* Поле Имя */}
          <div className="space-y-1">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder={t.namePlaceholder}
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
                placeholder={t.emailPlaceholder}
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
                placeholder={t.passwordPlaceholder}
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
                  placeholder={t.storePlaceholder}
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder={t.descriptionPlaceholder}
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
            {loading ? t.registerLoading : t.registerButton}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            {t.loginText}{' '}
            <button
              type="button"
              onClick={() => {
                if (onNavigateToLogin) {
                  onNavigateToLogin();
                  return;
                }
                navigate('/auth/login');
              }}
              className="text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer"
            >
              {t.loginLink}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
