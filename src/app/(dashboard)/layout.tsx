import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "Corpse Dashboard",
  description: "Admin dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#09090b] text-foreground antialiased selection:bg-brand-red/30 selection:text-brand-red/20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-[#09090b] to-[#09090b]">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 transition-all duration-300 relative flex flex-col w-full min-w-0 overflow-hidden">
            <Navbar />
            <div className="p-8">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
