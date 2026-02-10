import { API_BASE_URL } from "./client";

export interface Trend {
  current: number;
  previous: number;
  diff: number;
  percent: number;
}

export interface DashboardSummary {
  totals: {
    users: number;
    timeDeposits: number;
    availableBalance: number;
  };
  trends: {
    users: Trend;
    timeDeposits: Trend;
    availableBalance: Trend;
  };
}

export interface DashboardSummaryResponse {
  success: boolean;
  error?: string;
  data?: DashboardSummary;
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

export const getDashboardSummary = async (): Promise<DashboardSummaryResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/summary`, {
    method: "GET",
    headers: authHeaders(),
  });

  const payload = await response.json() as DashboardSummaryResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || "Failed to fetch dashboard summary");
  }

  return payload;
};
