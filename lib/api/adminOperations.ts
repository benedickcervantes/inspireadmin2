import { API_BASE_URL } from "./client";

/**
 * Verify admin password for sensitive operations
 * @param password - Admin password to verify
 * @returns Promise<boolean> - True if password is valid
 */
export const verifyAdminPassword = async (password: string): Promise<boolean> => {
    try {
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

        const response = await fetch(`${API_BASE_URL}/api/admin-auth/verify-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ password }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Password verification error:', error);
        return false;
    }
};

/**
 * Delete a Firebase user
 * @param userId - User ID to delete
 * @returns Promise with deletion result
 */
export const deleteFirebaseUser = async (userId: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

        const response = await fetch(`${API_BASE_URL}/api/firebase-users/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to delete user');
        }

        return data;
    } catch (error) {
        console.error('User deletion error:', error);
        throw error;
    }
};
