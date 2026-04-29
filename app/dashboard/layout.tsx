"use client"; // Wajib ditambahkan karena kita menggunakan hook yang berjalan di sisi browser

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";
import { Sparkles, PenSquare, Library, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mengambil URL yang sedang aktif saat ini
  const pathname = usePathname();

  // Logic untuk menentukan tab mana yang aktif
  const isGeneratorActive = pathname === "/dashboard";
  // Memakai startsWith agar tab tetap menyala meskipun user sedang berada di halaman edit (misal: /dashboard/saved atau /dashboard/edit/123)
  const isSavedActive =
    pathname.startsWith("/dashboard/saved") ||
    pathname.startsWith("/dashboard/edit");

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground overflow-hidden font-sans antialiased">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 flex-none border-b md:border-b-0 md:border-r border-border/40 bg-muted/10 flex flex-col z-20">
        <div className="h-14 flex flex-none items-center justify-between md:justify-start px-5 border-b border-border/40">
          <div className="flex items-center">
            <Sparkles className="size-4 text-primary mr-2" />
            <span className="font-semibold text-sm tracking-tight">
              SalesAI
            </span>
          </div>

          <div className="md:hidden">
            <form action={logout}>
              <Button
                variant="ghost"
                size="sm"
                type="submit"
                className="h-8 px-2 text-muted-foreground"
              >
                <LogOut className="size-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-row md:flex-col flex-none md:flex-1 p-2 md:p-3 gap-1 md:gap-2 overflow-x-auto md:overflow-visible border-b border-border/40 md:border-none no-scrollbar">
          <Link
            href="/dashboard"
            // TAMBAHAN: flex-1 md:flex-none justify-center md:justify-start
            className={`flex flex-1 md:flex-none items-center justify-center md:justify-start whitespace-nowrap px-3 py-2 text-xs md:text-sm font-medium rounded-md transition-colors ${
              isGeneratorActive
                ? "bg-muted/50 text-foreground" // Class aktif
                : "text-muted-foreground hover:bg-muted/30 hover:text-foreground" // Class tidak aktif
            }`}
          >
            <PenSquare
              className={`size-3.5 md:size-4 mr-2 md:mr-3 ${isGeneratorActive ? "text-foreground" : "text-muted-foreground"}`}
            />
            Generator
          </Link>

          <Link
            href="/dashboard/saved"
            // TAMBAHAN: flex-1 md:flex-none justify-center md:justify-start
            className={`flex flex-1 md:flex-none items-center justify-center md:justify-start whitespace-nowrap px-3 py-2 text-xs md:text-sm font-medium rounded-md transition-colors ${
              isSavedActive
                ? "bg-muted/50 text-foreground" // Class aktif
                : "text-muted-foreground hover:bg-muted/30 hover:text-foreground" // Class tidak aktif
            }`}
          >
            <Library
              className={`size-3.5 md:size-4 mr-2 md:mr-3 ${isSavedActive ? "text-foreground" : "text-muted-foreground"}`}
            />
            Library
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:block p-3 border-t border-border/40">
          <form action={logout}>
            <Button
              variant="ghost"
              type="submit"
              className="w-full justify-start text-muted-foreground hover:text-foreground h-9 px-3"
            >
              <LogOut className="size-4 mr-3" />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
        {children}
      </main>
    </div>
  );
}
