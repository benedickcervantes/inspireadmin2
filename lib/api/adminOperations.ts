import { login } from "./walletAuth";

/**
 * Verify admin password by attempting login (wallet backend)
 * @param password - Admin password to verify
 * @returns Promise<boolean> - True if password is valid
 */
export const verifyAdminPassword = async (password: string): Promise<boolean> => {
    try {
        const authUser = typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
        if (!authUser) return false;
        const user = JSON.parse(authUser);
        const email = user.email || user.emailAddress;
        if (!email) return false;

        await login(email, password);
        return true;
    } catch {
        return false;
    }
};

// User deletion is handled by walletUsers.deleteUser (DELETE /users/:id)
