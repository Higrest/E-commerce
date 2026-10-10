import { apiClient } from '../../core/api/apiClient';

/**
 * Получить историю заказов текущего покупателя
 * Эндпоинт: GET /api/orders
 */
export const fetchOrderHistory = async () => {
  const response = await apiClient.get('/orders');
  return response.data; // Ожидается массив заказов
};

/**
 * Получить детальную информацию о конкретном заказе по ID (для трекера)
 * Эндпоинт: GET /api/orders/:id
 */
export const fetchOrderDetails = async (orderId) => {
  const response = await apiClient.get(`/orders/${orderId}`);
  return response.data; // Ожидается объект заказа со статусом
};

/**
 * Создать новый заказ из товаров в корзине (Checkout)
 * Эндпоинт: POST /api/orders
 * @param {Object} orderData - { items: [{ product_id, quantity }], shipping_address }
 */
export const createOrder = async (orderData) => {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
};

/**
 * Отменить заказ покупателем (доступно на стадиях pending, confirmed, processing)
 * Эндпоинт: PATCH /api/orders/:id/cancel
 */
export const cancelOrder = async (orderId) => {
  const response = await apiClient.patch(`/orders/${orderId}/cancel`);
  return response.data;
};

/**
 * Изменить статус заказа продавцом или админом
 * Эндпоинт: PATCH /api/orders/:id/status
 * @param {string} orderId - ID заказа
 * @param {string} newStatus - 'confirmed', 'processing', 'shipped', 'delivered'
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  const response = await apiClient.patch(`/orders/${orderId}/status`, {
    status: newStatus,
  });
  return response.data;
};
