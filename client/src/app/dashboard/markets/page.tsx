"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Loader2, Package, RefreshCw, Plus, Activity } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ethers } from "ethers";
import { PRICE_ORACLE_ADDRESS, priceOracleAbi } from "@/lib/contracts";
import { COMMODITIES as LOCAL_COMMODITIES } from "@/lib/commodities";
import { toast } from "sonner";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────
interface MarketCommodity {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  chart: { time: string; price: number }[];
}

// ─── Helpers ──────────────────────────────────────────────────────
const getCommodityIcon = (symbol: string) => {
  const icons: Record<string, string> = {
    COFFEE: "☕",
    MAIZE: "🌽",
    WHEAT: "🌾",
    BARLEY: "🫘",
    SOYBEAN: "🟤",
    SUGAR: "🍬",
    COTTON: "🌿",
    COCOA: "🍫",
  };
  return icons[symbol.toUpperCase()] || "📦";
};

const generateMockChart = (basePrice: number) => {
  const points = [];
  const times = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
  let currentPrice = basePrice * (0.9 + Math.random() * 0.2); // Start between 90% and 110%
  
  for (let i = 0; i < times.length; i++) {
    // High volatility for "up and down" effect
    const volatility = basePrice * 0.05; 
    const trend = (Math.random() - 0.5) * 2; // Random trend direction
    currentPrice += trend * volatility;
    
    // Bounds check
    currentPrice = Math.max(currentPrice, basePrice * 0.7);
    currentPrice = Math.min(currentPrice, basePrice * 1.3);
    
    points.push({ 
      time: times[i], 
      price: parseFloat(currentPrice.toFixed(2)) 
    });
  }
  return points;
};

export default function MarketsPage() {
  const [markets, setMarkets] = useState<MarketCommodity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMarketData = async (isRefresh = false) => {
    if (!window.ethereum) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const oracleContract = new ethers.Contract(PRICE_ORACLE_ADDRESS, priceOracleAbi, provider);

      // Fetch all commodities and prices from oracle using the working test logic
      const [symbols, prices]: [string[], bigint[]] = await oracleContract.getAllPrices();
      
      const marketList: MarketCommodity[] = symbols.map((symbol, index) => {
        const priceInCents = Number(prices[index]);
        const priceInDollars = priceInCents / 100;
        
        // Find local metadata if available
        const localMeta = LOCAL_COMMODITIES.find(c => c.symbol === symbol);
        
        // Calculate a pseudo-random change for UI polish
        const change = (Math.random() * 4 - 1.5); 

        return {
          id: symbol.toLowerCase(),
          symbol: symbol,
          name: localMeta?.name || `${symbol} Futures`,
          price: priceInDollars,
          change: parseFloat(change.toFixed(2)),
          volume: `${(Math.random() * 100 + 50).toFixed(1)}K`,
          chart: generateMockChart(priceInDollars)
        };
      });

      setMarkets(marketList);
    } catch (err) {
      console.error("Failed to fetch market data:", err);
      toast.error("Market Data Unavailable", { 
        description: "Could not sync with the Price Oracle contract." 
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(() => fetchMarketData(true), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 p-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Commodity Markets</h1>
          <p className="text-gray-500 mt-2 font-medium">Real-time prices from the on-chain Price Oracle</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchMarketData(true)}
          disabled={refreshing || loading}
          className="rounded-xl border-gray-200 font-bold text-gray-600 gap-2 hover:bg-gray-50"
        >
          {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {refreshing ? "Syncing..." : "Refresh Prices"}
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-[#d80073] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="text-[#d80073]" size={16} />
            </div>
          </div>
          <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-[10px]">Syncing with Price Oracle...</p>
        </div>
      ) : markets.length === 0 ? (
        <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-100 p-20 text-center shadow-inner">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
            📊
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">No Market Data</h2>
          <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium">
            The Price Oracle hasn't published any commodity prices yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {markets.map((market) => (
            <Card key={market.id} className="bg-white border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-[32px] overflow-hidden group flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner">
                      {getCommodityIcon(market.symbol)}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-black text-gray-900 leading-tight">{market.symbol}</CardTitle>
                      <CardDescription className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{market.name}</CardDescription>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 ${
                    market.change >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  }`}>
                    {market.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {Math.abs(market.change)}%
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                {/* Mini Chart */}
                <div className="h-24 -mx-2 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={market.chart}>
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke={market.change >= 0 ? "#10b981" : "#f43f5e"}
                        strokeWidth={2.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Price</div>
                      <div className="text-3xl font-black text-gray-900 tracking-tighter">
                        ${market.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Volume</div>
                      <div className="text-sm font-bold text-gray-700">{market.volume}</div>
                    </div>
                  </div>

                  <Link href={`/dashboard/create-hedge?selected=${market.symbol}`} className="block">
                    <Button 
                      className="w-full h-12 rounded-2xl bg-[#d80073] hover:bg-[#c20067] text-white font-black shadow-lg shadow-[#d80073]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      Hedge Now <Plus size={18} />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-gray-50/50 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-6 border border-gray-100">
        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#d80073] border border-gray-50">
          <RefreshCw size={28} className={refreshing ? "animate-spin" : ""} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="font-bold text-gray-900">Oracle Data Feed</h4>
          <p className="text-sm text-gray-500 mt-1 font-medium leading-relaxed">
            These prices are fetched directly from the Price Oracle smart contract on Moonbase Alpha. Prices are updated periodically by verified data providers to ensure accurate settlement of all hedge positions.
          </p>
        </div>
        <div className="px-6 py-3 rounded-2xl bg-white border border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">
          Last Sync: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
