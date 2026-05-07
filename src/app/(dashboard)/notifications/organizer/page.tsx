"use client";

import { useState } from "react";
import {
    Building2,
    BellRing,
    Send,
    MessageSquare,
    Image as ImageIcon,
    Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// --- Components ---

const Panel = ({ children, title, icon: Icon, className = "", description }: any) => (
    <div className={`bg-zinc-950 border border-white/10 rounded-lg p-6 flex flex-col relative overflow-hidden group ${className}`}>
        {/* Tech Decor */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 rounded-tl-sm" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 rounded-tr-sm" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 rounded-bl-sm" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 rounded-br-sm" />

        <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="bg-zinc-900 border border-white/5 p-2 rounded-md group-hover:border-brand-red/30 transition-colors">
                {Icon && <Icon className="h-5 w-5 text-white" />}
            </div>
            <div>
                <h2 className="text-lg font-bold text-white font-naston tracking-wide uppercase">{title}</h2>
                {description && <p className="text-xs text-zinc-500">{description}</p>}
            </div>
        </div>
        <div className="h-px bg-white/5 w-full my-4" />
        <div className="relative z-10 flex-1 flex flex-col">
            {children}
        </div>
    </div>
);

export default function OrganizerNotificationsPage() {
    // Push Notification State
    const [pushTitle, setPushTitle] = useState("");
    const [pushMessage, setPushMessage] = useState("");

    // Popup Notification State
    const [popupTitle, setPopupTitle] = useState("");
    const [popupBody, setPopupBody] = useState("");
    const [popupImage, setPopupImage] = useState("");

    return (
        <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pb-8 px-2 space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white font-naston tracking-wide uppercase flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-brand-red" />
                    Organizer App Notifications
                </h1>
                <p className="text-zinc-500 text-sm mt-1">
                    Manage communications with Tournament Organizers via Push and In-App Popups.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* 1. Organizer Push Notification Console */}
                <Panel
                    title="Organizer Push Notification"
                    icon={BellRing}
                    description="Send alerts specifically to Organizer devices."
                >
                    <div className="space-y-4">
                        <div className="bg-brand-red/5 border border-brand-red/10 p-3 rounded flex items-center gap-2 text-xs text-brand-red mb-2">
                            <Briefcase className="h-4 w-4" />
                            <span className="font-bold">TARGET: ALL ORGANIZERS</span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Title</label>
                            <Input
                                placeholder="e.g. New Policy Update"
                                className="bg-zinc-900 border-white/10 focus:border-brand-red/50 text-white"
                                value={pushTitle}
                                onChange={(e) => setPushTitle(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Message</label>
                            <Textarea
                                placeholder="Enter message for organizers..."
                                className="bg-zinc-900 border-white/10 focus:border-brand-red/50 text-white min-h-[100px] resize-none"
                                value={pushMessage}
                                onChange={(e) => setPushMessage(e.target.value)}
                            />
                        </div>

                        <div className="pt-4 mt-auto">
                            <Button className="w-full bg-brand-red hover:bg-red-700 text-white font-bold tracking-wider uppercase">
                                <Send className="h-4 w-4 mr-2" /> Send to Organizers
                            </Button>
                        </div>
                    </div>
                </Panel>

                {/* 2. Organizer App Popup Console */}
                <Panel
                    title="Organizer App Popup"
                    icon={MessageSquare}
                    description="Broadcast a modal overlay to the Organizer App."
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Popup Title</label>
                            <Input
                                placeholder="e.g. Maintenance Scheduled"
                                className="bg-zinc-900 border-white/10 focus:border-brand-red/50 text-white"
                                value={popupTitle}
                                onChange={(e) => setPopupTitle(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Body Content</label>
                            <Textarea
                                placeholder="Details about the announcement..."
                                className="bg-zinc-900 border-white/10 focus:border-brand-red/50 text-white min-h-[100px]"
                                value={popupBody}
                                onChange={(e) => setPopupBody(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Image URL (Optional)</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <Input
                                    placeholder="https://..."
                                    className="pl-9 bg-zinc-900 border-white/10 focus:border-brand-red/50 text-white"
                                    value={popupImage}
                                    onChange={(e) => setPopupImage(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Preview Preview */}
                        {(popupTitle || popupBody) && (
                            <div className="mt-4 p-4 bg-black/40 rounded border border-white/5 relative">
                                <div className="absolute top-2 right-2 text-[9px] text-zinc-600 uppercase">Preview</div>
                                {popupImage && (
                                    <div className="h-24 w-full bg-zinc-800 rounded mb-2 overflow-hidden relative">
                                        <img src={popupImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                                    </div>
                                )}
                                <div className="font-bold text-white text-sm">{popupTitle || "Title"}</div>
                                <div className="text-xs text-zinc-400 mt-1">{popupBody || "Body text..."}</div>
                            </div>
                        )}

                        <div className="pt-4">
                            <Button className="w-full bg-white text-black hover:bg-zinc-200 font-bold tracking-wider uppercase">
                                <MessageSquare className="h-4 w-4 mr-2" /> Broadcast Popup
                            </Button>
                        </div>
                    </div>
                </Panel>

            </div>
        </div>
    );
}
