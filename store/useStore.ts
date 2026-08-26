'use client';

import { useState, useEffect } from 'react';

export interface UserNotifications {
  orderUpdates: boolean;
  subscriptionAlerts: boolean;
  promotions: boolean;
  smsAlerts: boolean;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  notifications: UserNotifications;
}

export interface CartItem {
  id: string | number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

const DEFAULT_USER: User = {
  name: 'Kasun Peiris',
  email: 'kasun.peiris@gmail.com',
  phone: '+94 77 123 4567',
  address: '123 Galle Road, Colombo 03, Sri Lanka',
  notifications: {
    orderUpdates: true,
    subscriptionAlerts: true,
    promotions: false,
    smsAlerts: true,
  },
};

// Global singleton state object
const globalState = {
  user: DEFAULT_USER,
  isAuthenticated: false,
  cart: [] as CartItem[],
};

// Subscriptions set
const listeners = new Set<() => void>();

// Load from localStorage safely on the client
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('7day_meals_user');
    if (saved) {
      globalState.user = JSON.parse(saved);
    }
    const authSaved = localStorage.getItem('7day_meals_auth');
    if (authSaved) {
      globalState.isAuthenticated = JSON.parse(authSaved);
    }
    const cartSaved = localStorage.getItem('7day_meals_cart');
    if (cartSaved) {
      globalState.cart = JSON.parse(cartSaved);
    }
  } catch (e) {
    console.error('Failed to load state from localStorage:', e);
  }
}

const saveCartToLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('7day_meals_cart', JSON.stringify(globalState.cart));
    } catch (e) {
      console.error('Failed to save cart state to localStorage:', e);
    }
  }
};

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function useStore() {
  const [state, setState] = useState({
    user: globalState.user,
    isAuthenticated: globalState.isAuthenticated,
    cart: globalState.cart,
  });

  useEffect(() => {
    const listener = () => {
      setState({
        user: globalState.user,
        isAuthenticated: globalState.isAuthenticated,
        cart: [...globalState.cart],
      });
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const updateUser = (updates: Partial<User>) => {
    globalState.user = {
      ...globalState.user,
      ...updates,
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('7day_meals_user', JSON.stringify(globalState.user));
      } catch (e) {
        console.error('Failed to save user state to localStorage:', e);
      }
    }

    notifyListeners();
  };

  const updateNotifications = (updates: Partial<UserNotifications>) => {
    globalState.user = {
      ...globalState.user,
      notifications: {
        ...globalState.user.notifications,
        ...updates,
      },
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('7day_meals_user', JSON.stringify(globalState.user));
      } catch (e) {
        console.error('Failed to save user state to localStorage:', e);
      }
    }

    notifyListeners();
  };

  const login = (userData: Partial<User>) => {
    globalState.user = {
      ...DEFAULT_USER,
      ...userData,
    };
    globalState.isAuthenticated = true;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('7day_meals_user', JSON.stringify(globalState.user));
        localStorage.setItem('7day_meals_auth', JSON.stringify(true));
      } catch (e) {
        console.error('Failed to save auth state to localStorage:', e);
      }
    }

    notifyListeners();
  };

  const logout = () => {
    globalState.user = DEFAULT_USER;
    globalState.isAuthenticated = false;

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('7day_meals_user');
        localStorage.removeItem('7day_meals_auth');
      } catch (e) {
        console.error('Failed to clear auth state from localStorage:', e);
      }
    }

    notifyListeners();
  };

  const resetStore = () => {
    globalState.user = DEFAULT_USER;
    globalState.isAuthenticated = false;
    globalState.cart = [];
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('7day_meals_user');
        localStorage.removeItem('7day_meals_auth');
        localStorage.removeItem('7day_meals_cart');
      } catch (e) {
        console.error('Failed to remove user state from localStorage:', e);
      }
    }
    notifyListeners();
  };

  const addToCart = (item: any) => {
    const id = item.id;
    const name = item.title || item.name;
    const category = item.category;
    const price = item.price;
    const image = item.image;

    const existingIndex = globalState.cart.findIndex((i) => i.id === id);
    if (existingIndex > -1) {
      globalState.cart[existingIndex] = {
        ...globalState.cart[existingIndex],
        quantity: globalState.cart[existingIndex].quantity + 1,
      };
    } else {
      globalState.cart.push({ id, name, category, price, image, quantity: 1 });
    }

    saveCartToLocalStorage();
    notifyListeners();
  };

  const updateQuantity = (id: string | number, delta: number) => {
    const existingIndex = globalState.cart.findIndex((i) => i.id === id);
    if (existingIndex > -1) {
      const newQty = Math.max(1, globalState.cart[existingIndex].quantity + delta);
      globalState.cart[existingIndex] = {
        ...globalState.cart[existingIndex],
        quantity: newQty,
      };
      saveCartToLocalStorage();
      notifyListeners();
    }
  };

  const removeItem = (id: string | number) => {
    globalState.cart = globalState.cart.filter((i) => i.id !== id);
    saveCartToLocalStorage();
    notifyListeners();
  };

  const clearCart = () => {
    globalState.cart = [];
    saveCartToLocalStorage();
    notifyListeners();
  };

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    cart: state.cart,
    updateUser,
    updateNotifications,
    login,
    logout,
    resetStore,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
