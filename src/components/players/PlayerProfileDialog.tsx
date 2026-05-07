"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from "recharts";
import {
    Swords,
    Trophy,
    Target,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Shield,
    Smartphone,
    Globe,
    Clock,
    DollarSign,
    CreditCard,
    Briefcase,
    Ban,
    AlertOctagon
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExtendedPlayer {
    id: string;
    username: string;
    email: string;
    phone: string;
    country: string;
    status: "Active" | "Banned" | "Suspended";
    joinedDate: string;
    lastActive: string;
    avatar: string;
    rank: string;
    // Stats
    gamesPlayed: { freeFire: number; bgmi: number; cod: number };
    tournamentsJoined: number;
    tournamentsCancelled: number;
    tournamentsCompleted: number;
    totalKills: { freeFire: number; bgmi: number; cod: number };
    matchesWon: number;
    matchesLost: number;
    eloPoints: number;
    winRate: number;
    topFinishPercent: number;
    // Earnings
    highestPrizeWon: string;
    totalEarnings: string;
    entryFeesPaid: string;
    lastTransactionDate: string;
    // Disputes
    disputesRaised: number;
    disputesWonLost: { won: number; lost: number };
    // Account
    rating: number;
    gameRanks: { freeFire: string; bgmi: string; cod: string };
    banHistory: number;
    suspendHistory: number;
    guildMember: boolean;
    guildName: string | null;
    teamId: string | null;
    blacklistedCount: number;
    peakPlayTime: string;
    avgMatchesPerWeek: number;
    deviceType: string;
    lastLoginIp: string;
}

interface PlayerProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    player: any; // Using any for base player prop, will extend inside
}

const COLORS = ['#D7333A', '#3b82f6', '#10b981', '#f59e0b'];

