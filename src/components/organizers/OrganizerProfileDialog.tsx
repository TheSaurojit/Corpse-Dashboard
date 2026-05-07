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
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar
} from "recharts";
import {
    Briefcase,
    Shield,
    Trophy,
    Target,
    TrendingUp,
    AlertTriangle,
    Users,
    Globe,
    Clock,
    DollarSign,
    Ban,
    AlertOctagon,
    Crown,
    Medal,
    Mail,
    Phone,
    CheckCircle2,
    XCircle,
    Flag,
    Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExtendedOrganizer {
    id: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    accountStatus: "Verified" | "Pending" | "Restricted";
    verificationStatus: "Verified" | "Unverified" | "Pending";
    status: "Active" | "Inactive" | "Banned" | "Suspended";
    joinedDate: string;
    lastActive: string;
    rating: number;
    logo: string;

    // Tournament Stats
    totalArenasHosted: number;
    activeTournaments: number;
    completedTournaments: number;
    cancelledTournaments: number;
    avgTournamentDuration: string;

    // Financials
    totalEntryFeesCollected: string;
    totalPrizePoolCreated: string;
    avgRevenuePerTournament: string;

    // Admin & Performance
    disputesRaised: number;
    disputesResolved: number;
    organizerRank: string;
    organizerRating: number; // Duplicate of rating for profile context
    reviewsCount: number;
}

interface OrganizerProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organizer: any;
}

const COLORS = ['#10b981', '#3b82f6', '#ef4444']; // Completed, Active, Cancelled

