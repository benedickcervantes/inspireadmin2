// API functions for task withdrawal requests

const API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:4000";

export interface TaskWithdrawal {
  id: string;
  userId: string;
  userName?: string;
  userEmail: string;
  mobileNumber: string;
  amount: number;
  amountInPeso: string;
  balanceBefore: number;
  balanceAfter: number;
  paymentMethod: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
}

export interface TaskWithdrawalStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalAmount: number;
}

export interface TaskWithdrawalsResponse {
  success: boolean;
  data: {
    withdrawals: TaskWithdrawal[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    stats: TaskWithdrawalStats;
  };
}

export interface TaskWithdrawalResponse {
  success: boolean;
  data: TaskWithdrawal;
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

export interface TaskWithdrawalsFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'pending' | 'approved' | 'rejected';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetch task withdrawal requests with optional filters
 */
export async function getTaskWithdrawals(filters: TaskWithdrawalsFilters = {}): Promise<TaskWithdrawalsResponse> {
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
  const url = `${API_BASE_URL}/api/task-withdrawals${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch task withdrawals");
  }

  return await response.json();
}

/**
 * Get a single task withdrawal by ID
 */
export async function getTaskWithdrawalById(id: string): Promise<TaskWithdrawalResponse> {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_BASE_URL}/api/task-withdrawals/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch task withdrawal");
  }

  return await response.json();
}

/**
 * Update task withdrawal status (approve or reject)
 */
export async function updateWithdrawalStatus(
  id: string,
  status: 'approved' | 'rejected'
): Promise<UpdateStatusResponse> {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_BASE_URL}/api/task-withdrawals/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update withdrawal status");
  }

  return await response.json();
}
