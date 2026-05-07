"use client";

import { useState } from "react";
import {
    Search,
    Shield,
    Eye,
    CheckCircle2,
    XCircle,
    Calendar,
    MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GuildProfileDialog } from "@/components/guilds/GuildProfileDialog";

// Guild Data Interface
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

// Mock Data
const MOCK_GUILDS: Guild[] = Array.from({ length: 15 }).map((_, i) => ({
    id: `G-${8000 + i}`,
    name: i % 2 === 0 ? `Team Soul ${i}` : `Godlike Esports ${i}`,
    accountStatus: i % 5 === 0 ? "Restricted" : "Verified",
    creationDate: new Date(Date.now() - i * 86400000 * 20).toLocaleDateString(),
    status: i % 4 === 0 ? "Inactive" : "Active",
    members: 20 + (i * 3),
    leader: `Player_${i}`,
    logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${i}`
}));

export default function GuildsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleViewProfile = (guild: Guild) => {
        setSelectedGuild(guild);
        setIsProfileOpen(true);
    };

    const filteredGuilds = MOCK_GUILDS.filter(guild =>
        guild.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guild.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 w-full h-full overflow-hidden">
            {/* Header Section */}
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

            {/* Data Table Container */}
            <div className="rounded-xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm overflow-hidden flex-1 relative flex flex-col">
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
                            {filteredGuilds.map((guild) => (
                                <tr
                                    key={guild.id}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-6 py-4 font-suisse text-zinc-400">{guild.id}</td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center">
                                                <img src={guild.logo} alt="Logo" className="w-full h-full object-cover opacity-70" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{guild.name}</div>
                                                <div className="text-xs text-zinc-500 flex items-center gap-1 font-suisse">
                                                    {guild.members} Members • Leader: {guild.leader}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border font-suisse ${guild.accountStatus === 'Verified' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            guild.accountStatus === 'Restricted' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                            }`}>
                                            {guild.accountStatus}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-zinc-400 font-suisse text-xs">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {guild.creationDate}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium font-suisse ${guild.status === 'Active' ? 'text-green-400' : 'text-zinc-500'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${guild.status === 'Active' ? 'bg-green-500' : 'bg-zinc-600'
                                                }`}></span>
                                            {guild.status}
                                        </span>
                                    </td>

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
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                <div>Showing {filteredGuilds.length} guilds</div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled className="h-8 border-white/5 bg-transparent">Previous</Button>
                    <Button variant="outline" size="sm" className="h-8 border-white/5 bg-transparent hover:bg-white/5 hover:text-white">Next</Button>
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
