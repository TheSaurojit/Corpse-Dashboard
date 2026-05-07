import Image from "next/image";
import Link from "next/link";

export function SidebarBrand() {
    return (
        <div className="flex h-16 items-center px-6">
            <Link href="/" className="flex items-center gap-3 font-semibold hover:opacity-90 transition-opacity">
                <div className="flex items-center justify-center">
                    <Image src="/logo.svg" alt="Corpse Logo" width={32} height={32} className="h-8 w-8" />
                </div>
                <span className="text-xl tracking-tight text-white font-naston">
                    Corpse
                </span>
            </Link>
            <div className="ml-auto">
                <button className="text-zinc-400 hover:text-white transition-colors">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-panel-left"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M9 3v18" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
