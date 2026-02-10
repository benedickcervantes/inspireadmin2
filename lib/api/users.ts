import { API_BASE_URL } from "./client";

export interface UserSubcollection {
  _firebaseDocId: string;
  [key: string]: unknown;
}

export interface User {
  _id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  accountNumber?: string;
  agentNumber?: string;
  agentCode?: string;
  refferedAgent?: string;
  company?: string;
  status?: string;
  kycStatus?: string;
  kycApproved?: boolean;
  kycApprovedAt?: string;
  accountType?: string;
  agent?: boolean;
  isOnline?: boolean;
  isDummyAccount?: boolean;
  preferredLanguage?: string;

  // Balances
  walletAmount?: number;
  availBalanceAmount?: number;
  stockAmount?: number;
  timeDepositAmount?: number;
  agentWalletAmount?: number;
  usdtAmount?: number;
  dollarDepositAmount?: number;
  dollarAvailBalanceAmount?: number;
  dollarWalletAmount?: number;
  cryptoAvailBalanceAmount?: number;
  cryptoWalletAmount?: number;
  accumulatedPoints?: number;

  // Objects
  cryptoBalances?: Record<string, number>;
  currencyBalances?: Record<string, number>;
  stock?: Record<string, unknown>;

  // Timestamps
  createdAt?: string;
  lastSignedIn?: string;
  lastLogin?: string;
  lastLogout?: string;

  // Migration info
  migratedFromFirebase?: boolean;
  migrationDate?: string;
  hasPassword?: boolean;
  migrationStatus?: 'password_set' | 'password_needed' | 'not_firebase';

  // Subcollections
  subcollections?: {
    transactions?: UserSubcollection[];
    agentTransactions?: UserSubcollection[];
    cryptoTrades?: UserSubcollection[];
    stockTransactions?: UserSubcollection[];
    investmentProfiles?: UserSubcollection[];
    notifications?: UserSubcollection[];
    pointsTransactions?: UserSubcollection[];
    purchasedCards?: UserSubcollection[];
    withdrawals?: UserSubcollection[];
    [key: string]: UserSubcollection[] | undefined;
  };
}

export interface UsersResponse {
  success: boolean;
  error?: string;
  data?: {
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface UserResponse {
  success: boolean;
  error?: string;
  data?: User;
}

export interface UserMigrationSummary {
  totalUsers: number;
  firebaseUsers: number;
  firebasePasswordSet: number;
  firebasePasswordNeeded: number;
  nativeUsers: number;
}

export interface UserMigrationSummaryResponse {
  success: boolean;
  error?: string;
  data?: UserMigrationSummary;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  kycStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  /** When true: agents only. When false: non-agents (account/investor). When undefined: all. */
  agent?: boolean;
  /** Filter by account type (e.g., 'demo', 'test') */
  accountType?: string;
  /** Filter by dummy account status */
  isDummyAccount?: boolean;
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

export const getUsers = async (params: GetUsersParams = {}): Promise<UsersResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);
  if (params.kycStatus) queryParams.append('kycStatus', params.kycStatus);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  if (params.agent === true) queryParams.append('agent', 'true');
  if (params.agent === false) queryParams.append('agent', 'false');
  if (params.accountType) queryParams.append('accountType', params.accountType);
  if (params.isDummyAccount === true) queryParams.append('isDummyAccount', 'true');
  if (params.isDummyAccount === false) queryParams.append('isDummyAccount', 'false');

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/api/users${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: authHeaders(),
  });

  const payload = await response.json() as UsersResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || 'Failed to fetch users');
  }

  return payload;
};

export const getUserById = async (id: string): Promise<UserResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: 'GET',
    headers: authHeaders(),
  });

  const payload = await response.json() as UserResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || 'Failed to fetch user');
  }

  return payload;
};

export const getUserByEmail = async (email: string): Promise<UserResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/users/email/${encodeURIComponent(email)}`, {
    method: 'GET',
    headers: authHeaders(),
  });

  const payload = await response.json() as UserResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || 'Failed to fetch user');
  }

  return payload;
};

export const getUserMigrationSummary = async (): Promise<UserMigrationSummaryResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/users/migration-summary`, {
    method: 'GET',
    headers: authHeaders(),
  });

  const payload = await response.json() as UserMigrationSummaryResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || 'Failed to fetch migration summary');
  }

  return payload;
};
