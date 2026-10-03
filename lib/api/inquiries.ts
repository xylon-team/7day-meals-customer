const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001';

export interface CreateInquiryPayload {
  title: string;
  message: string;
  sender_email: string;
}

export interface InquiryResponse {
  inquiry_id: number;
  title: string;
  message: string;
  sender_email: string;
  date_submitted: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message ?? 'An unexpected error occurred';
    throw new Error(message);
  }

  return data as T;
}

/** POST /inquiries */
export async function apiSubmitInquiry(payload: CreateInquiryPayload): Promise<InquiryResponse> {
  return request<InquiryResponse>('/inquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
