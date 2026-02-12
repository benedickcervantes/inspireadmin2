// API functions for withdrawal requests

const API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:4000";

export interface Withdrawal {
  id: string;
  userId: string;
  userName?: string;
  userEmail: string;
  emailAddress?: string;
  withdrawalType: string;
  withdrawalMethod: string;
  ewalletType?: string;
  amount: number;
  currency: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  bankName?: string;
  branchName?: string;
  walletNumber?: string;
  walletName?: string;
  requestType: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt?: string;
  requestDate?: string;
  processedAt?: string;
  approvedAt?: string;
  notes?: string;
  approvedBy?: string;
  rejectionReason?: string;
  transactionId?: string;
  processingFee?: number;
  netAmount?: number;
  withdrawalId?: string;
  source: 'top-level' | 'user-subcollection';
  _firebaseDocId?: string;
  paymentMethod?: string;
  mobileNumber?: string;
  walletAddress?: string;
  user?: {
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface WithdrawalStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalAmount: number;
}

export interface WithdrawalsResponse {
  success: boolean;
  data: {
    withdrawals: Withdrawal[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    stats: WithdrawalStats;
  };
}

export interface WithdrawalResponse {
  success: boolean;
  data: Withdrawal;
}

export interface UpdateStatusResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: string;
    processedBy: string;
    processedAt: string;
  };
}

export interface WithdrawalsFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'pending' | 'approved' | 'rejected';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetch withdrawal requests with optional filters
 */
export async function getWithdrawals(filters: WithdrawalsFilters = {}): Promise<WithdrawalsResponse> {
  const token = localStorage.getItem("authToken");
  
  // Build query string
  const params = new URLSearchParams();
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

  const queryString = params.toString();
  const url = `${API_BASE_URL}/api/withdrawals${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch withdrawals");
  }

  return await response.json();
}

/**
 * Get a single withdrawal by ID
 */
export async function getWithdrawalById(id: string): Promise<WithdrawalResponse> {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_BASE_URL}/api/withdrawals/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch withdrawal");
  }

  return await response.json();
}

/**
 * Update withdrawal status (approve or reject)
 */
export async function updateWithdrawalStatus(
  id: string,
  status: 'approved' | 'rejected',
  rejectionReason?: string
): Promise<UpdateStatusResponse> {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_BASE_URL}/api/withdrawals/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, rejectionReason }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update withdrawal status");
  }

  return await response.json();
}
