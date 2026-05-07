"use client";

import { useState } from "react";
import {
    Search,
    Users,
    MoreHorizontal,
    Mail,
    Phone,
    Calendar,
    Eye,
    CheckCircle2,
    XCircle,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayerProfileDialog } from "@/components/players/PlayerProfileDialog";

// Player Data Interface
interface Player {
    id: string;
    username: string;
    email: string;
    phone: string;
    country: string;
    status: "Active" | "Banned" | "Suspended";
    joinedDate: string;
    lastActive: string;
    avatar: string; // URL placeholder
    rank: string;
}

// Mock Data
const MOCK_PLAYERS: Player[] = Array.from({ length: 15 }).map((_, i) => ({
    id: `P-${5000 + i}`,
    username: i % 2 === 0 ? `SniperGod_${i}` : `Rusher_${i}X`,
    email: `player${i}@example.com`,
    phone: `+91 98765 432${i.toString().padStart(2, '0')}`,
    country: i % 3 === 0 ? "India" : i % 2 === 0 ? "USA" : "UK",
    status: i === 4 ? "Banned" : i === 7 ? "Suspended" : "Active",
    joinedDate: new Date(Date.now() - i * 86400000 * 10).toLocaleDateString(),
    lastActive: i === 0 ? "Just now" : `${i * 2} hours ago`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    rank: i < 3 ? "Conqueror" : "Ace"
}));

export default function PlayersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleViewProfile = (player: Player) => {
        setSelectedPlayer(player);
        setIsProfileOpen(true);
    };

    const filteredPlayers = MOCK_PLAYERS.filter(player =>
        player.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 w-full h-full overflow-hidden">
            {/* Header Section */}
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

            {/* Data Table Container - Horizontal Scroll */}
            <div className="rounded-xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm overflow-hidden flex-1 relative flex flex-col">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pb-4">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-zinc-950/80 text-zinc-500 sticky top-0 z-10 backdrop-blur-md font-suisse">
                            <tr>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[100px]">Player ID</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[200px]">Username</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[200px]">Contact Info</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[120px]">Location</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[120px]">Status</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[150px]">Joined</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[150px]">Last Active</th>
                                <th className="px-6 py-4 font-medium border-b border-white/5 text-center min-w-[120px]">Profile</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredPlayers.map((player) => (
                                <tr
                                    key={player.id}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-6 py-4 font-suisse text-zinc-400">{player.id}</td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center">
                                                <Users className="h-4 w-4 text-zinc-500" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{player.username}</div>
                                                <div className="text-xs text-brand-red flex items-center gap-1">
                                                    <Shield className="h-3 w-3" /> {player.rank}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-zinc-300 font-suisse text-xs">
                                                <Mail className="h-3 w-3 text-zinc-500" /> {player.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-400 font-suisse text-xs">
                                                <Phone className="h-3 w-3 text-zinc-500" /> {player.phone}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-zinc-300">{player.country}</td>

                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border font-suisse ${player.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            player.status === 'Banned' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                            }`}>
                                            {player.status === 'Active' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                            {player.status === 'Banned' && <XCircle className="h-3 w-3 mr-1" />}
                                            {player.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-zinc-400 font-suisse text-xs">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {player.joinedDate}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-zinc-300 font-suisse text-xs">
                                        {player.lastActive}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <Button
                                            size="sm"
                                            className="bg-zinc-800 hover:bg-brand-red hover:text-white text-zinc-300 border border-white/5 transition-all shadow-lg text-xs"
                                            onClick={() => handleViewProfile(player)}
                                        >
                                            <Eye className="mr-2 h-3 w-3" /> View Profile
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                <div>Showing {filteredPlayers.length} players</div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled className="h-8 border-white/5 bg-transparent">Previous</Button>
                    <Button variant="outline" size="sm" className="h-8 border-white/5 bg-transparent hover:bg-white/5 hover:text-white">Next</Button>
                </div>
            </div>
            <PlayerProfileDialog
                open={isProfileOpen}
                onOpenChange={setIsProfileOpen}
                player={selectedPlayer}
            />
        </div>
    );
}
