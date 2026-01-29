import { API_BASE_URL } from "./client";

export interface FirebaseCollectionResponse<T> {
  success: boolean;
  error?: string;
  data?: {
    items: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface FirebaseCollectionParams {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  includeUser?: boolean;
}

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

const buildQueryString = (params: FirebaseCollectionParams): string => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.status) queryParams.append("status", params.status);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params.search) queryParams.append("search", params.search);
  if (typeof params.includeUser === "boolean") {
    queryParams.append("includeUser", params.includeUser ? "true" : "false");
  }
  return queryParams.toString();
};

export async function getFirebaseCollection<T>(
  collection: string,
  params: FirebaseCollectionParams = {}
): Promise<FirebaseCollectionResponse<T>> {
  const queryString = buildQueryString(params);
  const url = `${API_BASE_URL}/api/firebase-collections/${collection}${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: authHeaders(),
  });

  const payload = (await response.json()) as FirebaseCollectionResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || `Failed to fetch ${collection}`);
  }

  return payload;
}
