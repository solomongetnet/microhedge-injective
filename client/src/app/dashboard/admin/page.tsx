"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { toast } from "sonner";
import {
  ShieldCheck,
  RefreshCw,
  Plus,
  DollarSign,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Wheat,
  BarChart3,
  Activity,
  Hash,
  Clock,
  Lock,
  XCircle,
  ExternalLink,
  DatabaseZap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { COMMODITIES } from "@/lib/commodities";
import PRICE_ORACLE_ABI from "../../../../contracts/price-oracle.abi.json";
import HEDGE_ABI from "../../../../contracts/hedge.abi.json";

// ─── Addresses ──────────────────────────────────────────────────────────────
const PRICE_ORACLE_ADDRESS =
  (process.env.NEXT_PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESS as `0x${string}`) ??
  "";
const HEDGE_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_HEDGE_CONTRACT_ADDRESS as `0x${string}`) ?? "";
const RPC_URL = process.env.NEXT_PUBLIC_HEDGE_CONTRACT_RPC ?? "";

// ─── Types ───────────────────────────────────────────────────────────────────
interface CropPrice {
  symbol: string;
  name: string;
  onChainPrice: bigint | null;
  loading: boolean;
}

interface UpdateForm {
  price: string;
  loading: boolean;
}

interface HedgePosition {
  id: number;
  owner: string;
  commodity: string;
  amount: bigint;
  strikePrice: bigint;
  expireAt: bigint;
  lockedValue: bigint;
  closed: boolean;
}

