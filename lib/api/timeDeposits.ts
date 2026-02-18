import { API_BASE_URL } from './client';

export type TimeDepositTerm = 'sixMonths' | 'oneYear' | 'twoYears';
export type TimeDepositReferralMode = 'manual' | 'hierarchy';

export interface TimeDepositReferralInput {
  referrerUserId: string;
  commissionPercentage?: number;
  mode?: TimeDepositReferralMode;
}

export interface TimeDepositContractInput {
  enabled?: boolean;
  strict?: boolean;
}

export interface TimeDepositQuoteRequest {
  amount: number;
  term: TimeDepositTerm;
  initialDate?: string;
  finalInterestRate?: number;
  referral?: TimeDepositReferralInput;
}

export interface TimeDepositQuoteData {
  term: TimeDepositTerm;
  cycles: number;
  estimatedInterestRate: number;
  finalInterestRate: number;
  annualNetInterest: number;
  totalNetInterestForTerm: number;
  totalReturnAmount: number;
  estimatedAgentRate?: number;
  referralNetCommission?: number;
}

export interface TimeDepositQuoteResponse {
  success: boolean;
  error?: string;
  message?: string;
  data?: TimeDepositQuoteData;
  requestId?: string;
}

export interface TimeDepositCreateRequest {
  amount: number;
  term: TimeDepositTerm;
  initialDate: string;
  finalInterestRate?: number;
  referral?: TimeDepositReferralInput;
  contract?: TimeDepositContractInput;
}

export interface TimeDepositRecord {
  id: string;
  displayId: string;
  userId: string;
  amount: number;
  term: TimeDepositTerm;
  initialDate: string;
  completionDate: string;
  status: string;
  estimatedInterestRate: number;
  finalInterestRate: number;
  annualNetInterest: number;
  totalNetInterestForTerm: number;
  totalReturnAmount: number;
  estimatedAgentRate?: number;
  agentRate?: number;
  requestId?: string;
  contractId?: string;
}

export interface TimeDepositCreateResponse {
  success: boolean;
  error?: string;
  message?: string;
  data?: {
    timeDeposit: TimeDepositRecord;
    idempotent?: boolean;
    contract?: {
      contractId: string;
      urls?: {
        view?: string | null;
        download?: string | null;
        pdf?: string | null;
      };
      expiresAt?: string | null;
    };
    contractWarning?: string;
  };
  requestId?: string;
}

const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

const buildHeaders = (requestId?: string): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(requestId ? { 'X-Request-Id': requestId } : {})
  };
};

const parseErrorMessage = (payload: { error?: string; message?: string }, fallback: string) =>
  payload.error || payload.message || fallback;

export const quoteTimeDeposit = async (
  payload: TimeDepositQuoteRequest
): Promise<TimeDepositQuoteResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/time-deposits/quote`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(payload)
  });

  const result = (await response.json()) as TimeDepositQuoteResponse;

  if (!response.ok || !result.success) {
    throw new Error(parseErrorMessage(result, 'Failed to quote time deposit'));
  }

  return result;
};

export const createUserTimeDeposit = async (
  userId: string,
  payload: TimeDepositCreateRequest,
  requestId?: string
): Promise<TimeDepositCreateResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/firebase-users/${encodeURIComponent(userId)}/time-deposits`, {
    method: 'POST',
    headers: buildHeaders(requestId),
    body: JSON.stringify(payload)
  });

  const result = (await response.json()) as TimeDepositCreateResponse;

  if (!response.ok || !result.success) {
    throw new Error(parseErrorMessage(result, 'Failed to create time deposit'));
  }

  return result;
};
