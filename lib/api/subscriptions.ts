import { ApiMealPlan, fetchMealPlans } from './meals';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8007';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED';
export type DeliveryTimeSlot = 'morning' | 'lunch' | 'dinner';
export type SubscriptionFrequency = 'weekly' | 'bi-weekly';

export interface Subscription {
  subscription_id: number;
  customer_id: number;
  meal_id: number;
  subscribe_date: string;
  canceled_date?: string | null;
  delivery_preferred_date: string;
  status: SubscriptionStatus;
  delivery_time_slot: DeliveryTimeSlot;
  frequency: SubscriptionFrequency;
  delivery_days: string[];
  special_instructions?: string;
  meal_plan?: ApiMealPlan;
}

export interface CreateSubscriptionPayload {
  customer_id: number;
  meal_id: number;
  delivery_preferred_date: string;
  delivery_time_slot?: DeliveryTimeSlot;
  frequency?: SubscriptionFrequency;
  delivery_days?: string[];
  special_instructions?: string;
}

export interface UpdateSubscriptionPayload {
  delivery_preferred_date?: string;
  delivery_time_slot?: DeliveryTimeSlot;
  frequency?: SubscriptionFrequency;
  delivery_days?: string[];
  special_instructions?: string;
  status?: SubscriptionStatus;
}

const STORAGE_KEY = '7day_meals_subscriptions';

// ─── Local Storage Helper (resilient persistence) ────────────────────────────

function getLocalSubscriptions(customerId: number): Subscription[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all: Subscription[] = JSON.parse(raw);
    return all.filter((s) => s.customer_id === customerId);
  } catch (e) {
    console.error('Failed to read subscriptions from localStorage', e);
    return [];
  }
}

function saveLocalSubscriptions(subscriptions: Subscription[]) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let all: Subscription[] = raw ? JSON.parse(raw) : [];
    
    // Merge updated subscriptions into all
    const updatedIds = new Set(subscriptions.map((s) => s.subscription_id));
    all = all.filter((s) => !updatedIds.has(s.subscription_id)).concat(subscriptions);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save subscriptions to localStorage', e);
  }
}

// ─── Subscription API Functions ───────────────────────────────────────────────

/**
 * Fetch all subscriptions for a specific customer.
 */
export async function fetchUserSubscriptions(
  customerId: number,
  token?: string | null
): Promise<Subscription[]> {
  try {
    // Attempt Next.js API route first
    const res = await fetch(`/api/subscriptions?customerId=${customerId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        saveLocalSubscriptions(data);
        return data;
      }
    }
  } catch (err) {
    console.warn('API route /api/subscriptions failed, checking local persistence:', err);
  }

  // Fallback to local persistence
  const local = getLocalSubscriptions(customerId);
  if (local.length > 0) {
    return local;
  }

  // If new user with no subscriptions yet, return empty list
  return [];
}

/**
 * Create a new meal subscription.
 */
export async function createSubscription(
  customerId: number,
  payload: CreateSubscriptionPayload,
  token?: string | null
): Promise<Subscription> {
  // Fetch available meals to populate meal_plan
  let mealPlan: ApiMealPlan | undefined;
  try {
    const meals = await fetchMealPlans();
    mealPlan = meals.find((m) => m.meal_id === payload.meal_id);
  } catch (e) {
    console.warn('Could not fetch meal plan details for new subscription:', e);
  }

  const newSub: Subscription = {
    subscription_id: Date.now(),
    customer_id: customerId,
    meal_id: payload.meal_id,
    subscribe_date: new Date().toISOString(),
    canceled_date: null,
    delivery_preferred_date: payload.delivery_preferred_date,
    status: 'ACTIVE',
    delivery_time_slot: payload.delivery_time_slot || 'lunch',
    frequency: payload.frequency || 'weekly',
    delivery_days: payload.delivery_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    special_instructions: payload.special_instructions || '',
    meal_plan: mealPlan,
  };

  try {
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(newSub),
    });

    if (res.ok) {
      const saved = await res.json();
      saveLocalSubscriptions([saved]);
      return saved;
    }
  } catch (err) {
    console.warn('Could not save to Next.js API route, saving locally:', err);
  }

  // Persist locally
  saveLocalSubscriptions([newSub]);
  return newSub;
}

/**
 * Update an existing subscription (schedule, preferences, status).
 */
export async function updateSubscription(
  subscriptionId: number,
  customerId: number,
  payload: UpdateSubscriptionPayload,
  token?: string | null
): Promise<Subscription> {
  const current = getLocalSubscriptions(customerId).find((s) => s.subscription_id === subscriptionId);
  
  const updated: Subscription = {
    ...(current || {
      subscription_id: subscriptionId,
      customer_id: customerId,
      meal_id: 1,
      subscribe_date: new Date().toISOString(),
      canceled_date: null,
      delivery_preferred_date: new Date().toISOString(),
      status: 'ACTIVE',
      delivery_time_slot: 'lunch',
      frequency: 'weekly',
      delivery_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    }),
    ...payload,
  };

  try {
    const res = await fetch(`/api/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const serverUpdated = await res.json();
      saveLocalSubscriptions([serverUpdated]);
      return serverUpdated;
    }
  } catch (err) {
    console.warn('API PATCH failed, saving locally:', err);
  }

  saveLocalSubscriptions([updated]);
  return updated;
}

/**
 * Cancel a subscription.
 */
export async function cancelSubscription(
  subscriptionId: number,
  customerId: number,
  reason?: string,
  token?: string | null
): Promise<Subscription> {
  const canceledDate = new Date().toISOString();
  return updateSubscription(
    subscriptionId,
    customerId,
    {
      status: 'CANCELLED',
      special_instructions: reason ? `Cancellation reason: ${reason}` : undefined,
    },
    token
  ).then((sub) => {
    sub.canceled_date = canceledDate;
    saveLocalSubscriptions([sub]);
    return sub;
  });
}

/**
 * Toggle Pause / Resume for a subscription.
 */
export async function togglePauseSubscription(
  subscriptionId: number,
  customerId: number,
  isPaused: boolean,
  token?: string | null
): Promise<Subscription> {
  return updateSubscription(
    subscriptionId,
    customerId,
    {
      status: isPaused ? 'PAUSED' : 'ACTIVE',
    },
    token
  );
}
