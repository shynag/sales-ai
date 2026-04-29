"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Palette,
  Terminal,
  BookOpen,
  ExternalLink,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExportHtmlButtonProps {
  markdown: string;
  productName: string;
}

type ThemeType = "modern" | "dark" | "classic";

export function ExportHtmlButton({
  markdown,
  productName,
}: ExportHtmlButtonProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeType>("modern");
  const [isOpen, setIsOpen] = useState(false);
  const [showIframe, setShowIframe] = useState(false);

  // EVENT HANDLER: Handle state synchronizations directly via user actions
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setShowIframe(false); // Reset synchronously via event handler, NOT via effect
    }
  };

  // EFFECT: Exclusively for asynchronous operations (Timeout)
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowIframe(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const generateHTMLTemplate = (theme: ThemeType) => {
    const themeConfig = {
      modern: {
        body: "bg-gray-50 text-gray-900 font-sans",
        prose:
          "prose prose-lg prose-blue md:prose-xl bg-white p-6 sm:p-12 lg:p-16 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100",
      },
      dark: {
        body: "bg-zinc-950 text-gray-100 font-mono",
        prose:
          "prose prose-invert prose-lg md:prose-xl bg-zinc-900/50 p-6 sm:p-12 lg:p-16 rounded-xl border border-zinc-800",
      },
      classic: {
        body: "bg-[#fdfbf7] text-stone-900 font-serif",
        prose:
          "prose prose-stone prose-lg md:prose-xl bg-transparent p-6 sm:p-12 lg:p-16",
      },
    };

    const config = themeConfig[theme];

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName} - Sales Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background-color: rgba(150, 150, 150, 0.3); border-radius: 10px; }
    </style>
</head>
<body class="antialiased min-h-screen flex justify-center py-6 sm:py-8 px-4 sm:px-6 lg:px-8 ${config.body}">
    <article id="content" class="w-full max-w-4xl ${config.prose} transition-all duration-300">
    </article>
    <script>
        const rawMarkdown = ${JSON.stringify(markdown)};
        document.getElementById('content').innerHTML = marked.parse(rawMarkdown);
    </script>
</body>
</html>
    `.trim();
  };

  const handleDownload = () => {
    const htmlContent = generateHTMLTemplate(activeTheme);
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${productName.toLowerCase().replace(/\s+/g, "-")}-${activeTheme}-page.html`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs font-medium bg-background hover:bg-muted/50 border-border/60 transition-colors"
        >
          <ExternalLink className="size-3 mr-1.5" />
          Export
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] sm:w-[90vw] max-w-5xl h-[90vh] md:h-[85vh] flex flex-col p-0 overflow-hidden bg-background border-border/40 gap-0 rounded-xl sm:rounded-2xl shadow-2xl">
        <DialogHeader className="px-4 py-4 md:px-6 md:py-5 border-b border-border/40 flex-none space-y-4 text-left">
          <div className="space-y-1.5 text-left">
            <DialogTitle className="text-base md:text-lg font-semibold tracking-tight">
              Export Setup
            </DialogTitle>
            <p className="text-xs md:text-sm text-muted-foreground">
              Preview and select a theme before downloading the standalone HTML.
            </p>
          </div>

          <Tabs
            value={activeTheme}
            onValueChange={(val) => setActiveTheme(val as ThemeType)}
            className="w-full sm:w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-3 h-9 sm:h-10 bg-muted/50 border border-border/50">
              <TabsTrigger
                value="modern"
                className="text-[10px] sm:text-[11px] data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Modern
              </TabsTrigger>
              <TabsTrigger
                value="dark"
                className="text-[10px] sm:text-[11px] data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Terminal
              </TabsTrigger>
              <TabsTrigger
                value="classic"
                className="text-[10px] sm:text-[11px] data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Classic
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>

        <div className="flex-1 bg-muted/20 relative p-3 sm:p-4 lg:p-6 overflow-hidden">
          {!showIframe ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="size-5 animate-spin mb-3 text-primary/70" />
              <span className="text-[10px] font-medium tracking-widest uppercase">
                Loading Preview...
              </span>
            </div>
          ) : (
            <div className="w-full h-full rounded-md sm:rounded-lg border border-border/40 shadow-sm overflow-hidden bg-background">
              <iframe
                srcDoc={generateHTMLTemplate(activeTheme)}
                title="HTML Live Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts"
              />
            </div>
          )}
        </div>

        <div className="px-4 py-3 md:px-6 md:py-4 border-t border-border/40 flex-none flex justify-end bg-background">
          <Button
            onClick={handleDownload}
            className="w-full sm:w-auto h-9 sm:h-10 px-6 transition-all"
          >
            <Download className="size-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
