"use client";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import {
    Swords,
    Trophy,
    Target,
    TrendingUp,
    Shield,
    Smartphone,
    Globe,
    Clock,
    Ban,
    AlertOctagon,
    Mail,
    Phone,
    MapPin,
    Star,
    CalendarDays,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts";

// ─── Types ─────────────────────────────────────────────────────────────────

// Shape coming from PlayersPage (already mapped from ApiUser)
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

interface PlayerProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    player: Player | null;
}

const COLORS = ["#D7333A", "#3b82f6", "#10b981", "#f59e0b"];

// ─── Helpers ───────────────────────────────────────────────────────────────

function Initials({ name }: { name: string }) {
    const parts = name.trim().split(/\s+/);
    const letters =
        parts.length >= 2
            ? parts[0][0] + parts[parts.length - 1][0]
            : name.slice(0, 2);
    return (
        <span className="text-2xl font-bold text-zinc-400 uppercase select-none">
            {letters}
        </span>
    );
}

function formatDob(iso: string | null): string {
    if (!iso) return "\u2014";
    // Slice YYYY-MM-DD only to avoid UTC->local timezone shift showing wrong day
    const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function calcAge(iso: string | null): string {
    if (!iso) return "";
    const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
    const dob = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return `${age} yrs`;
}

// ─── Component ─────────────────────────────────────────────────────────────

export function PlayerProfileDialog({ open, onOpenChange, player }: PlayerProfileDialogProps) {
    if (!player) return null;

    // ── Zeroed-out stats (not in API yet) ──────────────────────────────────
    const tournamentsJoined = 0;
    const tournamentsCompleted = 0;
    const matchesWon = 0;
    const matchesLost = 0;
    const winRate = 0;
    const topFinishPercent = 0;
    const avgMatchesPerWeek = 0;
    const peakPlayTime = "—";
    const highestPrizeWon = "₹0";
    const totalEarnings = "₹0";
    const entryFeesPaid = "₹0";
    const lastTransactionDate = "—";
    const disputesWon = 0;
    const disputesLost = 0;
    const blacklistedCount = 0;
    const guildName: string | null = null;
    const teamId: string | null = null;

    // Free Fire only platform — single game
    const ffKills = 0;
    const ffRank = "—";

    const mostPlayedData = [
        { name: "Free Fire", value: ffKills === 0 ? 1 : ffKills }, // avoid empty pie
    ];

    const pieColors = ["#D7333A"];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl bg-[#09090b] border-white/10 text-zinc-200 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 p-0 gap-0">

                {/* Header Banner */}
                <div className="h-32 bg-gradient-to-r from-brand-red/20 to-zinc-900 relative">
                    <div className="absolute -bottom-8 left-8 flex items-end gap-4">
                        {/* Avatar */}
                        <div className="h-24 w-24 rounded-full bg-zinc-950 border-4 border-[#09090b] overflow-hidden flex items-center justify-center shrink-0">
                            {player.photoUrl ? (
                                <img
                                    src={player.photoUrl}
                                    alt={player.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Initials name={player.displayName} />
                            )}
                        </div>
                        <div className="mb-2">
                            <h2 className="text-2xl font-bold text-white font-naston">
                                {player.username}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                <span className="font-suisse truncate max-w-[180px]">{player.id}</span>
                                {player.isVerified && (
                                    <>
                                        <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                                        <span className="text-brand-red flex items-center gap-1">
                                            <Shield className="h-3 w-3" /> Verified
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action buttons + status badge */}
                    <div className="absolute top-4 right-4 flex gap-2 items-center">
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 bg-red-600 text-white hover:bg-red-700 border border-red-500/50 font-medium"
                        >
                            <Ban className="h-3 w-3 mr-1" /> Ban Player
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 bg-amber-500 text-white hover:bg-amber-600 border border-amber-400/50 font-bold"
                        >
                            <AlertOctagon className="h-3 w-3 mr-1" /> Suspend
                        </Button>
                        {player.status === "Banned" ? (
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Banned
                            </span>
                        ) : (
                            <span className="bg-green-500/20 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Active
                            </span>
                        )}
                    </div>
                </div>

                <div className="pt-14 px-8 pb-8 flex flex-col gap-8">

                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Earnings"
                            value={totalEarnings}
                            sub={<span className="text-xs text-zinc-500 flex items-center mt-1">No transactions yet</span>}
                        />
                        <StatCard
                            label="ELO Points"
                            value={player.elo}
                            sub={<span className="text-xs text-zinc-500 mt-1">Unranked</span>}
                        />
                        <StatCard
                            label="Win Rate"
                            value={`${winRate}%`}
                            sub={<span className="text-xs text-zinc-500 mt-1">{matchesWon}W – {matchesLost}L</span>}
                        />
                        <StatCard
                            label="Tournaments"
                            value={tournamentsCompleted}
                            sub={<span className="text-xs text-zinc-500 mt-1">{tournamentsJoined} Joined</span>}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Left: Charts + Game Stats */}
                        <div className="md:col-span-2 flex flex-col gap-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Pie chart */}
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
                                                    {mostPlayedData.map((_, index) => (
                                                        <Cell key={index} fill={pieColors[index % pieColors.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#fff" }}
                                                    itemStyle={{ color: "#fff" }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex justify-center gap-4 text-xs mt-2">
                                        <div className="flex items-center gap-1 text-zinc-400">
                                            <div className="w-2 h-2 rounded-full bg-brand-red" />
                                            Free Fire
                                        </div>
                                    </div>
                                </div>

                                {/* Performance panel */}
                                <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <Swords className="h-4 w-4 text-brand-red" /> Performance
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoRow label="Avg Matches / Week" value={avgMatchesPerWeek} />
                                        <InfoRow label="Peak Play Time" value={peakPlayTime} />
                                        <div>
                                            <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2">
                                                <div
                                                    className="bg-brand-red h-1.5 rounded-full"
                                                    style={{ width: `${topFinishPercent}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs text-zinc-500 mt-1">
                                                <span>Top Finish Consistency</span>
                                                <span>{topFinishPercent}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Game Statistics */}
                            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-white mb-4">Game Statistics</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                    <div className="bg-zinc-950/50 rounded-lg p-3 border border-white/5">
                                        <div className="text-xs text-zinc-500 uppercase">Free Fire</div>
                                        <div className="text-lg font-bold text-white mt-1 font-suisse">
                                            {ffKills}{" "}
                                            <span className="text-xs font-sans text-zinc-500 font-normal">Kills</span>
                                        </div>
                                        <div className="text-xs text-brand-red mt-1">{ffRank}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Info cards */}
                        <div className="flex flex-col gap-6">

                            {/* Profile Details */}
                            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-white mb-4">Profile Details</h3>
                                <div className="space-y-3 text-sm">
                                    <InfoRow
                                        label={<><Mail className="h-3 w-3" /> Email</>}
                                        value={<span className="truncate max-w-[140px] block text-right">{player.email}</span>}
                                    />
                                    <InfoRow
                                        label={<><Phone className="h-3 w-3" /> Phone</>}
                                        value={player.phone ?? "—"}
                                    />
                                    <InfoRow
                                        label={<><MapPin className="h-3 w-3" /> Location</>}
                                        value={player.location}
                                    />
                                    <InfoRow
                                        label={<><CalendarDays className="h-3 w-3" /> DOB</>}
                                        value={
                                            player.dateOfBirth
                                                ? `${formatDob(player.dateOfBirth)} (${calcAge(player.dateOfBirth)})`
                                                : "—"
                                        }
                                    />
                                    <InfoRow
                                        label={<><Clock className="h-3 w-3" /> Last Active</>}
                                        value={player.lastActive}
                                    />
                                    <InfoRow
                                        label={<><CalendarDays className="h-3 w-3" /> Joined</>}
                                        value={player.joinedDate}
                                    />
                                    <InfoRow
                                        label={<><Shield className="h-3 w-3" /> Verified</>}
                                        value={
                                            player.isVerified
                                                ? <span className="flex items-center gap-1 text-green-400"><CheckCircle2 className="h-3 w-3" /> Yes</span>
                                                : <span className="flex items-center gap-1 text-zinc-500"><XCircle className="h-3 w-3" /> No</span>
                                        }
                                    />
                                </div>
                            </div>

                            {/* Team & Guild */}
                            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-white mb-4">Team &amp; Guild</h3>
                                <div className="space-y-3 text-sm">
                                    <InfoRow label="Guild Name" value={guildName ?? "None"} />
                                    <InfoRow label="Team ID" value={teamId ?? "N/A"} />
                                    <InfoRow
                                        label="Organizer Blacklists"
                                        value={<span className={blacklistedCount > 0 ? "text-red-400 font-bold" : "text-zinc-400"}>{blacklistedCount}</span>}
                                    />
                                </div>
                            </div>

                            {/* Financials */}
                            <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-white mb-4">Financials</h3>
                                <div className="space-y-3 text-sm">
                                    <InfoRow label="Highest Win" value={highestPrizeWon} />
                                    <InfoRow label="Fees Paid" value={entryFeesPaid} />
                                    <InfoRow label="Last Txn" value={lastTransactionDate} />
                                    <div className="pt-2 border-t border-white/5">
                                        <InfoRow
                                            label="Disputes (W/L)"
                                            value={`${disputesWon}W / ${disputesLost}L`}
                                        />
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

// ─── Tiny sub-components ────────────────────────────────────────────────────

function StatCard({
    label,
    value,
    sub,
}: {
    label: string;
    value: string | number;
    sub?: React.ReactNode;
}) {
    return (
        <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-4 flex flex-col">
            <span className="text-zinc-500 text-xs uppercase font-semibold">{label}</span>
            <span className="text-2xl font-bold text-white font-suisse mt-1">{value}</span>
            {sub}
        </div>
    );
}

function InfoRow({
    label,
    value,
}: {
    label: React.ReactNode;
    value: React.ReactNode;
}) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-zinc-400 flex items-center gap-1.5">{label}</span>
            <span className="text-white text-right">{value}</span>
        </div>
    );
}