import { API_BASE_URL } from "./client";

export type WalletUser = {
  id: string;
  email: string;
  accountNumber?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string | null;
  status?: string;
  role?: "USER" | "ADMIN" | "PAYMENT_SERVICE";
  emailVerified?: boolean;
  hasPasscode?: boolean;
  companyName?: string | null;
  lineAccountLink?: string | null;
  isAgent?: boolean;
};

export type LoginResponse = {
  access_token: string;
  user: WalletUser;
};

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

/**
 * Login via wallet backend POST /auth/login
 */
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid email or password");
    }
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(", ")
        : (data.message || "Login failed")
    );
  }

  return data as LoginResponse;
};

/**
 * Register via wallet backend POST /auth/register
 * New users get role USER by default; admins must be promoted via backend.
 */
export const register = async (payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("Email already registered");
    }
    throw new Error(
      Array.isArray(data.message)
        ? data.message.join(", ")
        : (data.message || "Registration failed")
    );
  }

  return data as LoginResponse;
};

/**
 * Get current user via GET /auth/me (requires Bearer token)
 */
export const getMe = async (): Promise<WalletUser> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error(data.message || "Failed to get profile");
  }

  return data as WalletUser;
};
