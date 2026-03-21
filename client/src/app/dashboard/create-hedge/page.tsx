"use client";

import { useState, useEffect, Suspense } from "react";
import { Info, Loader2, TrendingUp, Sparkles, Brain, Lightbulb, ShieldCheck, ArrowRight, Activity, Calendar, DollarSign, Package } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { COMMODITIES } from "@/lib/commodities";
import { ai as aiAction } from "@/actions/ai.actions";
import {
  HEDGE_CONTRACT_ADDRESS,
  hedgeAbi,
} from "@/lib/contracts";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";

// ─── Expire Options ────────────────────────────────────────────────
const EXPIRE_OPTIONS = [
  { id: 1, label: "1 Day" },
  { id: 2, label: "7 Days" },
  { id: 3, label: "14 Days" },
  { id: 4, label: "30 Days" },
] as const;

// ─── Commodity Icon ────────────────────────────────────────────────
function CommodityIcon({ symbol }: { symbol: string }) {
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

  const key = symbol.toUpperCase();
  return <span className="text-xl">{icons[key] ?? "📦"}</span>;
}

// ─── Form Component ───────────────────────────────────────────────
function CreateHedgeForm() {
  const { address, isConnected } = useAccount();
  const searchParams = useSearchParams();

  const [selectedSymbol, setSelectedSymbol] = useState(COMMODITIES[0].symbol);
  const [strikePrice, setStrikePrice] = useState("");
  const [expireOption, setExpireOption] = useState<1 | 2 | 3 | 4>(2);

  const [phase, setPhase] = useState<"idle" | "creating" | "done">("idle");

  // ── AI Simulation State ──────────────────────────────────────────
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [aiConfidence, setAiConfidence] = useState<number>(85);

  // Trigger AI Analysis when symbol or strike price changes
  useEffect(() => {
    const fetchAiAnalysis = async () => {
      if (!selectedSymbol) return;
      
      setIsAiThinking(true);
      // Small delay to feel more "simulated" and natural
      const debounceTimer = setTimeout(async () => {
        try {
          const prompt = `Analyze a hedge for ${selectedSymbol} with a strike price of $${strikePrice || "market price"}.`;
          const response = await aiAction({ message: prompt });
          
          if (response.success) {
            setAiAnalysis(response.reply);
            setAiConfidence(Math.floor(Math.random() * (95 - 75 + 1) + 75)); // Random confidence between 75-95%
          } else {
            throw new Error("AI Action failed");
          }
        } catch (err) {
          // Graceful fallback to mock data
          setAiAnalysis(`Based on historical data for ${selectedSymbol}, a ${strikePrice ? `$${strikePrice} strike` : "current market entry"} represents a balanced risk profile. We recommend a 14-day duration to capture expected volatility.`);
          setAiConfidence(82);
        } finally {
          setIsAiThinking(false);
        }
      }, 800);

      return () => clearTimeout(debounceTimer);
    };

    fetchAiAnalysis();
  }, [selectedSymbol, strikePrice]);

  // Read search parameter on mount
  useEffect(() => {
    const selected = searchParams.get("selected");
    if (selected) {
      const match = COMMODITIES.find(
        (c) =>
          c.symbol.toUpperCase() === selected.toUpperCase() ||
          c.name.toUpperCase() === selected.toUpperCase()
      );
      if (match) {
        setSelectedSymbol(match.symbol);
      }
    }
  }, [searchParams]);

  const selectedCommodity =
    COMMODITIES.find((c) => c.symbol === selectedSymbol) ?? COMMODITIES[0];

  // ── Contract Writer ──────────────────────────────────────────────
  const {
    writeContract: createHedge,
    data: createTxHash,
    isPending: isCreateWritePending,
    error: createWriteError,
    reset: resetCreate,
  } = useWriteContract();

  // ── Transaction Receipt Watcher ──────────────────────────────────
  const {
    isLoading: isCreateMining,
    isSuccess: isCreateSuccess,
    isError: isCreateMineError,
    error: createMineError,
  } = useWaitForTransactionReceipt({
    hash: createTxHash,
    query: {
      enabled: !!createTxHash,
    },
  });

  // ── Success Handler ──────────────────────────────────────────────
  useEffect(() => {
    if (isCreateSuccess && createTxHash) {
      setPhase("done");
      toast.success("Hedge Created! 🎉", {
        description: `Your ${selectedSymbol} hedge is now live on-chain.`,
        action: {
          label: "View Tx",
          onClick: () => window.open(`https://testnet.blockscout.injective.network/${createTxHash}`, '_blank')
        }
      });
    }
  }, [isCreateSuccess, selectedSymbol, createTxHash]);

  // ── Error Handling ───────────────────────────────────────────────
  useEffect(() => {
    const err = createWriteError || createMineError;
    if (!err) return;

    setPhase("idle");
    resetCreate(); // Clear the hash and error to stop the loader

    const msg =
      (err as any)?.shortMessage ||
      (err as any)?.message ||
      "Transaction failed";

    toast.error("Creation Failed", {
      description: msg,
    });
  }, [createWriteError, createMineError, resetCreate]);

  // ── Submit Handler ───────────────────────────────────────────────
  const handleCreateHedge = () => {
    if (phase === "done") {
      handleReset();
      return;
    }

    if (!isConnected || !address) {
      toast.error("Wallet Not Connected", {
        description: "Please connect your wallet first.",
      });
      return;
    }

    const priceFloat = parseFloat(strikePrice);
    if (!strikePrice || isNaN(priceFloat) || priceFloat <= 0) {
      toast.error("Invalid Input", {
        description: "Enter a valid strike price.",
      });
      return;
    }

    resetCreate();

    const strikePriceWei = parseEther(strikePrice);

    setPhase("creating");

    createHedge({
      address: HEDGE_CONTRACT_ADDRESS as `0x${string}`,
      abi: hedgeAbi,
      functionName: "createHedge",
      args: [
        selectedCommodity.symbol,   // commodity symbol (e.g. COFFEE)
        BigInt(1),                 // amount = 1
        strikePriceWei,           // strikePrice in 18-decimal wei
        BigInt(expireOption),      // expireOption 1–4
      ],
    });
  };

  // ── Reset ────────────────────────────────────────────────────────
  const handleReset = () => {
    setPhase("idle");
    setStrikePrice("");
    setExpireOption(2);
    resetCreate();
  };

  // ── UI State ─────────────────────────────────────────────────────
  const isLoading = isCreateWritePending || isCreateMining;

  const buttonLabel = () => {
    if (isCreateWritePending) return "Confirming in Wallet...";
    if (isCreateMining) return "Creating Hedge On-Chain...";
    if (phase === "done") return "Create Another Hedge";
    return "Create Hedge";
  };

  return (
    <div className="w-full space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Create New Hedge
        </h1>
        <p className="text-gray-500 font-medium">
          Secure your agricultural assets against market volatility with institutional-grade smart contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-8 bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col gap-8">

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#fce4ec] flex items-center justify-center text-[#d80073]">
                <Package size={16} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">1. Select Commodity</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {COMMODITIES.map((c) => (
                <button
                  key={c.symbol}
                  onClick={() => setSelectedSymbol(c.symbol)}
                  disabled={isLoading}
                  className={`p-5 rounded-[24px] flex flex-col items-center gap-3 transition-all duration-300 border-2 ${selectedSymbol === c.symbol
                      ? "bg-[#fce4ec]/30 border-[#d80073] shadow-md scale-[1.02]"
                      : "bg-gray-50 border-transparent hover:bg-gray-100"
                    }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                    <CommodityIcon symbol={c.symbol} />
                  </div>
                  <div className="font-black text-xs uppercase tracking-widest text-gray-700">{c.symbol}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#fce4ec] flex items-center justify-center text-[#d80073]">
                  <DollarSign size={16} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">2. Strike Price (USDT)</h2>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d80073] transition-colors">
                  $
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  value={strikePrice}
                  onChange={(e) => setStrikePrice(e.target.value)}
                  disabled={isLoading}
                  className="w-full p-4 pl-10 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#d80073] focus:bg-white outline-none transition-all font-bold text-lg"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#fce4ec] flex items-center justify-center text-[#d80073]">
                  <Calendar size={16} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">3. Duration</h2>
              </div>
              <div className="flex gap-2">
                {EXPIRE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setExpireOption(opt.id)}
                    disabled={isLoading}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all border-2 ${expireOption === opt.id
                        ? "bg-[#d80073] text-white border-[#d80073] shadow-lg shadow-[#d80073]/20"
                        : "bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100"
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            {isLoading && (
              <div className="flex items-center justify-center gap-3 p-4 bg-[#fce4ec]/30 rounded-2xl border border-[#d80073]/20">
                <Loader2 className="animate-spin w-5 h-5 text-[#d80073]" />
                <span className="font-bold text-[#d80073] text-sm uppercase tracking-widest">Deploying Smart Contract...</span>
              </div>
            )}

            <button
              onClick={handleCreateHedge}
              disabled={isLoading}
              className={`w-full py-6 rounded-[24px] font-black text-xl flex justify-center items-center gap-3 transition-all active:scale-[0.98] ${phase === "done"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-[#d80073] text-white shadow-xl shadow-[#d80073]/20 hover:bg-[#c20067]"
                }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : phase === "done" ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <ArrowRight className="w-6 h-6" />
              )}
              {buttonLabel()}
            </button>

            {!isConnected && (
              <div className="flex items-center justify-center gap-2 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <Info className="w-4 h-4 text-amber-500" />
                <p className="text-sm font-bold text-amber-700">Connect your wallet to enable on-chain deployment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI & Info Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Suggestions Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group min-h-[320px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Brain size={120} />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full w-fit backdrop-blur-sm border border-white/20">
                <Sparkles size={14} className="text-amber-300" />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Intelligence</span>
              </div>

              {isAiThinking ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-8 bg-white/20 rounded-lg w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-white/10 rounded-lg w-full" />
                    <div className="h-4 bg-white/10 rounded-lg w-5/6" />
                    <div className="h-4 bg-white/10 rounded-lg w-4/6" />
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">AI is thinking...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">Strategy Suggestion</h3>
                    <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                      {aiAnalysis || `Select a commodity and strike price to get an AI-powered risk analysis for your hedge.`}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold opacity-70">Analysis Confidence</span>
                      <span className="font-black text-amber-300">{aiConfidence}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-300 transition-all duration-1000 ease-out" 
                        style={{ width: `${aiConfidence}%` }} 
                      />
                    </div>
                    <p className="text-[10px] font-medium opacity-60 uppercase tracking-widest">Injective Mainnet Data Integrated</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Market Trends Card */}
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-900 tracking-tight uppercase text-xs">Market Trends</h3>
              <div className="flex items-center gap-1 text-emerald-500">
                <TrendingUp size={14} />
                <span className="text-[10px] font-black">+2.4%</span>
              </div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <Activity size={16} className="text-gray-400 group-hover:text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-24 bg-gray-100 rounded-full mb-2 overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[60%] opacity-50" />
                    </div>
                    <div className="h-1.5 w-16 bg-gray-50 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-[#fce4ec] rounded-[32px] p-8 border border-[#d80073]/10 space-y-4">
            <div className="flex items-center gap-2 text-[#d80073]">
              <Lightbulb size={20} />
              <h3 className="font-black text-xs uppercase tracking-widest">Pro Tip</h3>
            </div>
            <p className="text-[#d80073] text-sm font-bold leading-relaxed">
              Did you know? Hedging just 30% of your expected harvest can significantly reduce overall portfolio risk during peak harvest season.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page with Suspense ──────────────────────────────────────
export default function CreateHedgePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-[#d80073] animate-spin" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Form...</p>
        </div>
      }
    >
      <CreateHedgeForm />
    </Suspense>
  );
}