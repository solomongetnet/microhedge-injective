"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

const performanceData = [
  { month: "Jan", protected: 12000, unprotected: 33000 },
  { month: "Feb", protected: 14000, unprotected: 38000 },
  { month: "Mar", protected: 16000, unprotected: 32000 },
  { month: "Apr", protected: 18000, unprotected: 43000 },
  { month: "May", protected: 22000, unprotected: 48000 },
  { month: "Jun", protected: 28000, unprotected: 47000 },
];

const assetAllocation = [
  { name: "SPY", value: 35, color: "var(--chart-1)" },
  { name: "QQQ", value: 25, color: "var(--chart-2)" },
  { name: "IWM", value: 20, color: "var(--chart-3)" },
  { name: "Bonds", value: 12, color: "var(--chart-5)" },
  { name: "Gold", value: 8, color: "var(--chart-4)" },
];

const strategyPerformance = [
  { strategy: "Put Options", pnl: 1250, trades: 3, winRate: 100 },
  { strategy: "Call Spreads", pnl: 320, trades: 2, winRate: 100 },
  { strategy: "Collars", pnl: 180, trades: 1, winRate: 100 },
  { strategy: "Futures", pnl: -120, trades: 2, winRate: 50 },
];

const riskMetrics = [
  { metric: "Value at Risk (95%)", value: "$12,450", change: -5.2 },
  { metric: "Max Drawdown", value: "8.3%", change: -2.1 },
  { metric: "Sortino Ratio", value: "1.85", change: 0.12 },
  { metric: "Hedge Efficiency", value: "92%", change: 3.4 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Detailed performance and risk analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            6M
          </Button>
          <Button variant="outline" size="sm">1Y</Button>
          <Button variant="outline" size="sm">YTD</Button>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {riskMetrics.map((metric, idx) => (
          <Card key={idx} className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <p className={`text-xs flex items-center gap-1 mt-1 ${metric.change >= 0 ? 'text-positive' : 'text-negative'}`}>
                {metric.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Protected vs Unprotected */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Protected vs Unprotected</CardTitle>
            <CardDescription>Portfolio exposure over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)"
                  }}
                />
                <Legend />
                <Bar dataKey="protected" fill="var(--chart-2)" name="Protected" radius={[8, 8, 0, 0]} />
                <Bar dataKey="unprotected" fill="var(--chart-1)" name="Unprotected" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Diversification across assets</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={100}
                  fill="var(--chart-1)"
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Performance */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Strategy Performance</CardTitle>
          <CardDescription>Performance breakdown by hedging strategy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Strategy</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Total P&L</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Trades</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Win Rate</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Avg Return</th>
                </tr>
              </thead>
              <tbody>
                {strategyPerformance.map((strategy, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-4 font-medium text-foreground">{strategy.strategy}</td>
                    <td className={`px-4 py-4 text-right font-semibold ${strategy.pnl >= 0 ? 'text-positive' : 'text-negative'}`}>
                      {strategy.pnl > 0 ? '+' : ''} ${strategy.pnl}
                    </td>
                    <td className="px-4 py-4 text-right text-foreground">{strategy.trades}</td>
                    <td className="px-4 py-4 text-right">
                      <span className="px-2 py-1 rounded-full bg-positive/20 text-positive text-xs font-medium">
                        {strategy.winRate}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-foreground">
                      {((strategy.pnl / strategy.trades) / 1000 * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Performance summary and recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 p-3 rounded-lg bg-secondary/20 border border-border">
            <div className="text-2xl">📈</div>
            <div>
              <div className="font-semibold text-foreground">Strong Protection Effectiveness</div>
              <p className="text-sm text-muted-foreground">Your hedges have protected against 92% of downside risk while maintaining 85% upside participation.</p>
            </div>
          </div>

          <div className="flex gap-4 p-3 rounded-lg bg-secondary/20 border border-border">
            <div className="text-2xl">🎯</div>
            <div>
              <div className="font-semibold text-foreground">Put Options Outperform</div>
              <p className="text-sm text-muted-foreground">Put options show the highest profit factor at +$1,250 with a 100% win rate across 3 trades.</p>
            </div>
          </div>

          <div className="flex gap-4 p-3 rounded-lg bg-secondary/20 border border-border">
            <div className="text-2xl">⚠️</div>
            <div>
              <div className="font-semibold text-foreground">Review Futures Strategy</div>
              <p className="text-sm text-muted-foreground">Your futures hedges had only a 50% win rate. Consider adjusting entry/exit points or using alternative strategies.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
