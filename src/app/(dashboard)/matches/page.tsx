"use client";

import { useState } from "react";


import {
    MoreHorizontal,
    Search,
    Filter,
    Download,

    Clock,
    CheckCircle2,
    Trophy,
    Swords,
    Calendar,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

// Match Data Interface
interface Match {
    id: string;
    name: string;
    game: string;
    type: "Solo" | "Duo" | "Squad";
    roomId: string; // Room Id/code
    scheduledTime: string;
    totalSlots: number;
    slotsFilled: number;
    organizer: string;
    teams: string[]; // Player list/ Team names
    status: "Scheduled" | "Live" | "Completed" | "Cancelled";
    resultStatus: "Pending" | "Published" | "Disputed";
    prizePool: string;
    resultProof: string; // URL or "View"
    approvedBy: string; // Approved By Admin / Organizer
    entryFee: string;
    commission: string; // Platform Commission
    payoutStatus: "Pending" | "released" | "Hold";
    payoutTime: string; // Payout release time
    duration: string;
}

// Mock Data
const MOCK_MATCHES: Match[] = Array.from({ length: 10 }).map((_, i) => ({
    id: `M-${1000 + i}`,
    name: `Pro Scrims #${200 + i} - Erangel`,
    game: "BGMI",
    type: i % 3 === 0 ? "Squad" : i % 2 === 0 ? "Duo" : "Solo",
    roomId: i % 4 === 0 ? "Pending" : `RM-${8880 + i}`,
    scheduledTime: new Date(Date.now() + i * 3600000).toLocaleString(),
    totalSlots: 100,
    slotsFilled: 85 + i,
    organizer: "Corpse Esports",
    teams: ["Team Soul", "Godlike", "Entity", "Blind", "Team XSpark"],
    status: i === 0 ? "Live" : i === 1 ? "Completed" : "Scheduled",
    resultStatus: i === 1 ? "Published" : "Pending",
    prizePool: "₹5,000",
    resultProof: i === 1 ? "View Screenshot" : "-",
    approvedBy: "Admin",
    entryFee: "₹50",
    commission: "10%",
    payoutStatus: i === 1 ? "released" : "Pending",
    payoutTime: i === 1 ? "2 hours ago" : "-",
    duration: i === 1 ? "45m" : "-"
}));

export default function MatchesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredMatches = MOCK_MATCHES.filter(match => {
        const matchesSearch =
            match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            match.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            match.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
            match.organizer.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "All" || match.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex flex-col gap-6 w-full h-full overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 font-naston">
                        <Swords className="h-6 w-6 text-brand-red" />
                        Matches
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Manage and monitor all tournament matches in real-time.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Export button removed */}
                    <Button className="bg-brand-red hover:bg-red-700 text-white shadow-lg shadow-brand-red/20">
                        <Trophy className="mr-2 h-4 w-4" />
                        Create Match
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 p-1 rounded-lg bg-zinc-900/30 border border-white/5 w-fit">
                {["All", "Live", "Scheduled", "Completed"].map((status) => (
                    <Button
                        key={status}
                        variant="ghost"
                        size="sm"
                        onClick={() => setStatusFilter(status)}
                        className={`text-sm shadow-sm transition-all ${statusFilter === status
                            ? "bg-white/10 text-white"
                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        {status}
                    </Button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 bg-zinc-900/40 p-3 rounded-lg border border-white/5">
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Search matches..."
                        className="pl-9 bg-zinc-950/50 border-white/10 focus-visible:ring-brand-red/20 text-zinc-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                </div>
            </div>

            {/* Data Table Container - Horizontal Scroll */}
            <div className="rounded-xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm overflow-hidden flex-1 relative flex flex-col">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pb-4">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-zinc-950/80 text-zinc-500 sticky top-0 z-10 backdrop-blur-md font-suisse">
                            <tr>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[120px]">Match ID</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[200px]">Match Name</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[150px]">Status</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[120px]">Game</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[100px]">Type</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[120px]">Room Code</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[150px]">Schedule</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[100px]">Slots</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[150px]">Organizer</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[100px]">Fee</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[100px]">Prize</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[150px]">Teams</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[120px]">Result</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[100px]">Commission</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[120px]">Payout</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 text-right sticky right-0 bg-zinc-950/90 z-20">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredMatches.map((match) => (
                                <tr
                                    key={match.id}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-6 py-4 font-suisse text-zinc-400">{match.id}</td>
                                    <td className="px-6 py-4 font-medium text-white">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-1 bg-brand-red/50 rounded-full" />
                                            {match.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${match.status === 'Live' ? 'bg-brand-red/10 text-brand-red border-brand-red/20 animate-pulse' :
                                            match.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                'bg-zinc-800 text-zinc-400 border-zinc-700'
                                            }`}>
                                            {match.status === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-brand-red mr-1.5" />}
                                            {match.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-300">{match.game}</td>
                                    <td className="px-6 py-4 font-suisse text-zinc-300">{match.type}</td>
                                    <td className="px-6 py-4 font-suisse text-zinc-400">
                                        {match.roomId === "Pending" ? (
                                            <span className="text-yellow-500/80 text-xs">Waiting</span>
                                        ) : (
                                            <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">{match.roomId}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400 flex items-center gap-2 font-suisse">
                                        <Clock className="h-3 w-3" />
                                        {match.scheduledTime.split(',')[1]}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-300 font-suisse">
                                        {match.slotsFilled} <span className="text-zinc-600">/</span> {match.totalSlots}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-300">{match.organizer}</td>
                                    <td className="px-6 py-4 text-zinc-300 font-suisse">{match.entryFee}</td>
                                    <td className="px-6 py-4 text-brand-red font-medium font-suisse">{match.prizePool}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex -space-x-2">
                                            {match.teams.slice(0, 3).map((_, i) => (
                                                <div key={i} className="h-6 w-6 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] text-zinc-400">
                                                    T{i + 1}
                                                </div>
                                            ))}
                                            {match.teams.length > 3 && (
                                                <div className="h-6 w-6 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] text-zinc-400">
                                                    +{match.teams.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs ${match.resultStatus === 'Published' ? 'text-green-400' : 'text-zinc-500'}`}>
                                            {match.resultStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400">{match.commission}</td>
                                    <td className="px-6 py-4">
                                        {match.payoutStatus === 'released' ? (
                                            <div className="flex items-center gap-1 text-green-400 text-xs">
                                                <CheckCircle2 className="h-3 w-3" /> Released
                                            </div>
                                        ) : (
                                            <span className="text-zinc-500 text-xs">Pending</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right sticky right-0 bg-zinc-950/90 backdrop-blur-md border-l border-white/5 z-20">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                <div>Showing 10 of 128 matches</div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled className="h-8 border-white/5 bg-transparent">Previous</Button>
                    <Button variant="outline" size="sm" className="h-8 border-white/5 bg-transparent hover:bg-white/5 hover:text-white">Next</Button>
                </div>
            </div>
        </div>
    );
}
