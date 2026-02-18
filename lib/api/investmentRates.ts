import { API_BASE_URL } from './client';

export interface InvestmentRates {
  sixMonths: Record<string, number>;
  oneYear: Record<string, number>;
  twoYears: Record<string, number>;
  agentRates: Record<string, number>;
}

export interface InvestmentRatesResponse {
  success: boolean;
  data?: {
    docId: string;
    sixMonths?: Record<string, number>;
    oneYear?: Record<string, number>;
    twoYears?: Record<string, number>;
    agentRates?: Record<string, number>;
  };
  error?: string;
  message?: string;
}

export interface UpdateInvestmentRatesPayload {
  sixMonths?: Record<string, number>;
  oneYear?: Record<string, number>;
  twoYears?: Record<string, number>;
  agentRates?: Record<string, number>;
}

const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

const buildHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch investment rate tiers from Firestore
 * @param docId - Document ID (default matches backend INVESTMENT_RATES_DOC_ID)
 */
export const getInvestmentRates = async (
  docId: string = process.env.NEXT_PUBLIC_INVESTMENT_RATES_DOC_ID || 'eFy3nFCysIC824WKNfKW'
): Promise<InvestmentRatesResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/investment-rates/${encodeURIComponent(docId)}`,
    {
      method: 'GET',
      headers: buildHeaders(),
    }
  );

  const result = (await response.json()) as InvestmentRatesResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.error || result.message || 'Failed to fetch investment rates');
  }

  return result;
};

/**
 * Update investment rate tiers in Firestore (admin only)
 * This affects all future time deposits
 * @param docId - Document ID (default matches backend INVESTMENT_RATES_DOC_ID)
 * @param payload - Updated rate tiers (only provide terms you want to update)
 */
export const updateInvestmentRates = async (
  docId: string = process.env.NEXT_PUBLIC_INVESTMENT_RATES_DOC_ID || 'eFy3nFCysIC824WKNfKW',
  payload: UpdateInvestmentRatesPayload
): Promise<InvestmentRatesResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/investment-rates/${encodeURIComponent(docId)}`,
    {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const result = (await response.json()) as InvestmentRatesResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.error || result.message || 'Failed to update investment rates');
  }

  return result;
};
