import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, Clock, CheckCircle, Package, Truck, XCircle } from 'lucide-react';

// Моковые данные заказов текущего покупателя (для имитации /api/orders)
const mockOrdersHistory = [
  { id: 'ord_101', created_at: '2026-10-01T14:32:00.000Z', total_price: 1350000, status: 'processing', payment_status: 'paid' },
  { id: 'ord_102', created_at: '2026-09-25T09:15:00.000Z', total_price: 85000, status: 'delivered', payment_status: 'paid' },
  { id: 'ord_103', created_at: '2026-10-05T18:40:00.000Z', total_price: 450000, status: 'pending', payment_status: 'unpaid' },
  { id: 'ord_104', created_at: '2026-08-12T11:20:00.000Z', total_price: 320000, status: 'cancelled', payment_status: 'refunded' },
];

// Маппинг стилей и иконок для разных статусов жизненного цикла заказа
const STATUS_CONFIG = {
  pending: { label: 'Ожидает оплаты', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  confirmed: { label: 'Подтвержден', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: CheckCircle },
  processing: { label: 'В сборке', bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: Package },
  shipped: { label: 'Отправлен', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Truck },
  delivered: { label: 'Доставлен', bg: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
  cancelled: { label: 'Отменен', bg: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
};

export const OrderHistory = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 min-h-screen space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <ShoppingBag className="text-blue-600" size={24} />
          <span>История ваших заказов</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">Отслеживайте текущие посылки и просматривайте архив покупок</p>
      </div>

      {mockOrdersHistory.length === 0 ? (
        <div className="text-center py-20 bg-white border rounded-2xl shadow-sm text-gray-400">
          <ShoppingBag size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-base">Вы еще ничего не заказывали</p>
        </div>
      ) : (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4">ID Заказа</th>
                  <th className="p-4">Дата оформления</th>
                  <th className="p-4">Сумма</th>
                  <th className="p-4">Статус заказа</th>
                  <th className="p-4 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-gray-700">
                {mockOrdersHistory.map((order) => {
                  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* ID Заказа */}
                      <td className="p-4 font-bold text-gray-900">#{order.id}</td>
                      
                      {/* Дата */}
                      <td className="p-4 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()} в{' '}
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      
                      {/* Сумма */}
                      <td className="p-4 font-black text-gray-800">
                        {order.total_price.toLocaleString()} сум
                        <span className="block text-[10px] font-medium text-gray-400 capitalize">
                          Оплата: {order.payment_status}
                        </span>
                      </td>
                      
                      {/* Статус со значком */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-bold ${statusInfo.bg}`}>
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </span>
                      </td>
                      
                      {/* Кнопка отслеживания */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => navigate(`/orders/track/${order.id}`)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all"
                        >
                          <Eye size={14} />
                          <span>Трекер</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
