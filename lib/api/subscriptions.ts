import { ApiMealPlan } from './meals';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8007';

// ─── Types & Interfaces ───────────────────────────────────────────────────────

export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED';

export interface Subscription {
  subscription_id: number;
  customer_id: number;
  meal_id: number;
  subscribe_date: string;
  canceled_date?: string | null;
  delivery_preferred_date: string;
  next_delivery_date?: string | null;
  status: SubscriptionStatus;
  meal_plan?: ApiMealPlan;
  customer_order?: any[];
}

export interface CreateSubscriptionPayload {
  meal_id: number;
  delivery_preferred_date: string;
}

export interface UpdateSubscriptionPayload {
  delivery_preferred_date: string;
}

// ─── Helper: Normalize Backend Subscription Data ──────────────────────────────

function normalizeSubscription(item: any): Subscription {
  return {
    subscription_id: item.subscription_id,
    customer_id: item.customer_id,
    meal_id: item.meal_id,
    subscribe_date: item.subscribe_date,
    canceled_date: item.canceled_date ?? null,
    delivery_preferred_date: item.delivery_preferred_date,
    next_delivery_date: item.next_delivery_date ?? null,
    status: item.canceled_date ? 'CANCELLED' : 'ACTIVE',
    meal_plan: item.meal_plan,
    customer_order: item.customer_order || [],
  };
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * GET /users/:userId/subscriptions
 * Fetch all subscriptions for the authenticated user from the backend.
 */
export async function fetchUserSubscriptions(
  userId: number,
  token: string
): Promise<Subscription[]> {
  const res = await fetch(`${BASE_URL}/users/${userId}/subscriptions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const message = Array.isArray(errData?.message)
      ? errData.message.join(', ')
      : errData?.message || 'Failed to fetch subscriptions';
    throw new Error(message);
  }

  const data = await res.json();
  return Array.isArray(data) ? data.map(normalizeSubscription) : [];
}

/**
 * GET /users/:userId/subscriptions/:subscriptionId
 * Fetch single subscription details by ID.
 */
export async function fetchUserSubscriptionById(
  userId: number,
  subscriptionId: number,
  token: string
): Promise<Subscription> {
  const res = await fetch(
    `${BASE_URL}/users/${userId}/subscriptions/${subscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const message = Array.isArray(errData?.message)
      ? errData.message.join(', ')
      : errData?.message || 'Failed to fetch subscription';
    throw new Error(message);
  }

  const data = await res.json();
  return normalizeSubscription(data);
}

/**
 * POST /users/:userId/subscriptions
 * Create a new recurring meal subscription in the backend.
 */
export async function createSubscription(
  userId: number,
  payload: CreateSubscriptionPayload,
  token: string
): Promise<Subscription> {
  const res = await fetch(`${BASE_URL}/users/${userId}/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      meal_id: Number(payload.meal_id),
      delivery_preferred_date: new Date(payload.delivery_preferred_date).toISOString(),
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const message = Array.isArray(errData?.message)
      ? errData.message.join(', ')
      : errData?.message || 'Failed to create subscription';
    throw new Error(message);
  }

  const data = await res.json();
  return normalizeSubscription(data);
}

/**
 * PATCH /users/:userId/subscriptions/:subscriptionId/pref-delivery-date
 * Update the subscription's preferred delivery date in the backend.
 */
export async function updateSubscriptionSchedule(
  userId: number,
  subscriptionId: number,
  deliveryPreferredDate: string,
  token: string
): Promise<Subscription> {
  const res = await fetch(
    `${BASE_URL}/users/${userId}/subscriptions/${subscriptionId}/pref-delivery-date`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        delivery_preferred_date: new Date(deliveryPreferredDate).toISOString(),
      }),
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const message = Array.isArray(errData?.message)
      ? errData.message.join(', ')
      : errData?.message || 'Failed to update delivery schedule';
    throw new Error(message);
  }

  const data = await res.json();
  return normalizeSubscription(data);
}

/**
 * PATCH /users/:userId/subscriptions/:subscriptionId/cancel
 * Cancel a subscription in the backend.
 */
export async function cancelSubscription(
  userId: number,
  subscriptionId: number,
  token: string
): Promise<Subscription> {
  const res = await fetch(
    `${BASE_URL}/users/${userId}/subscriptions/${subscriptionId}/cancel`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const message = Array.isArray(errData?.message)
      ? errData.message.join(', ')
      : errData?.message || 'Failed to cancel subscription';
    throw new Error(message);
  }

  const data = await res.json();
  return normalizeSubscription(data);
}
