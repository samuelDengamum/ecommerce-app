export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  maxStock: number;
}

const CART_KEY = 'superstore_cart';

const canUseStorage = () => typeof window !== 'undefined';

const emitCartChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cartchange'));
  }
};

export const getCart = (): CartItem[] => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
};

export const saveCart = (items: CartItem[]) => {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(CART_KEY, JSON.stringify(items));
  emitCartChange();
};

export const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
  const safeQuantity = Math.max(1, Math.min(quantity, item.maxStock));
  const cart = getCart();
  const existing = cart.find((entry) => entry.id === item.id);

  if (existing) {
    existing.quantity = Math.min(existing.quantity + safeQuantity, existing.maxStock);
    saveCart([...cart]);
    return;
  }

  saveCart([...cart, { ...item, quantity: safeQuantity }]);
};

export const updateCartItemQuantity = (id: string, quantity: number) => {
  const cart = getCart();
  const next = cart
    .map((item) => {
      if (item.id !== id) {
        return item;
      }

      const safeQuantity = Math.max(1, Math.min(quantity, item.maxStock));
      return { ...item, quantity: safeQuantity };
    })
    .filter((item) => item.quantity > 0);

  saveCart(next);
};

export const removeCartItem = (id: string) => {
  const next = getCart().filter((item) => item.id !== id);
  saveCart(next);
};

export const clearCart = () => {
  saveCart([]);
};

export const getCartCount = () => {
  return getCart().reduce((count, item) => count + item.quantity, 0);
};

export const getCartSubtotal = () => {
  return getCart().reduce((total, item) => total + item.price * item.quantity, 0);
};
