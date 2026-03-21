export const COMMODITIES = [
  { symbol: "coffee", name: "Coffee Futures", price: 245.75 },
  { symbol: "maize", name: "Corn Futures", price: 487.25 },
  { symbol: "wheat", name: "Wheat Futures", price: 612.50 },
  { symbol: "barley", name: "Barley Futures", price: 334.80 },
  { symbol: "soybean", name: "Soybean Futures", price: 1156.25 },
  { symbol: "sugar", name: "Sugar Futures", price: 23.45 },
  { symbol: "cotton", name: "Cotton Futures", price: 78.90 },
  { symbol: "cocoa", name: "Cocoa Futures", price: 3845.50 },
];

export function getCommodityBySymbol(symbol: string) {
  return COMMODITIES.find((c) => c.symbol === symbol) || COMMODITIES[0];
}

export function getCommodityPrice(symbol: string): number {
  return getCommodityBySymbol(symbol).price;
}

export const HEDGE_STRATEGIES = [
  { id: "put", name: "Put Option", description: "Downside protection" },
  { id: "call", name: "Call Spread", description: "Limited profit/loss" },
  { id: "collar", name: "Collar", description: "Protected position" },
  { id: "spread", name: "Spread", description: "Reduced cost hedge" },
];

export function getStrategyName(id: string): string {
  return HEDGE_STRATEGIES.find((s) => s.id === id)?.name || id;
}
