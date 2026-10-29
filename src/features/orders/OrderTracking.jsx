import React from 'react';
import { useParams } from 'react-router-dom';
import { useUiStore } from '../../core/store/uiStore';
import { CheckCircle, Clock, Package, Truck, XCircle, AlertCircle } from 'lucide-react';

const mockTrackingOrders = [
  { id: 'ord_101', created_at: '2026-10-01T14:32:00.000Z', total_price: 1350000, status: 'processing', payment_status: 'paid' },
  { id: 'ord_102', created_at: '2026-09-25T09:15:00.000Z', total_price: 85000, status: 'delivered', payment_status: 'paid' },
  { id: 'ord_103', created_at: '2026-10-05T18:40:00.000Z', total_price: 450000, status: 'pending', payment_status: 'unpaid' },
  { id: 'ord_104', created_at: '2026-08-12T11:20:00.000Z', total_price: 320000, status: 'cancelled', payment_status: 'refunded' },
];

const translations = {
  ru: {
    notFound: 'Заказ не найден',
    cancelled: 'Заказ отменен',
    refunded: 'Средства (если были списаны) отправлены на возврат.',
    date: 'Дата',
    payment: 'Оплата',
    cancelInfo: 'Отмена доступна только до передачи в службу доставки (Shipped).',
    cancel: 'Отменить заказ',
    steps: {
      pending: 'Ожидает',
      confirmed: 'Подтвержден',
      processing: 'Сборка',
      shipped: 'В пути',
      delivered: 'Доставлен',
    },
  },
  en: {
    notFound: 'Order not found',
    cancelled: 'Order cancelled',
    refunded: 'Funds (if charged) have been sent for refund.',
    date: 'Date',
    payment: 'Payment',
    cancelInfo: 'Cancellation is only available before handover to the delivery service (Shipped).',
    cancel: 'Cancel order',
    steps: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Packing',
      shipped: 'In transit',
      delivered: 'Delivered',
    },
  },
  kk: {
    notFound: 'Тапсырыс табылмады',
    cancelled: 'Тапсырыс жасанды',
    refunded: 'Ақшалар (егер алынса) қайтаруға жіберілді.',
    date: 'Күні',
    payment: 'Төлем',
    cancelInfo: 'Бас тарту жеткізу қызметіне берілмейінше ғана қолжетімді (Shipped).',
    cancel: 'Тапсырысты болдырмау',
    steps: {
      pending: 'Күтілуде',
      confirmed: 'Расталды',
      processing: 'Жиналуда',
      shipped: 'Жолда',
      delivered: 'Жеткізілді',
    },
  },
  uz: {
    notFound: 'Buyurtma topilmadi',
    cancelled: 'Buyurtma bekor qilindi',
    refunded: 'Pul (agar yechilgan bo‘lsa) qaytarishga yuborildi.',
    date: 'Sana',
    payment: 'To‘lov',
    cancelInfo: 'Bekor qilish faqat yetkazib berish xizmatiga topshirilgunga qadar mumkin (Shipped).',
    cancel: 'Buyurtmani bekor qilish',
    steps: {
      pending: 'Kutilmoqda',
      confirmed: 'Tasdiqlandi',
      processing: 'Qadoqlanmoqda',
      shipped: 'Yo‘lda',
      delivered: 'Yetkazib berildi',
    },
  },
};

const STEPS = [
  { key: 'pending', icon: Clock },
  { key: 'confirmed', icon: CheckCircle },
  { key: 'processing', icon: Package },
  { key: 'shipped', icon: Truck },
  { key: 'delivered', icon: CheckCircle },
];

export const OrderTracking = ({ onCancel }) => {
  const { id } = useParams();
  const { language } = useUiStore();
  const t = translations[language] || translations.ru;
  const order = mockTrackingOrders.find((entry) => entry.id === id);

  if (!order) {
    return <div className="text-center py-8 text-gray-500">{t.notFound}</div>;
  }

  if (order.status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center my-4 max-w-3xl mx-auto">
        <XCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
        <h3 className="text-lg font-semibold text-red-700">{t.cancelled}</h3>
        <p className="text-sm text-red-500 mt-1">{t.refunded}</p>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((step) => step.key === order.status);
  const canCancel = ['pending', 'confirmed', 'processing'].includes(order.status);

  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto my-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Заказ #{order.id}</h2>
          <p className="text-sm text-gray-500">{t.date}: {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-semibold text-green-600">{order.total_price.toLocaleString()} сум</span>
          <p className="text-xs text-gray-400 capitalize">{t.payment}: {order.payment_status}</p>
        </div>
      </div>

      <div className="relative flex justify-between my-10">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStepIndex;
          const isCurrent = step.key === order.status;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'}
                  ${isCurrent ? 'ring-4 ring-green-100' : ''}`}
              >
                <Icon size={20} />
              </div>
              <span className={`text-xs font-medium mt-2 ${isCurrent ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                {t.steps[step.key]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-4 border-t flex justify-between items-center">
        <div className="flex items-center text-xs text-gray-500">
          <AlertCircle size={16} className="mr-1 text-amber-500" />
          <span>{t.cancelInfo}</span>
        </div>
        {canCancel && (
          <button
            onClick={() => onCancel?.(order.id)}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            {t.cancel}
          </button>
        )}
      </div>
    </div>
  );
};
