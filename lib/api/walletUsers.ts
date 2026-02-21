import { API_BASE_URL } from "./client";

export type WalletUserListItem = {
  id: string;
  email: string;
  accountNumber?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string | null;
  status?: string;
  role?: string;
  emailVerified?: boolean;
  isAgent?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  agent?: boolean;
};

export type UsersListResponse = {
  users: WalletUserListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

const authHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Map wallet user to admin portal User shape
 */
export function mapWalletUserToTableUser(w: WalletUserListItem) {
  return {
    _id: w.id,
    userId: w.id,
    id: w.id,
    emailAddress: w.email,
    email: w.email,
    accountNumber: w.accountNumber,
    firstName: w.firstName,
    lastName: w.lastName,
    middleName: w.middleName,
    status: w.status,
    agent: w.isAgent,
    isAgent: w.isAgent,
    emailVerified: w.emailVerified,
    createdAt: w.createdAt,
    updatedAt: w.updatedAt,
  };
}

/**
 * List users via GET /users (ADMIN only)
 */
export const getUsers = async (
  params: GetUsersParams = {}
): Promise<UsersListResponse> => {
  const queryParams = new URLSearchParams();
  if (params.page != null) queryParams.append("page", params.page.toString());
  if (params.limit != null) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.status) queryParams.append("status", params.status);
  if (params.agent === true) queryParams.append("agent", "true");
  if (params.agent === false) queryParams.append("agent", "false");

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/users${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) throw new Error("Unauthorized");
    if (response.status === 403) throw new Error("Admin access required");
    throw new Error(data.message || "Failed to fetch users");
  }

  return data as UsersListResponse;
};

/**
 * Delete user via DELETE /users/:id (ADMIN only)
 */
export const deleteUser = async (userId: string): Promise<{ success: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) throw new Error("Unauthorized");
    if (response.status === 403) throw new Error("Admin access required");
    if (response.status === 404) throw new Error("User not found");
    throw new Error(data.message || "Failed to delete user");
  }

  return data as { success: boolean };
};
