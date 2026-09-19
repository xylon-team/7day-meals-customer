const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001';

export interface ApiNotification {
  notif_id: number;
  customer_id: number;
  title: string;
  message: string;
  type: string;
  created_at: string;
  read_at: string | null;
}

export interface CreateNotificationPayload {
  title: string;
  message: string;
  type: string;
}

export interface UpdateNotificationReadStatusPayload {
  is_read: boolean;
}

/**
 * Fetch all notifications for a specific customer from the NestJS backend
 */
export async function fetchUserNotifications(
  userId: number | string,
  token?: string | null
): Promise<ApiNotification[]> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/users/${userId}/notifications`, {
    headers,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to fetch notifications');
  }

  return res.json();
}

/**
 * Update the read status of a notification for a specific customer
 */
export async function updateNotificationReadStatus(
  userId: number | string,
  notificationId: number | string,
  isRead: boolean,
  token?: string | null
): Promise<ApiNotification> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(
    `${BASE_URL}/users/${userId}/notifications/${notificationId}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ is_read: isRead }),
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(
      errData.message || 'Failed to update notification read status'
    );
  }

  return res.json();
}

/**
 * Create a new notification for a customer (if called from frontend)
 */
export async function createNotification(
  userId: number | string,
  payload: CreateNotificationPayload,
  token?: string | null
): Promise<ApiNotification> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/users/${userId}/notifications`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Failed to create notification');
  }

  return res.json();
}
