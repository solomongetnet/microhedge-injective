"use client";

import React from "react";
import { WalletLoginButton } from "@/components/WalletLoginButton";
import { Wallet } from "lucide-react";

interface ConnectWalletStateProps {
  title?: string;
  description?: string;
}

export function ConnectWalletState({ 
  title = "Connect Your Wallet", 
  description = "Please connect your wallet to verify your account status and access this page." 
}: ConnectWalletStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-in fade-in zoom-in duration-300">
      <div className="max-w-md w-full bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/10 rounded-[40px] p-12 shadow-xl shadow-gray-200/20 dark:shadow-black/40 space-y-8 relative overflow-hidden group">
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#d80073]/5 rounded-full blur-3xl group-hover:bg-[#d80073]/10 transition-colors duration-500" />
        
        <div className="relative space-y-8">
          <div className="w-24 h-24 rounded-[32px] bg-gray-50 dark:bg-white/5 flex items-center justify-center text-4xl shadow-inner mx-auto group-hover:scale-110 transition-transform duration-500">
            <Wallet size={40} className="text-[#d80073]" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <WalletLoginButton className="w-full py-8 rounded-[24px] bg-[#d80073] hover:bg-[#c20067] text-white font-black text-xl shadow-xl shadow-[#d80073]/20 transition-all active:scale-[0.98]" />
          </div>

          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] opacity-60">
            Powered by Injective & RainbowKit
          </p>
        </div>
      </div>
    </div>
  );
}
