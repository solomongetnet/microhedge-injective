"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Brain, 
  Sparkles, 
  Loader2, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Globe,
  Zap
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { ai as aiAction } from "@/actions/ai.actions";
import Link from "next/link";

interface MarketDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commodity: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    volume: string;
  } | null;
}

const generateHistoricalData = (basePrice: number, points: number, volatility: number) => {
  const data = [];
  let currentPrice = basePrice;
  const now = new Date();
  
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000); // Hourly
    const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
    currentPrice += change;
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: parseFloat(currentPrice.toFixed(2)),
    });
  }
  return data;
};

export function MarketDetailModal({ open, onOpenChange, commodity }: MarketDetailModalProps) {
  const [timeframe, setTimeframe] = useState<"1W" | "1M" | "1Y">("1W");
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (open && commodity) {
      const points = timeframe === "1W" ? 24 : timeframe === "1M" ? 30 : 52;
      setChartData(generateHistoricalData(commodity.price, points, 0.02));
      fetchAiAnalysis();
    }
  }, [open, commodity, timeframe]);

  const fetchAiAnalysis = async () => {
    if (!commodity) return;
    setIsAiThinking(true);
    try {
      const prompt = `Analyze the current market status for ${commodity.name} (${commodity.symbol}) priced at $${commodity.price}. The price has changed by ${commodity.change}% recently. Provide a concise professional outlook for a hedging platform.`;
      const response = await aiAction({ message: prompt });
      if (response.success) {
        setAiAnalysis(response.reply);
      } else {
        setAiAnalysis("The market for " + commodity.name + " is showing signs of moderate volatility. Current price levels suggest a balanced risk-reward ratio for short-term hedging strategies.");
      }
    } catch (err) {
      setAiAnalysis("Unable to generate AI analysis at this moment. Please refer to technical indicators.");
    } finally {
      setIsAiThinking(false);
    }
  };

  if (!commodity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl rounded-[40px] border-none p-0 overflow-hidden bg-white shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full max-h-[90vh] overflow-y-auto lg:overflow-hidden">
          {/* Left Column: Chart & Stats */}
          <div className="lg:col-span-8 p-8 space-y-8 flex flex-col">
            <DialogHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-3xl bg-gray-50 flex items-center justify-center text-3xl shadow-inner">
                    {commodity.symbol === "COFFEE" ? "☕" : 
                     commodity.symbol === "MAIZE" ? "🌽" :
                     commodity.symbol === "WHEAT" ? "🌾" :
                     commodity.symbol === "BARLEY" ? "🫘" :
                     commodity.symbol === "SOYBEAN" ? "🟤" :
                     commodity.symbol === "SUGAR" ? "🍬" :
                     commodity.symbol === "COTTON" ? "🌿" :
                     commodity.symbol === "COCOA" ? "🍫" : "📦"}
                  </div>
                  <div>
                    <DialogTitle className="text-3xl font-black text-gray-900 tracking-tight">
                      {commodity.symbol} <span className="text-gray-400 font-bold">/ USDT</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs font-black text-gray-400 uppercase tracking-[2px]">
                      {commodity.name} • INJECTIVE ORACLE FEED
                    </DialogDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-gray-900 tracking-tighter">
                    ${commodity.price.toFixed(2)}
                  </div>
                  <div className={`flex items-center justify-end gap-1 text-sm font-black ${
                    commodity.change >= 0 ? "text-emerald-500" : "text-rose-500"
                  }`}>
                    {commodity.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {Math.abs(commodity.change)}%
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Crypto-Style Chart */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex bg-gray-100 p-1 rounded-2xl w-fit">
                  {["1W", "1M", "1Y"].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf as any)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                        timeframe === tf 
                          ? "bg-white text-[#d80073] shadow-sm" 
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#d80073]" /> Spot Price
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 opacity-30" /> MA(20)
                  </div>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={commodity.change >= 0 ? "#10b981" : "#f43f5e"} stopOpacity={0.1}/>
                        <stop offset="95%" stopColor={commodity.change >= 0 ? "#10b981" : "#f43f5e"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                      minTickGap={30}
                    />
                    <YAxis 
                      hide 
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        fontWeight: 900,
                        fontSize: '12px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={commodity.change >= 0 ? "#10b981" : "#f43f5e"} 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Market Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">24h High</div>
                  <div className="text-lg font-black text-gray-900">${(commodity.price * 1.05).toFixed(2)}</div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">24h Low</div>
                  <div className="text-lg font-black text-gray-900">${(commodity.price * 0.95).toFixed(2)}</div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Volume (24h)</div>
                  <div className="text-lg font-black text-gray-900">{commodity.volume}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Analysis & Action */}
          <div className="lg:col-span-4 bg-gray-50 p-8 flex flex-col gap-8 border-l border-gray-100">
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-[#d80073]/10 text-[#d80073] rounded-full w-fit">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Market Intelligence</span>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black text-gray-900 leading-tight">AI Strategy Outlook</h3>
                {isAiThinking ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded-full w-full" />
                    <div className="h-4 bg-gray-200 rounded-full w-5/6" />
                    <div className="h-4 bg-gray-200 rounded-full w-4/6" />
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">
                    {aiAnalysis}
                  </p>
                )}
              </div>

              {/* Key Indicators */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Technical Sentiment</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600">Volatility Index</span>
                    <span className="text-xs font-black text-[#d80073]">MEDIUM</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#d80073] w-[65%]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600">Hedge Demand</span>
                    <span className="text-xs font-black text-emerald-500">HIGH</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[85%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-start gap-3">
                <Zap size={20} className="text-amber-500 mt-0.5" />
                <p className="text-[10px] font-bold text-gray-500 leading-normal">
                  <span className="text-gray-900">PRO TIP:</span> Prices for {commodity.symbol} are currently trending {commodity.change >= 0 ? "upwards" : "downwards"}. Consider a {commodity.change >= 0 ? "longer" : "shorter"} duration hedge to lock in current rates.
                </p>
              </div>
              
              <Link href={`/dashboard/create-hedge?selected=${commodity.symbol}`} className="block">
                <Button className="w-full py-8 rounded-[24px] bg-[#d80073] hover:bg-[#c20067] text-white font-black text-lg shadow-xl shadow-[#d80073]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                  Hedge Now <Plus size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
