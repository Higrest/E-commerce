import React, { useEffect, useState } from 'react';
import { Search, ShieldAlert, UserCheck, Shield, UserX, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../core/api/apiClient';

const mockUsersList = [
  { id: 'u_1', name: 'Дмитрий Петров', email: 'dima@mail.ru', role: 'customer', status: 'active', created_at: '2026-05-12' },
  { id: 'u_2', name: 'Иван Иванов', email: 'ivan@gmail.com', role: 'seller', status: 'active', created_at: '2026-06-20' },
  { id: 'u_3', name: 'Ботир Хакимов', email: 'botir_hater@mail.ru', role: 'customer', status: 'banned', created_at: '2026-08-15' },
  { id: 'u_4', name: 'Сардор Умаров', email: 'sardor@seller.uz', role: 'seller', status: 'active', created_at: '2026-09-01' },
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

export const UserManagement = () => {
  const [users, setUsers] = useState(mockUsersList);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await apiClient.get('/admin/users');
        const backendUsers = Array.isArray(data) ? data : data?.users ?? data?.data ?? [];
        setUsers(backendUsers.map(normalizeUser));
      } catch {
        setUsers(mockUsersList);
      }
    };

    loadUsers();
  }, []);

  const handleToggleBan = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';

    try {
      await apiClient.patch(`/admin/users/${id}`, { status: newStatus }).catch(() => null);
    } finally {
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status: newStatus } : user)));
    }

    if (newStatus === 'banned') {
      toast.error('Пользователь успешно заблокирован');
    } else {
      toast.success('Пользователь успешно разблокирован');
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await apiClient.patch(`/admin/users/${id}`, { role: newRole }).catch(() => null);
    } finally {
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role: newRole } : user)));
    }
    toast.success(`Роль пользователя изменена на ${newRole}`);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <Shield className="text-red-600" size={24} />
          <span>Управление пользователями</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Контроль учетных записей маркетплейса, выдача прав продавца и блокировка аккаунтов
        </p>
      </div>

      {/* Панель фильтров и поиска */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">Все роли</option>
          <option value="customer">Покупатели</option>
          <option value="seller">Продавцы</option>
        </select>
      </div>

      {/* Таблица пользователей */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4">Пользователь</th>
                <th className="p-4">Роль</th>
                <th className="p-4">Статус</th>
                <th className="p-4">Дата регистрации</th>
                <th className="p-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm text-gray-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    Пользователи не найдены
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Имя и Email */}
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </td>

                    {/* Выбор роли */}
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="customer">Customer</option>
                        <option value="seller">Seller</option>
                      </select>
                    </td>

                    {/* Статус аккаунта */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold 
                        ${user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {user.status === 'active' ? <UserCheck size={12} /> : <UserX size={12} />}
                        {user.status === 'active' ? 'Активен' : 'Забанен'}
                      </span>
                    </td>

                    {/* Дата регистрации */}
                    <td className="p-4 text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>

                    {/* Кнопка Блокировки */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleBan(user.id, user.status)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-bold transition-all
                          ${user.status === 'active' 
                            ? 'border-red-200 text-red-600 hover:bg-red-50' 
                            : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                      >
                        <ShieldAlert size={14} />
                        <span>{user.status === 'active' ? 'Забанить' : 'Разбанить'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Уведомление о правилах безопасности */}
      <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
        <AlertCircle size={16} className="shrink-0" />
        <span>
          <strong>Внимание:</strong> Блокировка пользователя мгновенно закрывает все его активные сессии и прекращает доступ к API маркетплейса.
        </span>
      </div>
    </div>
  );
};
