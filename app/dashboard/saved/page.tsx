import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteSalesPage } from "@/app/actions/sales-page";
import { ExportHtmlButton } from "@/components/export-html-button";
import { FileText, Trash2, Edit2, Calendar, Plus } from "lucide-react";

type SalesPageLocal = {
  id: string;
  userId: string;
  productName: string;
  targetAudience: string;
  generatedOutput: string;
  createdAt: Date;
  updatedAt: Date;
};

export default async function SavedPages() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // GUARD CLAUSE: Mencegah Prisma Error 500 jika user session null
  if (!user) {
    redirect("/login");
  }

  const { default: getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();

  const pages: SalesPageLocal[] = await prisma.salesPage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col h-full overflow-hidden w-full">
      {/* Top Command Bar */}
      <header className="h-12 md:h-14 flex-none border-b border-border/40 flex items-center justify-between px-4 md:px-6 bg-background">
        <div className="text-xs md:text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <span className="hidden sm:inline">Workspace</span>
          <span className="hidden sm:inline text-border">/</span>
          <span className="text-foreground">Saved Pages</span>
        </div>

        <Link href="/dashboard">
          <Button size="sm" className="h-8 px-3 group">
            <Plus className="size-3.5 md:size-4 mr-1.5" />
            New Document
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/5 w-full">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
            Document Library
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and export your generated sales copies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 w-full">
          {pages.map((page) => {
            // OPTIMASI: bind Server Action untuk mencegah memory leak
            const deleteAction = deleteSalesPage.bind(null, page.id);

            return (
              <div
                key={page.id}
                className="group relative flex flex-col justify-between p-5 rounded-lg border border-border/40 bg-background/50 hover:bg-muted/30 transition-all duration-200"
              >
                {/* Ultra-Minimalist Content Section */}
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 text-foreground w-full">
                      <FileText className="size-4 text-primary/70 flex-none" />
                      <h3
                        className="font-semibold text-sm truncate"
                        title={page.productName}
                      >
                        {page.productName}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <div className="flex items-center text-[11px] md:text-xs text-muted-foreground">
                      <Calendar className="size-3.5 mr-2 opacity-70" />
                      <span>
                        {new Intl.DateTimeFormat("en-US", {
                          dateStyle: "medium",
                        }).format(page.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Bar */}
                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border/40">
                  <div className="flex flex-1 items-center gap-2">
                    <Link
                      href={`/dashboard/edit/${page.id}`}
                      className="flex-1"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full h-8 text-xs font-medium bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <Edit2 className="size-3 mr-1.5" />
                        Edit
                      </Button>
                    </Link>

                    <div className="flex-1">
                      <ExportHtmlButton
                        markdown={page.generatedOutput}
                        productName={page.productName}
                      />
                    </div>
                  </div>

                  {/* Delete Action ter-bind */}
                  <form action={deleteAction} className="flex-none">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {pages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border/60 rounded-xl bg-background/30 mt-4">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="size-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              No pages generated
            </h3>
            <p className="text-xs text-muted-foreground mt-1 mb-6 max-w-sm">
              You haven&apos;t created any sales pages yet. Head over to the
              generator to create your first high-converting copy.
            </p>
            <Link href="/dashboard">
              <Button size="sm" className="h-8">
                <Plus className="size-3.5 mr-1.5" />
                Generate Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
