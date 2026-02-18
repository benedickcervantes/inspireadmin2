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
 * Update admin username
 */
export async function updateAdminUsername(username: string) {
  try {
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(`${API_BASE_URL}/api/admin/profile/username`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
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
 * Update admin email
 */
export async function updateAdminEmail(email: string) {
  try {
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(`${API_BASE_URL}/api/admin/profile/email`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update email");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating email:", error);
    throw error;
  }
}

/**
 * Update admin password
 */
export async function updateAdminPassword(currentPassword: string, newPassword: string) {
  try {
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(`${API_BASE_URL}/api/admin/profile/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update password");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
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
