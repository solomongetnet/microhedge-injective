"use client";

import React from "react";
import { useSwitchChain, useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, Zap, ArrowRight } from "lucide-react";

interface WrongNetworkStateProps {
  onContinueDemo?: () => void;
}

export function WrongNetworkState({ onContinueDemo }: WrongNetworkStateProps) {
  const { switchChain } = useSwitchChain();
  const INJECTIVE_EVM_CHAIN_ID = 1439;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-in fade-in zoom-in duration-300">
      <div className="max-w-md w-full bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/10 rounded-[32px] p-10 shadow-xl shadow-gray-200/20 dark:shadow-black/40 space-y-8 relative overflow-hidden group">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d80073]/5 rounded-full blur-3xl group-hover:bg-[#d80073]/10 transition-colors duration-500" />
        
        <div className="relative space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 mx-auto shadow-inner">
            <AlertCircle size={40} />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              ⚠️ Wrong Network
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              You’re connected to the wrong network. Please switch to Injective to use live features like real hedging and on-chain data.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Button 
              onClick={() => switchChain({ chainId: INJECTIVE_EVM_CHAIN_ID })}
              className="w-full py-7 rounded-2xl bg-[#d80073] hover:bg-[#c20067] text-white font-black text-lg shadow-lg shadow-[#d80073]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Switch to Injective <ArrowRight size={20} />
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                window.open("https://docs.injective.network/develop/guides/inevm/metamask/", "_blank");
              }}
              className="w-full py-7 rounded-2xl border-gray-100 dark:border-white/10 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add Injective Network
            </Button>

            {onContinueDemo && (
              <Button 
                variant="ghost"
                onClick={onContinueDemo}
                className="w-full py-4 rounded-2xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-bold text-sm transition-all"
              >
                Continue in Demo Mode
              </Button>
            )}
          </div>

          <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-center gap-2">
            <Zap size={14} className="text-[#d80073]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              ⚡ Live features are powered by Injective
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
