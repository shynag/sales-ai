"use client";

import { useCompletion } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { saveSalesPage } from "@/app/actions/sales-page";

export default function DashboardPage() {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    features: "",
    audience: "",
    price: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/generate",
    streamProtocol: "text",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    await complete(formData.productName, {
      body: {
        description: formData.description,
        features: formData.features,
        audience: formData.audience,
        price: formData.price,
      },
    });
  };

  const handleSave = async () => {
    if (!completion) return;

    setIsSaving(true);
    try {
      await saveSalesPage({
        productName: formData.productName,
        targetAudience: formData.audience,
        generatedOutput: completion,
      });
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Command Bar */}
      <header className="h-12 md:h-14 flex-none border-b border-border/40 flex items-center justify-between px-4 md:px-6 bg-background">
        <div className="text-xs md:text-sm font-medium flex items-center gap-2 text-muted-foreground">
          <span className="hidden sm:inline">Workspace</span>
          <span className="hidden sm:inline text-border">/</span>
          <span className="text-foreground">New Document</span>
        </div>

        <Button
          size="sm"
          onClick={handleSave}
          disabled={!completion || isLoading || isSaving}
          className="h-8 px-3 group"
        >
          <Save className="size-3.5 md:size-4 mr-1.5 text-primary-foreground/70 group-hover:text-primary-foreground transition-colors" />
          {isSaving ? "Saving..." : "Save Page"}
        </Button>
      </header>

      {/* Split Pane Area: 
          - Mobile: flex-col, global scroll (overflow-y-auto)
          - Desktop: grid 2 kolom, mati scroll global (lg:overflow-hidden) 
      */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 min-h-0 overflow-y-auto lg:overflow-hidden">
        {/* PANEL KIRI: Form Parameters */}
        {/* - Mobile: flex-none agar form punya tinggi utuh
            - Desktop: lg:overflow-y-auto agar punya scroll internal
        */}
        <div className="border-b lg:border-b-0 lg:border-r border-border/40 p-4 md:p-6 lg:p-8 bg-muted/5 flex-none lg:overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-sm md:text-base font-semibold text-foreground tracking-tight">
              Parameters
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Configure your product context for the AI model.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 md:space-y-5">
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
                required
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="e.g. Obsidian Mastery Course"
                className="h-9 md:h-10 bg-background/50 border-border/60 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-[11px] md:text-xs font-semibold text-foreground/80"
              >
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What exactly are you selling?"
                className="min-h-[80px] md:min-h-[100px] resize-y bg-background/50 border-border/60 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="features"
                className="text-[11px] md:text-xs font-semibold text-foreground/80"
              >
                Key Features
              </Label>
              <Input
                id="features"
                name="features"
                required
                value={formData.features}
                onChange={handleInputChange}
                placeholder="Comma separated (e.g. Fast, Local, Secure)"
                className="h-9 md:h-10 bg-background/50 border-border/60 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="audience"
                  className="text-[11px] md:text-xs font-semibold text-foreground/80"
                >
                  Audience
                </Label>
                <Input
                  id="audience"
                  name="audience"
                  required
                  value={formData.audience}
                  onChange={handleInputChange}
                  placeholder="e.g. Developers"
                  className="h-9 md:h-10 bg-background/50 border-border/60 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-[11px] md:text-xs font-semibold text-foreground/80"
                >
                  Price
                </Label>
                <Input
                  id="price"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g. $49"
                  className="h-9 md:h-10 bg-background/50 border-border/60 text-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2 h-9 md:h-10"
              disabled={isLoading || isSaving}
            >
              {isLoading ? (
                "Generating Magic..."
              ) : (
                <>
                  <Wand2 className="size-3.5 md:size-4 mr-2" />
                  Generate Markdown
                </>
              )}
            </Button>
          </form>
        </div>

        {/* PANEL KANAN: Live Preview */}
        {/* - Mobile: min-h-[500px] agar ada ruang kosong luas buat scroll ke bawah setelah generate
            - Desktop: lg:overflow-y-auto lg:min-h-0 agar scroll internal aktif
        */}
        <div className="bg-background relative flex flex-col min-h-[500px] lg:min-h-0 lg:overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center px-4 md:px-8 py-3 bg-background/95 backdrop-blur border-b border-border/40">
            <span className="text-[10px] md:text-xs font-medium text-muted-foreground tracking-widest uppercase">
              Output Preview
            </span>
          </div>

          <div className="p-4 md:p-6 lg:p-8 flex-1">
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50">
              {/* Typing-style preview: progressively reveal streamed completion */}
              {isLoading || completion ? (
                <TypingMarkdown
                  text={completion ?? ""}
                  isStreaming={isLoading}
                />
              ) : (
                <div className="h-full min-h-[300px] flex items-center justify-center text-center">
                  <p className="text-xs md:text-sm text-muted-foreground italic max-w-sm px-4">
                    No output yet. Fill in the parameters and generate your
                    sales copy.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Client-side typing renderer that progressively reveals `text` as it arrives.
function TypingMarkdown({
  text,
  isStreaming,
}: {
  text: string;
  isStreaming: boolean;
}) {
  const [display, setDisplay] = useState("");
  const targetRef = useRef(text);

  // ms per character (typing speed). Lower = faster.
  const msPerChar = 18;

  // Update target when `text` changes
  useEffect(() => {
    targetRef.current = text ?? "";
  }, [text]);

  // Typing loop
  useEffect(() => {
    let mounted = true;
    const id = setInterval(() => {
      if (!mounted) return;
      setDisplay((prev) => {
        const target = targetRef.current || "";
        if (prev.length < target.length) {
          return target.slice(0, prev.length + 1);
        }
        // If streaming has finished and fully displayed, stop interval by returning same value
        return prev;
      });
    }, msPerChar);

    return () => {
      mounted = false;
      clearInterval(id);
    };
    // We intentionally include isStreaming to keep the interval running while streaming
  }, [isStreaming]);

  // If the incoming text is shorter (e.g., reset), reflect it immediately
  useEffect(() => {
    if (text.length < display.length) {
      // Schedule the update to avoid synchronous setState in effect body
      const id = setTimeout(() => setDisplay(text), 0);
      return () => clearTimeout(id);
    }
    // If text equals display (fully synced) and not streaming, keep as is
  }, [text, display.length]);

  // Simple blinking cursor
  const cursor = isStreaming ? "\u258C" : ""; // ▌

  return (
    <div className="w-full max-w-2xl mt-4">
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
        <ReactMarkdown>{display + cursor}</ReactMarkdown>
      </div>
    </div>
  );
}
