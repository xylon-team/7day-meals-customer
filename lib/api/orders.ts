const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8007';

export interface CreateOrderPayload {
  customer_id: number;
  meal_id: number;
  order_status: string;
  payment_status: string;
  delivery_status: string;
  delivery_preferred_date: string;
  is_a_subscribed_meal?: boolean;
}

export async function createOrder(userId: number, payload: CreateOrderPayload, token: string) {
  const res = await fetch(`${BASE_URL}/users/${userId}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to create order');
  }
  return res.json();
}

export async function fetchUserOrders(userId: number, token: string) {
  const res = await fetch(`${BASE_URL}/users/${userId}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to fetch orders');
  }
  return res.json();
}
