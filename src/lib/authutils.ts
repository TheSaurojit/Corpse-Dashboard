// lib/authUtils.ts
//
// All API calls go through /api/proxy/* (Next.js server-side proxy)
// instead of hitting Railway directly from the browser.
// ─────────────────────────────────────────────────────────────────────────────

export const SESSION_TOKEN_KEY = "admin_session_token";

/** Base URL for all admin API calls — goes through the local proxy */
export const API_BASE = "/api/proxy";
export const ADMIN_API_BASE =
    process.env.NEXT_PUBLIC_ADMIN_API_URL ??
    "https://corpse-backend-dev.up.railway.app/api/admin";

/** Returns the stored session token, or empty string if not found */
export function getSessionToken(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(SESSION_TOKEN_KEY) ?? "";
}

/** Returns headers with Authorization: Bearer <token> for all API calls */
export function authHeaders(): HeadersInit {
    const token = getSessionToken();
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

/** Call this on logout to clear the stored token */
export function clearSession(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SESSION_TOKEN_KEY);
}