"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hedge, getHedges, deleteHedge, refreshHedgePnL } from "@/lib/hedge-service";
import { HedgeEditModal } from "@/components/dashboard/hedge-edit-modal";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Trash2, Edit2, Loader2 } from "lucide-react";
import { getStrategyName } from "@/lib/commodities";

export function MyHedgesSection() {
  const [hedges, setHedges] = useState<Hedge[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHedge, setEditingHedge] = useState<Hedge | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadHedges();
  }, []);

  const loadHedges = async () => {
    setLoading(true);
    try {
      const data = await getHedges();
      const updated = await refreshHedgePnL();
      setHedges(updated);
    } catch (error) {
      console.error("Failed to load hedges:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this hedge?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteHedge(id);
      setHedges(hedges.filter((h) => h.id !== id));
    } catch (error) {
      console.error("Failed to delete hedge:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveEdit = (updated: Hedge) => {
    setHedges(hedges.map((h) => (h.id === updated.id ? updated : h)));
    setEditingHedge(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hedges.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Hedges</h1>
          <p className="text-muted-foreground mt-1">Manage your active hedging positions</p>
        </div>
        <Card className="bg-card border-border">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">No active hedges yet</p>
            <p className="text-sm text-muted-foreground mb-6">Create your first hedge to get started with portfolio protection</p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Create First Hedge</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalExposure = hedges.reduce((sum, h) => sum + h.premium, 0);
  const totalPnL = hedges.reduce((sum, h) => sum + h.pnl, 0);
  const totalPnLPercent = hedges.length > 0 ? (totalPnL / totalExposure) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Hedges</h1>
        <p className="text-muted-foreground mt-1">Manage your active hedging positions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Total Exposure</div>
            <div className="text-2xl font-bold text-foreground">${totalExposure.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div>
            <div className="text-xs text-muted-foreground mt-2">{hedges.length} active position{hedges.length !== 1 ? "s" : ""}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Total P&L</div>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-success" : "text-destructive"}`}>
              ${totalPnL.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </div>
            <div className={`text-xs mt-2 ${totalPnL >= 0 ? "text-success" : "text-destructive"}`}>
              {totalPnL >= 0 ? "+" : ""}{totalPnLPercent.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Active Hedges</div>
            <div className="text-2xl font-bold text-foreground">{hedges.filter((h) => h.status === "active").length}</div>
            <div className="text-xs text-muted-foreground mt-2">{hedges.filter((h) => h.status === "expiring").length} expiring soon</div>
          </CardContent>
        </Card>
      </div>

      {/* Hedge Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hedges.map((hedge) => (
          <Card key={hedge.id} className="bg-card border-border overflow-hidden hover:border-border/60 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{hedge.commodity}</CardTitle>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      hedge.status === "active"
                        ? "bg-success/10 text-success"
                        : hedge.status === "expiring"
                        ? "bg-warning/10 text-warning"
                        : "bg-muted"
                    }`}>
                      {hedge.status}
                    </span>
                  </div>
                  <CardDescription className="mt-1">{getStrategyName(hedge.strategy)} - {hedge.quantity} contracts</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingHedge(hedge)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(hedge.id)}
                    disabled={deletingId === hedge.id}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    {deletingId === hedge.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Chart */}
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { date: "D-5", value: hedge.premium * 0.6 },
                    { date: "D-4", value: hedge.premium * 0.7 },
                    { date: "D-3", value: hedge.premium * 0.8 },
                    { date: "D-2", value: hedge.premium * 0.9 },
                    { date: "Today", value: hedge.currentValue },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.5rem",
                      }}
                      formatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Strike Price</div>
                  <div className="text-sm font-semibold text-foreground">${hedge.strikePrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Expiration</div>
                  <div className="text-sm font-semibold text-foreground">{new Date(hedge.expirationDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Premium Paid</div>
                  <div className="text-sm font-semibold text-foreground">${hedge.premium.toLocaleString("en-US", { maximumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Protection Level</div>
                  <div className="text-sm font-semibold text-foreground">{hedge.protectionLevel}%</div>
                </div>
              </div>

              {/* P&L Display */}
              <div className="p-3 bg-secondary rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Current P&L</div>
                  <div className={`text-lg font-bold ${hedge.pnl >= 0 ? "text-success" : "text-destructive"}`}>
                    ${hedge.pnl.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${hedge.pnl >= 0 ? "text-success" : "text-destructive"}`}>
                  {hedge.pnl >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-semibold">{hedge.pnl >= 0 ? "+" : ""}{hedge.pnlPercent.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingHedge && (
        <HedgeEditModal
          hedge={editingHedge}
          onClose={() => setEditingHedge(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
