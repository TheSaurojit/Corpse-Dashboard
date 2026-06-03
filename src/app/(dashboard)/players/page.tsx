"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Search,
    Users,
    Mail,
    Phone,
    Calendar,
    Eye,
    CheckCircle2,
    XCircle,
    Shield,
    MapPin,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayerProfileDialog } from "@/components/players/PlayerProfileDialog";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiUser {
    id: string;
    fname: string | null;
    lname: string | null;
    email: string;
    photoUrl: string | null;
    elo: number;
    phone: string | null;
    district: string | null;
    state: string | null;
    latitude: number | null;
    longitude: number | null;
    isBanned: boolean;
    createdAt: string;
    updatedAt: string;
    isVerified: boolean;
    userName: string;
    dateOfBirth: string | null;
}

interface ApiResponse {
    success: boolean;
    data: {
        data: ApiUser[];
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
    };
    message: string;
}

// Map API user → the shape our UI needs
interface Player {
    id: string;
    username: string;
    displayName: string;
    email: string;
    phone: string | null;
    location: string;
    status: "Active" | "Banned";
    joinedDate: string;
    lastActive: string;
    isVerified: boolean;
    elo: number;
    photoUrl: string | null;
    dateOfBirth: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const API_BASE = "https://corpse-backend-dev.up.railway.app/api/admin/users";

function mapUser(u: ApiUser): Player {
    const nameParts = [u.fname, u.lname].filter(Boolean);
    const displayName = nameParts.length ? nameParts.join(" ") : u.userName;

    const locationParts = [u.district, u.state].filter(Boolean);
    const location = locationParts.length ? locationParts.join(", ") : "—";

    return {
        id: u.id,
        username: u.userName,
        displayName,
        email: u.email,
        phone: u.phone,
        location,
        status: u.isBanned ? "Banned" : "Active",
        joinedDate: new Date(u.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }),
        lastActive: "—",
        isVerified: u.isVerified,
        elo: u.elo,
        photoUrl: u.photoUrl,
        dateOfBirth: u.dateOfBirth,
    };
}



// Avatar initials fallback
function Initials({ name }: { name: string }) {
    const parts = name.trim().split(/\s+/);
    const letters = parts.length >= 2
        ? parts[0][0] + parts[parts.length - 1][0]
        : name.slice(0, 2);
    return (
        <span className="text-xs font-bold text-zinc-400 uppercase select-none">
            {letters}
        </span>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlayersPage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 10;

    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [searchQuery]);

    // Fetch data
    const fetchPlayers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                ...(debouncedQuery ? { search: debouncedQuery } : {}),
            });
            const res = await fetch(`${API_BASE}?${params}`);
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const json: ApiResponse = await res.json();
            if (!json.success) throw new Error(json.message || "Failed to fetch");
            setPlayers(json.data.data.map(mapUser));
            setTotalPages(json.data.totalPages);
            setTotalCount(json.data.totalCount);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [page, debouncedQuery]);

    useEffect(() => { fetchPlayers(); }, [fetchPlayers]);

    const handleViewProfile = (player: Player) => {
        setSelectedPlayer(player);
        setIsProfileOpen(true);
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col gap-6 w-full h-full overflow-hidden">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 font-naston">
                        <Users className="h-6 w-6 text-brand-red" />
                        Players
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Manage player accounts, status, and activity.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search players..."
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
                            onClick={fetchPlayers}
                        >
                            Retry
                        </Button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && players.length === 0 && (
                    <div className="flex flex-col items-center justify-center flex-1 gap-2 py-20 text-zinc-600">
                        <Users className="h-10 w-10 opacity-30" />
                        <p className="text-sm">No players found</p>
                    </div>
                )}

                {/* Table */}
                {!error && players.length > 0 && (
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pb-4">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-zinc-950/80 text-zinc-500 sticky top-0 z-10 backdrop-blur-md font-suisse">
                                <tr>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[100px]">Player ID</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[180px]">Player</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[220px]">Contact</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[140px]">Location</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[80px] text-center">ELO</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[120px]">Status</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[140px]">Joined</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[130px]">Last Active</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 text-center min-w-[130px]">Profile</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {players.map((player) => (
                                    <tr
                                        key={player.id}
                                        className="group hover:bg-white/[0.02] transition-colors"
                                    >
                                        {/* Player ID */}
                                        <td className="px-6 py-4 font-suisse text-zinc-400 text-xs">
                                            {player.id}
                                        </td>

                                        {/* Player */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                                    {player.photoUrl ? (
                                                        <img
                                                            src={player.photoUrl}
                                                            alt={player.username}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Initials name={player.displayName} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white leading-tight">
                                                        {player.username}
                                                    </div>
                                                    {player.displayName !== player.username && (
                                                        <div className="text-xs text-zinc-500 leading-tight mt-0.5">
                                                            {player.displayName}
                                                        </div>
                                                    )}
                                                    {player.isVerified && (
                                                        <div className="text-xs text-brand-red flex items-center gap-1 mt-0.5">
                                                            <Shield className="h-3 w-3" /> Verified
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-zinc-300 font-suisse text-xs">
                                                    <Mail className="h-3 w-3 text-zinc-500 shrink-0" />
                                                    <span className="truncate max-w-[170px]">{player.email}</span>
                                                </div>
                                                {player.phone ? (
                                                    <div className="flex items-center gap-2 text-zinc-400 font-suisse text-xs">
                                                        <Phone className="h-3 w-3 text-zinc-500 shrink-0" />
                                                        {player.phone}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-zinc-600 font-suisse text-xs italic">
                                                        <Phone className="h-3 w-3 shrink-0" /> No phone
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Location */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-suisse">
                                                <MapPin className="h-3 w-3 text-zinc-600 shrink-0" />
                                                {player.location}
                                            </div>
                                        </td>

                                        {/* ELO */}
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-suisse text-sm font-semibold text-zinc-200">
                                                {player.elo}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border font-suisse ${
                                                player.status === "Active"
                                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                    : "bg-red-500/10 text-red-500 border-red-500/20"
                                            }`}>
                                                {player.status === "Active"
                                                    ? <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    : <XCircle className="h-3 w-3 mr-1" />
                                                }
                                                {player.status}
                                            </span>
                                        </td>

                                        {/* Joined */}
                                        <td className="px-6 py-4 text-zinc-400 font-suisse text-xs">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3" />
                                                {player.joinedDate}
                                            </div>
                                        </td>

                                        {/* Last Active */}
                                        <td className="px-6 py-4 text-zinc-300 font-suisse text-xs">
                                            {player.lastActive}
                                        </td>

                                        {/* View Profile */}
                                        <td className="px-6 py-4 text-center">
                                            <Button
                                                size="sm"
                                                className="bg-zinc-800 hover:bg-brand-red hover:text-white text-zinc-300 border border-white/5 transition-all shadow-lg text-xs"
                                                onClick={() => handleViewProfile(player)}
                                            >
                                                <Eye className="mr-2 h-3 w-3" /> View
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
                    <span className="text-zinc-300 font-medium">
                        {players.length}
                    </span>{" "}
                    of{" "}
                    <span className="text-zinc-300 font-medium">{totalCount}</span>{" "}
                    players
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

            {/* Profile Dialog */}
            <PlayerProfileDialog
                open={isProfileOpen}
                onOpenChange={setIsProfileOpen}
                player={selectedPlayer}
            />
        </div>
    );
}