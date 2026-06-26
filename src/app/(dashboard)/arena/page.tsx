"use client";

import { useState, useEffect, useCallback } from "react";

import {
    MoreHorizontal,
    Search,
    Clock,
    CheckCircle2,
    Trophy,
    Swords,
    Plus,
    Loader2,
    AlertCircle,
    Calendar,
    Users,
    FileText,
    ChevronDown,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/authutils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Tournament {
    id: string;
    name: string;
    status: string;
    type: string;
    startAt: string;
    maxTeams: number;
    filledSlots: number;
    prizePool: number;
    entryFeeAndroidTeam: number;
    createdById: string;
    game?: { name: string };
}

interface Template {
    id: string;
    name: string;
    description: string;
    type: string;
    format: string;
    teamSize: number;
    maxTeams: number;
    prizePool: number;
    entryFeeAndroidTeam: number;
    gameMapName: string;
    game?: { name: string };
}

interface Organizer {
    id: string;
    name: string;
    email: string;
    type: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
    live: "bg-brand-red/10 text-brand-red border-brand-red/20",
    upcoming: "bg-zinc-800 text-zinc-400 border-zinc-700",
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled: "bg-zinc-800/50 text-zinc-600 border-zinc-700/50",
};

function fmtDate(iso: string) {
    try {
        return new Date(iso).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return iso;
    }
}

// ─── Create Match Dialog ──────────────────────────────────────────────────────

interface CreateMatchDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

function CreateMatchDialog({ open, onClose, onSuccess }: CreateMatchDialogProps) {
    const [step, setStep] = useState<1 | 2>(1);

    // Step 1 — template + organizer selection
    const [templates, setTemplates] = useState<Template[]>([]);
    const [organizers, setOrganizers] = useState<Organizer[]>([]);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [metaError, setMetaError] = useState<string | null>(null);

    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);
    const [templateSearch, setTemplateSearch] = useState("");
    const [organizerSearch, setOrganizerSearch] = useState("");

    // Step 2 — schedule fields
    const [form, setForm] = useState({
        name: "",
        description: "",
        startAt: "",
        registrationEndAt: "",
        roomCardAvailableAt: "",
        publishedAt: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Fetch templates + organizers once the dialog opens
    useEffect(() => {
        if (!open) return;
        setLoadingMeta(true);
        setMetaError(null);
        Promise.all([
            apiFetch("/templates").then((r) => r.json()),
            apiFetch("/organizers?limit=100").then((r) => r.json()),
        ])
            .then(([tRes, oRes]) => {
                setTemplates(tRes.data || []);
                setOrganizers(oRes.data?.data || []);
            })
            .catch((e) => setMetaError(e.message || "Failed to load data"))
            .finally(() => setLoadingMeta(false));
    }, [open]);

    // Reset when closed
    useEffect(() => {
        if (!open) {
            setStep(1);
            setSelectedTemplate(null);
            setSelectedOrganizer(null);
            setTemplateSearch("");
            setOrganizerSearch("");
            setForm({ name: "", description: "", startAt: "", registrationEndAt: "", roomCardAvailableAt: "", publishedAt: "" });
            setSubmitError(null);
        }
    }, [open]);

    const filteredTemplates = templates.filter(
        (t) =>
            t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
            t.game?.name?.toLowerCase().includes(templateSearch.toLowerCase())
    );

    const filteredOrganizers = organizers.filter(
        (o) =>
            o.name?.toLowerCase().includes(organizerSearch?.toLowerCase()) ||
            o.email?.toLowerCase().includes(organizerSearch?.toLowerCase())
    );

    const handleSubmit = async () => {
        if (!selectedTemplate || !selectedOrganizer) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            const payload: Record<string, string> = {
                templateId: selectedTemplate.id,
                organizerId: selectedOrganizer.id,
                startAt: new Date(form.startAt).toISOString(),
                registrationEndAt: new Date(form.registrationEndAt).toISOString(),
                roomCardAvailableAt: new Date(form.roomCardAvailableAt).toISOString(),
                publishedAt: new Date(form.publishedAt).toISOString(),
            };
            if (form.name.trim()) payload.name = form.name.trim();
            if (form.description.trim()) payload.description = form.description.trim();

            const res = await apiFetch("/create-tournament", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            const json = await res.json();
            if (!res.ok || !json.success) {
                throw new Error(json.message || `Server error ${res.status}`);
            }

            onSuccess();
            onClose();
        } catch (e: any) {
            setSubmitError(e.message || "Failed to create tournament");
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-brand-red/10 border border-brand-red/20 flex items-center justify-center">
                            <Swords className="h-4 w-4 text-brand-red" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white font-naston">Create Tournament</h2>
                            <p className="text-xs text-zinc-500">
                                {step === 1 ? "Step 1 of 2 — Pick a template & organizer" : "Step 2 of 2 — Set the schedule"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Step indicator */}
                <div className="flex gap-0 px-6 pt-4">
                    {[1, 2].map((s) => (
                        <div key={s} className="flex items-center gap-2 mr-6">
                            <div
                                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                    step === s
                                        ? "bg-brand-red text-white"
                                        : step > s
                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                        : "bg-zinc-800 text-zinc-500"
                                }`}
                            >
                                {step > s ? <CheckCircle2 className="h-3 w-3" /> : s}
                            </div>
                            <span className={`text-xs ${step === s ? "text-white" : "text-zinc-500"}`}>
                                {s === 1 ? "Template & Organizer" : "Schedule"}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">

                    {/* Step 1 */}
                    {step === 1 && (
                        <>
                            {loadingMeta ? (
                                <div className="flex items-center justify-center py-16 gap-3 text-zinc-500">
                                    <Loader2 className="h-5 w-5 animate-spin text-brand-red" />
                                    <span className="text-sm">Loading templates &amp; organizers…</span>
                                </div>
                            ) : metaError ? (
                                <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-500">
                                    <AlertCircle className="h-6 w-6 text-red-500/70" />
                                    <p className="text-sm">{metaError}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Template picker */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                            <FileText className="h-3.5 w-3.5 text-brand-red" /> Template *
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                            <Input
                                                placeholder="Search templates…"
                                                value={templateSearch}
                                                onChange={(e) => setTemplateSearch(e.target.value)}
                                                className="pl-8 bg-zinc-900/50 border-white/10 text-zinc-200 text-sm h-9"
                                            />
                                        </div>
                                        <div className="max-h-52 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent pr-1">
                                            {filteredTemplates.length === 0 ? (
                                                <p className="text-xs text-zinc-600 py-4 text-center">No templates found</p>
                                            ) : filteredTemplates.map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setSelectedTemplate(t)}
                                                    className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
                                                        selectedTemplate?.id === t.id
                                                            ? "border-brand-red/40 bg-brand-red/10 text-white"
                                                            : "border-white/5 bg-zinc-900/40 text-zinc-300 hover:border-white/15 hover:bg-zinc-900/70"
                                                    }`}
                                                >
                                                    <div className="font-medium text-sm truncate">{t.name}</div>
                                                    <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2">
                                                        <span>{t.game?.name ?? "—"}</span>
                                                        <span>•</span>
                                                        <span className="capitalize">{t.type}</span>
                                                        <span>•</span>
                                                        <span>₹{t.prizePool?.toLocaleString()}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        {selectedTemplate && (
                                            <div className="rounded-lg bg-brand-red/5 border border-brand-red/15 p-3 space-y-1.5">
                                                <p className="text-xs font-semibold text-brand-red">Selected Template</p>
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                                    <span className="text-zinc-500">Format</span>
                                                    <span className="text-zinc-300 capitalize">{selectedTemplate.format?.replace(/_/g, " ")}</span>
                                                    <span className="text-zinc-500">Team Size</span>
                                                    <span className="text-zinc-300">{selectedTemplate.teamSize}v{selectedTemplate.teamSize}</span>
                                                    <span className="text-zinc-500">Max Teams</span>
                                                    <span className="text-zinc-300">{selectedTemplate.maxTeams}</span>
                                                    <span className="text-zinc-500">Entry Fee</span>
                                                    <span className="text-zinc-300">₹{selectedTemplate.entryFeeAndroidTeam}</span>
                                                    <span className="text-zinc-500">Map</span>
                                                    <span className="text-zinc-300">{selectedTemplate.gameMapName}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Organizer picker */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                            <Users className="h-3.5 w-3.5 text-brand-red" /> Organizer *
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                            <Input
                                                placeholder="Search organizers…"
                                                value={organizerSearch}
                                                onChange={(e) => setOrganizerSearch(e.target.value)}
                                                className="pl-8 bg-zinc-900/50 border-white/10 text-zinc-200 text-sm h-9"
                                            />
                                        </div>
                                        <div className="max-h-52 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent pr-1">
                                            {filteredOrganizers.length === 0 ? (
                                                <p className="text-xs text-zinc-600 py-4 text-center">No organizers found</p>
                                            ) : filteredOrganizers.map((o) => (
                                                <button
                                                    key={o.id}
                                                    onClick={() => setSelectedOrganizer(o)}
                                                    className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
                                                        selectedOrganizer?.id === o.id
                                                            ? "border-brand-red/40 bg-brand-red/10 text-white"
                                                            : "border-white/5 bg-zinc-900/40 text-zinc-300 hover:border-white/15 hover:bg-zinc-900/70"
                                                    }`}
                                                >
                                                    <div className="font-medium text-sm truncate">{o.name}</div>
                                                    <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2">
                                                        <span>{o.email}</span>
                                                        <span>•</span>
                                                        <span className="capitalize">{o.type?.toLowerCase()}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        {selectedOrganizer && (
                                            <div className="rounded-lg bg-brand-red/5 border border-brand-red/15 p-3">
                                                <p className="text-xs font-semibold text-brand-red mb-1">Selected Organizer</p>
                                                <p className="text-sm text-zinc-200 font-medium">{selectedOrganizer.name}</p>
                                                <p className="text-xs text-zinc-500">{selectedOrganizer.email}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <div className="space-y-5">
                            {/* Summary strip */}
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-white/5">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-zinc-500 mb-0.5">Template</p>
                                    <p className="text-sm text-zinc-200 font-medium truncate">{selectedTemplate?.name}</p>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-zinc-500 mb-0.5">Organizer</p>
                                    <p className="text-sm text-zinc-200 font-medium truncate">{selectedOrganizer?.name}</p>
                                </div>
                            </div>

                            {/* Optional overrides */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Override (optional)</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="grid gap-1.5">
                                        <label className="text-xs text-zinc-400">Tournament Name</label>
                                        <Input
                                            placeholder={`Default: ${selectedTemplate?.name}`}
                                            value={form.name}
                                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                            className="bg-zinc-900/50 border-white/10 text-zinc-200 focus-visible:ring-brand-red/20"
                                        />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <label className="text-xs text-zinc-400">Description</label>
                                        <Input
                                            placeholder="Override description…"
                                            value={form.description}
                                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                            className="bg-zinc-900/50 border-white/10 text-zinc-200 focus-visible:ring-brand-red/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5 text-brand-red" /> Schedule *
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {(
                                        [
                                            { key: "publishedAt", label: "Publish At", help: "When it goes live on the app" },
                                            { key: "registrationEndAt", label: "Registration Ends", help: "Deadline for team registration" },
                                            { key: "roomCardAvailableAt", label: "Room Card Available", help: "When room code is revealed" },
                                            { key: "startAt", label: "Match Starts At", help: "Actual tournament start time" },
                                        ] as const
                                    ).map(({ key, label, help }) => (
                                        <div key={key} className="grid gap-1.5">
                                            <label className="text-xs text-zinc-400">
                                                {label}
                                                <span className="text-zinc-600 ml-1 font-normal">— {help}</span>
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={form[key]}
                                                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                                                className="flex h-10 w-full rounded-md border border-white/10 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/20 [color-scheme:dark]"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {submitError && (
                                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                                    <p className="text-sm text-red-400">{submitError}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/5 bg-zinc-950">
                    <Button
                        variant="outline"
                        onClick={step === 1 ? onClose : () => setStep(1)}
                        className="border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white"
                        disabled={submitting}
                    >
                        {step === 1 ? "Cancel" : "← Back"}
                    </Button>

                    {step === 1 ? (
                        <Button
                            onClick={() => setStep(2)}
                            disabled={!selectedTemplate || !selectedOrganizer || loadingMeta}
                            className="bg-brand-red hover:bg-brand-red/90 text-white shadow-lg shadow-brand-red/20 disabled:opacity-40"
                        >
                            Next: Set Schedule →
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                submitting ||
                                !form.startAt ||
                                !form.registrationEndAt ||
                                !form.roomCardAvailableAt ||
                                !form.publishedAt
                            }
                            className="bg-brand-red hover:bg-brand-red/90 text-white shadow-lg shadow-brand-red/20 disabled:opacity-40 min-w-[160px]"
                        >
                            {submitting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…</>
                            ) : (
                                <><Trophy className="mr-2 h-4 w-4" /> Create Tournament</>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MatchesPage() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [createOpen, setCreateOpen] = useState(false);

    const fetchTournaments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiFetch("/tournaments");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setTournaments(data?.data?.data ?? []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTournaments();
    }, [fetchTournaments]);

    const filtered = tournaments.filter((t) => {
        const q = searchQuery.toLowerCase();
        const matchSearch =
            t.name?.toLowerCase().includes(q) ||
            t.id?.toLowerCase().includes(q) ||
            t.game?.name?.toLowerCase().includes(q);
        const matchStatus =
            statusFilter === "All" ||
            t.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchSearch && matchStatus;
    });

    return (
        <>
            <CreateMatchDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={fetchTournaments}
            />

            <div className="flex flex-col gap-6 w-full h-full overflow-hidden">
                {/* Header */}
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
                        <Button
                            onClick={() => setCreateOpen(true)}
                            className="bg-brand-red hover:bg-brand-red/90 text-white shadow-lg shadow-brand-red/20"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Match
                        </Button>
                    </div>
                </div>

                {/* Status filters */}
                <div className="flex items-center gap-3 p-1 rounded-lg bg-zinc-900/30 border border-white/5 w-fit">
                    {["All", "upcoming", "live", "completed", "cancelled"].map((s) => (
                        <Button
                            key={s}
                            variant="ghost"
                            size="sm"
                            onClick={() => setStatusFilter(s)}
                            className={`text-sm capitalize shadow-sm transition-all ${
                                statusFilter === s
                                    ? "bg-white/10 text-white"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            {s}
                        </Button>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between gap-4 bg-zinc-900/40 p-3 rounded-lg border border-white/5">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search matches…"
                            className="pl-9 bg-zinc-950/50 border-white/10 focus-visible:ring-brand-red/20 text-zinc-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table container */}
                <div className="rounded-xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm overflow-hidden flex-1 relative flex flex-col">
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pb-4 flex-1">

                        {loading ? (
                            <div className="flex items-center justify-center py-20 text-zinc-500 text-sm gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-brand-red" />
                                Loading tournaments…
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3 text-sm">
                                <AlertCircle className="h-6 w-6 text-red-500/60" />
                                <span className="text-red-400 text-center max-w-md">{error}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-white/10 hover:bg-white/5 text-zinc-400"
                                    onClick={fetchTournaments}
                                >
                                    Retry
                                </Button>
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-zinc-950/80 text-zinc-500 sticky top-0 z-10 backdrop-blur-md font-suisse">
                                    <tr>
                                        <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[120px]">ID</th>
                                        <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[200px]">Tournament</th>
                                        <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[130px]">Status</th>
                                        <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[100px]">Game</th>
                                        <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[90px]">Type</th>
                                        <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[160px]">Starts At</th>
                                        <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[100px]">Slots</th>
                                        <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[100px]">Entry Fee</th>
                                        <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[110px]">Prize Pool</th>
                                        <th className="px-6 py-4 font-medium border-b border-white/5 text-right sticky right-0 bg-zinc-950/90 z-20">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={10} className="px-6 py-12 text-center text-zinc-600 text-sm">
                                                {searchQuery || statusFilter !== "All"
                                                    ? "No matches found for your filters."
                                                    : "No tournaments yet. Create one above!"}
                                            </td>
                                        </tr>
                                    ) : filtered.map((t) => (
                                        <tr key={t.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-suisse text-zinc-500 text-xs">
                                                {t.id.slice(0, 8).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-1 bg-brand-red/50 rounded-full shrink-0" />
                                                    <span className="font-medium text-white truncate max-w-[180px]">{t.name ?? "—"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
                                                    STATUS_STYLES[t.status] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"
                                                }`}>
                                                    {t.status === "live" && (
                                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-red animate-pulse" />
                                                    )}
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-300">
                                                {t.game?.name ?? "—"}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-300 capitalize font-suisse">
                                                {t.type ?? "—"}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400 font-suisse text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3 text-zinc-600" />
                                                    {t.startAt ? fmtDate(t.startAt) : "—"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-300 font-suisse">
                                                {t.filledSlots ?? 0}
                                                <span className="text-zinc-600 mx-1">/</span>
                                                {t.maxTeams ?? 0}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-300 font-suisse">
                                                {t.entryFeeAndroidTeam != null ? `₹${t.entryFeeAndroidTeam}` : "—"}
                                            </td>
                                            <td className="px-6 py-4 text-brand-red font-medium font-suisse">
                                                {t.prizePool != null ? `₹${Number(t.prizePool).toLocaleString("en-IN")}` : "—"}
                                            </td>
                                            <td className="px-6 py-4 text-right sticky right-0 bg-zinc-950/90 backdrop-blur-md border-l border-white/5 z-20">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10 opacity-50 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Footer count */}
                {!loading && !error && (
                    <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                        <div>
                            Showing{" "}
                            <span className="text-zinc-300 font-medium">{filtered.length}</span>
                            {" "}of{" "}
                            <span className="text-zinc-300 font-medium">{tournaments.length}</span>
                            {" "}tournaments
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}