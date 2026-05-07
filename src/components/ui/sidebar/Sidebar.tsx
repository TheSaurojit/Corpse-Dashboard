import { SidebarBrand } from "./SidebarBrand";
import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";

export function Sidebar() {
    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-800 bg-[#0c0c0c] text-zinc-300 shadow-xl overflow-y-auto hidden md:flex md:flex-col">
            <SidebarBrand />

            <div className="flex-1 px-4 py-6 space-y-6">
                <div>
                    <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Components
                    </h3>

                    <SidebarSection title="Basic" defaultOpen={true}>
                        <SidebarItem href="#" active>Buttons</SidebarItem>
                        <SidebarItem href="#">Loaders</SidebarItem>
                        <SidebarItem href="#">Modals</SidebarItem>
                        <SidebarItem href="#">Pagination</SidebarItem>
                        <SidebarItem href="#">Progress</SidebarItem>
                    </SidebarSection>

                    <SidebarSection title="Required" defaultOpen={false}>
                        <SidebarItem href="#">Footers</SidebarItem>
                        <SidebarItem href="#">Headers</SidebarItem>
                        <SidebarItem href="#">Logo Cloud</SidebarItem>
                    </SidebarSection>

                    <SidebarSection title="Mainsections" defaultOpen={true}>
                        <SidebarItem href="#">About</SidebarItem>
                        <SidebarItem href="#">Contact</SidebarItem>
                        <SidebarItem href="#">CTA</SidebarItem>
                        <SidebarItem href="#">FAQs</SidebarItem>
                        <SidebarItem href="#">Features</SidebarItem>
                        <SidebarItem href="#">Hero</SidebarItem>
                        <SidebarItem href="#">Pricing</SidebarItem>
                        <SidebarItem href="#">Team</SidebarItem>
                    </SidebarSection>
                </div>
            </div>
        </aside>
    );
}
