'use client';

import { useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

const CART_STORAGE_KEY = '7day_meals_cart';

// Global singleton state
const globalCart: { items: CartItem[] } = { items: [] };
const cartListeners = new Set<() => void>();

// Load from localStorage on client
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      globalCart.items = JSON.parse(saved);
    }
  } catch {
    // ignore
  }
}

function notifyCartListeners() {
  cartListeners.forEach((l) => l());
}

function persistCart() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(globalCart.items));
    } catch {
      // ignore
    }
  }
}

export function useCartStore() {
  const [items, setItems] = useState<CartItem[]>(globalCart.items);

  useEffect(() => {
    const listener = () => setItems([...globalCart.items]);
    cartListeners.add(listener);
    return () => { cartListeners.delete(listener); };
  }, []);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    const existing = globalCart.items.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      globalCart.items = [...globalCart.items, { ...item, quantity: 1 }];
    }
    persistCart();
    notifyCartListeners();
  };

  const removeItem = (id: string) => {
    globalCart.items = globalCart.items.filter((i) => i.id !== id);
    persistCart();
    notifyCartListeners();
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    globalCart.items = globalCart.items.map((i) =>
      i.id === id ? { ...i, quantity } : i
    );
    persistCart();
    notifyCartListeners();
  };

  const clearCart = () => {
    globalCart.items = [];
    persistCart();
    notifyCartListeners();
  };

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items,
    totalAmount,
    totalItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
