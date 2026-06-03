"use client";

import { useState } from "react";
import { X, Mail, Check } from "lucide-react";

const ROLES = [
  { id: "member",  label: "Member",       desc: "View only access" },
  { id: "admin",   label: "Admin",         desc: "Full access to all features" },
  { id: "support", label: "Support Team",  desc: "Manage disputes & player issues" },
];

interface GiveAccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function GiveAccessModal({ open, onClose }: GiveAccessModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const handleSend = () => {
    if (!email.trim()) return;
    // TODO: POST /api/admin/invite  { email, role }
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setEmail("");
      setRole("member");
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4 bg-zinc-900 border border-white/8 rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h4 className="text-white font-bold text-base">Give Access</h4>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="text-xs text-zinc-400 font-medium mb-1.5 block">
            Email address
          </label>
          <div className="flex items-center gap-2 bg-zinc-800 border border-white/6 rounded-lg px-3 py-2.5">
            <Mail className="h-4 w-4 text-zinc-500 flex-shrink-0" />
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-sm text-white placeholder-zinc-600 outline-none w-full"
            />
          </div>
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="text-xs text-zinc-400 font-medium mb-2 block">Role</label>
          <div className="space-y-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-colors ${
                  role === r.id
                    ? "border-brand-red/50 bg-brand-red/8 text-white"
                    : "border-white/5 bg-zinc-800/50 text-zinc-400 hover:border-white/10"
                }`}
              >
                <div>
                  <p className="text-sm font-medium leading-none mb-0.5">{r.label}</p>
                  <p className="text-xs text-zinc-500">{r.desc}</p>
                </div>
                <div className={`h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                  role === r.id ? "border-brand-red bg-brand-red" : "border-zinc-600"
                }`}>
                  {role === r.id && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!email.trim() || sent}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
            sent
              ? "bg-green-600 text-white"
              : "bg-brand-red hover:bg-red-700 text-white disabled:opacity-40 disabled:cursor-not-allowed"
          }`}
        >
          {sent ? "✓ Invite Sent" : "Send Invite"}
        </button>
      </div>
    </div>
  );
}