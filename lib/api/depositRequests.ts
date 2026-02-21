/**
 * Deposit request API – approve/reject flows for Top Up, Time Deposit, and Stock.
 * All approve/reject actions require admin password for re-confirmation.
 * See lib/docs/backenddocs/API-AUTH-AND-USERS.md
 */

import { API_BASE_URL } from "./client";

export type DepositRequestType = "top_up_balance" | "time_deposit" | "stock";

export interface ApproveRejectBody {
  password: string;
  notes?: string;
}

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

const buildHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseError = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as { message?: string; error?: string };
    return body.message || body.error || response.statusText;
  } catch {
    return response.statusText;
  }
};

/** Approve a time deposit request */
export async function approveTimeDeposit(
  id: string,
  body: ApproveRejectBody
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/time-deposits/${id}/approve`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message);
  }
}

/** Reject a time deposit request */
export async function rejectTimeDeposit(
  id: string,
  body: ApproveRejectBody
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/time-deposits/${id}/reject`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message);
  }
}

/** Approve a top-up balance request */
export async function approveTopUp(
  id: string,
  body: ApproveRejectBody
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/deposit-requests/admin/top-up/${id}/approve`,
    {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message);
  }
}

/** Reject a top-up balance request */
export async function rejectTopUp(
  id: string,
  body: ApproveRejectBody
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/deposit-requests/admin/top-up/${id}/reject`,
    {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message);
  }
}

/** Approve a stock investment request */
export async function approveStockInvestment(
  id: string,
  body: ApproveRejectBody
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/deposit-requests/admin/stock-investment/${id}/approve`,
    {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message);
  }
}

/** Reject a stock investment request */
export async function rejectStockInvestment(
  id: string,
  body: ApproveRejectBody
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/deposit-requests/admin/stock-investment/${id}/reject`,
    {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message);
  }
}

/**
 * Approve or reject a deposit request by type.
 * Calls the appropriate endpoint based on requestType.
 */
export async function approveDepositRequest(
  id: string,
  requestType: DepositRequestType,
  body: ApproveRejectBody
): Promise<void> {
  switch (requestType) {
    case "time_deposit":
      return approveTimeDeposit(id, body);
    case "top_up_balance":
      return approveTopUp(id, body);
    case "stock":
      return approveStockInvestment(id, body);
    default:
      throw new Error(`Unknown request type: ${requestType}`);
  }
}

/**
 * Reject a deposit request by type.
 * Calls the appropriate endpoint based on requestType.
 */
export async function rejectDepositRequest(
  id: string,
  requestType: DepositRequestType,
  body: ApproveRejectBody
): Promise<void> {
  switch (requestType) {
    case "time_deposit":
      return rejectTimeDeposit(id, body);
    case "top_up_balance":
      return rejectTopUp(id, body);
    case "stock":
      return rejectStockInvestment(id, body);
    default:
      throw new Error(`Unknown request type: ${requestType}`);
  }
}
