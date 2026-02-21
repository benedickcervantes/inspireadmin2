//lib\api\dashboard.ts
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

/** InspireBank balance response (central bank available balance per currency) */
export interface InspireBankBalanceResponse {
  currencyId: string;
  currencyCode: string;
  balance: string;
}

/**
 * Fetch InspireBank (central bank) available balance.
 * Per API-INSPIREBANK-ECONOMIC-FLOW.md: InspireBank is the system's position for a currency —
 * the available balance left for Inspire Bank (deposits increase it, withdrawals decrease it).
 * ADMIN role required.
 */
export const getInspireBankBalance = async (
  currencyCode = "PHP"
): Promise<InspireBankBalanceResponse | null> => {
  const response = await fetch(
    `${API_BASE_URL}/inspire-bank/balance?currencyCode=${encodeURIComponent(currencyCode)}`,
    {
      method: "GET",
      headers: authHeaders(),
    }
  );

  if (response.status === 404) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      (typeof data?.message === "string" ? data.message : null) ||
        "Failed to fetch InspireBank balance"
    );
  }

  return data as InspireBankBalanceResponse;
};

/** InspireBank ledger entry (DEPOSIT, WITHDRAWAL, TRANSFER, CREDIT_FROM_RESERVE) */
export interface InspireBankLedgerEntry {
  id: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | "CREDIT_FROM_RESERVE";
  amount: string;
  walletId: string | null;
  toWalletId: string | null;
  transactionId: string | null;
  createdAt: string;
}

export interface InspireBankLedgerResponse {
  items: InspireBankLedgerEntry[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Fetch InspireBank ledger entries (paginated).
 * ADMIN role required. Returns DEPOSIT, WITHDRAWAL, TRANSFER, CREDIT_FROM_RESERVE.
 */
export const getInspireBankLedger = async (
  currencyCode = "PHP",
  page = 1,
  limit = 20
): Promise<InspireBankLedgerResponse> => {
  const params = new URLSearchParams({
    currencyCode,
    page: String(page),
    limit: String(limit),
  });
  const response = await fetch(
    `${API_BASE_URL}/inspire-bank/ledger?${params}`,
    { method: "GET", headers: authHeaders() }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      (typeof data?.message === "string" ? data.message : null) ||
        "Failed to fetch InspireBank ledger"
    );
  }

  return data as InspireBankLedgerResponse;
};