export function PlayerProfileDialog({ open, onOpenChange, player: basePlayer }: PlayerProfileDialogProps) {
    if (!basePlayer) return null;

    // Generate consistent mock data based on ID
    const seed = parseInt(basePlayer.id.replace(/\D/g, '')) || 0;

    // Extended Data Mocking
    const player: ExtendedPlayer = {
        ...basePlayer,
        gamesPlayed: {
            freeFire: 120 + (seed % 50),
            bgmi: 80 + (seed % 40),
            cod: 40 + (seed % 30)
        },
        tournamentsJoined: 45 + (seed % 10),
        tournamentsCancelled: 2,
        tournamentsCompleted: 43 + (seed % 10),
        totalKills: {
            freeFire: 540 + (seed * 2),
            bgmi: 320 + seed,
            cod: 150 + seed
        },
        matchesWon: 85 + (seed % 20),
        matchesLost: 35 + (seed % 10),
        eloPoints: 2450 + (seed * 5),
        winRate: 68.5,
        topFinishPercent: 82.4,
        highestPrizeWon: "$250.00",
        totalEarnings: "$1,450.00",
        entryFeesPaid: "$320.00",
        lastTransactionDate: "2024-03-10",
        disputesRaised: 3,
        disputesWonLost: { won: 2, lost: 1 },
        rating: 4.8,
        gameRanks: {
            freeFire: "Grandmaster",
            bgmi: "Ace Dominator",
            cod: "Legendary"
        },
        banHistory: 0,
        suspendHistory: 0,
        guildMember: true,
        guildName: "Team Soul",
        teamId: "TS-8821",
        blacklistedCount: 0,
        peakPlayTime: "20:00 - 23:00",
        avgMatchesPerWeek: 24,
        deviceType: "iPhone 14 Pro Max",
        lastLoginIp: "192.168.1.42"
    };

    const mostPlayedData = [
        { name: 'Free Fire', value: player.gamesPlayed.freeFire },
        { name: 'BGMI', value: player.gamesPlayed.bgmi },
        { name: 'COD', value: player.gamesPlayed.cod },
    ];

    const statsData = [
        { name: 'Won', value: player.matchesWon },
        { name: 'Lost', value: player.matchesLost },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl bg-[#09090b] border-white/10 text-zinc-200 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 p-0 gap-0">

                {/* Header Banner */}
                <div className="h-32 bg-gradient-to-r from-brand-red/20 to-zinc-900 relative">
                    <div className="absolute -bottom-8 left-8 flex items-end gap-4">
                        <div className="h-24 w-24 rounded-full bg-zinc-950 border-4 border-[#09090b] overflow-hidden flex items-center justify-center relative">
                            <img src={player.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="mb-2">
                            <h2 className="text-2xl font-bold text-white font-naston">{player.username}</h2>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <span className="font-suisse">{player.id}</span>
                                <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                                <span className="text-brand-red flex items-center gap-1"><Trophy className="h-3 w-3" /> {player.rank}</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-4 right-12 flex gap-2 items-center">
                        <div className="flex gap-2 mr-4">
                            <Button
                                variant="destructive"
                                size="sm"
                                className="h-7 bg-red-600 text-white hover:bg-red-700 border border-red-500/50 transition-all font-medium"
                            >
                                <Ban className="h-3 w-3 mr-1" /> Ban Player
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 bg-amber-500 text-white hover:bg-amber-600 border border-amber-400/50 transition-all font-bold"
                            >
                                <AlertOctagon className="h-3 w-3 mr-1" /> Suspend
                            </Button>
                        </div>
                        {player.status === 'Banned' ? (
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Banned</span>
                        ) : (
                            <span className="bg-green-500/20 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Active</span>
                        )}
                    </div>
                </div>

                <div className="pt-12 px-8 pb-8 flex flex-col gap-8">

                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex flex-col">
                            <span className="text-zinc-500 text-xs uppercase font-semibold">Total Earnings</span>
                            <span className="text-2xl font-bold text-white font-suisse mt-1">{player.totalEarnings}</span>
                            <span className="text-xs text-green-400 flex items-center mt-1"><TrendingUp className="h-3 w-3 mr-1" /> +12% this month</span>
                        </div>
                        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex flex-col">
                            <span className="text-zinc-500 text-xs uppercase font-semibold">ELO Points</span>
                            <span className="text-2xl font-bold text-white font-suisse mt-1">{player.eloPoints}</span>
                            <span className="text-xs text-brand-red flex items-center mt-1">Top 5% Global</span>
                        </div>
                        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex flex-col">
                            <span className="text-zinc-500 text-xs uppercase font-semibold">Win Rate</span>
                            <span className="text-2xl font-bold text-white font-suisse mt-1">{player.winRate}%</span>
                            <span className="text-xs text-zinc-400 mt-1">{player.matchesWon}W - {player.matchesLost}L</span>
                        </div>
                        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex flex-col">
                            <span className="text-zinc-500 text-xs uppercase font-semibold">Tournaments</span>
                            <span className="text-2xl font-bold text-white font-suisse mt-1">{player.tournamentsCompleted}</span>
                            <span className="text-xs text-zinc-400 mt-1">{player.tournamentsJoined} Joined</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Column 1: Charts & Gameplay */}
                        <div className="md:col-span-2 flex flex-col gap-6">

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <Target className="h-4 w-4 text-brand-red" /> Most Played Game
                                    </h3>
                                    <div className="h-48 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={mostPlayedData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {mostPlayedData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex justify-center gap-4 text-xs mt-2">
                                        {mostPlayedData.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center gap-1 text-zinc-400">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                                {entry.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <Swords className="h-4 w-4 text-brand-red" /> Performance
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-zinc-400">Avg Matches/Week</span>
                                            <span className="text-white font-suisse">{player.avgMatchesPerWeek}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-zinc-400">Peak Play Time</span>
                                            <span className="text-white font-suisse">{player.peakPlayTime}</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2">
                                            <div className="bg-brand-red h-1.5 rounded-full" style={{ width: `${player.topFinishPercent}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-zinc-500 mt-1">
                                            <span>Top Finish Consistency</span>
                                            <span>{player.topFinishPercent}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Game Specific Stats */}
                            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-white mb-4">Game Statistics</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { name: 'Free Fire', kills: player.totalKills.freeFire, rank: player.gameRanks.freeFire },
                                        { name: 'BGMI', kills: player.totalKills.bgmi, rank: player.gameRanks.bgmi },
                                        { name: 'COD', kills: player.totalKills.cod, rank: player.gameRanks.cod },
                                    ].map((game) => (
                                        <div key={game.name} className="bg-zinc-950/50 rounded-lg p-3 border border-white/5">
                                            <div className="text-xs text-zinc-500 uppercase">{game.name}</div>
                                            <div className="text-lg font-bold text-white mt-1 font-suisse">{game.kills} <span className="text-xs font-sans text-zinc-500 font-normal">Kills</span></div>
                                            <div className="text-xs text-brand-red mt-1">{game.rank}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Column 2: Info & Details */}
                        <div className="flex flex-col gap-6">

                            {/* Profile Details */}
                            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-white mb-4">Profile Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400 flex items-center gap-2"><Globe className="h-3 w-3" /> Country</span>
                                        <span className="text-white">{player.country}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400 flex items-center gap-2"><Smartphone className="h-3 w-3" /> Device</span>
                                        <span className="text-white">{player.deviceType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400 flex items-center gap-2"><Clock className="h-3 w-3" /> Last Active</span>
                                        <span className="text-white">{player.lastActive}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400 flex items-center gap-2"><Shield className="h-3 w-3" /> IP Used</span>
                                        <span className="text-white font-suisse">{player.lastLoginIp}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Guild / Team */}
                            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-white mb-4">Team & Guild</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Guild Name</span>
                                        <span className="text-white">{player.guildName || "None"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Team ID</span>
                                        <span className="text-white font-suisse">{player.teamId || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Organizer Blacklists</span>
                                        <span className="text-red-400 font-bold">{player.blacklistedCount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Financial */}
                            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-white mb-4">Financials</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Highest Win</span>
                                        <span className="text-white font-suisse">{player.highestPrizeWon}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Fees Paid</span>
                                        <span className="text-white font-suisse">{player.entryFeesPaid}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Last Txn</span>
                                        <span className="text-white font-suisse">{player.lastTransactionDate}</span>
                                    </div>
                                    <div className="pt-2 border-t border-white/5">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Disputes (W/L)</span>
                                            <span className="text-zinc-300">{player.disputesWonLost.won}W / {player.disputesWonLost.lost}L</span>
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
