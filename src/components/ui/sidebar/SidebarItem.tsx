"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
    href: string;
    children: React.ReactNode;
    active?: boolean;
}

// Simple utility if @/lib/utils is not present, otherwise I'd rely on it.
// Assuming user might not have cn utility, I'll inline a simple joiner or just use template literals if unsure.
// But standard nextjs projects usually have it. I'll check existence or just write a safe version.
// Checking file structure... I didn't see a lib folder in `list_dir src`.
// `src` had `app` and `components`. No `lib`.
// I will create a local utility or just use template strings.
function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
}

export function SidebarItem({ href, children, active: explicitActive }: SidebarItemProps) {
    // logic to determine active state if not explicitly passed
    // For now we'll trust the prop or simple exact match? 
    // The user might want visual testing, lets strict to props for flexibility in the "demo".

    return (
        <Link
            href={href}
            className={classNames(
                "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                explicitActive
                    ? "bg-brand-red/10 text-white"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
            )}
        >
            {explicitActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-[2px] rounded-r-full bg-brand-red" />
            )}
            {/* Adjust padding for the border line if needed, but absolute positioning is fine if container has padding */}
            <span className={classNames(explicitActive && "translate-x-1", "transition-transform duration-200")}>
                {children}
            </span>
        </Link>
    );
}
