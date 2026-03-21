"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const markets = [
  {
    id: "coffee",
    symbol: "COFFEE",
    name: "Coffee Futures",
    price: 245.75,
    change: 3.15,
    volume: "94.2K",
    chart: [
      { time: "9:30", price: 242 },
      { time: "10:00", price: 243.5 },
      { time: "10:30", price: 244.2 },
      { time: "11:00", price: 245.1 },
      { time: "11:30", price: 245.75 },
    ]
  },
  {
    id: "maize",
    symbol: "MAIZE",
    name: "Corn Futures",
    price: 487.25,
    change: -1.85,
    volume: "127.3K",
    chart: [
      { time: "9:30", price: 496 },
      { time: "10:00", price: 493.2 },
      { time: "10:30", price: 490.8 },
      { time: "11:00", price: 489.1 },
      { time: "11:30", price: 487.25 },
    ]
  },
  {
    id: "wheat",
    symbol: "WHEAT",
    name: "Wheat Futures",
    price: 612.50,
    change: 2.45,
    volume: "78.6K",
    chart: [
      { time: "9:30", price: 608 },
      { time: "10:00", price: 609.5 },
      { time: "10:30", price: 610.8 },
      { time: "11:00", price: 611.7 },
      { time: "11:30", price: 612.50 },
    ]
  },
  {
    id: "barley",
    symbol: "BARLEY",
    name: "Barley Futures",
    price: 334.80,
    change: 1.25,
    volume: "42.1K",
    chart: [
      { time: "9:30", price: 331.2 },
      { time: "10:00", price: 332.1 },
      { time: "10:30", price: 333.4 },
      { time: "11:00", price: 334.2 },
      { time: "11:30", price: 334.80 },
    ]
  },
  {
    id: "soybean",
    symbol: "SOYBEAN",
    name: "Soybean Futures",
    price: 1156.25,
    change: -0.95,
    volume: "156.8K",
    chart: [
      { time: "9:30", price: 1168 },
      { time: "10:00", price: 1163.2 },
      { time: "10:30", price: 1160.1 },
      { time: "11:00", price: 1158.5 },
      { time: "11:30", price: 1156.25 },
    ]
  },
  {
    id: "sugar",
    symbol: "SUGAR",
    name: "Sugar Futures",
    price: 23.45,
    change: 4.35,
    volume: "312.4K",
    chart: [
      { time: "9:30", price: 22.1 },
      { time: "10:00", price: 22.5 },
      { time: "10:30", price: 22.9 },
      { time: "11:00", price: 23.2 },
      { time: "11:30", price: 23.45 },
    ]
  },
  {
    id: "cotton",
    symbol: "COTTON",
    name: "Cotton Futures",
    price: 78.90,
    change: -2.15,
    volume: "89.3K",
    chart: [
      { time: "9:30", price: 81.2 },
      { time: "10:00", price: 80.5 },
      { time: "10:30", price: 79.8 },
      { time: "11:00", price: 79.3 },
      { time: "11:30", price: 78.90 },
    ]
  },
  {
    id: "cocoa",
    symbol: "COCOA",
    name: "Cocoa Futures",
    price: 3845.50,
    change: 2.85,
    volume: "156.2K",
    chart: [
      { time: "9:30", price: 3742 },
      { time: "10:00", price: 3768.5 },
      { time: "10:30", price: 3802.3 },
      { time: "11:00", price: 3825.1 },
      { time: "11:30", price: 3845.50 },
    ]
  },
];

export function MarketsSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Markets</h1>
        <p className="text-muted-foreground mt-1">Browse available assets to hedge</p>
      </div>

      {/* Market Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {markets.map((market) => (
          <Card key={market.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{market.symbol}</CardTitle>
                  <CardDescription className="text-xs">{market.name}</CardDescription>
                </div>
                {market.change >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-positive" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-negative" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mini Chart */}
              <div className="h-16 -mx-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={market.chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="transparent" />
                    <XAxis stroke="transparent" hide={true} />
                    <YAxis stroke="transparent" hide={true} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "var(--card)", 
                        border: "1px solid var(--border)",
                        color: "var(--foreground)"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={market.change >= 0 ? "var(--chart-2)" : "var(--chart-4)"}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Price Info */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">${market.price.toFixed(2)}</div>
                  <div className={`text-sm flex items-center gap-1 ${market.change >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {market.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(market.change).toFixed(2)}%
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>Vol: {market.volume}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => {}}
                >
                  Create Hedge
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
