const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export interface AdminLog {
  id: string;
  adminDisplayName?: string;
  adminEmail?: string;
  action?: string;
  targetUserName?: string;
  targetUserId?: string;
  details?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export interface GetAdminLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  adminEmail?: string;
  action?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminLogsResponse {
  success: boolean;
  data?: {
    logs: AdminLog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
  message?: string;
}

export interface AdminLogResponse {
  success: boolean;
  data?: AdminLog;
  error?: string;
  message?: string;
}

export interface AdminEmailsResponse {
  success: boolean;
  data?: Array<{
    email: string;
    displayName: string;
  }>;
  error?: string;
  message?: string;
}

export interface ActionsResponse {
  success: boolean;
  data?: string[];
  error?: string;
  message?: string;
}

const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

const authHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getAdminLogs = async (params: GetAdminLogsParams = {}): Promise<AdminLogsResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.adminEmail) queryParams.append('adminEmail', params.adminEmail);
  if (params.action) queryParams.append('action', params.action);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/api/admin-logs${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: authHeaders(),
  });

  const payload = await response.json() as AdminLogsResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || 'Failed to fetch admin logs');
  }

  return payload;
};

export const getAdminLogById = async (id: string): Promise<AdminLogResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/admin-logs/${id}`, {
    method: 'GET',
    headers: authHeaders(),
  });

  const payload = await response.json() as AdminLogResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || 'Failed to fetch admin log');
  }

  return payload;
};

export const getAdminEmails = async (): Promise<AdminEmailsResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/admin-logs/admins`, {
    method: 'GET',
    headers: authHeaders(),
  });

  const payload = await response.json() as AdminEmailsResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || 'Failed to fetch admin emails');
  }

  return payload;
};

export const getActions = async (): Promise<ActionsResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/admin-logs/actions`, {
    method: 'GET',
    headers: authHeaders(),
  });

  const payload = await response.json() as ActionsResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || 'Failed to fetch actions');
  }

  return payload;
};
