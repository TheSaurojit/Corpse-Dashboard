export const SESSION_TOKEN_KEY = "admin_session_token";

export const API_BASE = "/api/proxy";

export function getSessionToken(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(SESSION_TOKEN_KEY) ?? "";
}

export function authHeaders(): HeadersInit {
    const token = getSessionToken();
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

export function clearSession(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SESSION_TOKEN_KEY);
    document.cookie = `${SESSION_TOKEN_KEY}=; path=/; max-age=0`;
}


export async function apiFetch(
    path: string,
    options?: RequestInit
): Promise<Response> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            ...authHeaders(),
            ...(options?.headers ?? {}),
        },
    });

    if (res.status === 401) {
        clearSession();
        window.location.href = "/admin/login";
    }

    return res;
}

/**
 * For multipart/form-data uploads (e.g. file + fields).
 * Do NOT set Content-Type manually — the browser sets it with the correct boundary.
 * Auth token is injected automatically.
 */
export async function apiFormFetch(
    path: string,
    formData: FormData,
    options?: Omit<RequestInit, "body" | "headers">
): Promise<Response> {
    const token = getSessionToken();
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        ...options,
        headers: {
            // No Content-Type here — browser adds multipart/form-data + boundary
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
    });

    if (res.status === 401) {
        clearSession();
        window.location.href = "/admin/login";
    }

    return res;
}