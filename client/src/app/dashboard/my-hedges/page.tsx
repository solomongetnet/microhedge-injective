"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown,
  Clock, 
  ShieldCheck, 
  Loader2,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  Lock,
  Activity,
  Plus
} from "lucide-react";
import { 
  useAccount, 
  useWriteContract,
  useWaitForTransactionReceipt
} from "wagmi";
import { ethers } from "ethers";
import { formatEther } from "viem";
import { HEDGE_CONTRACT_ADDRESS, PRICE_ORACLE_ADDRESS, hedgeAbi, priceOracleAbi } from "@/lib/contracts";
import { toast } from "sonner";
import { COMMODITIES } from "@/lib/commodities";
import { SettlementInfoModal } from "@/components/dashboard/settlement-info-modal";
import { WrongNetworkState } from "@/components/dashboard/wrong-network-state";

// ─── Types ────────────────────────────────────────────────────────
interface OnChainHedge {
  id: bigint;
  owner: string;
  commodity: string;
  amount: bigint;
  strikePrice: bigint;
  expireAt: bigint;
  lockedValue: bigint;
  closed: boolean;
  currentPrice?: bigint;
}

// ─── Helpers ──────────────────────────────────────────────────────
const getStatus = (hedge: OnChainHedge) => {
  if (hedge.closed) return { label: "Settled", color: "bg-gray-100 text-gray-600", icon: ShieldCheck };
  const now = BigInt(Math.floor(Date.now() / 1000));
  if (hedge.expireAt < now) return { label: "Ready to Settle", color: "bg-amber-100 text-amber-700", icon: Clock };
  return { label: "Active Protection", color: "bg-emerald-100 text-emerald-700", icon: ShieldCheck };
};

const getCommodityIcon = (name: string) => {
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
  const symbol = name.split(" ")[0].toUpperCase();
  return icons[symbol] || "📦";
};

const formatCurrency = (val: bigint | number | undefined) => {
  if (val === undefined) return "—";
  const num = typeof val === "bigint" ? Number(formatEther(val)) : val;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num);
};

const formatOraclePrice = (val: bigint | undefined) => {
  if (val === undefined) return "—";
  // Oracle price is in cents (2 decimals)
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(val) / 100);
};

const getTimeRemaining = (expireAt: bigint) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = Number(expireAt) - now;
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / 86400);
  if (days > 0) return `${days}d remaining`;
  const hours = Math.floor(diff / 3600);
  return `${hours}h remaining`;
};

// ─── Components ───────────────────────────────────────────────────

