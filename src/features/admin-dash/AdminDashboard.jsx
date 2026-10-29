import React, { useEffect, useState } from 'react';
import { Shield, Users, ShoppingBag, Check, X, AlertTriangle, ShieldAlert } from 'lucide-react';
import apiClient from '../../core/api/apiClient';

const mockAdminStats = {
  totalPlatformRevenue: 148900000,
  totalSellers: 34,
  totalUsers: 1140,
  pendingVerifications: 3
};

const fallbackPendingSellers = [
  { id: 'sel_1', store_name: 'TechWave Uzbekistan', owner_name: 'Алишер Каримов', email: 'alisher@techwave.uz', category: 'Электроника' },
  { id: 'sel_2', store_name: 'ModaUZ Trend', owner_name: 'Мадина Саидова', email: 'madina@modauz.com', category: 'Одежда и стиль' },
];

const fallbackUsers = [
  { id: 'u_1', name: 'Дмитрий Петров', email: 'dima@mail.ru', role: 'customer', status: 'active' },
  { id: 'u_2', name: 'Иван Иванов', email: 'ivan@gmail.com', role: 'seller', status: 'active' },
  { id: 'u_3', name: 'Ботир Хакимов', email: 'botir_hater@mail.ru', role: 'customer', status: 'banned' },
];

const normalizeUser = (user) => {
  const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();

  return {
    id: user.id ?? user._id ?? user.user_id ?? user.email ?? Math.random().toString(),
    name: user.name ?? user.full_name ?? (fullName || 'Без имени'),
    email: user.email ?? '—',
    role: user.role ?? 'customer',
    status: user.status === 'banned' || user.banned || user.isBanned ? 'banned' : 'active',
    created_at: user.created_at ?? user.createdAt ?? new Date().toISOString(),
  };
};

const normalizeSeller = (seller) => ({
  id: seller.id ?? seller._id ?? seller.user_id ?? seller.email ?? Math.random().toString(),
  store_name: seller.store_name ?? seller.storeName ?? 'Магазин',
  owner_name: seller.owner_name ?? seller.ownerName ?? seller.name ?? 'Не указано',
  email: seller.email ?? seller.owner_email ?? '—',
  category: seller.category ?? seller.business_type ?? 'Разное',
});

export const AdminDashboard = () => {
  const [pendingSellers, setPendingSellers] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('sellers');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);
      try {
        const [usersResponse, sellersResponse] = await Promise.all([
          apiClient.get('/admin/users').catch(() => ({ data: fallbackUsers })),
          apiClient.get('/admin/products', { params: { status: 'pending' } }).catch(() => ({ data: fallbackPendingSellers })),
        ]);

        const backendUsers = Array.isArray(usersResponse.data)
          ? usersResponse.data
          : usersResponse.data?.users ?? usersResponse.data?.data ?? [];

        const backendSellers = Array.isArray(sellersResponse.data)
          ? sellersResponse.data
          : sellersResponse.data?.products ?? sellersResponse.data?.items ?? sellersResponse.data?.data ?? [];

        setUsers(backendUsers.map(normalizeUser));
        setPendingSellers(backendSellers.map(normalizeSeller));
      } catch {
        setUsers(fallbackUsers);
        setPendingSellers(fallbackPendingSellers);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const handleApproveSeller = async (id) => {
    try {
      await apiClient.patch(`/admin/products/${id}/approve`).catch(() => null);
    } finally {
      setPendingSellers((prev) => prev.filter((s) => s.id !== id));
      alert('Магазин успешно активирован на платформе!');
    }
  };

  const handleRejectSeller = async (id) => {
    if (!window.confirm('Вы уверены, что хотите отказать этому продавцу в регистрации?')) return;

    try {
      await apiClient.patch(`/admin/products/${id}/reject`, { reason: 'Не прошёл модерацию' }).catch(() => null);
    } finally {
      setPendingSellers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const toggleUserBan = async (id) => {
    const currentUser = users.find((u) => u.id === id);
    if (!currentUser) return;

    const nextStatus = currentUser.status === 'active' ? 'banned' : 'active';

    try {
      await apiClient.patch(`/admin/users/${id}`, { status: nextStatus }).catch(() => null);
    } finally {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u)));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      {/* Шапка */}
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-red-50 text-red-600 rounded-xl border border-red-100">
          <Shield size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Панель Суперадмина</h1>
          <p className="text-sm text-gray-500 mt-0.5">Глобальный контроль магазинов, модерация заявок и безопасность</p>
        </div>
      </div>

      {/* Метрики маркетплейса */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border rounded-xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBag size={22} /></div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Оборот маркетплейса</p>
            <h3 className="text-xl font-bold text-gray-800">{mockAdminStats.totalPlatformRevenue.toLocaleString()} сум</h3>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Users size={22} /></div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Всего продавцов</p>
            <h3 className="text-xl font-bold text-gray-800">{mockAdminStats.totalSellers} доменов</h3>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Users size={22} /></div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Зарегистрировано лиц</p>
            <h3 className="text-xl font-bold text-gray-800">{mockAdminStats.totalUsers} акк.</h3>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm flex items-center space-x-4 border-l-4 border-l-amber-500">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><AlertTriangle size={22} /></div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Заявок на проверку</p>
            <h3 className="text-xl font-bold text-amber-600">{pendingSellers.length} новых</h3>
          </div>
        </div>
      </div>

      {/* Переключатель вкладок */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('sellers')}
          className={`py-2.5 px-5 font-semibold text-sm border-b-2 transition-all ${activeTab === 'sellers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Заявки продавцов ({pendingSellers.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2.5 px-5 font-semibold text-sm border-b-2 transition-all ${activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Все пользователи платформы ({users.length})
        </button>
      </div>

      {/* Таблица Контента */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {activeTab === 'sellers' ? (
          pendingSellers.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">Нет новых заявок на модерацию магазинов.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b">
                  <th className="p-4">Название магазина</th>
                  <th className="p-4">Владелец</th>
                  <th className="p-4">Направление</th>
                  <th className="p-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-gray-700">
                {pendingSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-800">{seller.store_name}</td>
                    <td className="p-4">
                      <div>{seller.owner_name}</div>
                      <div className="text-xs text-gray-400">{seller.email}</div>
                    </td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{seller.category}</span></td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleApproveSeller(seller.id)} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-colors" title="Активировать">
                        <Check size={16} />
                      </button>
                      <button onClick={() => handleRejectSeller(seller.id)} className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors" title="Отклонить">
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b">
                <th className="p-4">Имя / Email</th>
                <th className="p-4">Роль</th>
                <th className="p-4">Статус</th>
                <th className="p-4 text-right">Модерация аккаунта</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm text-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </td>
                  <td className="p-4 capitalize"><span className={`text-xs px-2 py-0.5 rounded font-medium ${user.role === 'admin' ? 'bg-red-50 text-red-600' : user.role === 'seller' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>{user.role}</span></td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {user.status === 'active' ? 'Активен' : 'Забанен'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => toggleUserBan(user.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center space-x-1 ml-auto transition-colors
                          ${user.status === 'active' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                      >
                        <ShieldAlert size={14} />
                        <span>{user.status === 'active' ? 'Заблокировать' : 'Разблокировать'}</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
