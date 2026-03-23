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
import {
    ShieldCheck,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Info,
    Lock,
    Calendar,
    Layers,
    Package
} from "lucide-react";

interface HedgeDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    hedge: {
        id: string;
        commodity: string;
        strikePrice: string;
        amount: string;
        expireAt: string;
        status: {
            label: string;
            color: string;
            icon: any;
        };
        isFavorable: boolean;
        currentPrice: string;
    };
}

export function HedgeDetailsModal({ open, onOpenChange, hedge }: HedgeDetailsModalProps) {
    const StatusIcon = hedge.status.icon;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-[32px] border-none p-0 overflow-hidden bg-white shadow-2xl max-h-[90dvh] overflow-y-scroll">
                <div className="p-8 space-y-8">
                    <DialogHeader className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-3xl bg-gray-50 flex items-center justify-center text-3xl shadow-inner">
                                    {hedge.commodity.split(" ")[0] === "COFFEE" ? "☕" :
                                        hedge.commodity.split(" ")[0] === "MAIZE" ? "🌽" :
                                            hedge.commodity.split(" ")[0] === "WHEAT" ? "🌾" :
                                                hedge.commodity.split(" ")[0] === "BARLEY" ? "🫘" :
                                                    hedge.commodity.split(" ")[0] === "SOYBEAN" ? "🟤" :
                                                        hedge.commodity.split(" ")[0] === "SUGAR" ? "🍬" :
                                                            hedge.commodity.split(" ")[0] === "COTTON" ? "🌿" :
                                                                hedge.commodity.split(" ")[0] === "COCOA" ? "🍫" : "📦"}
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
                                        Hedge Details
                                    </DialogTitle>
                                    <DialogDescription className="text-xs font-black text-gray-400 uppercase tracking-[2px]">
                                        ID: #{hedge.id.toString()} • {hedge.commodity}
                                    </DialogDescription>
                                </div>
                            </div>
                            <div className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide uppercase shadow-sm flex items-center gap-1.5 ${hedge.status.color}`}>
                                <StatusIcon size={12} />
                                {hedge.status.label}
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Data Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Lock size={12} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Strike Price</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900">{hedge.strikePrice}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Layers size={12} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Amount</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900">{hedge.amount} UNIT</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calendar size={12} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Expiry Date</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900">{hedge.expireAt}</div>
                        </div>
                        <div className={`p-4 rounded-2xl border space-y-1 ${hedge.isFavorable ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
                            <div className="flex items-center gap-2 opacity-70">
                                <ShieldCheck size={12} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Live Market</span>
                            </div>
                            <div className="text-lg font-bold">{hedge.currentPrice}</div>
                        </div>
                    </div>

                    {/* Explanation Section */}
                    <div className="space-y-4">
                        <h4 className="font-black text-xs uppercase tracking-widest text-gray-400">What happens at expiry?</h4>
                        <div className="space-y-3">
                            <div className="flex gap-3 items-start p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                                <ArrowDownRight className="text-emerald-500 mt-0.5 shrink-0" size={18} />
                                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                    <span className="font-bold text-gray-900">Price Drops:</span> You are protected. You receive the difference to match your locked strike price.
                                </p>
                            </div>
                            <div className="flex gap-3 items-start p-4 rounded-2xl bg-[#fce4ec]/30 border border-[#d80073]/10">
                                <ArrowUpRight className="text-[#d80073] mt-0.5 shrink-0" size={18} />
                                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                    <span className="font-bold text-gray-900">Price Rises:</span> You benefit from the upside. You receive the higher current market value.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <Info className="text-amber-500 mt-0.5 shrink-0" size={18} />
                        <p className="text-[11px] font-bold text-amber-700 leading-normal">
                            Note: Hedging is designed to reduce financial risk and provide predictability, not to maximize speculative profit.
                        </p>
                    </div>
                </div>

                <DialogFooter className="p-8 bg-gray-50 border-t border-gray-100">
                    <DialogClose asChild>
                        <Button className="w-full py-6 rounded-2xl bg-[#d80073] hover:bg-[#c20067] text-white font-black text-lg shadow-xl shadow-[#d80073]/20 transition-all active:scale-[0.98]">
                            Got it
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
