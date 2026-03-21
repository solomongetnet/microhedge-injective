export interface Hedge {
  id: string;
  commodity: string;
  strategy: "put" | "call" | "collar" | "spread";
  quantity: number;
  strikePrice: number;
  expirationDate: string;
  protectionLevel: number;
  premium: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  status: "active" | "expiring" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateHedgeInput {
  commodity: string;
  strategy: string;
  quantity: number;
  strikePrice: number;
  expirationDate: string;
  protectionLevel: number;
}

export interface UpdateHedgeInput {
  quantity?: number;
  strikePrice?: number;
  expirationDate?: string;
  protectionLevel?: number;
  status?: "active" | "expiring" | "closed";
}

// Commodity prices for P&L calculations
const COMMODITY_PRICES: Record<string, number> = {
  COFFEE: 245.75,
  MAIZE: 487.25,
  WHEAT: 612.50,
  BARLEY: 334.80,
  SOYBEAN: 1156.25,
  SUGAR: 23.45,
  COTTON: 78.90,
  COCOA: 3845.50,
};

class HedgeStore {
  private hedges: Map<string, Hedge> = new Map();
  private nextId: number = 1;

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("hedges");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          this.hedges = new Map(data);
          this.nextId =
            Math.max(...Array.from(this.hedges.keys()).map((id) => parseInt(id))) +
            1 || 1;
        } catch (e) {
          console.error("Failed to load hedges from localStorage", e);
        }
      }
    }
  }

  private saveToLocalStorage() {
    if (typeof window !== "undefined") {
      try {
        const data = Array.from(this.hedges.entries());
        localStorage.setItem("hedges", JSON.stringify(data));
      } catch (e) {
        console.error("Failed to save hedges to localStorage", e);
      }
    }
  }

  private generateId(): string {
    return `hedge_${this.nextId++}`;
  }

  calculatePnL(
    hedge: Hedge,
    currentPrice: number
  ): { pnl: number; pnlPercent: number } {
    let currentValue = 0;

    if (hedge.strategy === "put") {
      currentValue = Math.max(hedge.strikePrice - currentPrice, 0) * hedge.quantity;
    } else if (hedge.strategy === "call") {
      currentValue = Math.max(currentPrice - hedge.strikePrice, 0) * hedge.quantity;
    } else if (hedge.strategy === "collar") {
      currentValue = Math.max(hedge.strikePrice - currentPrice, 0) * hedge.quantity * 0.5;
    } else if (hedge.strategy === "spread") {
      currentValue =
        Math.max(hedge.strikePrice - currentPrice, 0) * hedge.quantity * 0.75;
    }

    const pnl = currentValue - hedge.premium;
    const pnlPercent = hedge.premium > 0 ? (pnl / hedge.premium) * 100 : 0;

    return { pnl: Math.round(pnl * 100) / 100, pnlPercent: Math.round(pnlPercent * 100) / 100 };
  }

  async getHedges(): Promise<Hedge[]> {
    return Array.from(this.hedges.values());
  }

  async getHedgeById(id: string): Promise<Hedge | null> {
    return this.hedges.get(id) || null;
  }

  async createHedge(input: CreateHedgeInput): Promise<Hedge> {
    const id = this.generateId();
    const currentPrice = COMMODITY_PRICES[input.commodity] || 100;
    const { pnl, pnlPercent } = this.calculatePnL(
      {
        id,
        ...input,
        premium: input.quantity * currentPrice * 0.02,
        currentValue: 0,
        pnl: 0,
        pnlPercent: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Hedge,
      currentPrice
    );

    const hedge: Hedge = {
      id,
      commodity: input.commodity,
      strategy: input.strategy as "put" | "call" | "collar" | "spread",
      quantity: input.quantity,
      strikePrice: input.strikePrice,
      expirationDate: input.expirationDate,
      protectionLevel: input.protectionLevel,
      premium: input.quantity * currentPrice * 0.02,
      currentValue: 0,
      pnl,
      pnlPercent,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.hedges.set(id, hedge);
    this.saveToLocalStorage();
    return hedge;
  }

  async updateHedge(id: string, input: UpdateHedgeInput): Promise<Hedge> {
    const hedge = this.hedges.get(id);
    if (!hedge) {
      throw new Error(`Hedge ${id} not found`);
    }

    const updated: Hedge = {
      ...hedge,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    const currentPrice = COMMODITY_PRICES[hedge.commodity] || 100;
    const { pnl, pnlPercent } = this.calculatePnL(updated, currentPrice);
    updated.pnl = pnl;
    updated.pnlPercent = pnlPercent;

    this.hedges.set(id, updated);
    this.saveToLocalStorage();
    return updated;
  }

  async deleteHedge(id: string): Promise<void> {
    this.hedges.delete(id);
    this.saveToLocalStorage();
  }

  async refreshPnL(): Promise<Hedge[]> {
    const hedges = Array.from(this.hedges.values());
    for (const hedge of hedges) {
      const currentPrice = COMMODITY_PRICES[hedge.commodity] || 100;
      const { pnl, pnlPercent } = this.calculatePnL(hedge, currentPrice);
      hedge.pnl = pnl;
      hedge.pnlPercent = pnlPercent;
    }
    this.saveToLocalStorage();
    return hedges;
  }
}

// Singleton instance
let store: HedgeStore | null = null;

export function getHedgeStore(): HedgeStore {
  if (!store) {
    store = new HedgeStore();
  }
  return store;
}

// Exported API functions
export async function getHedges(): Promise<Hedge[]> {
  return getHedgeStore().getHedges();
}

export async function getHedgeById(id: string): Promise<Hedge | null> {
  return getHedgeStore().getHedgeById(id);
}

export async function createHedge(input: CreateHedgeInput): Promise<Hedge> {
  return getHedgeStore().createHedge(input);
}

export async function updateHedge(
  id: string,
  input: UpdateHedgeInput
): Promise<Hedge> {
  return getHedgeStore().updateHedge(id, input);
}

export async function deleteHedge(id: string): Promise<void> {
  return getHedgeStore().deleteHedge(id);
}

export async function refreshHedgePnL(): Promise<Hedge[]> {
  return getHedgeStore().refreshPnL();
}