export function OrganizerProfileDialog({ open, onOpenChange, organizer: baseOrganizer }: OrganizerProfileDialogProps) {
    if (!baseOrganizer) return null;

    const seed = parseInt(baseOrganizer.id.replace(/\D/g, '')) || 0;

    // Generate Mock Data
    const organizer: ExtendedOrganizer = {
        ...baseOrganizer,
        logo: `https://api.dicebear.com/7.x/initials/svg?seed=${baseOrganizer.name}`,
        totalArenasHosted: 150 + (seed * 5),
        activeTournaments: 5 + (seed % 3),
        completedTournaments: 142 + (seed * 5),
        cancelledTournaments: 3 + (seed % 2),
        avgTournamentDuration: "4 Days",
        totalEntryFeesCollected: `$${(25000 + seed * 200).toLocaleString()}`,
        totalPrizePoolCreated: `$${(20000 + seed * 180).toLocaleString()}`,
        avgRevenuePerTournament: `$${(350 + seed * 5).toLocaleString()}`,
        disputesRaised: 8,
        disputesResolved: 7,
        organizerRank: `#${50 + (seed % 50)} Global`,
        organizerRating: 4.7,
        reviewsCount: 124
    };

    const tournamentData = [
        { name: 'Completed', value: organizer.completedTournaments },
        { name: 'Active', value: organizer.activeTournaments },
        { name: 'Cancelled', value: organizer.cancelledTournaments },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl bg-[#09090b] border-white/10 text-zinc-200 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 p-0 gap-0">

                {/* Header Banner */}
                <div className="h-40 bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-900/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                    <div className="absolute -bottom-8 left-8 flex items-end gap-6 z-10">
                        <div className="h-28 w-28 rounded-2xl bg-zinc-950 border-4 border-[#09090b] overflow-hidden flex items-center justify-center relative shadow-2xl">
                            <img src={organizer.logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="mb-3">
                            <h2 className="text-3xl font-bold text-white font-naston flex items-center gap-3">
                                {organizer.name}
                                {organizer.verificationStatus === 'Verified' && <CheckCircle2 className="h-5 w-5 text-blue-400 fill-blue-400/20" />}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-zinc-400 mt-1">
                                <span className="font-suisse text-zinc-500">{organizer.id}</span>
                                <span className="flex items-center gap-1.5"><Globe className="h-3 w-3" /> {organizer.country}</span>
                                <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> {organizer.organizerRating} ({organizer.reviewsCount} Reviews)</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Bottom Right */}
                    <div className="absolute bottom-4 right-8 flex gap-2 items-center z-10">
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 bg-red-600/90 text-white hover:bg-red-600 border border-red-500/50 shadow-lg shadow-red-900/20 transition-all font-medium px-4"
                        >
                            <Ban className="h-3.5 w-3.5 mr-2" /> Ban Org
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 bg-amber-500/90 text-black hover:bg-amber-500 border border-amber-400/50 shadow-lg shadow-amber-900/20 transition-all font-bold px-4"
                        >
                            <AlertOctagon className="h-3.5 w-3.5 mr-2" /> Suspend
                        </Button>
                        <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-lg ${organizer.status === 'Active' ? 'bg-green-500 text-black border-green-400' : 'bg-zinc-700 text-zinc-300 border-zinc-600'
                            }`}>
                            {organizer.status}
                        </div>
                    </div>
                </div>

                <div className="pt-14 px-8 pb-8 flex flex-col gap-8">

                    {/* Contact & Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                            <span className="text-zinc-500 text-xs uppercase font-semibold mb-1">Email</span>
                            <div className="flex items-center gap-2 text-white text-sm truncate">
                                <Mail className="h-3 w-3 text-zinc-400" /> {organizer.email}
                            </div>
                        </div>
                        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                            <span className="text-zinc-500 text-xs uppercase font-semibold mb-1">Phone</span>
                            <div className="flex items-center gap-2 text-white text-sm">
                                <Phone className="h-3 w-3 text-zinc-400" /> {organizer.phone}
                            </div>
                        </div>
                        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex flex-col justify-center col-span-2">
                            <span className="text-zinc-500 text-xs uppercase font-semibold mb-1">Account Status</span>
                            <div className="flex items-center gap-4 text-white text-sm">
                                <span className={`flex items-center gap-1.5 ${organizer.accountStatus === 'Verified' ? 'text-blue-400' : 'text-zinc-400'}`}>
                                    <Shield className="h-3.5 w-3.5" /> Account: {organizer.accountStatus}
                                </span>
                                <span className="w-1 h-3 bg-white/10"></span>
                                <span className="text-zinc-400">Joined: {organizer.joinedDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Column 1: Tournament Stats & Performance */}
                        <div className="md:col-span-2 flex flex-col gap-6">

                            {/* Key Stats Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4 text-center">
                                    <div className="text-zinc-500 text-xs w-full uppercase mb-2">Total Arenas Hosted</div>
                                    <div className="text-2xl font-bold text-white font-suisse">{organizer.totalArenasHosted}</div>
                                </div>
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4 text-center">
                                    <div className="text-zinc-500 text-xs w-full uppercase mb-2">Total Prize Pool</div>
                                    <div className="text-2xl font-bold text-white font-suisse">{organizer.totalPrizePoolCreated}</div>
                                </div>
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4 text-center">
                                    <div className="text-zinc-500 text-xs w-full uppercase mb-2">Global Rank</div>
                                    <div className="text-2xl font-bold text-brand-red font-suisse">{organizer.organizerRank}</div>
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Tournament Status */}
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <Trophy className="h-4 w-4 text-brand-red" /> Tournament Breakdown
                                    </h3>
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
                                                    {tournamentData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex justify-center gap-4 text-xs mt-2">
                                        {tournamentData.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center gap-1 text-zinc-400">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                                {entry.name} ({entry.value})
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Detailed Metrics */}
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4 flex flex-col justify-center space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-zinc-400 text-xs uppercase">Avg Tournament Duration</span>
                                            <span className="text-white font-bold">{organizer.avgTournamentDuration}</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 rounded-full h-1.5">
                                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-zinc-400 text-xs uppercase">Disputes Resolution</span>
                                            <span className="text-white font-bold">{Math.round((organizer.disputesResolved / organizer.disputesRaised) * 100)}%</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-zinc-500 mt-1">
                                            <span>{organizer.disputesRaised} Raised</span>
                                            <span>{organizer.disputesResolved} Resolved</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-zinc-400 text-xs uppercase">Avg Revenue / Event</span>
                                            <span className="text-green-400 font-bold">{organizer.avgRevenuePerTournament}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Column 2: Financials & Admin */}
                        <div className="flex flex-col gap-6">

                            {/* Financial */}
                            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-green-500" /> Financial Overview
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-zinc-950/50 p-3 rounded-lg border border-white/5">
                                        <div className="text-xs text-zinc-500 mb-1">Total Fees Collected</div>
                                        <div className="text-white font-suisse text-lg">{organizer.totalEntryFeesCollected}</div>
                                    </div>
                                    <div className="bg-zinc-950/50 p-3 rounded-lg border border-white/5">
                                        <div className="text-xs text-zinc-500 mb-1">Total Prize Pool Created</div>
                                        <div className="text-white font-suisse text-lg">{organizer.totalPrizePoolCreated}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Time */}
                            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-white mb-4">Activity Status</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400 flex items-center gap-2"><Clock className="h-3 w-3" /> Last Active</span>
                                        <span className="text-white">{organizer.lastActive}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Joined Date</span>
                                        <span className="text-zinc-300 font-suisse">{organizer.joinedDate}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
