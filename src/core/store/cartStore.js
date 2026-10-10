import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cartItems: [], // Массив [{ product_id, name, price, quantity, stock_quantity, image_url }]

  setCartItems: (items) => set({ cartItems: items }),

  addToCart: (product, quantity = 1) => {
    const { cartItems } = get();
    const existingItem = cartItems.find(item => item.product_id === product.id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock_quantity) return false; // Запрет, если на складе нет столько

      set({
        cartItems: cartItems.map(item =>
          item.product_id === product.id ? { ...item, quantity: newQuantity } : item
        ),
      });
    } else {
      if (quantity > product.stock_quantity) return false;
      set({
        cartItems: [...cartItems, {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          stock_quantity: product.stock_quantity,
          image_url: product.image_url
        }]
      });
    }
    return true;
  },

  updateQuantity: (productId, newQuantity) => {
    const { cartItems } = get();
    const item = cartItems.find(item => item.product_id === productId);
    if (!item || newQuantity < 1 || newQuantity > item.stock_quantity) return;

    set({
      cartItems: cartItems.map(item =>
        item.product_id === productId ? { ...item, quantity: newQuantity } : item
      ),
    });
  },

  removeFromCart: (productId) => {
    set({ cartItems: get().cartItems.filter(item => item.product_id !== productId) });
  },

  clearCart: () => set({ cartItems: [] }),

  getTotalPrice: () => {
    return get().cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}));
