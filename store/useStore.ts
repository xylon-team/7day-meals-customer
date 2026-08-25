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
  } catch (e) {
    console.error('Failed to load user state from localStorage:', e);
  }
}

export function useStore() {
  const [state, setState] = useState({ user: globalState.user });

  useEffect(() => {
    const listener = () => {
      setState({ user: globalState.user });
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
    
    // Notify all active hooks
    listeners.forEach((listener) => listener());
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

    listeners.forEach((listener) => listener());
  };

  const resetStore = () => {
    globalState.user = DEFAULT_USER;
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('7day_meals_user');
      } catch (e) {
        console.error('Failed to remove user state from localStorage:', e);
      }
    }
    listeners.forEach((listener) => listener());
  };

  return {
    user: state.user,
    updateUser,
    updateNotifications,
    resetStore,
  };
}
