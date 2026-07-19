import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: JSON.parse(localStorage.getItem('luxury_restaurant_cart')) || [],
  isOpen: false,
  activeDish: null,
  isAddModalOpen: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  openAddModal: (dish) => set({ activeDish: dish, isAddModalOpen: true }),
  closeAddModal: () => set({ activeDish: null, isAddModalOpen: false }),

  addToCart: (dish, quantity) => {
    const currentCart = get().cart;
    const existingIndex = currentCart.findIndex((item) => item.dish.id === dish.id);
    let newCart = [...currentCart];

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ id: `${dish.id}-${Date.now()}`, dish, quantity });
    }

    localStorage.setItem('luxury_restaurant_cart', JSON.stringify(newCart));
    set({ cart: newCart });
  },

  updateQuantity: (id, qty) => {
    const currentCart = get().cart;
    const newCart = currentCart
      .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, qty) } : item))
      .filter((item) => item.quantity > 0);

    localStorage.setItem('luxury_restaurant_cart', JSON.stringify(newCart));
    set({ cart: newCart });
  },

  removeFromCart: (id) => {
    const currentCart = get().cart;
    const newCart = currentCart.filter((item) => item.id !== id);

    localStorage.setItem('luxury_restaurant_cart', JSON.stringify(newCart));
    set({ cart: newCart });
  },

  clearCart: () => {
    localStorage.removeItem('luxury_restaurant_cart');
    set({ cart: [] });
  },

  getTotals: (rate = 1.0) => {
    const cart = get().cart;
    const subtotal = cart.reduce((acc, item) => acc + item.dish.price * item.quantity, 0);
    const convertedSubtotal = Math.round(subtotal * rate);
    return {
      subtotal: convertedSubtotal,
      tax: Math.round(convertedSubtotal * 0.1), // 10% tax
      total: Math.round(convertedSubtotal * 1.1),
    };
  },
}));
