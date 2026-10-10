import React, { useState } from 'react';
import { Shield, Users, ShoppingBag, Check, X, AlertTriangle, ShieldAlert } from 'lucide-react';

// Моковые данные платформы для админа
const mockAdminStats = {
  totalPlatformRevenue: 148900000,
  totalSellers: 34,
  totalUsers: 1140,
  pendingVerifications: 3
};

const mockPendingSellers = [
  { id: 'sel_1', store_name: 'TechWave Uzbekistan', owner_name: 'Алишер Каримов', email: 'alisher@techwave.uz', category: 'Электроника' },
  { id: 'sel_2', store_name: 'ModaUZ Trend', owner_name: 'Мадина Саидова', email: 'madina@modauz.com', category: 'Одежда и стиль' },
];

const mockAllUsers = [
  { id: 'u_1', name: 'Дмитрий Петров', email: 'dima@mail.ru', role: 'customer', status: 'active' },
  { id: 'u_2', name: 'Иван Иванов', email: 'ivan@gmail.com', role: 'seller', status: 'active' },
  { id: 'u_3', name: 'Ботир Хакимов', email: 'botir_hater@mail.ru', role: 'customer', status: 'banned' },
];

export const AdminDashboard = () => {
  const [pendingSellers, setPendingSellers] = useState(mockPendingSellers);
  const [users, setUsers] = useState(mockAllUsers);
  const [activeTab, setActiveTab] = useState('sellers'); // sellers | users

  // Модерация продавца: Одобрение
  const handleApproveSeller = (id) => {
    alert('Магазин успешно активирован на платформе!');
    setPendingSellers(pendingSellers.filter(s => s.id !== id));
  };

  // Модерация продавца: Отклонение
  const handleRejectSeller = (id) => {
    if (window.confirm('Вы уверены, что хотите отказать этому продавцу в регистрации?')) {
      setPendingSellers(pendingSellers.filter(s => s.id !== id));
    }
  };

  // Блокировка / Разблокировка пользователей
  const toggleUserBan = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const newStatus = u.status === 'active' ? 'banned' : 'active';
        return { ...u, status: newStatus };
      }
      return u;
    }));
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
