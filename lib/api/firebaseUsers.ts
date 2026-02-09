import { API_BASE_URL } from "./client";
import type { GetUsersParams, UsersResponse, UserResponse } from "./users";

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

const buildQueryString = (params: GetUsersParams): string => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.status) queryParams.append("status", params.status);
  if (params.kycStatus) queryParams.append("kycStatus", params.kycStatus);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params.agent === true) queryParams.append("agent", "true");
  if (params.agent === false) queryParams.append("agent", "false");
  if (params.accountType) queryParams.append("accountType", params.accountType);
  if (params.isDummyAccount === true) queryParams.append("isDummyAccount", "true");
  if (params.isDummyAccount === false) queryParams.append("isDummyAccount", "false");
  // Add timestamp to prevent caching
  queryParams.append("_t", Date.now().toString());
  return queryParams.toString();
};

export const getFirebaseUsers = async (
  params: GetUsersParams = {}
): Promise<UsersResponse> => {
  const queryString = buildQueryString(params);
  const url = `${API_BASE_URL}/api/firebase-users${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: authHeaders(),
  });

  const payload = (await response.json()) as UsersResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || "Failed to fetch Firebase users");
  }

  return payload;
};

export const getFirebaseUserById = async (id: string): Promise<UserResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/firebase-users/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });

  const payload = (await response.json()) as UserResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || "Failed to fetch Firebase user");
  }

  return payload;
};
