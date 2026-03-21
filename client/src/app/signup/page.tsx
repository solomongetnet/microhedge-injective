"use client";

import Link from "next/link";
import { WalletLoginButton } from "@/components/WalletLoginButton";

export default function SignupPage() {
  return (
    <div className="h-screen flex w-full bg-background">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-lg p-8 flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create Account
            </h1>
            <p className="text-foreground/70 mb-8">
              Connect your wallet to start building your financial profile
            </p>

            <div className="w-full flex justify-center mt-6">
              <WalletLoginButton redirectOnAuth={true} />
            </div>

            <p className="text-center text-foreground/70 mt-8">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 relative w-full max-md:hidden md:max-h-[100dvh] md:h-full rounded-bl-2xl rounded-tl-2xl overflow-hidden shadow-2xl">
        <img
          src="https://img.freepik.com/premium-photo/vertical-happy-freelancer-man-working-home-with-laptop-desk-night-young-guy-smiling-browsing-internet-using-computer-living-room-entrepreneur-looking-bank-finances-invests_639864-408.jpg?semt=ais_rp_50_assets&w=740&q=80"
          alt="Freelancer working with laptop"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    </div>
  );
}
