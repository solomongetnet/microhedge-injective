"use client";

import Link from "next/link";
import { WalletLoginButton } from "@/components/WalletLoginButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-background">
      <div className="flex flex-col gap-3 items-center justify-center">
        {/* Navigation */}
        <nav className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/logo-white.png" alt="CrediX Logo" className="h-8 w-auto" />
            </Link>
          </div>
        </nav>

        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="bg-card border border-border rounded-lg p-8 text-center flex flex-col items-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome Back
              </h1>
              <p className="text-foreground/70 mb-8">
                Sign in to your CrediX account with your wallet
              </p>

              <div className="w-full flex justify-center mt-6">
                <WalletLoginButton redirectOnAuth={true} />
              </div>

              <p className="text-center text-foreground/70 mt-8">
                New to CrediX? Connecting your wallet works for signup too!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
