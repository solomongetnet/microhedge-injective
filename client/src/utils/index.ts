export function formatCurrency(
  amountInCents: number,
  options?: {
    currency?: string; // Default ETB
    withSymbol?: boolean; // true = show currency, false = only number
    locale?: string; // Default en-ET
  }
) {
  const {
    currency = "ETB",
    withSymbol = true,
    locale = "en-ET",
  } = options || {};

  const amount = amountInCents / 100;

  return new Intl.NumberFormat(locale, {
    style: withSymbol ? "currency" : "decimal",
    currency: withSymbol ? currency : undefined,
    minimumFractionDigits: 0,
  }).format(amount);
}
