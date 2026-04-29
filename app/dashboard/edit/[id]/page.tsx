import { createClient } from "@/lib/supabase";
import Link from "next/link";
import EditForm from "./EditForm";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// 1. Ubah tipe Params menjadi Promise (Standar Next.js 15)
type Params = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPage(props: Params) {
  // 2. Ekstrak (await) id dari params sebelum digunakan
  const { id } = await props.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const { default: getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();

  // 3. Masukkan id yang sudah berupa string ke dalam Prisma
  const page = await prisma.salesPage.findFirst({
    where: {
      id: id, // Sekarang ini pasti string yang benar, bukan undefined
      userId: user.id,
    },
  });

  if (!page) return redirect("/dashboard/saved");

  const initialData = {
    id: page.id,
    productName: page.productName,
    targetAudience: page.targetAudience,
    generatedOutput: page.generatedOutput,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Command Bar */}
      <header className="h-12 md:h-14 flex-none border-b border-border/40 flex items-center px-4 md:px-6 bg-background">
        <Link href="/dashboard/saved" className="mr-3 md:mr-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-4 mr-1" />
            Back
          </Button>
        </Link>

        <div className="text-xs md:text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <span className="hidden sm:inline">Workspace</span>
          <span className="hidden sm:inline text-border">/</span>
          <span className="hidden sm:inline">Saved Pages</span>
          <span className="hidden sm:inline text-border">/</span>
          <span
            className="text-foreground truncate max-w-[200px] md:max-w-[300px]"
            title={page.productName}
          >
            {page.productName}
          </span>
        </div>
      </header>

      <EditForm initial={initialData} />
    </div>
  );
}
