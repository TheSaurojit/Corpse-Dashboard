"use client";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts";
import {
    Shield,
    Trophy,
    Clock,
    DollarSign,
    Ban,
    AlertOctagon,
    Globe,
    Star,
    Mail,
    Phone,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrganizerProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organizer: any; // accepts the mapped Organizer from OrganizersPage
}

const COLORS = ['#10b981', '#3b82f6', '#ef4444']; // Completed, Active, Cancelled

export function OrganizerProfileDialog({ open, onOpenChange, organizer }: OrganizerProfileDialogProps) {
    if (!organizer) return null;

    // ── Derive display values from what the API actually gives us ──────────────

    const logo = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(organizer.name)}`;

    // Location: state + district (new), fallback to country (old mock)
    const locationLabel = (() => {
        if (organizer.district && organizer.state) return `${organizer.district}, ${organizer.state}`;
        if (organizer.state) return organizer.state;
        if (organizer.district) return organizer.district;
        if (organizer.country) return organizer.country; // backwards-compat with mock
        return "—";
    })();

    // Verification badge: new field isVerified, fallback to old verificationStatus
    const isVerified = organizer.isVerified ?? organizer.verificationStatus === "Verified";

    // Account status label: new isVerified bool, fallback to old accountStatus string
    const accountStatusLabel = organizer.accountStatus
        ?? (organizer.isVerified ? "Verified" : "Unverified");

    // Joined date: new createdAt ISO string, fallback to old joinedDate string
    const joinedDate = (() => {
        const raw = organizer.createdAt ?? organizer.joinedDate ?? null;
        if (!raw) return "—";
        try { return new Date(raw).toLocaleDateString(); } catch { return raw; }
    })();

    // Last active: new updatedAt ISO, fallback to old lastActive string
    const lastActive = (() => {
        const raw = organizer.updatedAt ?? organizer.lastActive ?? null;
        if (!raw) return "—";
        try {
            const diff = Date.now() - new Date(raw).getTime();
            const h = Math.floor(diff / 3600000);
            if (h < 1) return "Just now";
            if (h < 24) return `${h}h ago`;
            return `${Math.floor(h / 24)}d ago`;
        } catch { return raw; }
    })();

    // Status: new field may not exist, default Active
    const status = organizer.status ?? "Active";

    // ── Stats: use real values when present, else 0 ───────────────────────────
    const totalArenasHosted       = organizer.totalArenasHosted       ?? 0;
    const activeTournaments       = organizer.activeTournaments       ?? 0;
    const completedTournaments    = organizer.completedTournaments    ?? 0;
    const cancelledTournaments    = organizer.cancelledTournaments    ?? 0;
    const avgTournamentDuration   = organizer.avgTournamentDuration   ?? "—";
    const totalEntryFeesCollected = organizer.totalEntryFeesCollected ?? "₹0";
    const totalPrizePoolCreated   = organizer.totalPrizePoolCreated   ?? "₹0";
    const avgRevenuePerTournament = organizer.avgRevenuePerTournament ?? "₹0";
    const disputesRaised          = organizer.disputesRaised          ?? 0;
    const disputesResolved        = organizer.disputesResolved        ?? 0;
    const organizerRank           = organizer.organizerRank           ?? "—";
    const organizerRating         = organizer.organizerRating ?? organizer.rating ?? 0;
    const reviewsCount            = organizer.reviewsCount            ?? 0;

    const disputeResolutionPct = disputesRaised > 0
        ? Math.round((disputesResolved / disputesRaised) * 100)
        : 0;

    const tournamentData = [
        { name: 'Completed', value: completedTournaments },
        { name: 'Active',    value: activeTournaments },
        { name: 'Cancelled', value: cancelledTournaments },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl bg-[#09090b] border-white/10 text-zinc-200 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 p-0 gap-0">

                {/* Header Banner */}
                <div className="h-40 bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-900/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                    <div className="absolute -bottom-8 left-8 flex items-end gap-6 z-10">
                        <div className="h-28 w-28 rounded-2xl bg-zinc-950 border-4 border-[#09090b] overflow-hidden flex items-center justify-center shadow-2xl">
                            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="mb-3">
                            <h2 className="text-3xl font-bold text-white font-naston flex items-center gap-3">
                                {organizer.name}
                                {isVerified && <CheckCircle2 className="h-5 w-5 text-blue-400 fill-blue-400/20" />}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-zinc-400 mt-1">
                                <span className="font-suisse text-zinc-500 text-xs truncate max-w-[140px]" title={organizer.id}>
                                    {organizer.id.length > 14 ? `${organizer.id.slice(0, 14)}…` : organizer.id}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Globe className="h-3 w-3" /> {locationLabel}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    {organizerRating > 0 ? `${organizerRating} (${reviewsCount} Reviews)` : "No ratings yet"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute bottom-4 right-8 flex gap-2 items-center z-10">
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 bg-red-600/90 text-white hover:bg-red-600 border border-red-500/50 shadow-lg shadow-red-900/20 font-medium px-4"
                        >
                            <Ban className="h-3.5 w-3.5 mr-2" /> Ban Org
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 bg-amber-500/90 text-black hover:bg-amber-500 border border-amber-400/50 shadow-lg shadow-amber-900/20 font-bold px-4"
                        >
                            <AlertOctagon className="h-3.5 w-3.5 mr-2" /> Suspend
                        </Button>
                        <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-lg ${
                            status === 'Active'
                                ? 'bg-green-500 text-black border-green-400'
                                : 'bg-zinc-700 text-zinc-300 border-zinc-600'
                        }`}>
                            {status}
                        </div>
                    </div>
                </div>

                <div className="pt-14 px-8 pb-8 flex flex-col gap-8">

                    {/* Contact & Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                            <span className="text-zinc-500 text-xs uppercase font-semibold mb-1">Email</span>
                            <div className="flex items-center gap-2 text-white text-sm truncate">
                                <Mail className="h-3 w-3 text-zinc-400 shrink-0" /> {organizer.email}
                            </div>
                        </div>
                        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                            <span className="text-zinc-500 text-xs uppercase font-semibold mb-1">Phone</span>
                            <div className="flex items-center gap-2 text-white text-sm">
                                <Phone className="h-3 w-3 text-zinc-400 shrink-0" /> {organizer.phone}
                            </div>
                        </div>
                        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex flex-col justify-center col-span-2">
                            <span className="text-zinc-500 text-xs uppercase font-semibold mb-1">Account Status</span>
                            <div className="flex items-center gap-4 text-white text-sm">
                                <span className={`flex items-center gap-1.5 ${isVerified ? 'text-blue-400' : 'text-zinc-400'}`}>
                                    <Shield className="h-3.5 w-3.5" /> Account: {accountStatusLabel}
                                </span>
                                <span className="w-px h-3 bg-white/10"></span>
                                <span className="text-zinc-400">Joined: {joinedDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Column 1: Tournament Stats */}
                        <div className="md:col-span-2 flex flex-col gap-6">

                            {/* Key Stats Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4 text-center">
                                    <div className="text-zinc-500 text-xs uppercase mb-2">Total Arenas Hosted</div>
                                    <div className="text-2xl font-bold text-white font-suisse">{totalArenasHosted}</div>
                                </div>
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4 text-center">
                                    <div className="text-zinc-500 text-xs uppercase mb-2">Total Prize Pool</div>
                                    <div className="text-2xl font-bold text-white font-suisse">{totalPrizePoolCreated}</div>
                                </div>
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4 text-center">
                                    <div className="text-zinc-500 text-xs uppercase mb-2">Global Rank</div>
                                    <div className="text-2xl font-bold text-brand-red font-suisse">{organizerRank}</div>
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Tournament Breakdown Pie */}
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <Trophy className="h-4 w-4 text-brand-red" /> Tournament Breakdown
                                    </h3>
                                    {totalArenasHosted === 0 ? (
                                        <div className="h-48 flex items-center justify-center text-zinc-600 text-xs">
                                            No tournament data available
                                        </div>
                                    ) : (
                                        <div className="h-48 flex items-center justify-center">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={tournamentData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={50}
                                                        outerRadius={70}
                                                        dataKey="value"
                                                        paddingAngle={5}
                                                    >
                                                        {tournamentData.map((_, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                    <div className="flex justify-center gap-4 text-xs mt-2">
                                        {tournamentData.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center gap-1 text-zinc-400">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                                {entry.name} ({entry.value})
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4 flex flex-col justify-center space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-zinc-400 text-xs uppercase">Avg Tournament Duration</span>
                                            <span className="text-white font-bold">{avgTournamentDuration}</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 rounded-full h-1.5">
                                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-zinc-400 text-xs uppercase">Disputes Resolution</span>
                                            <span className="text-white font-bold">{disputeResolutionPct}%</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-zinc-500 mt-1">
                                            <span>{disputesRaised} Raised</span>
                                            <span>{disputesResolved} Resolved</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-zinc-400 text-xs uppercase">Avg Revenue / Event</span>
                                            <span className="text-green-400 font-bold">{avgRevenuePerTournament}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Financials & Activity */}
                        <div className="flex flex-col gap-6">

                            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-green-500" /> Financial Overview
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-zinc-950/50 p-3 rounded-lg border border-white/5">
                                        <div className="text-xs text-zinc-500 mb-1">Total Fees Collected</div>
                                        <div className="text-white font-suisse text-lg">{totalEntryFeesCollected}</div>
                                    </div>
                                    <div className="bg-zinc-950/50 p-3 rounded-lg border border-white/5">
                                        <div className="text-xs text-zinc-500 mb-1">Total Prize Pool Created</div>
                                        <div className="text-white font-suisse text-lg">{totalPrizePoolCreated}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-white mb-4">Activity Status</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400 flex items-center gap-2">
                                            <Clock className="h-3 w-3" /> Last Active
                                        </span>
                                        <span className="text-white">{lastActive}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Joined Date</span>
                                        <span className="text-zinc-300 font-suisse">{joinedDate}</span>
                                    </div>
                                    {/* Description if available */}
                                    {organizer.description && (
                                        <div className="pt-2 border-t border-white/5">
                                            <div className="text-xs text-zinc-500 mb-1">About</div>
                                            <p className="text-zinc-400 text-xs leading-relaxed">{organizer.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}