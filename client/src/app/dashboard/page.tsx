"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Shield, Wallet } from "lucide-react";

const portfolioData = [
  { month: "Jan", value: 45000, hedged: 18000 },
  { month: "Feb", value: 52000, hedged: 20000 },
  { month: "Mar", value: 48000, hedged: 19200 },
  { month: "Apr", value: 61000, hedged: 24400 },
  { month: "May", value: 70000, hedged: 28000 },
  { month: "Jun", value: 75000, hedged: 30000 },
];

const performanceData = [
  { category: "Protected", value: 15200, fill: "var(--chart-2)" },
  { category: "Exposed", value: 59800, fill: "var(--chart-1)" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Portfolio Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor your hedged positions and risk exposure</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$75,000</div>
            <p className="text-xs text-positive flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12.5% this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hedged Value</CardTitle>
            <Shield className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$30,000</div>
            <p className="text-xs text-muted-foreground mt-1">40% of portfolio</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Hedges</CardTitle>
            <Shield className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8</div>
            <p className="text-xs text-muted-foreground mt-1">3 expiring soon</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Month P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-positive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">+$9,400</div>
            <p className="text-xs text-positive flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +14.3%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Portfolio Growth */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Portfolio Growth</CardTitle>
            <CardDescription>6-month performance with hedging impact</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioData}>
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
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--chart-1)" 
                  name="Total Value"
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="hedged" 
                  stroke="var(--chart-2)" 
                  name="Hedged Value"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hedge Breakdown */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Exposure Breakdown</CardTitle>
            <CardDescription>Protected vs unprotected assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--chart-2)]" />
                  <span className="text-sm text-muted-foreground">Protected</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">$30,000</div>
                  <div className="text-xs text-positive">40%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--chart-1)]" />
                  <span className="text-sm text-muted-foreground">Exposed</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">$45,000</div>
                  <div className="text-xs text-muted-foreground">60%</div>
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden mt-4">
                <div className="h-full w-[40%] bg-[var(--chart-2)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Recent Hedge Activity</CardTitle>
          <CardDescription>Last 5 actions in your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Hedge Opened", asset: "SPY Call", date: "2 hours ago", status: "Active" },
              { action: "Position Updated", asset: "QQQ Put", date: "5 hours ago", status: "Modified" },
              { action: "Hedge Closed", asset: "IWM Call", date: "1 day ago", status: "Closed" },
              { action: "Partial Profit Taken", asset: "GLD Call", date: "2 days ago", status: "Partial" },
              { action: "New Hedge Created", asset: "TLT Put", date: "3 days ago", status: "Active" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex-1">
                  <div className="font-medium text-foreground text-sm">{item.action}</div>
                  <div className="text-xs text-muted-foreground">{item.asset}</div>
                </div>
                <div className="text-xs text-muted-foreground">{item.date}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
