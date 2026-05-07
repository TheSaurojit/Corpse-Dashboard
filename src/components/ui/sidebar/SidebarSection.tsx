"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface SidebarSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export function SidebarSection({ title, children, defaultOpen = true }: SidebarSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
                <span>{title}</span>
                {isOpen ? (
                    <ChevronDown className="h-4 w-4 opacity-50" />
                ) : (
                    <ChevronRight className="h-4 w-4 opacity-50" />
                )}
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="mt-1 flex flex-col gap-0.5 px-2">
                    {children}
                </div>
            </div>
        </div>
    );
}
