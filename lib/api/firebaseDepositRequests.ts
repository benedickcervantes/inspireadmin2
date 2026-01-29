import { API_BASE_URL } from "./client";
import type { DepositRequest, GetSubcollectionParams, SubcollectionResponse } from "./subcollections";

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

const buildQueryString = (params: GetSubcollectionParams): string => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.status) queryParams.append("status", params.status);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  return queryParams.toString();
};

export const getFirebaseDepositRequests = async (
  params: GetSubcollectionParams = {}
): Promise<SubcollectionResponse<DepositRequest>> => {
  const queryString = buildQueryString(params);
  const url = `${API_BASE_URL}/api/firebase-deposit-requests${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: authHeaders(),
  });

  const payload = (await response.json()) as SubcollectionResponse<DepositRequest>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || "Failed to fetch Firebase deposit requests");
  }

  return payload;
};
