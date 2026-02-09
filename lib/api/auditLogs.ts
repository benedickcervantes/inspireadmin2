// API functions for admin audit logs

const API_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL || "http://localhost:4000";

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  action: string;
  actionLabel: string;
  resourceType: string;
  resourceId?: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface AuditLogsResponse {
  success: boolean;
  data: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuditLogsFilters {
  page?: number;
  limit?: number;
  action?: string;
  adminId?: string;
  adminEmail?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  resourceType?: string;
}

/**
 * Fetch admin audit logs with optional filters
 */
export async function getAuditLogs(filters: AuditLogsFilters = {}): Promise<AuditLogsResponse> {
  const token = localStorage.getItem("authToken");
  
  // Build query string
  const params = new URLSearchParams();
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.action) params.append("action", filters.action);
  if (filters.adminId) params.append("adminId", filters.adminId);
  if (filters.adminEmail) params.append("adminEmail", filters.adminEmail);
  if (filters.search) params.append("search", filters.search);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.resourceType) params.append("resourceType", filters.resourceType);

  const queryString = params.toString();
  const url = `${API_BASE_URL}/api/admin-logs${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch audit logs");
  }

  const result = await response.json();
  
  // Transform backend response to match frontend expectations
  return {
    success: result.success,
    data: result.data?.logs || [],
    pagination: result.data?.pagination || {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    }
  };
}

export interface AuditStats {
  totalActions: number;
  uniqueAdmins: number;
  actionsByType: Record<string, number>;
  actionsByDay: Array<{ date: string; count: number }>;
  topAdmins: Array<{ adminId: string; adminName: string; actionCount: number }>;
}

/**
 * Fetch audit log statistics
 */
export async function getAuditStats(period: string = "month"): Promise<AuditStats> {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_BASE_URL}/api/admin-logs/stats?period=${period}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch audit statistics");
  }

  const data = await response.json();
  return data.stats;
}
