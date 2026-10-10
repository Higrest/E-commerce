import React from 'react';
import { CheckCircle, Clock, Package, Truck, XCircle, AlertCircle } from 'lucide-react';

const STEPS = [
  { key: 'pending', label: 'Ожидает', icon: Clock },
  { key: 'confirmed', label: 'Подтвержден', icon: CheckCircle },
  { key: 'processing', label: 'Сборка', icon: Package },
  { key: 'shipped', label: 'В пути', icon: Truck },
  { key: 'delivered', label: 'Доставлен', icon: CheckCircle },
];

export const OrderTracking = ({ order, onCancel }) => {
  if (!order) return <div className="text-center py-8 text-gray-500">Заказ не найден</div>;

  // Если заказ отменен
  if (order.status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center my-4">
        <XCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
        <h3 className="text-lg font-semibold text-red-700">Заказ отменен</h3>
        <p className="text-sm text-red-500 mt-1">Средства (если были списаны) отправлены на возврат.</p>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((step) => step.key === order.status);

  // Правила отмены по бизнес-логике (Shipped и Delivered отменить нельзя)
  const canCancel = ['pending', 'confirmed', 'processing'].includes(order.status);

  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto my-6">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Заказ #{order.id}</h2>
          <p className="text-sm text-gray-500">Дата: {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-semibold text-green-600">{order.total_price} сум</span>
          <p className="text-xs text-gray-400 capitalize">Оплата: {order.payment_status}</p>
        </div>
      </div>

      {/* Трекер шагов (Stepper) */}
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
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Кнопка отмены с учетом бизнес-правил */}
      <div className="mt-8 pt-4 border-t flex justify-between items-center">
        <div className="flex items-center text-xs text-gray-500">
          <AlertCircle size={16} className="mr-1 text-amber-500" />
          <span>Отмена доступна только до передачи в службу доставки (Shipped).</span>
        </div>
        {canCancel && (
          <button
            onClick={() => onCancel(order.id)}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Отменить заказ
          </button>
        )}
      </div>
    </div>
  );
};