interface HedgeStats {
  totalPositions: number;
  adminAddress: string | null;
  oracleAddress: string | null;
  usdtAddress: string | null;
  loading: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatPrice(raw: bigint | null): string {
  if (raw === null) return "—";
  return `$${(Number(raw) / 100).toFixed(2)}`;
}

function formatUSDT(raw: bigint): string {
  // USDT typically 6 decimals
  return `${(Number(raw) / 1_000_000).toFixed(2)} USDT`;
}

function formatExpiry(ts: bigint): string {
  // @ts-ignore
  if (ts === 0) return "—";
  const d = new Date(Number(ts) * 1000);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function shortAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function getReadProvider() {
  if (RPC_URL) return new ethers.JsonRpcProvider(RPC_URL);
  if (typeof window !== "undefined" && window.ethereum)
    return new ethers.BrowserProvider(window.ethereum as any);
  return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminPriceOraclePage() {
  const { address, isConnected } = useAccount();

  // ── Oracle state ─────────────────────────────────────────────────────────
  const [adminAddress, setAdminAddress] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [crops, setCrops] = useState<CropPrice[]>(
    COMMODITIES.map((c) => ({
      symbol: c.symbol,
      name: c.name,
      onChainPrice: null,
      loading: true,
    })),
  );
  const [updateForms, setUpdateForms] = useState<Record<string, UpdateForm>>(
    Object.fromEntries(
      COMMODITIES.map((c) => [c.symbol, { price: "", loading: false }]),
    ),
  );
  const [newCrop, setNewCrop] = useState({ symbol: "", price: "" });
  const [addingCrop, setAddingCrop] = useState(false);

  // ── Hedge contract state ─────────────────────────────────────────────────
  const [hedgeStats, setHedgeStats] = useState<HedgeStats>({
    totalPositions: 0,
    adminAddress: null,
    oracleAddress: null,
    usdtAddress: null,
    loading: true,
  });
  const [hedgePositions, setHedgePositions] = useState<HedgePosition[]>([]);
  const [hedgePositionsLoading, setHedgePositionsLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  // ── Fetch PriceOracle data ───────────────────────────────────────────────
  const fetchOracleData = useCallback(async () => {
    if (!PRICE_ORACLE_ADDRESS) return;
    const provider = getReadProvider();
    if (!provider) return;

    try {
      const contract = new ethers.Contract(
        PRICE_ORACLE_ADDRESS,
        PRICE_ORACLE_ABI,
        provider,
      );

      const admin: string = await contract.admin();
      setAdminAddress(admin);
      setIsAdmin(!!address && admin.toLowerCase() === address.toLowerCase());

      setCrops((prev) => prev.map((c) => ({ ...c, loading: true })));
      const results = await Promise.allSettled(
        COMMODITIES.map((c) => contract.getPrice(c.symbol)),
      );
      setCrops(
        COMMODITIES.map((c, i) => ({
          symbol: c.symbol,
          name: c.name,
          onChainPrice:
            results[i].status === "fulfilled"
              ? (results[i] as PromiseFulfilledResult<bigint>).value
              : null,
          loading: false,
        })),
      );
    } catch (err) {
      console.error("Failed to fetch oracle data:", err);
      setCrops((prev) => prev.map((c) => ({ ...c, loading: false })));
    }
  }, [address]);

  // ── Fetch HedgeContract data ─────────────────────────────────────────────
  const fetchHedgeData = useCallback(async () => {
    if (!HEDGE_CONTRACT_ADDRESS) return;
    const provider = getReadProvider();
    if (!provider) return;

    setHedgeStats((prev) => ({ ...prev, loading: true }));
    setHedgePositionsLoading(true);

    try {
      const contract = new ethers.Contract(
        HEDGE_CONTRACT_ADDRESS,
        HEDGE_ABI,
        provider,
      );

      // Fetch contract-level info in parallel
      const [hedgeAdmin, oracleAddr, usdtAddr, totalPos] = await Promise.all([
        contract.admin(),
        contract.oracle(),
        contract.usdt(),
        contract.totalPositions(),
      ]);

      setHedgeStats({
        totalPositions: Number(totalPos),
        adminAddress: hedgeAdmin as string,
        oracleAddress: oracleAddr as string,
        usdtAddress: usdtAddr as string,
        loading: false,
      });

      // Fetch all positions
      const total = Number(totalPos);
      if (total === 0) {
        setHedgePositions([]);
        setHedgePositionsLoading(false);
        return;
      }

      const positionCalls = Array.from({ length: total }, (_, i) =>
        contract.positions(i),
      );
      const posResults = await Promise.allSettled(positionCalls);

      const positions: HedgePosition[] = posResults
        .map((result, i) => {
          if (result.status !== "fulfilled") return null;
          const p = result.value;
          return {
            id: i,
            owner: p.owner as string,
            commodity: p.commodity as string,
            amount: p.amount as bigint,
            strikePrice: p.strikePrice as bigint,
            expireAt: p.expireAt as bigint,
            lockedValue: p.lockedValue as bigint,
            closed: p.closed as boolean,
          } satisfies HedgePosition;
        })
        .filter((p): p is HedgePosition => p !== null);

      setHedgePositions(positions);
    } catch (err) {
      console.error("Failed to fetch hedge contract data:", err);
      setHedgeStats((prev) => ({ ...prev, loading: false }));
    } finally {
      setHedgePositionsLoading(false);
    }
  }, []);

  // Combined fetch
  const fetchAll = useCallback(async () => {
    await Promise.all([fetchOracleData(), fetchHedgeData()]);
  }, [fetchOracleData, fetchHedgeData]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Update oracle price tx ───────────────────────────────────────────────
  async function submitUpdate(symbol: string) {
    if (!isConnected || !window.ethereum) {
      toast.error("Wallet not connected.");
      return;
    }
    if (!isAdmin) {
      toast.error("Only the contract admin can update prices.");
      return;
    }

    const raw = updateForms[symbol].price.trim();
    if (!raw || isNaN(Number(raw)) || Number(raw) <= 0) {
      toast.error("Enter a valid positive price.");
      return;
    }

    const priceScaled = BigInt(Math.round(Number(raw) * 100));

    setUpdateForms((prev) => ({
      ...prev,
      [symbol]: { ...prev[symbol], loading: true },
    }));

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        PRICE_ORACLE_ADDRESS,
        PRICE_ORACLE_ABI,
        signer,
      );

      const toastId = toast.loading(`Updating price for ${symbol}…`);
      const tx = await contract.updatePrice(symbol, priceScaled);
      await tx.wait();

      toast.dismiss(toastId);
      toast.success(`${symbol} price updated successfully!`);

      setUpdateForms((prev) => ({
        ...prev,
        [symbol]: { price: "", loading: false },
      }));
      await fetchOracleData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.reason ?? err?.message ?? "Transaction failed.");
      setUpdateForms((prev) => ({
        ...prev,
        [symbol]: { ...prev[symbol], loading: false },
      }));
    }
  }

  // ── Add new crop tx ──────────────────────────────────────────────────────
  async function submitAddCrop() {
    if (!isConnected || !window.ethereum) {
      toast.error("Wallet not connected.");
      return;
    }
    if (!isAdmin) {
      toast.error("Only the contract admin can add crops.");
      return;
    }

    const sym = newCrop.symbol.trim().toUpperCase();
    const raw = newCrop.price.trim();

    if (!sym) {
      toast.error("Enter a crop symbol.");
      return;
    }
    if (!raw || isNaN(Number(raw)) || Number(raw) <= 0) {
      toast.error("Enter a valid positive price.");
      return;
    }

    const priceScaled = BigInt(Math.round(Number(raw) * 100));
    setAddingCrop(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        PRICE_ORACLE_ADDRESS,
        PRICE_ORACLE_ABI,
        signer,
      );

      const toastId = toast.loading(`Adding ${sym}…`);
      const tx = await contract.updatePrice(sym, priceScaled);
      await tx.wait();

      toast.dismiss(toastId);
      toast.success(`${sym} added to oracle!`);
      setNewCrop({ symbol: "", price: "" });
      setCrops((prev) => [
        ...prev,
        { symbol: sym, name: sym, onChainPrice: priceScaled, loading: false },
      ]);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.reason ?? err?.message ?? "Transaction failed.");
    } finally {
      setAddingCrop(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  }

  // Derived hedge stats for summary cards
  const activePositions = hedgePositions.filter((p) => !p.closed).length;
  const closedPositions = hedgePositions.filter((p) => p.closed).length;
  const totalLockedValue = hedgePositions.reduce(
    // @ts-ignore
    (acc, p) => acc + (p.closed ? 0 : p.lockedValue),
    0,
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* ─── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage on-chain commodity prices and monitor hedge positions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isConnected ? (
            isAdmin ? (
              <Badge className="gap-1 bg-green-500/10 text-green-600 border-green-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Admin Connected
              </Badge>
            ) : (
              <Badge className="gap-1 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                <AlertTriangle className="w-3.5 h-3.5" />
                Not Admin
              </Badge>
            )
          ) : (
            <Badge variant="outline" className="gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
              Wallet Disconnected
            </Badge>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* ─── Wallet warning ────────────────────────────────────────────── */}
      {!isConnected && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted border rounded-lg px-4 py-3">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Connect your wallet (top-right) to interact with the contracts.
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          HEDGE CONTRACT SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <DatabaseZap className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Hedge Contract</h2>
          {HEDGE_CONTRACT_ADDRESS && (
            <a
              href={`https://creditcoin-testnet.blockscout.com/address/${HEDGE_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              {shortAddress(HEDGE_CONTRACT_ADDRESS)}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {!HEDGE_CONTRACT_ADDRESS && (
          <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>NEXT_PUBLIC_HEDGE_CONTRACT_ADDRESS</strong> is not set in
              your <code>.env</code> file.
            </span>
          </div>
        )}

        {/* Contract address info strip */}
        {HEDGE_CONTRACT_ADDRESS && !hedgeStats.loading && (
          <div className="text-xs text-muted-foreground bg-muted/50 border rounded-lg px-4 py-2 flex flex-wrap gap-4">
            {hedgeStats.adminAddress && (
              <span>
                <span className="font-medium text-foreground">Admin: </span>
                {hedgeStats.adminAddress}
              </span>
            )}
            {hedgeStats.oracleAddress && (
              <span>
                <span className="font-medium text-foreground">Oracle: </span>
                {hedgeStats.oracleAddress}
              </span>
            )}
            {hedgeStats.usdtAddress && (
              <span>
                <span className="font-medium text-foreground">USDT: </span>
                {hedgeStats.usdtAddress}
              </span>
            )}
          </div>
        )}

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total Positions */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Hash className="w-3.5 h-3.5" />
                Total Positions
              </div>
              {hedgeStats.loading ? (
                <div className="h-7 w-12 bg-muted animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold">
                  {hedgeStats.totalPositions}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Active */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Activity className="w-3.5 h-3.5 text-green-500" />
                Active
              </div>
              {hedgePositionsLoading ? (
                <div className="h-7 w-12 bg-muted animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-green-600">
                  {activePositions}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Closed */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
                Closed
              </div>
              {hedgePositionsLoading ? (
                <div className="h-7 w-12 bg-muted animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-muted-foreground">
                  {closedPositions}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Total Locked Value */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Lock className="w-3.5 h-3.5 text-primary" />
                Total Locked
              </div>
              {hedgePositionsLoading ? (
                <div className="h-7 w-24 bg-muted animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-primary">
                  {/*@ts-ignore */}
                  {formatUSDT(totalLockedValue)}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Positions Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              All Hedge Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hedgePositionsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-muted animate-pulse rounded"
                  />
                ))}
              </div>
            ) : hedgePositions.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No hedge positions found on-chain.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground text-xs">
                      <th className="text-left py-2 pr-4 font-medium">ID</th>
                      <th className="text-left py-2 pr-4 font-medium">Owner</th>
                      <th className="text-left py-2 pr-4 font-medium">
                        Commodity
                      </th>
                      <th className="text-right py-2 pr-4 font-medium">
                        Amount
                      </th>
                      <th className="text-right py-2 pr-4 font-medium">
                        Strike
                      </th>
                      <th className="text-right py-2 pr-4 font-medium">
                        Locked
                      </th>
                      <th className="text-left py-2 pr-4 font-medium">
                        Expires
                      </th>
                      <th className="text-left py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {hedgePositions.map((pos) => (
                      <tr
                        key={pos.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <td className="py-2.5 pr-4 font-mono text-xs text-muted-foreground">
                          #{pos.id}
                        </td>
                        <td className="py-2.5 pr-4">
                          <a
                            href={`https://creditcoin-testnet.blockscout.com/address/${pos.owner}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            {shortAddress(pos.owner)}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="py-2.5 pr-4">
                          <Badge
                            variant="secondary"
                            className="font-mono text-xs"
                          >
                            {pos.commodity}
                          </Badge>
                        </td>
                        <td className="py-2.5 pr-4 text-right font-mono text-xs">
                          {Number(pos.amount).toLocaleString()}
                        </td>
                        <td className="py-2.5 pr-4 text-right font-mono text-xs">
                          {formatPrice(pos.strikePrice)}
                        </td>
                        <td className="py-2.5 pr-4 text-right font-mono text-xs">
                          {formatUSDT(pos.lockedValue)}
                        </td>
                        <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatExpiry(pos.expireAt)}
                          </span>
                        </td>
                        <td className="py-2.5">
                          {pos.closed ? (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-muted text-muted-foreground"
                            >
                              Closed
                            </Badge>
                          ) : (
                            <Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                              Active
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          PRICE ORACLE SECTION
          ══════════════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Price Oracle</h2>
          {PRICE_ORACLE_ADDRESS && (
            <a
              href={`https://creditcoin-testnet.blockscout.com/address/${PRICE_ORACLE_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              {shortAddress(PRICE_ORACLE_ADDRESS)}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {!PRICE_ORACLE_ADDRESS ? (
          <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>NEXT_PUBLIC_PRICE_ORACLE_CONTRACT_ADDRESS</strong> is not
              set in your <code>.env</code> file.
            </span>
          </div>
        ) : (
          adminAddress && (
            <div className="text-xs text-muted-foreground bg-muted/50 border rounded-lg px-4 py-2 flex flex-wrap gap-4">
              <span>
                <span className="font-medium text-foreground">Contract: </span>
                {PRICE_ORACLE_ADDRESS}
              </span>
              <span>
                <span className="font-medium text-foreground">Admin: </span>
                {adminAddress}
              </span>
            </div>
          )
        )}

        {/* Crop Price Cards */}
        <div>
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Wheat className="w-5 h-5 text-primary" />
            Crop Prices
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {crops.map((crop) => {
              const form = updateForms[crop.symbol] ?? {
                price: "",
                loading: false,
              };
              return (
                <Card
                  key={crop.symbol}
                  className="border bg-card hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">
                        {crop.name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs font-mono">
                        {crop.symbol}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* On-chain price */}
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      {crop.loading ? (
                        <span className="text-sm text-muted-foreground animate-pulse">
                          Loading…
                        </span>
                      ) : (
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(crop.onChainPrice)}
                        </span>
                      )}
                    </div>

                    {/* Update form */}
                    <Separator />
                    <div className="space-y-2">
                      <Label
                        htmlFor={`price-${crop.symbol}`}
                        className="text-xs"
                      >
                        New Price (USD)
                      </Label>
                      <Input
                        id={`price-${crop.symbol}`}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="e.g., 245.75"
                        value={form.price}
                        onChange={(e) =>
                          setUpdateForms((prev) => ({
                            ...prev,
                            [crop.symbol]: {
                              ...prev[crop.symbol],
                              price: e.target.value,
                            },
                          }))
                        }
                        disabled={!isAdmin || form.loading}
                        className="h-8 text-sm"
                      />
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => submitUpdate(crop.symbol)}
                        disabled={!isAdmin || form.loading || !form.price}
                      >
                        {form.loading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                            Updating…
                          </>
                        ) : (
                          "Update Price"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Add New Crop */}
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Add New Crop
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="space-y-1">
                <Label htmlFor="new-crop-symbol" className="text-xs">
                  Crop Symbol
                </Label>
                <Input
                  id="new-crop-symbol"
                  placeholder="e.g., RICE"
                  value={newCrop.symbol}
                  onChange={(e) =>
                    setNewCrop((p) => ({
                      ...p,
                      symbol: e.target.value.toUpperCase(),
                    }))
                  }
                  disabled={!isAdmin || addingCrop}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-crop-price" className="text-xs">
                  Initial Price (USD)
                </Label>
                <Input
                  id="new-crop-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 350.00"
                  value={newCrop.price}
                  onChange={(e) =>
                    setNewCrop((p) => ({ ...p, price: e.target.value }))
                  }
                  disabled={!isAdmin || addingCrop}
                  className="h-9"
                />
              </div>
              <Button
                onClick={submitAddCrop}
                disabled={
                  !isAdmin || addingCrop || !newCrop.symbol || !newCrop.price
                }
                className="h-9"
              >
                {addingCrop ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding…
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Crop
                  </>
                )}
              </Button>
            </div>
            {!isAdmin && isConnected && (
              <p className="text-xs text-muted-foreground mt-2">
                Only the contract admin can add new crops.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
