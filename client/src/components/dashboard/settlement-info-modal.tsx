"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, TrendingUp, Info } from "lucide-react";

/**
 * Structured content for the Settlement Info Modal.
 * This makes it easy to update later or localize.
 */
export const SETTLEMENT_INFO_CONTENT = {
  title: "How Settlement Works",
  sections: [
    {
      text: "When a hedge reaches its expiration date, you can settle it to claim your payout. The settlement protects users against commodity price fluctuations:",
    },
    {
      title: "If the spot price is below your strike price:",
      text: "You are fully protected for the amount you locked in, ensuring no loss even if the market drops.",
      icon: ShieldCheck,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      title: "If the spot price is above your strike price:",
      text: "You receive the current market value, allowing you to benefit from favorable market movements.",
      icon: TrendingUp,
      iconColor: "text-[#d80073]",
      bgColor: "bg-[#fce4ec]/50",
    },
    {
      text: "This settlement system makes hedging simple, reliable, and predictable, providing security for all users, including farmers and small businesses, while still allowing potential upside if market conditions improve.",
    },
  ],
  buttonText: "Got it",
};

interface SettlementInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettlementInfoModal({ open, onOpenChange }: SettlementInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-[32px] border-none p-8 gap-6 overflow-hidden">
        <DialogHeader className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#fce4ec] flex items-center justify-center text-[#d80073] mb-2">
            <Info size={24} />
          </div>
          <DialogTitle className="text-3xl font-black text-gray-900 tracking-tight">
            {SETTLEMENT_INFO_CONTENT.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {SETTLEMENT_INFO_CONTENT.sections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              {section.title ? (
                <div className={`p-4 rounded-2xl ${section.bgColor} border border-transparent transition-all flex gap-4 items-start`}>
                  {section.icon && (
                    <div className={`mt-1 shrink-0 ${section.iconColor}`}>
                      <section.icon size={20} />
                    </div>
                  )}
                  <div className="space-y-1">
                    <h4 className="font-black text-sm uppercase tracking-wider text-gray-900">
                      {section.title}
                    </h4>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">
                      {section.text}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {section.text}
                </p>
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4 sm:justify-start">
          <DialogClose asChild>
            <Button 
              type="button" 
              className="w-full sm:w-auto px-10 py-6 rounded-2xl bg-[#d80073] hover:bg-[#c20067] text-white font-black text-lg shadow-xl shadow-[#d80073]/20 transition-all active:scale-[0.98]"
            >
              {SETTLEMENT_INFO_CONTENT.buttonText}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