function HedgeCard({ hedge, onSettle }: { hedge: OnChainHedge, onSettle: (id: bigint) => void }) {
  const status = getStatus(hedge);
  const StatusIcon = status.icon;
  const isExpired = !hedge.closed && BigInt(Math.floor(Date.now() / 1000)) >= hedge.expireAt;
  
  // Calculate Gain/Loss
  const strikePrice = hedge.strikePrice;
  const oraclePriceInDollars = hedge.currentPrice ? Number(hedge.currentPrice) / 100 : 0;
  const strikePriceInDollars = Number(formatEther(strikePrice));
  const isFavorable = oraclePriceInDollars >= strikePriceInDollars;
  const diffPercent = strikePriceInDollars > 0 
    ? ((oraclePriceInDollars - strikePriceInDollars) / strikePriceInDollars) * 100 
    : 0;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col h-full">
      <div className="p-6 space-y-6 flex-1">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
              {getCommodityIcon(hedge.commodity)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{hedge.commodity}</h3>
              <div className={`mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wide uppercase shadow-sm ${status.color}`}>
                <StatusIcon size={10} />
                {status.label}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Coverage</div>
            <div className="text-lg font-black text-gray-900 leading-none">{hedge.amount.toString()} <span className="text-xs text-gray-400 font-bold">UNIT</span></div>
          </div>
        </div>

        {/* Price Section */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50 shadow-sm">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Lock size={12} />
              <span className="text-[10px] font-black uppercase tracking-tight">Locked Strike</span>
            </div>
            <div className="font-bold text-gray-900 text-lg tracking-tight">{formatCurrency(hedge.strikePrice)}</div>
          </div>
          <div className={`rounded-2xl p-4 border transition-all duration-500 shadow-sm ${
            hedge.currentPrice 
              ? isFavorable 
                ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                : "bg-rose-50 border-rose-100 text-rose-700"
              : "bg-gray-50 border-gray-100 text-gray-400"
          }`}>
            <div className="flex items-center gap-2 mb-1 opacity-70">
              <Activity size={12} />
              <span className="text-[10px] font-black uppercase tracking-tight">Live Market</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg tracking-tight">{formatOraclePrice(hedge.currentPrice)}</span>
              {/* {hedge.currentPrice && (
                <div className="flex flex-col items-end">
                  {isFavorable ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span className="text-[10px] font-black leading-none mt-0.5">
                    {diffPercent > 0 ? "+" : ""}{diffPercent.toFixed(1)}%
                  </span>
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={12} />
              <span className="text-[10px] font-black uppercase tracking-tight">Expiry</span>
            </div>
            <div className="font-bold text-gray-700 text-sm">
              {new Date(Number(hedge.expireAt) * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            {!hedge.closed && (
              <div className="text-[10px] font-bold text-[#d80073] animate-pulse">
                {getTimeRemaining(hedge.expireAt)}
              </div>
            )}
          </div>
          <div className="space-y-1 text-right">
            <div className="flex items-center gap-2 text-gray-400 justify-end">
              <Layers size={12} />
              <span className="text-[10px] font-black uppercase tracking-tight">Locked Value</span>
            </div>
            <div className="font-black text-gray-900 text-sm">
              {formatCurrency(hedge.strikePrice)}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 space-y-3">
        {/* Action */}
        {!hedge.closed && (
          <button
            onClick={() => isExpired && onSettle(hedge.id)}
            disabled={!isExpired}
            className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
              isExpired 
                ? "bg-[#d80073] text-white shadow-lg shadow-[#d80073]/20 hover:bg-[#c20067] active:scale-[0.98]" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isExpired ? (
              <>
                Settle Position <ChevronRight size={18} />
              </>
            ) : (
              <>
                Waiting for Expiry <Clock size={18} />
              </>
            )}
          </button>
        )}
        
        {hedge.closed && (
          <div className="w-full py-4 rounded-2xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center gap-2">
            <ShieldCheck size={18} /> Position Settled
          </div>
        )}

        <a 
          href={`https://testnet.blockscout.injective.network/address/${HEDGE_CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 flex items-center justify-center gap-1.5 text-gray-400 hover:text-[#d80073] transition-colors text-[10px] font-bold uppercase tracking-widest"
        >
          View on InjScan <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}

export default function MyHedgesPage() {
  const { address, isConnected, chainId } = useAccount();
  const INJECTIVE_EVM_CHAIN_ID = 1439;
  const isWrongNetwork = isConnected && chainId !== INJECTIVE_EVM_CHAIN_ID;

  const [hedges, setHedges] = useState<OnChainHedge[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSettling, setIsSettling] = useState<bigint | null>(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const fetchOnChainData = async () => {
    if (isWrongNetwork) return;
    if (!window.ethereum || !address) return;
    if (hedges.length === 0) setLoading(true);
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(HEDGE_CONTRACT_ADDRESS, hedgeAbi, provider);
      const oracleContract = new ethers.Contract(PRICE_ORACLE_ADDRESS, priceOracleAbi, provider);

      const positionIds: bigint[] = await contract.getUserPositions(address);
      const hedgeList: OnChainHedge[] = [];

      for (const id of positionIds) {
        const pos = await contract.positions(id);
        
        // Handle mapping from name to symbol for legacy hedges
        let lookupSymbol = pos.commodity;
        const matchingCommodity = COMMODITIES.find(c => c.name === pos.commodity || c.symbol === pos.commodity);
        if (matchingCommodity) {
          lookupSymbol = matchingCommodity.symbol;
        }

        let currentPrice = BigInt(0);
        try {
          // Explicitly call the contract method
          const price = await oracleContract.getPrice(lookupSymbol);
          currentPrice = BigInt(price);
        } catch (e) {
          console.error(`Failed to fetch price for ${lookupSymbol}`, e);
        }

        hedgeList.push({
          id: id,
          owner: pos.owner,
          commodity: pos.commodity, // keep original string for display
          amount: pos.amount,
          strikePrice: pos.strikePrice,
          expireAt: pos.expireAt,
          lockedValue: pos.lockedValue,
          closed: pos.closed,
          currentPrice
        });
      }
      setHedges(hedgeList);
    } catch (err) {
      console.error("Failed to fetch on-chain hedges:", err);
      if (hedges.length === 0) toast.error("Fetch Failed", { description: "Could not sync with blockchain data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isWrongNetwork) {
      setLoading(false);
      return;
    }
    if (isConnected && address) {
      fetchOnChainData();
      const interval = setInterval(fetchOnChainData, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, address, isWrongNetwork]);

  // 3. Settle Functionality
  const { writeContract: settleHedge, data: settleTxHash } = useWriteContract();
  const { isLoading: isSettleMining, isSuccess: isSettleSuccess } = useWaitForTransactionReceipt({ hash: settleTxHash });

  useEffect(() => {
    if (isSettleSuccess) {
      toast.success("Position Settled! 🎉", {
        description: "Your payout has been transferred to your wallet."
      });
      setIsSettling(null);
      fetchOnChainData();
    }
  }, [isSettleSuccess]);

  const handleSettle = (id: bigint) => {
    setIsSettling(id);
    settleHedge({
      address: HEDGE_CONTRACT_ADDRESS as `0x${string}`,
      abi: hedgeAbi,
      functionName: "closeHedge",
      args: [id],
      gas: BigInt(1000000), // Explicit gas limit for Injective Testnet reliability
    }, {
      onError: (err) => {
        toast.error("Settlement Failed", { description: (err as any).shortMessage || err.message });
        setIsSettling(null);
      }
    });
  };

  // Stats
  const activeHedges = hedges.filter(h => !h.closed);
  const totalLocked = activeHedges.reduce((sum, h) => sum + h.lockedValue, BigInt(0));

  if (isWrongNetwork) {
    return (
      <div className="w-full space-y-8 p-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Hedges</h1>
            <p className="text-gray-500 font-medium">Manage and settle your active on-chain protection positions.</p>
          </div>
        </div>
        <WrongNetworkState />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="w-full py-20 px-6 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl">
          🔌
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Connect Your Wallet</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Please connect your wallet to view and manage your on-chain micro-hedge positions.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10 p-6 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Hedges</h1>
          <p className="text-gray-500 mt-2 font-medium">Your active on-chain protection positions.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-[#fce4ec] px-6 py-4 rounded-3xl border border-[#d80073]/10 shadow-sm">
            <div className="text-[10px] font-black text-[#d80073] uppercase tracking-widest mb-1">Total Protected</div>
            <div className="text-2xl font-black text-gray-900">{formatCurrency(totalLocked)}</div>
          </div>
          <div className="bg-emerald-50 px-6 py-4 rounded-3xl border border-emerald-100 shadow-sm">
            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Active Positions</div>
            <div className="text-2xl font-black text-gray-900">{activeHedges.length}</div>
          </div>
        </div>
      </div>

      {loading && hedges.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-[#d80073] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Package size={16} className="text-[#d80073]" />
            </div>
          </div>
          <p className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-[10px]">Syncing live market data...</p>
        </div>
      ) : hedges.length === 0 ? (
        <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-100 p-20 text-center shadow-inner bg-gradient-to-b from-white to-gray-50/30">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
            🌾
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">No Hedges Found</h2>
          <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
            You haven't created any price protection contracts yet. Secure your harvest against market volatility today.
          </p>
          <button 
            onClick={() => window.location.href = "/dashboard/create-hedge"}
            className="bg-[#d80073] text-white px-10 py-5 rounded-2xl font-black shadow-xl shadow-[#d80073]/20 hover:bg-[#c20067] transition-all active:scale-[0.98] flex items-center gap-2 mx-auto"
          >
            Create New Hedge <Plus size={20} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {hedges.map((hedge) => (
            <HedgeCard 
              key={hedge.id.toString()} 
              hedge={hedge} 
              onSettle={handleSettle} 
            />
          ))}
        </div>
      )}

      {/* Info Footer */}
      <div className="bg-[#fafafa] rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-6 border border-gray-100/50 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#d80073] border border-gray-50">
          <AlertCircle size={28} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="font-bold text-gray-900">How Settlement Works</h4>
          <p className="text-sm text-gray-500 mt-1 font-medium leading-relaxed">
            Once a hedge expires, you can settle it to receive your payout. If the spot price is below your strike price, you're protected for the full locked value. If it's higher, you receive the current market value.
          </p>
        </div>
        <button 
          onClick={() => setInfoModalOpen(true)}
          className="text-[#d80073] font-bold text-sm hover:underline flex items-center gap-1 shrink-0"
        >
          Learn More <ExternalLink size={14} />
        </button>
      </div>

      <SettlementInfoModal 
        open={infoModalOpen} 
        onOpenChange={setInfoModalOpen} 
      />

      {/* Settle Overlay Loading */}
      {(isSettling !== null || isSettleMining) && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-gray-100 border-t-[#d80073] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="text-[#d80073]" size={32} />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Settling Position</h3>
            <p className="text-gray-500 font-medium mt-1">Verifying on-chain settlement details...</p>
          </div>
        </div>
      )}
    </div>
  );
}
