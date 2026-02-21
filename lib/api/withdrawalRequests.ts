/**
 * Withdrawal request API – fetch from wallet backend, approve/reject flows.
 * Uses API_BASE_URL (wallet backend). See lib/docs/backenddocs/API-WITHDRAWAL-REQUESTS.md
 */

import { API_BASE_URL } from "./client";
import { getUserById, getUsers } from "./users";

export interface ApproveRejectBody {
  password: string;
  notes?: string;
}

/** Normalized withdrawal request from backend (method: local_bank | e_wallet) */
export interface WithdrawalRequestItem {
  id: string;
  userId?: string;
  walletId?: string;
  currencyId?: string;
  method: "local_bank" | "e_wallet";
  walletType?: "gcash" | "maya";
  amount?: number;
  status?: string;
  accountNumber?: string;
  accountHolderName?: string;
  accountName?: string;
  bankName?: string;
  branchName?: string;
  adminNotes?: string;
  reviewedAt?: string;
  reviewedById?: string;
  createdAt?: string;
  updatedAt?: string;
  user: {
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
    accountNumber?: string;
  };
  [key: string]: unknown;
}

export interface WithdrawalRequestsResponse {
  success: boolean;
  data?: {
    items: WithdrawalRequestItem[];
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

async function fetchJsonArray(url: string): Promise<unknown[] | null> {
  const response = await fetch(url, {
    headers: buildHeaders(),
    cache: "no-store",
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

function toStatusParam(status?: string): string | undefined {
  if (!status || status === "all") return undefined;
  const s = status.toLowerCase();
  if (s === "pending") return "PENDING";
  if (s === "approved") return "APPROVED";
  if (s === "rejected") return "REJECTED";
  return undefined;
}

function buildListUrl(base: string, statusParam?: string): string {
  if (!statusParam) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}status=${encodeURIComponent(statusParam)}`;
}

function normalizeItem(raw: Record<string, unknown>): WithdrawalRequestItem {
  const id = String(raw.id ?? raw._firebaseDocId ?? "");
  const rawUser = (raw.user ?? raw.User ?? raw.userInfo ?? raw.owner ?? {}) as Record<string, unknown>;
  const flat = raw as Record<string, unknown>;
  const user = {
    firstName: (rawUser.firstName ?? rawUser.first_name ?? flat.userFirstName ?? flat.user_first_name) as string | undefined,
    lastName: (rawUser.lastName ?? rawUser.last_name ?? flat.userLastName ?? flat.user_last_name) as string | undefined,
    emailAddress: (rawUser.emailAddress ?? rawUser.email ?? flat.userEmail ?? flat.user_email) as string | undefined,
    accountNumber: (rawUser.accountNumber ?? rawUser.account_number) as string | undefined,
    ...rawUser,
  } as WithdrawalRequestItem["user"];

  const method = ((raw.method ?? raw.withdrawalMethod ?? "local_bank") as string).toLowerCase();
  const walletType = (raw.walletType ?? raw.ewalletType ?? "").toString().toLowerCase();

  return {
    ...raw,
    id,
    userId: (raw.userId ?? raw.ownerId ?? raw.user_id) as string | undefined,
    walletId: raw.walletId as string | undefined,
    currencyId: raw.currencyId as string | undefined,
    method: method === "e_wallet" || method === "ewallet" ? "e_wallet" : "local_bank",
    walletType: walletType === "gcash" ? "gcash" : walletType === "maya" ? "maya" : undefined,
    amount: typeof raw.amount === "number" ? raw.amount : parseFloat(String(raw.amount || 0)) || undefined,
    status: (raw.status as string) ?? "pending",
    accountNumber: (raw.accountNumber ?? raw.account_number) as string | undefined,
    accountHolderName: (raw.accountHolderName ?? raw.account_holder_name ?? raw.bankAccountName) as string | undefined,
    accountName: (raw.accountName ?? raw.account_name) as string | undefined,
    bankName: (raw.bankName ?? raw.bank_name) as string | undefined,
    branchName: (raw.branchName ?? raw.branch_name) as string | undefined,
    adminNotes: (raw.adminNotes ?? raw.admin_notes ?? raw.notes) as string | undefined,
    reviewedAt: raw.reviewedAt as string | undefined,
    reviewedById: raw.reviewedById as string | undefined,
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
    user,
  };
}

/**
 * Fetch withdrawal requests from wallet backend.
 * GET /withdrawal-requests/admin?status=PENDING|APPROVED|REJECTED
 */
export async function getWithdrawalRequests(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<WithdrawalRequestsResponse> {
  try {
    const includeAllStatuses = !params?.status || params.status === "all" || params.status === "approved" || params.status === "rejected";
    const statusParam = toStatusParam(params?.status);
    const baseAll = `${API_BASE_URL}/withdrawal-requests/admin`;
    const basePending = `${API_BASE_URL}/withdrawal-requests/admin/pending`;
    const urls = includeAllStatuses
      ? [buildListUrl(baseAll, statusParam), basePending]
      : [basePending];

    let items: WithdrawalRequestItem[] = [];
    for (const url of urls) {
      const rawItems = await fetchJsonArray(url);
      if (rawItems !== null) {
        items = rawItems.map((item) => normalizeItem(item as Record<string, unknown>));
        break;
      }
    }

    // Enrich with user details when backend omits user
    const toEnrich = items.filter(
      (i) =>
        i.userId &&
        !i.user?.firstName &&
        !i.user?.lastName &&
        !i.user?.emailAddress
    );
    if (toEnrich.length > 0) {
      const userIds = [...new Set(toEnrich.map((i) => i.userId!))];
      const userMap = new Map<string, { firstName?: string; lastName?: string; emailAddress?: string }>();

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
          });
        }
      }

      items = items.map((item) => {
        if (!item.userId || !toEnrich.find((e) => e.id === item.id)) return item;
        const u = userMap.get(item.userId);
        if (!u) return item;
        return {
          ...item,
          user: { ...item.user, ...u },
        } as WithdrawalRequestItem;
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
    if (params?.search?.trim()) {
      const q = params.search.toLowerCase().trim();
      items = items.filter((i) => {
        const name = `${i.user?.firstName ?? ""} ${i.user?.lastName ?? ""}`.toLowerCase();
        const email = (i.user?.emailAddress ?? "").toLowerCase();
        const ref = (i.id ?? "").toLowerCase();
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

/** Approve withdrawal request – POST /withdrawal-requests/admin/:id/approve */
export async function approveWithdrawalRequest(id: string, body: ApproveRejectBody): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/withdrawal-requests/admin/${id}/approve`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ notes: body.notes }),
  });
  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message);
  }
}

/** Reject withdrawal request – POST /withdrawal-requests/admin/:id/reject */
export async function rejectWithdrawalRequest(id: string, body: ApproveRejectBody): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/withdrawal-requests/admin/${id}/reject`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ notes: body.notes }),
  });
  if (!response.ok) {
    const message = await parseError(response);
    throw new Error(message);
  }
}
