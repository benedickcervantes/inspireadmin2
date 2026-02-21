/**
 * Placeholder responses for features that require wallet backend endpoints
 * not yet implemented. Returns empty data with success flag.
 */

export const EMPTY_PAGINATION = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
};

export const FEATURE_UNAVAILABLE_MESSAGE =
  "This feature requires backend support. The wallet backend does not yet expose the required endpoints.";

export function emptyCollectionResponse<T>() {
  return {
    success: true,
    data: {
      items: [] as T[],
      pagination: EMPTY_PAGINATION,
    },
  };
}
