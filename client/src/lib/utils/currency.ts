export const CTC_RATE = 0.16;

export function getLoanLimit(score: number): number {
  if (score <= 30) return 5;
  if (score <= 60) return 15;
  if (score <= 80) return 25;
  return 30; // max 30 CTC for > 80 score
}

export function formatCTC(amount: number): string {
  return `${amount} cCTC`;
}

export function formatUSD(ctcAmount: number): string {
  const usd = ctcAmount * CTC_RATE;
  return `$${usd.toFixed(2)} USD`;
}
