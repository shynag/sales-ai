import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, BrainCircuit } from "lucide-react";

export default function Home() {
  return (
    // Mengunci viewport layar penuh tanpa scroll
    <main className="relative h-screen w-full bg-background text-foreground overflow-hidden font-sans antialiased flex flex-col">
      {/* Header Minimalis */}
      <header className="flex-none w-full border-b border-border/40 bg-background/80 backdrop-blur-md z-50">
        <div className="container flex h-14 items-center justify-between px-6 max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center space-x-2 font-bold tracking-tight"
          >
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm md:text-base">SalesAI</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs md:text-sm"
              >
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="h-8 text-xs md:text-sm group">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Grid Layout: Stack di Mobile, 2 Kolom Kiri-Kanan di Desktop */}
      <div className="flex-1 container grid lg:grid-cols-2 gap-8 lg:gap-16 px-6 max-w-6xl mx-auto items-center pt-16 md:pt-20 lg:pt-0">
        {/* Kolom Kiri: Copywriting */}
        {/* Di mobile: rata tengah. Di desktop: rata kiri (lg:items-start, lg:text-left) */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left relative z-20 w-full max-w-xl mx-auto lg:mx-0">
          <div className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-[10px] md:text-xs font-medium text-muted-foreground mb-6 backdrop-blur-sm">
            <BrainCircuit className="mr-2 size-3 text-primary" />
            <span>Powered by Gemini Flash</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1]">
            Turn raw specs into sales copy.
          </h1>

          <p className="text-sm md:text-base text-muted-foreground mt-5 max-w-md">
            Stop staring at blank pages. Generate CRO-optimized markdown for
            your products in seconds.
          </p>

          <div className="flex items-center gap-4 mt-8">
            <Link href="/dashboard">
              <Button size="default" className="h-11 px-8 font-medium group">
                Start Generating
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Kolom Kanan: The Mockup */}
        <div className="relative w-full h-full flex items-end lg:items-center justify-center z-10 perspective-[1000px]">
          {/* Efek Bleed Dinamis:
            - Mobile: w-[120%] dan ditarik ke bawah (translate-y-[20%])
            - Desktop: w-[130%] dan ditarik ke kanan (lg:translate-y-0 lg:translate-x-[15%])
          */}
          <div className="w-[120%] lg:w-[130%] translate-y-[20%] lg:translate-y-0 lg:translate-x-[25%]">
            <div className="border border-border/60 bg-muted/20 rounded-2xl p-2 md:p-3 shadow-2xl backdrop-blur-xl">
              <Card className="border border-border bg-background p-1 aspect-[4/3] md:aspect-[16/10] rounded-xl overflow-hidden relative">
                <div className="h-full w-full bg-muted/30 border border-border rounded-lg p-5 md:p-6 space-y-4 font-mono text-[10px] md:text-xs text-muted-foreground/90">
                  {/* Fake OS Window Controls */}
                  <div className="flex items-center gap-1.5 mb-6 border-b border-border/50 pb-4">
                    <div className="size-3 rounded-full bg-border" />
                    <div className="size-3 rounded-full bg-border" />
                    <div className="size-3 rounded-full bg-border" />
                    <span className="ml-3 text-[10px] text-muted-foreground/70 tracking-tight font-sans">
                      SalesAI / generator.md
                    </span>
                  </div>

                  <p className="text-foreground font-semibold text-xs md:text-sm">
                    Is Your Website Costing You Sales ?
                  </p>
                  <p className="text-muted-foreground">
                    Turn your web app into a 24/7 revenue-generating machine.
                  </p>
                  <div className="mt-6 border-l-2 border-primary pl-4 py-2 space-y-3">
                    <p className="text-primary font-semibold flex items-center gap-2">
                      <span className="size-2 rounded-full bg-primary animate-pulse" />
                      Generating Core Benefits...
                    </p>
                    <p>Blazing Fast Load Times</p>
                    <p>Frictionless UX/UI</p>
                    <p>Type-Safe Scalability</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
