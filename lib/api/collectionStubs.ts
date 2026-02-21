/**
 * Stub implementations for collection endpoints.
 * These return empty data - the wallet backend does not yet expose these endpoints.
 * Pages will render empty state. Add a banner in the UI for "Feature requires backend support".
 */

import { emptyCollectionResponse } from "./placeholders";

export interface CollectionParams {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  [key: string]: unknown;
}

export async function getCollectionStub<T>(
  _collection: string,
  _params?: CollectionParams
) {
  return emptyCollectionResponse<T>();
}

export async function getDepositRequestsStub(_params?: CollectionParams) {
  return emptyCollectionResponse<unknown>();
}

export async function getDepositRequestStatsStub() {
  return {
    success: true,
    data: {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0,
      totalAmount: "0",
    },
  };
}
