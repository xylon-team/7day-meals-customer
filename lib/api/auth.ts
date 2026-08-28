const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8007';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  fname: string;
  lname: string;
  phone_number: string;
  email: string;
  password: string;
  address_line_1?: string;
  address_line_2?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  new_password: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface AuthCustomer {
  customer_id: number;
  fname: string;
  lname: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  customer: AuthCustomer;
}

export interface RegisterResponse {
  customer_id: number;
  email: string;
}

export interface MessageResponse {
  message: string;
}

export interface ChangePasswordResponse {
  access_token: string;
  message: string;
}

// ─── Internal helper ──────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    // NestJS returns { message, statusCode, error }
    const message =
      Array.isArray(data?.message)
        ? data.message.join(', ')
        : data?.message ?? 'An unexpected error occurred';
    throw new Error(message);
  }

  return data as T;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

/** POST /auth/register */
export async function apiRegister(payload: RegisterPayload): Promise<RegisterResponse> {
  return request<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** POST /auth/login */
export async function apiLogin(payload: LoginPayload): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** POST /auth/logout  (requires JWT) */
export async function apiLogout(token: string): Promise<MessageResponse> {
  return request<MessageResponse>('/auth/logout', { method: 'POST' }, token);
}

/** POST /auth/forgot-password */
export async function apiForgotPassword(
  payload: ForgotPasswordPayload,
): Promise<MessageResponse> {
  return request<MessageResponse>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** POST /auth/reset-password */
export async function apiResetPassword(
  payload: ResetPasswordPayload,
): Promise<MessageResponse> {
  return request<MessageResponse>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** POST /auth/change-password  (requires JWT) */
export async function apiChangePassword(
  payload: ChangePasswordPayload,
  token: string,
): Promise<ChangePasswordResponse> {
  return request<ChangePasswordResponse>(
    '/auth/change-password',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
}
