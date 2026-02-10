import { API_BASE_URL } from "./client";

export type AuthUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  error?: string;
  needsMigration?: boolean;
  data?: {
    token?: string;
    user?: AuthUser;
  };
};

type LoginPayload = {
  emailAddress: string;
  password: string;
};

type RegisterPayload = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  confirmPassword?: string;
};

const postAuth = async (path: string, body: Record<string, unknown>) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as AuthResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || payload.message || "Request failed. Please try again.");
  }

  return payload;
};

export const login = (payload: LoginPayload) => postAuth("/api/auth/login", payload);

export const register = (payload: RegisterPayload) => postAuth("/api/auth/register", payload);
