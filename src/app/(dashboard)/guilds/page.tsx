"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Search,
    Shield,
    Eye,
    Calendar,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GuildProfileDialog } from "@/components/guilds/GuildProfileDialog";
import { authHeaders, ADMIN_API_BASE } from "@/lib/authutils";

const TEAMS_URL = `${ADMIN_API_BASE}/teams`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiTeam {
    id: string;
    name: string;
    logoUrl: string | null;
    createdAt: string;
    updatedAt: string;
    memberCount: number;
    leaderName: string | null;
    isVerified?: boolean;
    status?: string;
}

interface ApiResponse {
    success: boolean;
    data: {
        data: ApiTeam[];
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
    };
    message: string;
}

interface Guild {
    id: string;
    name: string;
    accountStatus: "Verified" | "Pending" | "Restricted";
    creationDate: string;
    status: "Active" | "Inactive";
    members: number;
    leader: string;
    logo: string;
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

function mapTeam(t: ApiTeam): Guild {
    return {
        id: t.id,
        name: t.name,
        accountStatus: t.isVerified ? "Verified" : "Pending",
        creationDate: new Date(t.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }),
        status: t.status === "Inactive" ? "Inactive" : "Active",
        members: t.memberCount ?? 0,
        leader: t.leaderName ?? "—",
        logo: t.logoUrl ?? `https://api.dicebear.com/7.x/identicon/svg?seed=${t.id}`,
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GuildsPage() {
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 10;

    const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const fetchTeams = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                ...(debouncedQuery ? { search: debouncedQuery } : {}),
            });
            const res = await fetch(`${TEAMS_URL}?${params}`, {
                headers: authHeaders(),
            });

            if (res.status === 401 || res.status === 403) {
                setError("Session expired or unauthorized. Please log in again.");
                return;
            }

            if (!res.ok) throw new Error(`Server error: ${res.status}`);

            const json: ApiResponse = await res.json();
            if (!json.success) throw new Error(json.message || "Failed to fetch");

            setGuilds(json.data.data.map(mapTeam));
            setTotalPages(json.data.totalPages);
            setTotalCount(json.data.totalCount);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [page, debouncedQuery]);

    useEffect(() => { fetchTeams(); }, [fetchTeams]);

    const handleViewProfile = (guild: Guild) => {
        setSelectedGuild(guild);
        setIsProfileOpen(true);
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col gap-6 w-full h-full overflow-hidden">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 font-naston">
                        <Shield className="h-6 w-6 text-brand-red" />
                        Guilds / Teams
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Manage competitive guilds and team rosters.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search guilds..."
                            className="pl-9 bg-zinc-950/50 border-white/10 focus-visible:ring-brand-red/20 text-zinc-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="rounded-xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm overflow-hidden flex-1 relative flex flex-col">

                {/* Loading overlay */}
                {loading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm rounded-xl">
                        <Loader2 className="h-7 w-7 animate-spin text-brand-red" />
                    </div>
                )}

                {/* Error state */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center flex-1 gap-3 py-20 text-zinc-500">
                        <AlertCircle className="h-8 w-8 text-red-500/70" />
                        <p className="text-sm">{error}</p>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 text-zinc-400 hover:bg-white/5"
                            onClick={fetchTeams}
                        >
                            Retry
                        </Button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && guilds.length === 0 && (
                    <div className="flex flex-col items-center justify-center flex-1 gap-2 py-20 text-zinc-600">
                        <Shield className="h-10 w-10 opacity-30" />
                        <p className="text-sm">No guilds found</p>
                    </div>
                )}

                {/* Table */}
                {!error && guilds.length > 0 && (
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pb-4">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-zinc-950/80 text-zinc-500 sticky top-0 z-10 backdrop-blur-md font-suisse">
                                <tr>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[120px]">Guild ID</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[200px]">Guild Name</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[150px]">Account Status</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[150px]">Creation Date</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[120px]">Status</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 text-center min-w-[120px]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {guilds.map((guild) => (
                                    <tr
                                        key={guild.id}
                                        className="group hover:bg-white/[0.02] transition-colors"
                                    >
                                        {/* Guild ID */}
                                        <td className="px-6 py-4 font-suisse text-zinc-400 text-xs">
                                            {guild.id.length > 12 ? `${guild.id.slice(0, 12)}…` : guild.id}
                                        </td>

                                        {/* Guild Name */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                                    <img
                                                        src={guild.logo}
                                                        alt="Logo"
                                                        className="w-full h-full object-cover opacity-70"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{guild.name}</div>
                                                    <div className="text-xs text-zinc-500 flex items-center gap-1 font-suisse">
                                                        {guild.members} Members • Leader: {guild.leader}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Account Status */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border font-suisse ${
                                                guild.accountStatus === "Verified"
                                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                    : guild.accountStatus === "Restricted"
                                                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                            }`}>
                                                {guild.accountStatus}
                                            </span>
                                        </td>

                                        {/* Creation Date */}
                                        <td className="px-6 py-4 text-zinc-400 font-suisse text-xs">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3" />
                                                {guild.creationDate}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium font-suisse ${
                                                guild.status === "Active" ? "text-green-400" : "text-zinc-500"
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    guild.status === "Active" ? "bg-green-500" : "bg-zinc-600"
                                                }`} />
                                                {guild.status}
                                            </span>
                                        </td>

                                        {/* Action */}
                                        <td className="px-6 py-4 text-center">
                                            <Button
                                                size="sm"
                                                className="bg-zinc-800 hover:bg-brand-red hover:text-white text-zinc-300 border border-white/5 transition-all shadow-lg text-xs"
                                                onClick={() => handleViewProfile(guild)}
                                            >
                                                <Eye className="mr-2 h-3 w-3" /> View Profile
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                <div>
                    Showing{" "}
                    <span className="text-zinc-300 font-medium">{guilds.length}</span>
                    {" "}of{" "}
                    <span className="text-zinc-300 font-medium">{totalCount}</span>
                    {" "}guilds
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1 || loading}
                        onClick={() => setPage((p) => p - 1)}
                        className="h-8 border-white/5 bg-transparent hover:bg-white/5 hover:text-white disabled:opacity-30"
                    >
                        <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
                    </Button>
                    <span className="px-2 text-zinc-400">
                        {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages || loading}
                        onClick={() => setPage((p) => p + 1)}
                        className="h-8 border-white/5 bg-transparent hover:bg-white/5 hover:text-white disabled:opacity-30"
                    >
                        Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                </div>
            </div>

            <GuildProfileDialog
                open={isProfileOpen}
                onOpenChange={setIsProfileOpen}
                guild={selectedGuild}
            />
        </div>
    );
}