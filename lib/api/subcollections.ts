import { API_BASE_URL } from "./client";

export interface SubcollectionUser {
  odId?: string;
  oderId?: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  accountNumber?: string;
}

export interface BankApplication {
  _firebaseDocId: string;
  userId?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  status?: string;
  type?: string;
  amount?: number;
  createdAt?: string;
  updatedAt?: string;
  user: SubcollectionUser;
  [key: string]: unknown;
}

export interface DepositRequest {
  _firebaseDocId: string;
  userId?: string;
  amount?: number;
  status?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  createdAt?: string;
  user: SubcollectionUser;
  [key: string]: unknown;
}

export interface WithdrawalRequest {
  _firebaseDocId: string;
  userId?: string;
  withdrawalType?: string;
  amount?: number;
  currency?: string;
  emailAddress?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  bankName?: string;
  branchName?: string;
  requestType?: string;
  status?: string;
  submittedAt?: string;
  processedAt?: string;
  approvedAt?: string;
  completedAt?: string;
  notes?: string;
  rejectionReason?: string;
  transactionId?: string;
  processingFee?: number;
  netAmount?: number;
  user: SubcollectionUser;
  [key: string]: unknown;
}

export interface MayaApplication {
  _firebaseDocId: string;
  userId?: string;
  status?: string;
  applicationDate?: string;
  createdAt?: string;
  user: SubcollectionUser;
  [key: string]: unknown;
}

export interface TravelApplication {
  _firebaseDocId: string;
  userId?: string;
  destination?: string;
  travelDate?: string;
  status?: string;
  coverage?: string;
  premium?: number;
  createdAt?: string;
  user: SubcollectionUser;
  [key: string]: unknown;
}

export interface SubcollectionResponse<T> {
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

export interface GetSubcollectionParams {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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

const buildQueryString = (params: GetSubcollectionParams): string => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.status) queryParams.append('status', params.status);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  return queryParams.toString();
};

async function fetchSubcollection<T>(
  endpoint: string,
  params: GetSubcollectionParams = {}
): Promise<SubcollectionResponse<T>> {
  const queryString = buildQueryString(params);
  const url = `${API_BASE_URL}/api/subcollections/${endpoint}${queryString ? `?${queryString}` : ''}`;

  console.log('[API] Fetching:', url);
  console.log('[API] Params:', params);

  const response = await fetch(url, {
    method: 'GET',
    headers: authHeaders(),
  });

  const payload = await response.json() as SubcollectionResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || `Failed to fetch ${endpoint}`);
  }

  return payload;
}

export const getBankApplications = (params?: GetSubcollectionParams) =>
  fetchSubcollection<BankApplication>('bank-applications', params);

export const getDepositRequests = (params?: GetSubcollectionParams) =>
  fetchSubcollection<DepositRequest>('deposit-requests', params);

export const getWithdrawalRequests = (params?: GetSubcollectionParams) =>
  fetchSubcollection<WithdrawalRequest>('withdrawals', params);

export const getMayaApplications = (params?: GetSubcollectionParams) =>
  fetchSubcollection<MayaApplication>('maya-applications', params);

export const getTravelApplications = (params?: GetSubcollectionParams) =>
  fetchSubcollection<TravelApplication>('travel-applications', params);

// Helper to get user full name
export const getUserFullName = (user: SubcollectionUser): string => {
  const first = user.firstName || '';
  const last = user.lastName || '';
  return `${first} ${last}`.trim() || 'Unknown User';
};

// Helper to get avatar URL
export const getUserAvatarUrl = (user: SubcollectionUser): string => {
  const name = getUserFullName(user);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;
};

export interface Task {
  _firebaseDocId: string;
  name?: string;
  description?: string;
  points?: number;
  link?: string;
  expiration?: string;
  hasExpiration?: boolean;
  createdAt?: string;
  lastUpdated?: string;
  completedCount?: number;
  notCompletedCount?: number;
  totalUsers?: number;
  completionRate?: number;
  status?: 'active' | 'inactive';
  [key: string]: unknown;
}

export async function getTasks(params?: {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<SubcollectionResponse<Task>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const url = `${API_BASE_URL}/api/subcollections/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }

  return response.json();
}
