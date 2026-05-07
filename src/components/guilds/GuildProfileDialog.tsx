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
    UserCog,
    Swords,
    Gavel,
    Flag
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExtendedGuild {
    id: string;
    name: string;
    logo: string;
    accountStatus: "Verified" | "Pending" | "Restricted";
    status: "Active" | "Inactive" | "Banned" | "Suspended";
    creationDate: string;

    // Leadership
    captain: string;
    viceCaptain: string;
    managers: string[];

    // Roster
    totalMembers: number;
    memberRanks: { rank: string; count: number }[];

    // Performance
    matchesPlayed: number;
    matchesWon: number;
    matchesLost: number;
    winRate: number;
    guildRank: string;

    // Financials
    totalWinnings: string;
    highestPrizeWon: string;
    avgEarningsPerTournament: string;

    // Activity
    lastMatchDate: string;
    avgMatchesPerWeek: number;
    peakPlayTime: string;

    // Admin
    disputesWon: number;
    disputesLost: number;
    reportsCount: number;
    rating: number; // 1-5
}

interface GuildProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    guild: any; // Using any for base guild prop extensions
}

const COLORS = ['#D7333A', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
const RANK_COLORS = ['#fbbf24', '#94a3b8', '#b45309', '#e2e8f0']; // Gold, Silver, Bronze, Platinum

export function GuildProfileDialog({ open, onOpenChange, guild: baseGuild }: GuildProfileDialogProps) {
    if (!baseGuild) return null;

    const seed = parseInt(baseGuild.id.replace(/\D/g, '')) || 0;

    // Generate Mock Data
    const guild: ExtendedGuild = {
        ...baseGuild,
        captain: `Captain_${baseGuild.name.split(' ')[0]}`,
        viceCaptain: `Vice_${baseGuild.name.split(' ')[0]}`,
        managers: [`Mgr_One`, `Mgr_Two`],
        totalMembers: 45 + (seed % 15),
        memberRanks: [
            { rank: "Conqueror", count: 5 },
            { rank: "Ace", count: 12 },
            { rank: "Crown", count: 18 },
            { rank: "Diamond", count: 10 + (seed % 5) }
        ],
        matchesPlayed: 340 + (seed * 10),
        matchesWon: 210 + (seed * 5),
        matchesLost: 130 + (seed * 5),
        winRate: 61.5,
        guildRank: `#${15 + (seed % 100)} Global`,
        totalWinnings: `$${(15000 + seed * 100).toLocaleString()}`,
        highestPrizeWon: `$${(5000 + seed * 50).toLocaleString()}`,
        avgEarningsPerTournament: `$${(450 + seed * 10).toLocaleString()}`,
        lastMatchDate: "Today, 10:30 AM",
        avgMatchesPerWeek: 35 + (seed % 10),
        peakPlayTime: "19:00 - 00:00",
        disputesWon: 12,
        disputesLost: 3,
        reportsCount: seed % 5,
        rating: 4.5
    };

    const disputeData = [
        { name: 'Won', value: guild.disputesWon },
        { name: 'Lost', value: guild.disputesLost },
    ];

    const memberRankData = guild.memberRanks.map(r => ({ name: r.rank, value: r.count }));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl bg-[#09090b] border-white/10 text-zinc-200 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 p-0 gap-0">

                {/* Header Banner */}
                <div className="h-40 bg-gradient-to-r from-zinc-900 via-zinc-900 to-brand-red/10 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                    <div className="absolute -bottom-8 left-8 flex items-end gap-6 z-10">
                        <div className="h-28 w-28 rounded-2xl bg-zinc-950 border-4 border-[#09090b] overflow-hidden flex items-center justify-center relative shadow-2xl">
                            <img src={guild.logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="mb-3">
                            <h2 className="text-3xl font-bold text-white font-naston flex items-center gap-3">
                                {guild.name}
                                {guild.accountStatus === 'Verified' && <Shield className="h-5 w-5 text-blue-400 fill-blue-400/20" />}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-zinc-400 mt-1">
                                <span className="font-suisse text-zinc-500">{guild.id}</span>
                                <span className="flex items-center gap-1.5"><Globe className="h-3 w-3" /> Global Rank: <span className="text-white font-bold">{guild.guildRank}</span></span>
                                <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> {guild.totalMembers} Members</span>
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
                            <Ban className="h-3.5 w-3.5 mr-2" /> Ban Guild
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 bg-amber-500/90 text-black hover:bg-amber-500 border border-amber-400/50 shadow-lg shadow-amber-900/20 transition-all font-bold px-4"
                        >
                            <AlertOctagon className="h-3.5 w-3.5 mr-2" /> Suspend
                        </Button>
                        <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-lg ${guild.status === 'Active' ? 'bg-green-500 text-black border-green-400' : 'bg-zinc-700 text-zinc-300 border-zinc-600'
                            }`}>
                            {guild.status}
                        </div>
                    </div>
                </div>

                <div className="pt-14 px-8 pb-8 flex flex-col gap-8">

                    {/* Leadership Cluster */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-brand-red/5 group-hover:bg-brand-red/10 transition-colors"></div>
                            <div className="h-10 w-10 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center border border-brand-red/30">
                                <Crown className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-xs text-brand-red uppercase font-bold tracking-wider">Captain</div>
                                <div className="text-white font-medium">{guild.captain}</div>
                            </div>
                        </div>
                        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                                <Medal className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-xs text-blue-400 uppercase font-bold tracking-wider">Vice Captain</div>
                                <div className="text-white font-medium">{guild.viceCaptain}</div>
                            </div>
                        </div>
                        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex items-center gap-4 md:col-span-2">
                            <div className="h-10 w-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                                <UserCog className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-xs text-purple-400 uppercase font-bold tracking-wider">Managers</div>
                                <div className="text-white font-medium text-sm flex gap-2">
                                    {guild.managers.map(m => (
                                        <span key={m} className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">{m}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Column 1: Performance & Financials */}
                        <div className="md:col-span-2 flex flex-col gap-6">

                            {/* Key Stats Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4 text-center">
                                    <div className="text-zinc-500 text-xs w-full uppercase mb-2">Total Winnings</div>
                                    <div className="text-2xl font-bold text-white font-suisse">{guild.totalWinnings}</div>
                                </div>
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4 text-center">
                                    <div className="text-zinc-500 text-xs w-full uppercase mb-2">Matches Played</div>
                                    <div className="text-2xl font-bold text-white font-suisse">{guild.matchesPlayed}</div>
                                </div>
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4 text-center">
                                    <div className="text-zinc-500 text-xs w-full uppercase mb-2">Guild Rating</div>
                                    <div className="flex justify-center items-center gap-1 text-2xl font-bold text-yellow-500 font-suisse">
                                        {guild.rating} <span className="text-sm text-zinc-500">/ 5.0</span>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Match Performance */}
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <Trophy className="h-4 w-4 text-brand-red" /> Match Performance
                                    </h3>
                                    <div className="flex justify-between items-end mb-6">
                                        <div>
                                            <div className="text-3xl font-bold text-white font-suisse">{guild.winRate}%</div>
                                            <div className="text-xs text-zinc-500">Win Rate</div>
                                        </div>
                                        <div className="text-right text-sm">
                                            <div className="text-green-400 font-bold">{guild.matchesWon} Won</div>
                                            <div className="text-red-400 font-bold">{guild.matchesLost} Lost</div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-zinc-800 rounded-full h-2">
                                        <div className="bg-brand-red h-2 rounded-full" style={{ width: `${guild.winRate}%` }}></div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                                        <div className="bg-zinc-950 p-2 rounded border border-white/5">
                                            <span className="text-zinc-500 block">Avg Earnings/Tourn</span>
                                            <span className="text-white font-suisse">{guild.avgEarningsPerTournament}</span>
                                        </div>
                                        <div className="bg-zinc-950 p-2 rounded border border-white/5">
                                            <span className="text-zinc-500 block">Highest Prize</span>
                                            <span className="text-white font-suisse">{guild.highestPrizeWon}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Member Distribution */}
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                                        <Users className="h-4 w-4 text-brand-red" /> Roster Composition
                                    </h3>
                                    <div className="h-40 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={memberRankData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#71717a' }} width={60} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                />
                                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                                    {memberRankData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={RANK_COLORS[index % RANK_COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Column 2: Activity & Admin */}
                        <div className="flex flex-col gap-6">

                            {/* Activity */}
                            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-white mb-4">Activity Insights</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Peak Play Time</div>
                                        <div className="text-white font-suisse text-lg">{guild.peakPlayTime}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><Swords className="h-3 w-3" /> Avg Matches / Week</div>
                                        <div className="text-white font-suisse text-lg">{guild.avgMatchesPerWeek}</div>
                                    </div>
                                    <div className="pt-2 border-t border-white/5">
                                        <div className="text-xs text-zinc-500 mb-1">Last Match Played</div>
                                        <div className="text-zinc-300 text-sm">{guild.lastMatchDate}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Admin & Disputes */}
                            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-white mb-4 flex items-center justify-between">
                                    <span>Disputes & Reports</span>
                                    <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-xs border border-red-500/20 flex gap-1 items-center">
                                        <Flag className="h-3 w-3" /> {guild.reportsCount} Reports
                                    </span>
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="h-24 w-24 flex-shrink-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={disputeData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={25}
                                                    outerRadius={40}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    <Cell fill="#10b981" />
                                                    <Cell fill="#ef4444" />
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex flex-col gap-2 text-sm flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-zinc-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Won</span>
                                            <span className="text-white font-suisse">{guild.disputesWon}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-zinc-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Lost</span>
                                            <span className="text-white font-suisse">{guild.disputesLost}</span>
                                        </div>
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
