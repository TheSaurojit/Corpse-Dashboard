"use client";

import { useState } from "react";
import {
    Settings,
    Power,
    Percent,
    DollarSign,
    Shield,
    Gamepad2,
    Bell,
    Save,
    Swords,
    Trophy,
    Users,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    // State for toggles and inputs
    const [appEnabled, setAppEnabled] = useState(true);
    const [platformCommission, setPlatformCommission] = useState(10);
    const [organizerCommission, setOrganizerCommission] = useState(5);
    const [guildVerification, setGuildVerification] = useState(true);
    const [matchStartAlert, setMatchStartAlert] = useState(15);
    const [maxGuildMembers, setMaxGuildMembers] = useState(50);

    const [activeGames, setActiveGames] = useState({
        bgmi: true,
        freefire: true,
        codm: false,
        valorant: false
    });

    const [matchTypes, setMatchTypes] = useState({
        solo: true,
        duo: true,
        squad: true,
        tDM: false
    });

    return (
        <div className="flex flex-col gap-6 w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pb-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 font-naston">
                        <Settings className="h-6 w-6 text-brand-red" />
                        Settings
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Configure global platform usage, rules, and game availability.
                    </p>
                </div>
                <Button className="bg-brand-red hover:bg-red-700 text-white font-bold shadow-lg shadow-red-900/20">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Global App Control */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Power className="h-24 w-24 text-brand-red" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Power className="h-5 w-5 text-brand-red" /> App Status
                        </h3>
                        <div className="flex items-center justify-between p-4 bg-zinc-950/50 border border-white/5 rounded-xl">
                            <div>
                                <div className="font-bold text-white">Application Access</div>
                                <div className="text-sm text-zinc-500">Enable or disable the entire platform for users.</div>
                            </div>
                            <Switch
                                checked={appEnabled}
                                onCheckedChange={setAppEnabled}
                                className="data-[state=checked]:bg-green-500"
                            />
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 bg-red-500/10 border border-red-500/20 p-2 rounded text-red-400">
                            <Shield className="h-3 w-3" />
                            Warning: Disabling this will prevent all users from logging in.
                        </div>
                    </div>
                </div>

                {/* Commission Settings */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Percent className="h-5 w-5 text-brand-red" /> Commission Rates
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm text-zinc-300 font-medium">Platform Commission (%)</label>
                                <span className="text-brand-red font-bold font-suisse">{platformCommission}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="30"
                                value={platformCommission}
                                onChange={(e) => setPlatformCommission(Number(e.target.value))}
                                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-red"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm text-zinc-300 font-medium">Organizer Commission (%)</label>
                                <span className="text-blue-400 font-bold font-suisse">{organizerCommission}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="20"
                                value={organizerCommission}
                                onChange={(e) => setOrganizerCommission(Number(e.target.value))}
                                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Game Configuration */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Gamepad2 className="h-5 w-5 text-brand-red" /> Active Games
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { id: 'bgmi', name: 'BGMI', icon: CrosshairIcon },
                            { id: 'freefire', name: 'Free Fire', icon: FlameIcon },
                            { id: 'codm', name: 'Call of Duty', icon: SkullIcon },
                            { id: 'valorant', name: 'Valorant', icon: RadioIcon }
                        ].map((game) => (
                            <div key={game.id} className={`border rounded-xl p-4 flex items-center justify-between transition-all ${
                                // @ts-ignore
                                activeGames[game.id]
                                    ? 'bg-brand-red/10 border-brand-red/30'
                                    : 'bg-zinc-950/30 border-white/5 opacity-60'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${
                                        // @ts-ignore
                                        activeGames[game.id] ? 'bg-brand-red text-white' : 'bg-zinc-800 text-zinc-500'
                                        }`}>
                                        <game.icon className="h-5 w-5" />
                                    </div>
                                    <span className={`font-bold ${
                                        // @ts-ignore
                                        activeGames[game.id] ? 'text-white' : 'text-zinc-500'
                                        }`}>{game.name}</span>
                                </div>
                                <Switch
                                    // @ts-ignore
                                    checked={activeGames[game.id]}
                                    // @ts-ignore
                                    onCheckedChange={(c) => setActiveGames(prev => ({ ...prev, [game.id]: c }))}
                                />
                            </div>
                        ))}
                    </div>

                    <Separator className="my-6 bg-white/5" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Minimum Entry Fees</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-zinc-300 w-24 text-sm">BGMI</span>
                                    <div className="relative flex-1">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                        <Input className="pl-9 bg-zinc-950 border-white/10 h-9" defaultValue="50" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-zinc-300 w-24 text-sm">Free Fire</span>
                                    <div className="relative flex-1">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                        <Input className="pl-9 bg-zinc-950 border-white/10 h-9" defaultValue="30" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Allowed Match Types</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(matchTypes).map(([type, enabled]) => (
                                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${enabled ? 'bg-brand-red border-brand-red' : 'border-zinc-600 bg-transparent'
                                            }`}>
                                            {enabled && <CheckIcon className="h-3.5 w-3.5 text-white" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={enabled}
                                            onChange={(e) => setMatchTypes(prev => ({ ...prev, [type]: e.target.checked }))}
                                        />
                                        <span className="text-zinc-300 text-sm capitalize group-hover:text-white transition-colors">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Organization & Alerts */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-brand-red" /> Guild Settings
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-zinc-300">Detailed Verification Required</label>
                            <Switch checked={guildVerification} onCheckedChange={setGuildVerification} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">Max Guild Members</label>
                            <Input
                                type="number"
                                value={maxGuildMembers}
                                onChange={(e) => setMaxGuildMembers(Number(e.target.value))}
                                className="bg-zinc-950 border-white/10"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Bell className="h-5 w-5 text-brand-red" /> Match Alerts
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-300">Match Start Alert Time (Minutes before)</label>
                            <div className="flex gap-4 items-center">
                                <Input
                                    type="number"
                                    value={matchStartAlert}
                                    onChange={(e) => setMatchStartAlert(Number(e.target.value))}
                                    className="bg-zinc-950 border-white/10"
                                />
                                <span className="text-sm text-zinc-500 whitespace-nowrap">min before start</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Icons
function CrosshairIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="22" x2="18" y1="12" y2="12" />
            <line x1="6" x2="2" y1="12" y2="12" />
            <line x1="12" x2="12" y1="6" y2="2" />
            <line x1="12" x2="12" y1="22" y2="18" />
        </svg>
    )
}

function FlameIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3.3a1 1 0 0 0 .9.8z" />
        </svg>
    )
}

function SkullIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="9" cy="12" r="1" />
            <circle cx="15" cy="12" r="1" />
            <path d="M8 20v2h8v-2" />
            <path d="m12.5 17-.5-1-.5 1h1z" />
            <path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20" />
        </svg>
    )
}

function RadioIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
            <circle cx="12" cy="12" r="2" />
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
        </svg>
    )
}

function CheckIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
