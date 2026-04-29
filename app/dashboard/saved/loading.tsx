import { FileText, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SavedPagesLoading() {
  return (
    <div className="flex flex-col h-full overflow-hidden w-full">
      {/* Top Command Bar (Dibuat statis agar tidak berkedip saat transisi) */}
      <header className="h-12 md:h-14 flex-none border-b border-border/40 flex items-center justify-between px-4 md:px-6 bg-background w-full">
        <div className="text-xs md:text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <span className="hidden sm:inline">Workspace</span>
          <span className="hidden sm:inline text-border">/</span>
          <span className="text-foreground">Saved Pages</span>
        </div>

        <Button size="sm" className="h-8 px-3 group" disabled>
          <Plus className="size-3.5 md:size-4 mr-1.5 opacity-50" />
          <span className="opacity-50">New Document</span>
        </Button>
      </header>

      {/* Main Content Skeleton */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/5 w-full">
        {/* Header Title Skeleton */}
        <div className="mb-6 md:mb-8 space-y-2">
          <div className="h-7 md:h-8 w-48 bg-muted animate-pulse rounded-md"></div>
          <div className="h-4 w-64 bg-muted/60 animate-pulse rounded-md"></div>
        </div>

        {/* Grid Cards Skeleton (Render 6 kotak kosong) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 w-full">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between p-5 rounded-lg border border-border/40 bg-background/50 h-[170px]"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 w-full">
                    <div className="p-1.5 bg-muted/50 rounded animate-pulse">
                      <FileText className="size-4 text-muted-foreground/30" />
                    </div>
                    {/* Title placeholder */}
                    <div className="h-5 w-3/4 bg-muted animate-pulse rounded"></div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center">
                    <Calendar className="size-3.5 mr-2 text-muted-foreground/30" />
                    {/* Date placeholder */}
                    <div className="h-3 w-24 bg-muted/60 animate-pulse rounded"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar Skeleton */}
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border/40">
                <div className="flex flex-1 items-center gap-2">
                  <div className="h-8 flex-1 bg-muted/50 animate-pulse rounded-md"></div>
                  <div className="h-8 flex-1 bg-muted/50 animate-pulse rounded-md"></div>
                </div>
                <div className="h-8 w-8 bg-muted/30 animate-pulse rounded-md flex-none"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
