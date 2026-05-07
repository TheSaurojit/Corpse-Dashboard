"use client";

import { Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Navbar() {
    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-zinc-950/70 px-6 backdrop-blur-md transition-all">
            {/* Gradient Spotlight Effect - properly positioned to bleed onto page */}
            <div className="absolute inset-x-0 -top-20 h-[200px] pointer-events-none flex justify-center overflow-visible z-0">
                <div className="w-[1000px] h-[300px] bg-brand-red/10 blur-[120px] rounded-[100%] mix-blend-screen" />
            </div>

            <div className="flex items-center gap-4 relative z-10">
                <SidebarTrigger className="md:hidden" />
                <div className="relative group">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-[200px] md:w-[300px] pl-9 bg-zinc-900/50 border-white/5 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-brand-red/20 focus-visible:border-brand-red/30 transition-all rounded-md"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none select-none">
                        <kbd className="inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-zinc-900 px-1.5 font-mono text-[10px] font-medium text-zinc-500 opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 relative z-10">
                <Button
                    variant="ghost"
                    className="text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </Button>
            </div>
        </header>
    );
}
