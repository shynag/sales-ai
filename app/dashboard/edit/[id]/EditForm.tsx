"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveSalesPage, deleteSalesPage } from "@/app/actions/sales-page";
import { useRouter } from "next/navigation";
import { Save, Trash2, FileEdit } from "lucide-react";

type Props = {
  initial: {
    id: string;
    productName: string;
    targetAudience: string;
    generatedOutput: string;
  };
};

export default function EditForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    productName: initial.productName || "",
    targetAudience: initial.targetAudience || "", // Tetap disimpan di state agar backend tidak error saat update
    generatedOutput: initial.generatedOutput || "",
    id: initial.id,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSaving(true);
    try {
      await saveSalesPage({
        id: form.id,
        productName: form.productName,
        targetAudience: form.targetAudience, // Tetap dikirim ke database
        generatedOutput: form.generatedOutput,
      });
      router.push("/dashboard/saved");
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this document? This action cannot be undone.",
      )
    )
      return;
    setIsDeleting(true);
    try {
      await deleteSalesPage(form.id);
      router.push("/dashboard/saved");
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="flex-1 flex flex-col lg:grid lg:grid-cols-12 min-h-0 overflow-y-auto lg:overflow-hidden"
    >
      {/* PANEL KIRI: Metadata & Actions */}
      <div className="border-b lg:border-b-0 lg:border-r border-border/40 p-4 md:p-6 lg:p-8 bg-muted/5 flex-none lg:overflow-y-auto lg:col-span-4 xl:col-span-3">
        <div className="mb-6">
          <h2 className="text-sm md:text-base font-semibold text-foreground tracking-tight flex items-center">
            <FileEdit className="size-4 mr-2 text-primary/70" />
            Document Settings
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Update the metadata or delete this page entirely.
          </p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Input yang tersisa hanya Product Name */}
          <div className="space-y-2">
            <Label
              htmlFor="productName"
              className="text-[11px] md:text-xs font-semibold text-foreground/80"
            >
              Product Name
            </Label>
            <Input
              id="productName"
              name="productName"
              value={form.productName}
              onChange={onChange}
              required
              className="h-9 md:h-10 bg-background/50 border-border/60 text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-border/40 space-y-3">
            <Button
              type="submit"
              className="w-full h-9 md:h-10 transition-all"
              disabled={isSaving || isDeleting}
            >
              <Save className="size-3.5 md:size-4 mr-2" />
              {isSaving ? "Saving changes..." : "Save Changes"}
            </Button>

            <Button
              variant="outline"
              onClick={handleDelete}
              type="button"
              disabled={isSaving || isDeleting}
              className="w-full h-9 md:h-10 text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/30 transition-all"
            >
              <Trash2 className="size-3.5 md:size-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete Document"}
            </Button>
          </div>
        </div>
      </div>

      {/* PANEL KANAN: Raw Markdown Editor */}
      <div className="bg-background relative flex flex-col min-h-[500px] lg:min-h-0 lg:col-span-8 xl:col-span-9">
        <div className="sticky top-0 z-10 flex items-center px-4 md:px-8 py-3 bg-background/95 backdrop-blur border-b border-border/40">
          <span className="text-[10px] md:text-xs font-medium text-muted-foreground tracking-widest uppercase">
            Markdown Source Editor
          </span>
        </div>

        <Textarea
          id="generatedOutput"
          name="generatedOutput"
          value={form.generatedOutput}
          onChange={onChange}
          className="flex-1 w-full resize-none rounded-none border-0 bg-transparent p-4 md:p-6 lg:p-8 text-sm md:text-base font-mono leading-relaxed focus-visible:ring-0 focus-visible:outline-none placeholder:text-muted-foreground/50"
          placeholder="Start typing your markdown content here..."
        />
      </div>
    </form>
  );
}
