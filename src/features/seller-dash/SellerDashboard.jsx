import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, ShoppingBag, TrendingUp, Package, LayoutDashboard, PackagePlus, BarChart3 } from 'lucide-react';
import { ManageProducts } from './ManageProducts';

const mockStats = {
  totalRevenue: 24500000,
  totalSales: 142,
  averageOrderValue: 172500,
  activeProducts: 18
};

const mockSalesData = [
  { name: 'Пн', sales: 12, revenue: 1200000 },
  { name: 'Вт', sales: 19, revenue: 2100000 },
  { name: 'Ср', sales: 15, revenue: 1700000 },
  { name: 'Чт', sales: 27, revenue: 3400000 },
  { name: 'Пт', sales: 32, revenue: 4500000 },
  { name: 'Сб', sales: 45, revenue: 6800000 },
  { name: 'Вс', sales: 38, revenue: 4800000 },
];

export const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('add-product');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[85vh]">
      <div className="bg-white border rounded-2xl p-4 shadow-sm h-fit space-y-2">
        <div className="px-3 py-2 border-b mb-4">
          <h2 className="font-bold text-gray-800 text-base">Панель продавца</h2>
          <p className="text-xs text-gray-400 mt-0.5">Управление вашим магазином</p>
        </div>

        <button 
          onClick={() => setActiveTab('add-product')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer
            ${activeTab === 'add-product' ? 'bg-blue-50 text-blue-600' : 'bg-transparent text-gray-600 hover:bg-gray-50'}`}
        >
          <PackagePlus size={18} />
          <span>Добавить товар</span>
        </button>

        <button 
          onClick={() => setActiveTab('my-products')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer
            ${activeTab === 'my-products' ? 'bg-blue-50 text-blue-600' : 'bg-transparent text-gray-600 hover:bg-gray-50'}`}
        >
          <LayoutDashboard size={18} />
          <span>Мои товары</span>
        </button>

        <button 
          onClick={() => setActiveTab('analytics')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer
            ${activeTab === 'analytics' ? 'bg-blue-50 text-blue-600' : 'bg-transparent text-gray-600 hover:bg-gray-50'}`}
        >
          <BarChart3 size={18} />
          <span>Статистика продаж</span>
        </button>
      </div>

      <div className="lg:col-span-3 space-y-8">
        {activeTab === 'add-product' && <ManageProducts />}

        {activeTab === 'my-products' && (
          <div className="text-center py-20 text-gray-500 bg-white border rounded-2xl shadow-sm">
            <p className="text-lg font-medium">Список ваших товаров пуст</p>
            <p className="text-sm mt-1">Используйте вкладку «Добавить товар», чтобы выставить позиции на маркетплейс.</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border rounded-xl p-6 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Общая выручка</p>
                  <h3 className="text-xl font-bold text-gray-800">{mockStats.totalRevenue.toLocaleString()} сум</h3>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-6 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Продано товаров</p>
                  <h3 className="text-xl font-bold text-gray-800">{mockStats.totalSales} шт.</h3>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-6 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Средний чек заказа</p>
                  <h3 className="text-xl font-bold text-gray-800">{mockStats.averageOrderValue.toLocaleString()} сум</h3>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-6 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Active товары</p>
                  <h3 className="text-xl font-bold text-gray-800">{mockStats.activeProducts} поз.</h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Недельный доход (в сумах)</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockSalesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${v / 1000000}M`} />
                      <Tooltip formatter={(value) => [`${value.toLocaleString()} сум`, 'Выручка']} />
                      <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Количество заказов (по дням)</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockSalesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip formatter={(value) => [`${value} шт.`, 'Продажи']} />
                      <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
