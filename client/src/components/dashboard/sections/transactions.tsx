"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

const transactions = [
  {
    id: "TRX001",
    date: "Mar 20, 2024 2:34 PM",
    type: "hedge_opened",
    asset: "COFFEE",
    strategy: "Put Option",
    quantity: 500,
    price: 4.50,
    total: 2250,
    status: "completed",
    description: "Opened Coffee put hedge"
  },
  {
    id: "TRX002",
    date: "Mar 19, 2024 10:15 AM",
    type: "partial_profit",
    asset: "MAIZE",
    strategy: "Call Spread",
    quantity: 750,
    price: 2.52,
    total: 1890,
    status: "completed",
    description: "Partial profit taken on Maize call spread"
  },
  {
    id: "TRX003",
    date: "Mar 18, 2024 3:47 PM",
    type: "hedge_closed",
    asset: "SUGAR",
    strategy: "Put Option",
    quantity: 1200,
    price: 3.50,
    total: 4200,
    status: "completed",
    description: "Closed Sugar put option"
  },
  {
    id: "TRX004",
    date: "Mar 17, 2024 9:20 AM",
    type: "hedge_opened",
    asset: "WHEAT",
    strategy: "Collar",
    quantity: 250,
    price: 2.70,
    total: 675,
    status: "completed",
    description: "Opened Wheat collar strategy"
  },
  {
    id: "TRX005",
    date: "Mar 16, 2024 1:53 PM",
    type: "partial_profit",
    asset: "COFFEE",
    strategy: "Put Option",
    quantity: 500,
    price: 3.25,
    total: 1625,
    status: "completed",
    description: "Partial profit on Coffee puts"
  },
  {
    id: "TRX006",
    date: "Mar 15, 2024 11:42 AM",
    type: "position_updated",
    asset: "COCOA",
    strategy: "Call Spread",
    quantity: 200,
    price: 5.85,
    total: 1170,
    status: "completed",
    description: "Adjusted Cocoa hedge position"
  },
  {
    id: "TRX007",
    date: "Mar 14, 2024 4:32 PM",
    type: "hedge_opened",
    asset: "COTTON",
    strategy: "Put Option",
    quantity: 600,
    price: 2.80,
    total: 1680,
    status: "completed",
    description: "New Cotton put option hedge"
  },
  {
    id: "TRX008",
    date: "Mar 13, 2024 8:15 AM",
    type: "hedge_closed",
    asset: "SOYBEAN",
    strategy: "Collar",
    quantity: 350,
    price: 3.50,
    total: 1225,
    status: "completed",
    description: "Closed Soybean collar protection"
  },
];

const getTransactionTypeLabel = (type: string) => {
  const labels: { [key: string]: string } = {
    hedge_opened: "Hedge Opened",
    hedge_closed: "Hedge Closed",
    partial_profit: "Profit Taken",
    position_updated: "Position Updated",
  };
  return labels[type] || type;
};

const getTransactionTypeIcon = (type: string) => {
  return type.includes("closed") || type === "partial_profit" ? "down" : "up";
};

export function TransactionsSection() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = transactions.filter(
    (t) =>
      t.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-1">Complete history of all hedge operations</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{transactions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Premiums Paid</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$1,909</div>
            <p className="text-xs text-muted-foreground mt-1">Cost of all hedges</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profits Taken</CardTitle>
            <TrendingUp className="h-4 w-4 text-positive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$465</div>
            <p className="text-xs text-muted-foreground mt-1">From closed positions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by asset, strategy, or transaction ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-input border-border"
        />
      </div>

      {/* Transactions Table */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="border-b border-border">
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Strategy</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">Qty</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr key={tx.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-primary">{tx.id}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{tx.date}</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {getTransactionTypeIcon(tx.type) === "up" ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {getTransactionTypeLabel(tx.type)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">{tx.asset}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{tx.strategy}</td>
                    <td className="px-6 py-4 text-right text-foreground font-medium">{tx.quantity}</td>
                    <td className="px-6 py-4 text-right text-foreground">${tx.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground">${tx.total}</td>
                    <td className="px-6 py-4">
                      <Badge className="bg-positive/20 text-positive">
                        ✓ {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground text-center">
              <p className="font-medium">No transactions found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
