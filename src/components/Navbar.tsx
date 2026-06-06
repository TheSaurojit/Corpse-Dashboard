"use client";

import { Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { API_BASE, authHeaders, clearSession, SESSION_TOKEN_KEY } from "@/lib/authutils";

const LOGIN_ROUTE = "/admin/login";

interface UserProfile {
    email: string;
    role: string;
    lastActiveAt?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(email: string): string {
    const name = email.split("@")[0];
    const parts = name.split(/[._-]/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

function formatRole(role: string): string {
    return role.charAt(0) + role.slice(1).toLowerCase();
}

function timeAgo(iso: string): string {
    try {
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60_000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    } catch {
        return "—";
    }
}

function roleColor(role: string): string {
    switch (role) {
        case "OWNER":   return "#f6ad55";
        case "ADMIN":   return "#68d391";
        case "SUPPORT": return "#63b3ed";
        default:        return "#a0aec0";
    }
}


export function Navbar() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const res = await fetch(`${API_BASE}/auth/verify-token`, {
                    headers: authHeaders(),
                });

                if (res.status === 401) {
                    // Token expired or revoked — force logout
                    doLogoutCleanup();
                    return;
                }

                if (res.ok) {
                    const json = await res.json();
                    if (json.success && json.data) {
                        setProfile(json.data);
                    }
                }
            } catch {
                // Network error — don't force logout, user might be offline briefly
                console.warn("[Navbar] Token verify failed — network error");
            }
        };

        verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Close tooltip on outside click ────────────────────────────────────────
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                tooltipRef.current &&
                avatarRef.current &&
                !tooltipRef.current.contains(e.target as Node) &&
                !avatarRef.current.contains(e.target as Node)
            ) {
                setTooltipOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ── Cleanup: clear localStorage + cookie + redirect ───────────────────────
    function doLogoutCleanup() {
        clearSession();
        document.cookie = `${SESSION_TOKEN_KEY}=; path=/; max-age=0`;
        router.replace(LOGIN_ROUTE);
    }

    // ── Logout handler ────────────────────────────────────────────────────────
    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch(`${API_BASE}/auth/logout`, {
                method: "POST",
                headers: authHeaders(),
            });
        } catch {
            // Even if the request fails, clean up locally
        } finally {
            doLogoutCleanup();
        }
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-zinc-950/70 px-6 backdrop-blur-md transition-all">
            <div className="absolute inset-x-0 -top-20 h-[200px] pointer-events-none flex justify-center overflow-visible z-0">
                <div className="w-[1000px] h-[300px] bg-brand-red/10 blur-[120px] rounded-[100%] mix-blend-screen" />
            </div>

            <div className="flex items-center gap-4 relative z-10">
                <SidebarTrigger className="md:hidden" />
                <div className="relative group">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-[200px] md:w-[300px] pl-9 bg-zinc-900/50 border-white/5 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-brand-red/20 focus-visible:border-brand-red/30 transition-all rounded-md"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none select-none">
                        <kbd className="inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-zinc-900 px-1.5 font-mono text-[10px] font-medium text-zinc-500">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">

                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{loggingOut ? "Logging out…" : "Logout"}</span>
                </Button>

                <div className="relative">
                    <button
                        ref={avatarRef}
                        onClick={() => setTooltipOpen((o) => !o)}
                        className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white border border-white/10 transition-all hover:border-white/25 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-red/40"
                        style={{
                            background: profile
                                ? `linear-gradient(135deg, ${roleColor(profile.role)}33, ${roleColor(profile.role)}66)`
                                : "linear-gradient(135deg, #27272a, #3f3f46)",
                            borderColor: profile ? `${roleColor(profile.role)}40` : undefined,
                        }}
                        aria-label="Profile"
                    >
                        {profile ? getInitials(profile.email) : "?"}
                    </button>

                    {/* Tooltip dropdown */}
                    {tooltipOpen && (
                        <div
                            ref={tooltipRef}
                            className="absolute right-0 top-12 w-64 bg-zinc-900 border border-white/8 rounded-xl shadow-2xl shadow-black/60 p-4 z-50 animate-in"
                        >
                            {/* Arrow */}
                            <div className="absolute -top-1.5 right-3 w-3 h-3 bg-zinc-900 border-l border-t border-white/8 rotate-45" />

                            {profile ? (
                                <>
                                    {/* Avatar large */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div
                                            className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                                            style={{
                                                background: `linear-gradient(135deg, ${roleColor(profile.role)}33, ${roleColor(profile.role)}66)`,
                                                border: `1px solid ${roleColor(profile.role)}40`,
                                            }}
                                        >
                                            {getInitials(profile.email)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-semibold truncate">
                                                {profile.email.split("@")[0]}
                                            </p>
                                            <p className="text-zinc-500 text-xs truncate">
                                                {profile.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/5 mb-3" />

                                    {/* Role badge */}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-zinc-500">Role</span>
                                        <span
                                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                            style={{
                                                color: roleColor(profile.role),
                                                background: `${roleColor(profile.role)}18`,
                                                border: `1px solid ${roleColor(profile.role)}30`,
                                            }}
                                        >
                                            {formatRole(profile.role)}
                                        </span>
                                    </div>

                                    {/* Last active */}
                                    {profile.lastActiveAt && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-500">Last active</span>
                                            <span className="text-xs text-zinc-400">
                                                {timeAgo(profile.lastActiveAt)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="h-px bg-white/5 my-3" />

                                    {/* Logout inside tooltip too */}
                                    <button
                                        onClick={handleLogout}
                                        disabled={loggingOut}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/8 transition-colors"
                                    >
                                        <LogOut className="h-3.5 w-3.5" />
                                        {loggingOut ? "Logging out…" : "Sign out"}
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-2 text-zinc-500 text-xs py-2">
                                    <div className="w-3 h-3 border border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
                                    Loading profile…
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
