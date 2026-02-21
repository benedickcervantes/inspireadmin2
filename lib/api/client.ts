// API client configuration and utilities
// Admin portal connects exclusively to the wallet backend

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_WALLET_BACKEND_URL || "http://localhost:3000";
