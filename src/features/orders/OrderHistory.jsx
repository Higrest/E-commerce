import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../core/store/uiStore';
import { ShoppingBag, Eye, Clock, CheckCircle, Package, Truck, XCircle } from 'lucide-react';

const mockOrdersHistory = [
  { id: 'ord_101', created_at: '2026-10-01T14:32:00.000Z', total_price: 1350000, status: 'processing', payment_status: 'paid' },
  { id: 'ord_102', created_at: '2026-09-25T09:15:00.000Z', total_price: 85000, status: 'delivered', payment_status: 'paid' },
  { id: 'ord_103', created_at: '2026-10-05T18:40:00.000Z', total_price: 450000, status: 'pending', payment_status: 'unpaid' },
  { id: 'ord_104', created_at: '2026-08-12T11:20:00.000Z', total_price: 320000, status: 'cancelled', payment_status: 'refunded' },
];

const translations = {
  ru: {
    title: 'История ваших заказов',
    subtitle: 'Отслеживайте текущие посылки и просматривайте архив покупок',
    empty: 'Вы еще ничего не заказывали',
    orderId: 'ID Заказа',
    date: 'Дата оформления',
    amount: 'Сумма',
    status: 'Статус заказа',
    action: 'Действие',
    tracker: 'Трекер',
    payment: 'Оплата',
    paymentPaid: 'Оплачено',
    paymentUnpaid: 'Не оплачено',
    paymentRefunded: 'Возврат',
  },
  en: {
    title: 'Your order history',
    subtitle: 'Track active shipments and review your purchase archive',
    empty: 'You have not placed any orders yet',
    orderId: 'Order ID',
    date: 'Order date',
    amount: 'Amount',
    status: 'Order status',
    action: 'Action',
    tracker: 'Tracker',
    payment: 'Payment',
    paymentPaid: 'Paid',
    paymentUnpaid: 'Unpaid',
    paymentRefunded: 'Refunded',
  },
  kk: {
    title: 'Сіздің тапсырыстарыңыздың тарихы',
    subtitle: 'Ағымдағы жөнелтілімдерді қадағалаңыз және сатып алу тарихын қараңыз',
    empty: 'Сіз әлі ештеңе тапсырыс бермедіңіз',
    orderId: 'Тапсырыс ID',
    date: 'Тапсырыс күні',
    amount: 'Сома',
    status: 'Тапсырыс күйі',
    action: 'Әрекет',
    tracker: 'Трекер',
    payment: 'Төлем',
    paymentPaid: 'Төленді',
    paymentUnpaid: 'Төленбеді',
    paymentRefunded: 'Қайтарылды',
  },
  uz: {
    title: 'Buyurtmalar tarixi',
    subtitle: 'Joriy jo‘natmalarni kuzatib boring va xaridlar arxivini ko‘rib chiqing',
    empty: 'Siz hali hech narsa buyurtma qilmagansiz',
    orderId: 'Buyurtma ID',
    date: 'Buyurtma sanasi',
    amount: 'Summa',
    status: 'Buyurtma holati',
    action: 'Harakat',
    tracker: 'Treker',
    payment: 'To‘lov',
    paymentPaid: 'To‘langan',
    paymentUnpaid: 'To‘lanmagan',
    paymentRefunded: 'Qaytarilgan',
  },
};

const STATUS_CONFIG = {
  pending: { ru: 'Ожидает оплаты', en: 'Awaiting payment', kk: 'Төлем күтілуде', uz: 'To‘lov kutilmoqda', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  confirmed: { ru: 'Подтвержден', en: 'Confirmed', kk: 'Расталды', uz: 'Tasdiqlangan', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: CheckCircle },
  processing: { ru: 'В сборке', en: 'In packing', kk: 'Жиналуда', uz: 'Qayta ishlanmoqda', bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: Package },
  shipped: { ru: 'Отправлен', en: 'Shipped', kk: 'Жіберілді', uz: 'Yuborilgan', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Truck },
  delivered: { ru: 'Доставлен', en: 'Delivered', kk: 'Жеткізілді', uz: 'Yetkazib berildi', bg: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
  cancelled: { ru: 'Отменен', en: 'Cancelled', kk: 'Бас тартылды', uz: 'Bekor qilindi', bg: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
};

export const OrderHistory = () => {
  const navigate = useNavigate();
  const { language } = useUiStore();
  const t = translations[language] || translations.ru;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 min-h-screen space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <ShoppingBag className="text-blue-600" size={24} />
          <span>{t.title}</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
      </div>

      {mockOrdersHistory.length === 0 ? (
        <div className="text-center py-20 bg-white border rounded-2xl shadow-sm text-gray-400">
          <ShoppingBag size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-base">{t.empty}</p>
        </div>
      ) : (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4">{t.orderId}</th>
                  <th className="p-4">{t.date}</th>
                  <th className="p-4">{t.amount}</th>
                  <th className="p-4">{t.status}</th>
                  <th className="p-4 text-right">{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-gray-700">
                {mockOrdersHistory.map((order) => {
                  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const StatusIcon = statusInfo.icon;
                  const paymentLabel = {
                    paid: t.paymentPaid,
                    unpaid: t.paymentUnpaid,
                    refunded: t.paymentRefunded,
                  }[order.payment_status] || order.payment_status;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-bold text-gray-900">#{order.id}</td>
                      <td className="p-4 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()} в{' '}
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 font-black text-gray-800">
                        {order.total_price.toLocaleString()} сум
                        <span className="block text-[10px] font-medium text-gray-400 capitalize">
                          {t.payment}: {paymentLabel}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-bold ${statusInfo.bg}`}>
                          <StatusIcon size={12} />
                          {statusInfo[language] || statusInfo.ru}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => navigate(`/orders/track/${order.id}`)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all"
                        >
                          <Eye size={14} />
                          <span>{t.tracker}</span>
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
