const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8007';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateReviewPayload {
  order_id: number;
  rating_value: number;
  description?: string;
}

export interface ReviewRecord {
  feedback_id: number;
  order_id: number;
  rating_value: number;
  description: string | null;
  reviewer_name: string;
  created_at: string | null;
  reply: string | null;
  replied_date: string | null;
}

// ─── API Functions ────────────────────────────────────────────────────────────

/** POST /reviews — Submit a review for a delivered order */
export async function submitReview(
  token: string,
  payload: CreateReviewPayload,
): Promise<ReviewRecord> {
  const res = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message ?? 'Failed to submit review';
    const err = new Error(message) as Error & { status: number };
    err.status = res.status;
    throw err;
  }

  return data as ReviewRecord;
}

/** GET /meals/:mealId/reviews — Fetch all reviews for a meal plan (public) */
export async function fetchReviewsByMealId(
  mealId: string | number,
): Promise<ReviewRecord[]> {
  const res = await fetch(`${BASE_URL}/meals/${mealId}/reviews`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message ?? 'Failed to fetch reviews';
    throw new Error(message);
  }

  return data as ReviewRecord[];
}

/** GET /users/:userId/orders/:orderId/review — Check if an order has been reviewed */
export async function fetchOrderReview(
  userId: number,
  orderId: string | number,
  token: string,
): Promise<ReviewRecord> {
  const res = await fetch(
    `${BASE_URL}/users/${userId}/orders/${orderId}/review`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message ?? 'Failed to fetch review';
    const err = new Error(message) as Error & { status: number };
    err.status = res.status;
    throw err;
  }

  return data as ReviewRecord;
}
