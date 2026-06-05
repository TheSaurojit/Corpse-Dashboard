"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Briefcase,
    Eye,
    CheckCircle2,
    Star,
    Mail,
    Phone,
    RefreshCw,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrganizerProfileDialog } from "@/components/organizers/OrganizerProfileDialog";
import { authHeaders } from "@/lib/authutils"


const ADMIN_API_BASE =
    process.env.NEXT_PUBLIC_ADMIN_API_URL ??
    "https://corpse-backend-dev.up.railway.app/api/admin";

const ORGANIZERS_URL = `${ADMIN_API_BASE}/organizers`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Organizer {
    id: string;
    name: string;
    email: string;
    phone: string;
    state: string | null;
    district: string | null;
    isVerified: boolean;
    isPhoneVerified: boolean;
    status: "Active" | "Inactive" | "Banned" | "Suspended";
    createdAt: string;
    updatedAt: string;
    rating: number | null;
    type: string;
    logoUrl: string | null;
    bannerUrl: string | null;
    description: string | null;
}

interface PaginationMeta {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
    try {
        return new Date(iso).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    } catch {
        return iso;
    }
}

function timeAgo(iso: string): string {
    try {
        const diff = Date.now() - new Date(iso).getTime();
        const hours = Math.floor(diff / 3_600_000);
        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days}d ago`;
        return `${Math.floor(days / 30)}mo ago`;
    } catch {
        return "—";
    }
}

function locationLabel(org: Organizer): string {
    if (org.district && org.state) return `${org.district}, ${org.state}`;
    if (org.state) return org.state;
    if (org.district) return org.district;
    return "—";
}

function mapApiItem(item: any): Organizer {
    return {
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        state: item.state ?? null,
        district: item.district ?? null,
        isVerified: item.isVerified ?? false,
        isPhoneVerified: item.isPhoneVerified ?? false,
        status: "Active",
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        rating: null,
        type: item.type,
        logoUrl: item.logoUrl ?? null,
        bannerUrl: item.bannerUrl ?? null,
        description: item.description ?? null,
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrganizersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const [organizers, setOrganizers] = useState<Organizer[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta>({
        page: 1,
        limit: 10,
        totalCount: 0,
        totalPages: 1,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrganizers = async (page: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `${ORGANIZERS_URL}?page=${page}&limit=${pagination.limit}`,
                { headers: authHeaders() }
            );

            if (res.status === 401 || res.status === 403) {
                setError("Session expired or unauthorized. Please log in again.");
                return;
            }

            if (!res.ok) {
                setError(`Server error: ${res.status} ${res.statusText}`);
                return;
            }

            const json = await res.json();

            if (json.success) {
                setOrganizers(json.data.data.map(mapApiItem));
                setPagination({
                    page: json.data.page,
                    limit: json.data.limit,
                    totalCount: json.data.totalCount,
                    totalPages: json.data.totalPages,
                });
            } else {
                setError(json.message ?? "Failed to fetch organizers.");
            }
        } catch {
            setError("Network error. Could not reach the server.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizers(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredOrganizers = organizers.filter(
        (org) =>
            org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            org.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            org.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleViewProfile = (organizer: Organizer) => {
        setSelectedOrganizer(organizer);
        setIsProfileOpen(true);
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 font-naston">
                        <Briefcase className="h-6 w-6 text-brand-red" />
                        Organizers
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Manage tournament organizers and partnerships.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                        className="h-9 border-white/5 bg-transparent hover:bg-white/5 hover:text-white text-zinc-400"
                        onClick={() => fetchOrganizers(pagination.page)}
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    </Button>

                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search by name, ID or email..."
                            className="pl-9 bg-zinc-950/50 border-white/10 focus-visible:ring-brand-red/20 text-zinc-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm overflow-hidden flex-1 relative flex flex-col">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pb-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20 gap-2 text-zinc-500 text-sm">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Loading organizers...
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-sm">
                            <AlertCircle className="h-6 w-6 text-red-400" />
                            <span className="text-red-400 text-center max-w-md">{error}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-white/10 hover:bg-white/5 text-zinc-400"
                                onClick={() => fetchOrganizers(pagination.page)}
                            >
                                Retry
                            </Button>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-zinc-950/80 text-zinc-500 sticky top-0 z-10 backdrop-blur-md font-suisse">
                                <tr>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[120px]">Org ID</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[200px]">Name / Email</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[150px]">Contact</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[150px]">Status</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[120px]">Joined</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[100px]">Rating</th>
                                    <th className="px-6 py-4 font-medium border-b border-white/5 text-center min-w-[120px]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredOrganizers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-16 text-center text-zinc-500 text-sm">
                                            No organizers found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrganizers.map((org) => (
                                        <tr
                                            key={org.id}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            {/* Org ID */}
                                            <td
                                                className="px-6 py-4 font-suisse text-zinc-400 text-xs truncate max-w-[120px]"
                                                title={org.id}
                                            >
                                                {org.id.length > 12 ? `${org.id.slice(0, 12)}…` : org.id}
                                            </td>

                                            {/* Name / Email */}
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-white flex items-center gap-2">
                                                        {org.name}
                                                        {org.isVerified && (
                                                            <CheckCircle2 className="h-3 w-3 text-blue-400" />
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-zinc-500 font-suisse flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {org.email}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact */}
                                            <td className="px-6 py-4">
                                                <div className="text-zinc-300 text-xs flex flex-col gap-1">
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3 text-zinc-500" />
                                                        {org.phone}
                                                    </span>
                                                    <span className="text-zinc-500">{locationLabel(org)}</span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span
                                                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                                            org.isVerified
                                                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                                : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                                        }`}
                                                    >
                                                        {org.isVerified ? "Verified" : "Unverified"}
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center gap-1 text-[10px] ${
                                                            org.status === "Active" ? "text-green-400" : "text-red-400"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`w-1.5 h-1.5 rounded-full ${
                                                                org.status === "Active" ? "bg-green-500" : "bg-red-500"
                                                            }`}
                                                        />
                                                        {org.status}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Joined */}
                                            <td className="px-6 py-4 text-zinc-400 font-suisse text-xs">
                                                <div className="flex flex-col">
                                                    <span>{formatDate(org.createdAt)}</span>
                                                    <span className="text-zinc-600 text-[10px]">
                                                        Updated: {timeAgo(org.updatedAt)}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Rating */}
                                            <td className="px-6 py-4 text-zinc-500 font-suisse text-xs">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 text-zinc-600" />
                                                    <span>N/A</span>
                                                </div>
                                            </td>

                                            {/* Action */}
                                            <td className="px-6 py-4 text-center">
                                                <Button
                                                    size="sm"
                                                    className="bg-zinc-800 hover:bg-brand-red hover:text-white text-zinc-300 border border-white/5 transition-all shadow-lg text-xs"
                                                    onClick={() => handleViewProfile(org)}
                                                >
                                                    <Eye className="mr-2 h-3 w-3" />
                                                    View Profile
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                <div>
                    Showing {filteredOrganizers.length} of {pagination.totalCount} organizer
                    {pagination.totalCount !== 1 ? "s" : ""}
                    {searchQuery && ` (filtered)`}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-zinc-600">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page <= 1 || isLoading}
                        className="h-8 border-white/5 bg-transparent hover:bg-white/5 hover:text-white"
                        onClick={() => fetchOrganizers(pagination.page - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page >= pagination.totalPages || isLoading}
                        className="h-8 border-white/5 bg-transparent hover:bg-white/5 hover:text-white"
                        onClick={() => fetchOrganizers(pagination.page + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <OrganizerProfileDialog
                open={isProfileOpen}
                onOpenChange={setIsProfileOpen}
                organizer={selectedOrganizer}
            />
        </div>
    );
}