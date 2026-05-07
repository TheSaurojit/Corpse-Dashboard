"use client";

import { useState } from "react";
import {
    Search,
    Briefcase,
    Eye,
    CheckCircle2,
    XCircle,
    Calendar,
    Star,
    Mail,
    Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrganizerProfileDialog } from "@/components/organizers/OrganizerProfileDialog";

// Organizer Data Interface
interface Organizer {
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
}

// Mock Data
const MOCK_ORGANIZERS: Organizer[] = Array.from({ length: 15 }).map((_, i) => ({
    id: `ORG-${3000 + i}`,
    name: `Tournament Org ${i}`,
    email: `contact@org${i}.com`,
    phone: `+1 555 010 ${i.toString().padStart(2, '0')}`,
    country: i % 3 === 0 ? "USA" : i % 2 === 0 ? "India" : "UK",
    accountStatus: i % 5 === 0 ? "Restricted" : "Verified",
    verificationStatus: i % 4 === 0 ? "Pending" : "Verified",
    status: i === 2 ? "Banned" : "Active",
    joinedDate: new Date(Date.now() - i * 86400000 * 30).toLocaleDateString(),
    lastActive: `${i} hours ago`,
    rating: 4.0 + (i % 10) / 10
}));

export default function OrganizersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleViewProfile = (organizer: Organizer) => {
        setSelectedOrganizer(organizer);
        setIsProfileOpen(true);
    };

    const filteredOrganizers = MOCK_ORGANIZERS.filter(org =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 w-full h-full overflow-hidden">
            {/* Header Section */}
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
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search organizers..."
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
                            {filteredOrganizers.map((org) => (
                                <tr
                                    key={org.id}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-6 py-4 font-suisse text-zinc-400">{org.id}</td>

                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-white flex items-center gap-2">
                                                {org.name}
                                                {org.verificationStatus === 'Verified' && <CheckCircle2 className="h-3 w-3 text-blue-400" />}
                                            </div>
                                            <div className="text-xs text-zinc-500 font-suisse flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {org.email}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="text-zinc-300 text-xs flex flex-col gap-1">
                                            <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-zinc-500" /> {org.phone}</span>
                                            <span className="text-zinc-500">{org.country}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${org.accountStatus === 'Verified' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-zinc-800 text-zinc-400 border-zinc-700'
                                                }`}>
                                                {org.accountStatus}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 text-[10px] ${org.status === 'Active' ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${org.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                {org.status}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-zinc-400 font-suisse text-xs">
                                        <div className="flex flex-col">
                                            <span>{org.joinedDate}</span>
                                            <span className="text-zinc-600 text-[10px]">Active: {org.lastActive}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-zinc-300 font-suisse text-xs">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="h-3 w-3 fill-yellow-500" /> {org.rating.toFixed(1)}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <Button
                                            size="sm"
                                            className="bg-zinc-800 hover:bg-brand-red hover:text-white text-zinc-300 border border-white/5 transition-all shadow-lg text-xs"
                                            onClick={() => handleViewProfile(org)}
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
                <div>Showing {filteredOrganizers.length} organizers</div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled className="h-8 border-white/5 bg-transparent">Previous</Button>
                    <Button variant="outline" size="sm" className="h-8 border-white/5 bg-transparent hover:bg-white/5 hover:text-white">Next</Button>
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
