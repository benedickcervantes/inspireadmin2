import { API_BASE_URL } from "./client";

/**
 * Get admin profile
 */
export async function getAdminProfile() {
  try {
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(`${API_BASE_URL}/api/admin/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch profile");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

/**
 * Update admin username (maps to PATCH /auth/profile firstName/lastName)
 */
export async function updateAdminUsername(username: string) {
  try {
    const token = localStorage.getItem("authToken");
    const parts = username.trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName, lastName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update username");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating username:", error);
    throw error;
  }
}

/**
 * Update admin email - wallet backend does not expose email update via API
 */
export async function updateAdminEmail(_email: string) {
  throw new Error("Email update is not supported by the backend.");
}

/**
 * Update admin password - wallet backend does not expose password update via API
 */
export async function updateAdminPassword(_currentPassword: string, _newPassword: string) {
  throw new Error("Password update is not supported by the backend.");
}

/**
 * Update investment rates
 */
export interface InvestmentRates {
  monthlyRate: number;
  quarterlyRate: number;
  semiAnnualRate: number;
  annualRate: number;
}

export async function updateInvestmentRates(rates: InvestmentRates) {
  try {
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(`${API_BASE_URL}/api/admin/settings/investment-rates`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update investment rates");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating investment rates:", error);
    throw error;
  }
}

/**
 * Get investment rates
 */
export async function getInvestmentRates(): Promise<InvestmentRates> {
  try {
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(`${API_BASE_URL}/api/admin/settings/investment-rates`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch investment rates");
    }

    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error("Error fetching investment rates:", error);
    throw error;
  }
}
