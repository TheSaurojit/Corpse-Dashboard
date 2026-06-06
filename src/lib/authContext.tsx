// lib/authContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { API_BASE, authHeaders, clearSession, SESSION_TOKEN_KEY } from "@/lib/authutils";

interface UserProfile {
    email: string;
    role: "OWNER" | "ADMIN" | "MEMBER" | "SUPPORT";
    lastActiveAt?: string;
    createdAt?: string;
}

interface AuthContextValue {
    profile: UserProfile | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ profile: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch(`${API_BASE}/auth/verify-token`, {
                    headers: authHeaders(),
                });

                if (res.status === 401) {
                    clearSession();
                    window.location.href = "/admin/login";
                    return;
                }

                if (res.ok) {
                    const json = await res.json();
                    if (json.success && json.data) {
                        setProfile(json.data);
                    }
                }
            } catch {
                console.warn("[AuthContext] verify-token failed — network error");
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, []);

    return (
        <AuthContext.Provider value={{ profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}