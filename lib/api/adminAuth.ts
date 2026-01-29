import { API_BASE_URL } from "./client";

export type AdminUser = {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
    assignedUsersCount?: number;
    createdAt?: string;
};

export type AdminAuthResponse = {
    success: boolean;
    message?: string;
    error?: string;
    data?: {
        token?: string;
        user?: AdminUser;
    };
};

type AdminLoginPayload = {
    emailAddress: string;
    password: string;
};

type AdminRegisterPayload = {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    emailAddress?: string;
    password: string;
    confirmPassword?: string;
};

const postAdminAuth = async (path: string, body: Record<string, unknown>) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const payload = (await response.json()) as AdminAuthResponse;

    if (!response.ok || !payload.success) {
        throw new Error(payload.error || payload.message || "Request failed. Please try again.");
    }

    return payload;
};

/**
 * Login admin with email and password
 * Uses Firebase RTDB /adminUsers for authentication
 */
export const adminLogin = (payload: AdminLoginPayload) =>
    postAdminAuth("/api/admin-auth/login", {
        email: payload.emailAddress,
        password: payload.password,
    });

/**
 * Register a new admin
 * Creates user in Firebase Auth and record in /adminUsers RTDB path
 */
export const adminRegister = (payload: AdminRegisterPayload) =>
    postAdminAuth("/api/admin-auth/register", {
        name: payload.name || (payload.firstName && payload.lastName ? `${payload.firstName} ${payload.lastName}` : ''),
        email: payload.email || payload.emailAddress,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
    });

/**
 * Login admin with Firebase ID token
 * For use with client-side Firebase authentication
 */
export const adminFirebaseLogin = (firebaseToken: string) =>
    postAdminAuth("/api/admin-auth/firebase-login", { firebaseToken });

/**
 * Get admin profile
 */
export const getAdminProfile = async (): Promise<AdminAuthResponse> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const response = await fetch(`${API_BASE_URL}/api/admin-auth/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    const payload = (await response.json()) as AdminAuthResponse;

    if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Failed to get profile");
    }

    return payload;
};
