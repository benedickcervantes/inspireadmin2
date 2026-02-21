/**
 * Deposit request API – fetch from wallet backend, approve/reject flows.
 * Uses API_BASE_URL (wallet backend). See lib/docs/backenddocs/API-AUTH-AND-USERS.md
 */

import { API_BASE_URL } from "./client";
import { getUserById, getUsers } from "./users";

export type DepositRequestType = "top_up_balance" | "time_deposit" | "stock";

/** Body sent to approve/reject API. Backend only accepts `notes` (forbidNonWhitelisted). */
export interface ApproveRejectBody {
  password: string; // Used by frontend modal; not sent to backend (verified via verifyAdminPassword first)
  notes?: string;
}

/** Normalized deposit request from backend (id, requestType, user, amount, etc.) */
export interface DepositRequestItem {
  id: string;
  requestType: DepositRequestType;
  userId?: string;
  amount?: number;
  status?: string;
  referenceNumber?: string;
  createdAt?: string;
  processedAt?: string;
  notes?: string;
  user: {
    odId?: string;
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
    accountNumber?: string;
  };
  [key: string]: unknown;
}

export interface DepositRequestsResponse {
  success: boolean;
  data?: {
    items: DepositRequestItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
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

/** Fetch from URL; returns null on 404 (caller may try fallback), throws on other errors */
async function fetchJsonArray(url: string): Promise<unknown[] | null> {
  const response = await fetch(url, {
    headers: buildHeaders(),
    cache: "no-store", // Ensure fresh data after approve/reject
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    const msg = await parseError(response);
    throw new Error(msg);
  }
  const json = await response.json();
  if (Array.isArray(json)) return json;
  const obj = json as Record<string, unknown>;
  const data = obj?.data;
  const raw =
    (data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>).items ?? (data as Record<string, unknown>).requests
      : undefined) ??
    obj?.items ??
    obj?.requests ??
    (Array.isArray(data) ? data : undefined);
  return Array.isArray(raw) ? raw : [];
}

/** Map frontend status filter to backend query param (PENDING|APPROVED|REJECTED). Approved includes COMPLETED. */
function toStatusParam(status?: string): string | undefined {
  if (!status || status === "all") return undefined;
  const s = status.toLowerCase();
  if (s === "pending") return "PENDING";
  if (s === "approved") return "APPROVED"; // backend may also return COMPLETED; we filter client-side
  if (s === "rejected") return "REJECTED";
  return undefined;
}

/** Build URL with optional ?status= query param */
function buildListUrl(base: string, statusParam?: string): string {
  if (!statusParam) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}status=${encodeURIComponent(statusParam)}`;
}

/** Fetch time deposits. When includeAllStatuses: tries /admin (all) first, falls back to /admin/pending */
async function fetchTimeDeposits(includeAllStatuses: boolean, statusParam?: string): Promise<DepositRequestItem[]> {
  const baseAll = `${API_BASE_URL}/time-deposits/admin`;
  const basePending = `${API_BASE_URL}/time-deposits/admin/pending`;
  const urls = includeAllStatuses
    ? [buildListUrl(baseAll, statusParam), basePending]
    : [basePending];
  for (const url of urls) {
    const items = await fetchJsonArray(url);
    if (items !== null) return items.map((item) => normalizeItem(item as Record<string, unknown>, "time_deposit"));
  }
  return [];
}

/** Fetch top-up requests. Backend: GET /deposit-requests/admin/top-up?status=PENDING|APPROVED|REJECTED */
async function fetchTopUp(includeAllStatuses: boolean, statusParam?: string): Promise<DepositRequestItem[]> {
  const baseAll = `${API_BASE_URL}/deposit-requests/admin/top-up`;
  const basePending = `${API_BASE_URL}/deposit-requests/admin/top-up/pending`;
  const urls = includeAllStatuses
    ? [buildListUrl(baseAll, statusParam), basePending]
    : [basePending];
  for (const url of urls) {
    const items = await fetchJsonArray(url);
    if (items !== null) return items.map((item) => normalizeItem(item as Record<string, unknown>, "top_up_balance"));
  }
  return [];
}

/** Fetch stock investment requests. Backend: GET /deposit-requests/admin/stock-investment?status=PENDING|APPROVED|REJECTED */
async function fetchStockInvestment(includeAllStatuses: boolean, statusParam?: string): Promise<DepositRequestItem[]> {
  const baseAll = `${API_BASE_URL}/deposit-requests/admin/stock-investment`;
  const basePending = `${API_BASE_URL}/deposit-requests/admin/stock-investment/pending`;
  const urls = includeAllStatuses
    ? [buildListUrl(baseAll, statusParam), basePending]
    : [basePending];
  for (const url of urls) {
    const items = await fetchJsonArray(url);
    if (items !== null) return items.map((item) => normalizeItem(item as Record<string, unknown>, "stock"));
  }
  return [];
}

function normalizeItem(raw: Record<string, unknown>, requestType: DepositRequestType): DepositRequestItem {
  const id = String(raw.id ?? raw._firebaseDocId ?? "");
  const rawUser = (raw.user ?? raw.User ?? raw.userInfo ?? raw.owner ?? {}) as Record<string, unknown>;
  // Merge with flat fields on item (userFirstName, userEmail, etc.)
  const flat = raw as Record<string, unknown>;
  const user = {
    odId: rawUser.odId as string | undefined,
    firstName: (rawUser.firstName ?? rawUser.first_name ?? flat.userFirstName ?? flat.user_first_name) as string | undefined,
    lastName: (rawUser.lastName ?? rawUser.last_name ?? flat.userLastName ?? flat.user_last_name) as string | undefined,
    emailAddress: (rawUser.emailAddress ?? rawUser.email ?? flat.userEmail ?? flat.user_email) as string | undefined,
    accountNumber: (rawUser.accountNumber ?? rawUser.account_number) as string | undefined,
    ...rawUser,
  } as DepositRequestItem["user"];
  const userId = (raw.userId ?? raw.ownerId ?? raw.user_id ?? raw.owner_id) as string | undefined;
  const nestedRef = (raw as { payment?: { reference?: string }; meta?: { referenceId?: string; reference?: string } }).payment?.reference
    ?? (raw as { payment?: { reference?: string }; meta?: { referenceId?: string; reference?: string } }).meta?.referenceId
    ?? (raw as { payment?: { reference?: string }; meta?: { referenceId?: string; reference?: string } }).meta?.reference;
  const referenceNumber = (raw.referenceNumber ?? raw.reference ?? raw.displayId ?? raw.ref ?? raw.paymentReference ?? raw.transactionReference ?? raw.externalReference ?? nestedRef) as string | undefined;
  return {
    ...raw,
    id,
    requestType,
    userId,
    amount: typeof raw.amount === "number" ? raw.amount : parseFloat(String(raw.amount || 0)) || undefined,
    status: (raw.status as string) ?? "pending",
    referenceNumber,
    createdAt: raw.createdAt as string | undefined,
    processedAt: raw.processedAt as string | undefined,
    notes: (raw.notes ?? raw.adminNotes ?? (raw as { admin_notes?: string }).admin_notes) as string | undefined,
    user, // normalized last so email -> emailAddress, etc. take precedence over raw.user
  };
}

/**
 * Fetch all deposit requests from wallet backend (time deposit, top-up, stock).
 * Merges results from the three admin endpoints per API-AUTH-AND-USERS.md.
 * Base URL: API_BASE_URL (NEXT_PUBLIC_WALLET_BACKEND_URL).
 */
export async function getDepositRequests(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentMethod?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<DepositRequestsResponse> {
  try {
    const includeAllStatuses = !params?.status || params.status === "all" || params.status === "approved" || params.status === "rejected";
    const statusParam = toStatusParam(params?.status);
    const [timeDeposits, topUp, stock] = await Promise.all([
      fetchTimeDeposits(includeAllStatuses, statusParam),
      fetchTopUp(includeAllStatuses, statusParam),
      fetchStockInvestment(includeAllStatuses, statusParam),
    ]);

    let items: DepositRequestItem[] = [
      ...timeDeposits,
      ...topUp,
      ...stock,
    ];

    // Enrich with user details when backend omits user (fetch by userId)
    const toEnrich = items.filter(
      (i) =>
        i.userId &&
        !i.user?.firstName &&
        !i.user?.lastName &&
        !i.user?.emailAddress
    );
    if (toEnrich.length > 0) {
      const userIds = [...new Set(toEnrich.map((i) => i.userId!))];
      const userMap = new Map<string, { firstName?: string; lastName?: string; emailAddress?: string; accountNumber?: string }>();

      for (const uid of userIds) {
        let u = (await getUserById(uid)).data;
        if (!u) {
          const listRes = await getUsers({ page: 1, limit: 100 });
          const found = listRes.data?.users?.find((us) => us._id === uid || us.userId === uid || (us as { id?: string }).id === uid);
          if (found) u = found;
        }
        if (u) {
          userMap.set(uid, {
            firstName: u.firstName,
            lastName: u.lastName,
            emailAddress: u.emailAddress ?? (u as { email?: string }).email,
            accountNumber: u.accountNumber,
          });
        }
      }

      items = items.map((item) => {
        if (!item.userId || !toEnrich.find((e) => e.id === item.id)) return item;
        const u = userMap.get(item.userId);
        if (!u) return item;
        return {
          ...item,
          user: {
            ...item.user,
            ...u,
          },
        } as DepositRequestItem;
      });
    }

    // Client-side filters
    if (params?.status && params.status !== "all") {
      const s = params.status.toLowerCase();
      items = items.filter((i) => {
        const status = (i.status ?? "").toLowerCase();
        if (s === "approved") return status === "approved" || status === "completed";
        return status === s;
      });
    }
    if (params?.paymentMethod && params.paymentMethod !== "all") {
      const pm = params.paymentMethod.toLowerCase();
      items = items.filter((i) => {
        const rt = i.requestType ?? "";
        if (pm === "time_deposit") return rt === "time_deposit";
        if (pm === "stock") return rt === "stock";
        if (pm === "topup_available_balance") return rt === "top_up_balance";
        return false;
      });
    }
    if (params?.search?.trim()) {
      const q = params.search.toLowerCase().trim();
      items = items.filter((i) => {
        const name = `${i.user?.firstName ?? ""} ${i.user?.lastName ?? ""}`.toLowerCase();
        const email = (i.user?.emailAddress ?? "").toLowerCase();
        const ref = (i.referenceNumber ?? i.id ?? "").toLowerCase();
        return name.includes(q) || email.includes(q) || ref.includes(q);
      });
    }
    if (params?.dateFrom || params?.dateTo) {
      items = items.filter((i) => {
        const created = i.createdAt ? new Date(i.createdAt).getTime() : 0;
        if (params.dateFrom && created < new Date(params.dateFrom).getTime()) return false;
        if (params.dateTo && created > new Date(params.dateTo).getTime()) return false;
        return true;
      });
    }

    // Sort by createdAt desc
    items.sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const total = items.length;
    const start = (page - 1) * limit;
    const paginated = items.slice(start, start + limit);

    return {
      success: true,
      data: {
        items: paginated,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 0,
        },
      },
    };
  } catch (err) {
    return {
      success: false,
      data: {
        items: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
      },
    };
  }
}

/**
 * Fetch deposit request stats (total, pending, approved, rejected, totalAmount) from wallet backend.
 */
export async function getDepositRequestStats(): Promise<{
  success: boolean;
  data?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalAmount: string;
  };
}> {
  try {
    const response = await getDepositRequests({ page: 1, limit: 9999 });
    const items = response.data?.items ?? [];
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let totalAmount = 0;
    for (const i of items) {
      const s = (i.status ?? "").toLowerCase();
      if (s === "pending") pending++;
      else if (s === "approved" || s === "completed") approved++;
      else if (s === "rejected") rejected++;
      totalAmount += Number(i.amount ?? 0);
    }
    return {
      success: true,
      data: {
        total: items.length,
        pending,
        approved,
        rejected,
        totalAmount: totalAmount.toFixed(2),
      },
    };
  } catch {
    return {
      success: true,
      data: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        totalAmount: "0",
      },
    };
  }
}

/**
 * Fetch a single deposit request by ID and type.
 * Used to load full details (e.g. reference) when opening the details modal.
 * Falls back to undefined if endpoint is not available.
 */
export async function getDepositRequestById(
  id: string,
  requestType: DepositRequestType
): Promise<DepositRequestItem | undefined> {
  try {
    let url: string;
    switch (requestType) {
      case "top_up_balance":
        url = `${API_BASE_URL}/deposit-requests/admin/top-up/${id}`;
        break;
      case "stock":
        url = `${API_BASE_URL}/deposit-requests/admin/stock-investment/${id}`;
        break;
      case "time_deposit":
        url = `${API_BASE_URL}/time-deposits/${id}`;
        break;
      default:
        return undefined;
    }
    const response = await fetch(url, { headers: buildHeaders() });
    if (!response.ok) return undefined;
    const json = (await response.json()) as Record<string, unknown>;
    const raw = (json?.data as Record<string, unknown>) ?? json;
    return normalizeItem(raw as Record<string, unknown>, requestType);
  } catch {
    return undefined;
  }
}

/** Approve a time deposit request */
export async function approveTimeDeposit(
  id: string,
  body: ApproveRejectBody
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/time-deposits/${id}/approve`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ notes: body.notes }),
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
    body: JSON.stringify({ notes: body.notes }),
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
      body: JSON.stringify({ notes: body.notes }),
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
      body: JSON.stringify({ notes: body.notes }),
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
      body: JSON.stringify({ notes: body.notes }),
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
      body: JSON.stringify({ notes: body.notes }),
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
