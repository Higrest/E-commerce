import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, ShoppingBag, TrendingUp, Package, LayoutDashboard, PackagePlus, BarChart3 } from 'lucide-react';
import { useUiStore } from '../../core/store/uiStore';
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

const translations = {
  ru: {
    title: 'Панель продавца',
    subtitle: 'Управление вашим магазином',
    addProduct: 'Добавить товар',
    myProducts: 'Мои товары',
    analytics: 'Статистика продаж',
    emptyTitle: 'Список ваших товаров пуст',
    emptyText: 'Используйте вкладку «Добавить товар», чтобы выставить позиции на маркетплейс.',
    totalRevenue: 'Общая выручка',
    totalSales: 'Продано товаров',
    avgOrder: 'Средний чек заказа',
    activeProducts: 'Активные товары',
    weeklyRevenue: 'Недельный доход (в сумах)',
    ordersByDay: 'Количество заказов (по дням)',
    sum: 'сум',
    pcs: 'шт.',
    pos: 'поз.',
  },
  en: {
    title: 'Seller dashboard',
    subtitle: 'Manage your store',
    addProduct: 'Add product',
    myProducts: 'My products',
    analytics: 'Sales statistics',
    emptyTitle: 'Your product list is empty',
    emptyText: 'Use the “Add product” tab to list products on the marketplace.',
    totalRevenue: 'Total revenue',
    totalSales: 'Products sold',
    avgOrder: 'Average order value',
    activeProducts: 'Active products',
    weeklyRevenue: 'Weekly revenue (in sum)',
    ordersByDay: 'Orders by day',
    sum: 'sum',
    pcs: 'pcs.',
    pos: 'items',
  },
  kk: {
    title: 'Сатушы панелі',
    subtitle: 'Дүкеніңізді басқару',
    addProduct: 'Тауар қосу',
    myProducts: 'Менің тауарларым',
    analytics: 'Сату статистикасы',
    emptyTitle: 'Сіздің тауарлар тізімі бос',
    emptyText: 'Маркетплейс пен сату үшін «Тауар қосу» қойындысын пайдаланыңыз.',
    totalRevenue: 'Жалпы табыс',
    totalSales: 'Сатылған тауарлар',
    avgOrder: 'Орташа тапсырыс сомасы',
    activeProducts: 'Белсенді тауарлар',
    weeklyRevenue: 'Апталық табыс (соммен)',
    ordersByDay: 'Тапсырыстар саны (күндер бойынша)',
    sum: 'сом',
    pcs: 'дана',
    pos: 'таңба',
  },
  uz: {
    title: 'Sotuvchi paneli',
    subtitle: 'Do‘koningizni boshqarish',
    addProduct: 'Mahsulot qo‘shish',
    myProducts: 'Mening mahsulotlarim',
    analytics: 'Savdo statistikasi',
    emptyTitle: 'Mahsulotlar ro‘yxati bo‘sh',
    emptyText: 'Marketplacega mahsulotlarni chiqarmoqchi bo‘lsangiz, «Mahsulot qo‘shish» tabidan foydalaning.',
    totalRevenue: 'Umumiy daromad',
    totalSales: 'Sotilgan mahsulotlar',
    avgOrder: 'O‘rtacha buyurtma qiymati',
    activeProducts: 'Faol mahsulotlar',
    weeklyRevenue: 'Haftalik daromad (so‘mda)',
    ordersByDay: 'Buyurtmalar soni (kunlar bo‘yicha)',
    sum: 'so‘m',
    pcs: 'dona',
    pos: 'poz.',
  },
};

export const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('add-product');
  const { language } = useUiStore();
  const t = translations[language] || translations.ru;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[85vh]">
      <div className="bg-white border rounded-2xl p-4 shadow-sm h-fit space-y-2">
        <div className="px-3 py-2 border-b mb-4">
          <h2 className="font-bold text-gray-800 text-base">{t.title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{t.subtitle}</p>
        </div>

        <button 
          onClick={() => setActiveTab('add-product')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer
            ${activeTab === 'add-product' ? 'bg-blue-50 text-blue-600' : 'bg-transparent text-gray-600 hover:bg-gray-50'}`}
        >
          <PackagePlus size={18} />
          <span>{t.addProduct}</span>
        </button>

        <button 
          onClick={() => setActiveTab('my-products')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer
            ${activeTab === 'my-products' ? 'bg-blue-50 text-blue-600' : 'bg-transparent text-gray-600 hover:bg-gray-50'}`}
        >
          <LayoutDashboard size={18} />
          <span>{t.myProducts}</span>
        </button>

        <button 
          onClick={() => setActiveTab('analytics')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer
            ${activeTab === 'analytics' ? 'bg-blue-50 text-blue-600' : 'bg-transparent text-gray-600 hover:bg-gray-50'}`}
        >
          <BarChart3 size={18} />
          <span>{t.analytics}</span>
        </button>
      </div>

      <div className="lg:col-span-3 space-y-8">
        {activeTab === 'add-product' && <ManageProducts />}

        {activeTab === 'my-products' && (
          <div className="text-center py-20 text-gray-500 bg-white border rounded-2xl shadow-sm">
            <p className="text-lg font-medium">{t.emptyTitle}</p>
            <p className="text-sm mt-1">{t.emptyText}</p>
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
                  <p className="text-sm font-medium text-gray-400">{t.totalRevenue}</p>
                  <h3 className="text-xl font-bold text-gray-800">{mockStats.totalRevenue.toLocaleString()} {t.sum}</h3>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-6 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">{t.totalSales}</p>
                  <h3 className="text-xl font-bold text-gray-800">{mockStats.totalSales} {t.pcs}</h3>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-6 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">{t.avgOrder}</p>
                  <h3 className="text-xl font-bold text-gray-800">{mockStats.averageOrderValue.toLocaleString()} {t.sum}</h3>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-6 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">{t.activeProducts}</p>
                  <h3 className="text-xl font-bold text-gray-800">{mockStats.activeProducts} {t.pos}</h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t.weeklyRevenue}</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockSalesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${v / 1000000}M`} />
                      <Tooltip formatter={(value) => [`${value.toLocaleString()} ${t.sum}`, t.totalRevenue]} />
                      <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t.ordersByDay}</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockSalesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip formatter={(value) => [`${value} ${t.pcs}`, t.analytics]} />
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
