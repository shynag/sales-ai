"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { login } from "@/app/actions/auth";

// 1. Ekstraksi komponen tombol agar bisa membaca context dari <form> induknya
function SubmitButton() {
  // Hook ini akan otomatis menjadi true ketika action={login} sedang berjalan
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-11 text-sm font-semibold mt-4 group transition-all"
    >
      {pending ? (
        <>
          {/* Efek muter-muter (animate-spin) bawaan Tailwind */}
          <Loader2 className="size-4 mr-2 animate-spin text-primary-foreground/70" />
          Signing In...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background p-6 md:p-10 font-sans antialiased">
      <div className="w-full max-w-[380px] flex flex-col">
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
              <Sparkles className="size-5 text-primary" />
            </div>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Log in to your SalesAI account to continue
          </p>
        </div>

        {/* Form Section */}
        <div className="w-full">
          <form action={login} className="space-y-5">
            <div className="space-y-2.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-foreground/80"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@shynag.dev"
                required
                className="h-11 bg-muted/20 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40 transition-shadow"
              />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold text-foreground/80"
                >
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-11 bg-muted/20 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40 transition-shadow"
              />
            </div>

            {/* 2. Gunakan komponen SubmitButton yang sudah kita buat */}
            <SubmitButton />
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground mt-8">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-foreground hover:text-primary transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
