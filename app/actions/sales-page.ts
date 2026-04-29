"use server";
import { createClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveSalesPage(formData: {
  id?: string;
  productName: string;
  targetAudience: string;
  generatedOutput: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");
  // Import prisma dynamically so this module can be imported safely from client-side
  // code (for example when importing server actions from a client component). This
  // prevents Prisma from being bundled into the browser where it cannot run.
  const { default: getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();

  if (formData.id) {
    // Logic untuk UPDATE (Edit)
    await prisma.salesPage.update({
      where: { id: formData.id, userId: user.id },
      data: {
        productName: formData.productName,
        targetAudience: formData.targetAudience,
        generatedOutput: formData.generatedOutput,
      },
    });
  } else {
    // Logic untuk CREATE baru
    await prisma.salesPage.create({
      data: {
        userId: user.id,
        productName: formData.productName,
        targetAudience: formData.targetAudience,
        generatedOutput: formData.generatedOutput,
      },
    });
  }

  // Refresh cache agar data terbaru muncul di halaman list
  revalidatePath("/dashboard/saved");
  redirect("/dashboard/saved");
}

export async function deleteSalesPage(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Import prisma dynamically to avoid bundling it into client-side code.
  const { default: getPrisma } = await import("@/lib/prisma");
  const prisma = getPrisma();

  await prisma.salesPage.delete({
    where: { id, userId: user.id },
  });

  revalidatePath("/dashboard/saved");
}
