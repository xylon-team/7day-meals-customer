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
  isAuthenticated: false,
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
  } catch (e) {
    console.error('Failed to load state from localStorage:', e);
  }
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function useStore() {
  const [state, setState] = useState({
    user: globalState.user,
    isAuthenticated: globalState.isAuthenticated,
  });

  useEffect(() => {
    const listener = () => {
      setState({
        user: globalState.user,
        isAuthenticated: globalState.isAuthenticated,
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
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('7day_meals_user');
        localStorage.removeItem('7day_meals_auth');
      } catch (e) {
        console.error('Failed to remove user state from localStorage:', e);
      }
    }
    notifyListeners();
  };

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    updateUser,
    updateNotifications,
    login,
    logout,
    resetStore,
  };
}
