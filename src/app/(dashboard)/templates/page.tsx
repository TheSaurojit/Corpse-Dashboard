"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LayoutTemplate,
  Plus,
  Search,
  FileText,
  Edit2,
  Trash2,
  Calendar,
  Gamepad2,
  Trophy,
  Users,
  Loader2,
  AlertCircle,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiFetch, apiFormFetch } from "@/lib/authutils";

interface Template {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;
  type: string;
  entryFeeAndroidTeam: number;
  entryFeeIosTeam: number;
  prizePool: number;
  maxTeams: number;
  format: string;
  elo: number;
  gameId: string;
  teamSize: number;
  gameMapName: string;
  matchType: string;
  createdAt: string;
  updatedAt: string;
  game: {
    id: string;
    name: string;
    slug: string;
  };
}

const DEFAULT_FORM_DATA = {
  name: "",
  description: "",
  type: "squad",
  entryFeeAndroidTeam: 0,
  entryFeeIosTeam: 0,
  prizePool: 0,
  maxTeams: 100,
  format: "single_elimination",
  elo: 0,
  gameId: "",
  teamSize: 4,
  gameMapName: "Erangel",
  matchType: "battle_royale"
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        const res = await apiFetch("/templates");
        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }
        const json = await res.json();
        if (!json.success) {
            throw new Error(json.message || "Failed to fetch templates");
        }
        setTemplates(json.data || []);
    } catch (e: any) {
        setError(e.message || "An unknown error occurred");
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.game?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setBannerFile(e.target.files[0]);
      }
  };

  const handleCreateTemplate = async () => {
    if (!formData.name.trim() || !formData.gameId.trim()) {
        alert("Name and Game ID are required");
        return;
    }
    
    setIsSubmitting(true);
    try {
        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            payload.append(key, String(value));
        });
        if (bannerFile) {
            payload.append("banner", bannerFile);
        }

        // apiFormFetch auto-injects the Bearer token and lets the browser
        // set Content-Type: multipart/form-data with the correct boundary
        const res = await apiFormFetch("/create-templates", payload);

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        const json = await res.json();
        if (!json.success) {
            throw new Error(json.message || "Failed to create template");
        }

        setIsCreateOpen(false);
        setFormData(DEFAULT_FORM_DATA);
        setBannerFile(null);
        fetchTemplates();
    } catch (e: any) {
        alert(e.message || "Failed to create template");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
        const res = await apiFetch(`/admin/templates/${id}`, { method: "DELETE" });
        if (res.ok) {
            setTemplates(templates.filter((t) => t.id !== id));
        } else {
            alert("Failed to delete template");
        }
    } catch (e: any) {
        alert(e.message || "Error deleting template");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2 font-naston">
            <LayoutTemplate className="h-6 w-6 text-brand-red" />
            Templates
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Create and manage tournament templates for your events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search templates..."
              className="pl-9 bg-zinc-950/50 border-white/10 focus-visible:ring-brand-red/20 text-zinc-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-red hover:bg-brand-red/90 text-white font-medium shadow-lg shadow-brand-red/20 border-0">
                <Plus className="mr-2 h-4 w-4" /> Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-zinc-950 border-white/10 text-white scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-brand-red" />
                  New Tournament Template
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Fill in the details below to create a reusable template.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4 mt-2">
                
                {/* General Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">General Info</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2 sm:col-span-2">
                            <label htmlFor="name" className="text-sm font-medium text-zinc-300">Template Name *</label>
                            <Input id="name" name="name" placeholder="e.g. Epic Weekly Scrimmage" value={formData.name} onChange={handleInputChange} className="bg-zinc-900/50 border-white/10 focus-visible:ring-brand-red/20 text-zinc-200" />
                        </div>
                        <div className="grid gap-2 sm:col-span-2">
                            <label htmlFor="description" className="text-sm font-medium text-zinc-300">Description</label>
                            <Textarea id="description" name="description" placeholder="A high-stakes weekly tournament..." value={formData.description} onChange={handleInputChange} className="bg-zinc-900/50 border-white/10 focus-visible:ring-brand-red/20 text-zinc-200 min-h-[80px]" />
                        </div>
                        <div className="grid gap-2 sm:col-span-2">
                            <label htmlFor="banner" className="text-sm font-medium text-zinc-300">Banner Image (Max 5MB)</label>
                            <div className="flex items-center gap-3">
                                <Button type="button" variant="outline" className="border-white/10 bg-zinc-900/50 text-zinc-300 hover:bg-white/5 relative overflow-hidden">
                                    <Upload className="h-4 w-4 mr-2 text-zinc-500" />
                                    {bannerFile ? "Change Image" : "Upload Banner"}
                                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </Button>
                                {bannerFile && <span className="text-xs text-brand-red truncate max-w-[200px]">{bannerFile.name}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Game Settings */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Game Settings</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <label htmlFor="gameId" className="text-sm font-medium text-zinc-300">Game ID *</label>
                            <Input id="gameId" name="gameId" placeholder="e.g. b3f2c5d1-..." value={formData.gameId} onChange={handleInputChange} className="bg-zinc-900/50 border-white/10 focus-visible:ring-brand-red/20 text-zinc-200" />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="gameMapName" className="text-sm font-medium text-zinc-300">Map Name</label>
                            <Input id="gameMapName" name="gameMapName" placeholder="e.g. Erangel" value={formData.gameMapName} onChange={handleInputChange} className="bg-zinc-900/50 border-white/10 focus-visible:ring-brand-red/20 text-zinc-200" />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="matchType" className="text-sm font-medium text-zinc-300">Match Type</label>
                            <select id="matchType" name="matchType" value={formData.matchType} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-white/10 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/20">
                                <option value="battle_royale">Battle Royale</option>
                                <option value="multiplayer">Multiplayer</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="format" className="text-sm font-medium text-zinc-300">Format</label>
                            <select id="format" name="format" value={formData.format} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-white/10 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/20">
                                <option value="knockout">Knockout</option>
                                <option value="single_elimination">Single Elimination</option>
                                <option value="single_match">Single Match</option>
                                <option value="best_of_three">Best of Three</option>
                                <option value="best_of_six">Best of Six</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Team & Entry */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Team & Entry Fees</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <label htmlFor="type" className="text-sm font-medium text-zinc-300">Team Type</label>
                            <select id="type" name="type" value={formData.type} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-white/10 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/20">
                                <option value="solo">Solo</option>
                                <option value="duo">Duo</option>
                                <option value="squad">Squad</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="teamSize" className="text-sm font-medium text-zinc-300">Team Size</label>
                            <Input id="teamSize" name="teamSize" type="number" min="1" value={formData.teamSize} onChange={handleInputChange} className="bg-zinc-900/50 border-white/10 focus-visible:ring-brand-red/20 text-zinc-200" />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="maxTeams" className="text-sm font-medium text-zinc-300">Max Teams</label>
                            <Input id="maxTeams" name="maxTeams" type="number" min="2" value={formData.maxTeams} onChange={handleInputChange} className="bg-zinc-900/50 border-white/10 focus-visible:ring-brand-red/20 text-zinc-200" />
                        </div>
                        
                        <div className="grid gap-2">
                            <label htmlFor="entryFeeAndroidTeam" className="text-sm font-medium text-zinc-300">Entry Fee (Android)</label>
                            <Input id="entryFeeAndroidTeam" name="entryFeeAndroidTeam" type="number" min="0" value={formData.entryFeeAndroidTeam} onChange={handleInputChange} className="bg-zinc-900/50 border-white/10 focus-visible:ring-brand-red/20 text-zinc-200" />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="entryFeeIosTeam" className="text-sm font-medium text-zinc-300">Entry Fee (iOS)</label>
                            <Input id="entryFeeIosTeam" name="entryFeeIosTeam" type="number" min="0" value={formData.entryFeeIosTeam} onChange={handleInputChange} className="bg-zinc-900/50 border-white/10 focus-visible:ring-brand-red/20 text-zinc-200" />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="prizePool" className="text-sm font-medium text-zinc-300">Prize Pool</label>
                            <Input id="prizePool" name="prizePool" type="number" min="0" value={formData.prizePool} onChange={handleInputChange} className="bg-zinc-900/50 border-white/10 focus-visible:ring-brand-red/20 text-zinc-200" />
                        </div>
                        <div className="grid gap-2 sm:col-span-3">
                            <label htmlFor="elo" className="text-sm font-medium text-zinc-300">Required ELO</label>
                            <Input id="elo" name="elo" type="number" min="0" value={formData.elo} onChange={handleInputChange} className="bg-zinc-900/50 border-white/10 focus-visible:ring-brand-red/20 text-zinc-200" />
                        </div>
                    </div>
                </div>

              </div>
              <DialogFooter className="sticky bottom-0 bg-zinc-950 pt-4 pb-2 border-t border-white/5 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTemplate}
                  disabled={!formData.name.trim() || !formData.gameId.trim() || isSubmitting}
                  className="bg-brand-red hover:bg-brand-red/90 text-white disabled:opacity-50"
                >
                  {isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                  ) : "Create Template"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content Container */}
      <div className="rounded-xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm overflow-hidden flex-1 relative flex flex-col">
        {/* Loading overlay */}
        {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm rounded-xl">
                <Loader2 className="h-7 w-7 animate-spin text-brand-red" />
            </div>
        )}

        {/* Error state */}
        {error && !loading && (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 py-20 text-zinc-500">
                <AlertCircle className="h-8 w-8 text-red-500/70" />
                <p className="text-sm">{error}</p>
                <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10 text-zinc-400 hover:bg-white/5"
                    onClick={fetchTemplates}
                >
                    Retry
                </Button>
            </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredTemplates.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 py-20 text-zinc-500">
            <FileText className="h-12 w-12 opacity-20 mb-2" />
            <p className="text-lg font-medium text-zinc-400">
              No templates found
            </p>
            <p className="text-sm">
              Try adjusting your search or create a new template.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-white/10 text-zinc-300 hover:bg-white/5"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Create First Template
            </Button>
          </div>
        )}

        {/* Table */}
        {!error && filteredTemplates.length > 0 && (
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-zinc-950/80 text-zinc-500 sticky top-0 z-10 backdrop-blur-md font-suisse">
                <tr>
                  <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[250px]">
                    Template Details
                  </th>
                  <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[180px]">
                    Game
                  </th>
                  <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[120px]">
                    Format
                  </th>
                  <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[120px]">
                    Prize Pool
                  </th>
                  <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[100px]">
                    Type
                  </th>
                  <th className="px-6 py-4 font-medium border-b border-white/5 min-w-[140px]">
                    Created
                  </th>
                  {/* <th className="px-6 py-4 font-medium border-b border-white/5 text-right">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTemplates.map((template) => (
                  <tr
                    key={template.id}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-200 text-base">
                          {template.name}
                        </span>
                        <span className="text-zinc-500 text-xs mt-1 max-w-xs truncate" title={template.description}>
                          {template.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md bg-zinc-800 flex items-center justify-center border border-white/10 shrink-0">
                            {template.bannerUrl ? (
                                <img src={template.bannerUrl} alt="banner" className="h-full w-full object-cover rounded-md opacity-80" />
                            ) : (
                                <Gamepad2 className="h-4 w-4 text-zinc-400" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-zinc-300 font-medium text-xs">{template.game?.name || "Unknown Game"}</span>
                            <span className="text-zinc-500 text-xs">{template.gameMapName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                          <span className="text-zinc-300 capitalize text-xs flex items-center gap-1.5">
                              <Trophy className="h-3 w-3 text-brand-red" />
                              {template.format?.replace(/_/g, " ")}
                          </span>
                          <span className="text-zinc-500 text-xs flex items-center gap-1.5">
                              <Users className="h-3 w-3" />
                              {template.teamSize}v{template.teamSize} • Max {template.maxTeams}
                          </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-emerald-400 font-medium font-suisse text-sm">
                        ₹{template.prizePool?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800/50 text-zinc-300 border border-white/5 capitalize">
                        {template.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-zinc-400 font-suisse text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                        {new Date(template.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        })}
                      </div>
                    </td>
                    {/* <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-white/10 hover:text-white text-zinc-400"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-red-500/20 hover:text-red-400 text-zinc-400"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredTemplates.length > 0 && !loading && !error && (
        <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
          <div>
            Showing{" "}
            <span className="text-zinc-300 font-medium">
              {filteredTemplates.length}
            </span>{" "}
            templates
          </div>
        </div>
      )}
    </div>
  );
}
